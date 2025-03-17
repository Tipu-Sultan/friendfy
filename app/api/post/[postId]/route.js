import { NextResponse } from "next/server";
import Post from "@/models/PostModel";
import dbConnect from "@/lib/db";

export async function POST(req, { params }) {
  await dbConnect();
  const { postId } = await params;
  const { userId, text } = await req.json();

  if (!userId || !text) {
    return NextResponse.json({ message: "User ID and comment text are required" }, { status: 400 });
  }

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    // Add new comment
    const newComment = { user: userId, text, createdAt: new Date() };
    post.comments.push(newComment);
    await post.save();

    return NextResponse.json({ message: "Comment added", comment: newComment }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}