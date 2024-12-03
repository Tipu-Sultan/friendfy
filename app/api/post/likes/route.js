import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect"; // Ensure this connects to your database
import Post from "@/models/Post"; // Import your Post model

export async function POST(req) {
  try {
    const body = await req.json(); // Parse JSON from the request body
    const { postId, userId } = body;

    // Validate input
    if (!postId || !userId) {
      return NextResponse.json(
        { message: "Post ID and User ID are required" },
        { status: 400 }
      );
    }

    // Connect to the database
    await dbConnect();

    // Find the post by ID
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json(
        { message: "Post not found" },
        { status: 404 }
      );
    }

    // Check if the user already liked the post
    const hasLiked = post.likes.includes(userId);
    if (hasLiked) {
      // Unlike the post
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      // Like the post
      post.likes.push(userId);
    }

    // Save the updated post
    await post.save();

    return NextResponse.json(
      {
        message: hasLiked ? "Post unliked" : "Post liked",
        likes: post.likes,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error.message);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
