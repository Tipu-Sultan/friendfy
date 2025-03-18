import { NextResponse } from "next/server";
import mongoose from "mongoose"; // Ensure mongoose is imported
import Post from "@/models/PostModel";
import User from "@/models/UserModel";
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

        const user = await User.findById(userId).select("_id username profilePicture");
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Create the comment object
        const newComment = {
            _id: new mongoose.Types.ObjectId(), // Explicitly creating a new ObjectId
            user:user, // Store user details directly
            text,
            replies: []
        };

        // Add the new comment to the post's comments array
        post.comments.push(newComment);
        await post.save(); // Save the post with the new comment

        // Retrieve the newly added comment (last item in the array)
        const recentComment = post.comments[post.comments.length - 1];

        return NextResponse.json({ message: "Comment added", comment: recentComment }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
