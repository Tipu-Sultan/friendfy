import { NextResponse } from "next/server";
import Post from "@/models/PostModel";
import dbConnect from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import User from "@/models/UserModel";
import mongoose from "mongoose";

export async function DELETE(req, { params }) {
  await dbConnect();

  // Get session to ensure the user is authenticated
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { postId, commentId } = await params; // Extract postId and commentId

  try {
    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Find the comment in the post
    const commentIndex = post.comments.findIndex(
      (comment) => comment._id.toString() === commentId
    );

    if (commentIndex === -1) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    // Ensure only the comment's owner can delete it
    if (post.comments[commentIndex].user.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Remove the comment
    post.comments.splice(commentIndex, 1);
    await post.save();

    return NextResponse.json(
      { message: "Comment deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req, { params }) {
  await dbConnect();

  const { postId, commentId } = await params;
  const { userId, text } = await req.json();

  if (!userId || !text) {
    return NextResponse.json(
      { message: "User ID and reply text are required" },
      { status: 400 }
    );
  }

  try {
    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    // Find the specific comment
    const comment = post.comments.id(commentId);
    if (!comment) {
      return NextResponse.json({ message: "Comment not found" }, { status: 404 });
    }

    // Validate if user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Create a new reply object
    const newReply = {
      _id: new mongoose.Types.ObjectId(),
      user: user._id,
      text,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add the reply to the comment's replies array
    comment.replies.push(newReply);
    await post.save();

    // Retrieve the newly added reply with user details
    const populatedPost = await Post.findById(postId)
      .populate({
        path: "comments.replies.user",
        select: "username profilePicture",
      })
      .lean();

    // Find the updated comment and its last reply
    const updatedComment = populatedPost.comments.find(
      (c) => c._id.toString() === commentId
    );
    
    const recentReply = updatedComment.replies.find(
      (r) => r._id.toString() === newReply._id.toString()
    );

    return NextResponse.json(
      { message: "Reply added successfully", reply: recentReply },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Failed to add reply: ${error.message}` },
      { status: 500 }
    );
  }
}


