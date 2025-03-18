import { NextResponse } from "next/server";
import Post from "@/models/PostModel";
import dbConnect from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function DELETE(req, { params }) {
    await dbConnect();
  
    // Get session to ensure the user is authenticated
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    const { postId, commentId, replyId } = await params; // Extract postId, commentId, replyId
  
    try {
      // Find the post
      const post = await Post.findById(postId);
      if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }
  
      // Find the comment
      const comment = post.comments.id(commentId);
      if (!comment) {
        return NextResponse.json({ error: "Comment not found" }, { status: 404 });
      }
  
      // Find the reply inside the comment
      const replyIndex = comment.replies.findIndex(
        (reply) => reply._id.toString() === replyId
      );
  
      if (replyIndex === -1) {
        return NextResponse.json({ error: "Reply not found" }, { status: 404 });
      }
  
      // Ensure only the reply's owner can delete it
      if (comment.replies[replyIndex].user.toString() !== session.user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
  
      // Remove the reply
      comment.replies.splice(replyIndex, 1);
      await post.save();
  
      return NextResponse.json({ message: "Reply deleted successfully" }, { status: 200 });
    } catch (error) {
      console.error("Error deleting reply:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }

