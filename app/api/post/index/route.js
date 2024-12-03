import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Post from "@/models/PostModel";
import { uploadMedia } from "@/utils/uploadMedia"; // Adjust the path based on your project structure

export const POST = async (req) => {
  try {
    // Parse incoming form data
    const formData = await req.formData();
    const file = formData.get("file");
    const content = formData.get("content");
    const contentType = formData.get("contentType");
    const userId = formData.get("userId");

    // Validate input
    if (!content || !userId) {
      return NextResponse.json(
        { error: "Content and userId are required." },
        { status: 400 }
      );
    }

    let mediaDetails = null;
    let mediaUrl = null;

    // Handle media file if provided
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      try {
        mediaDetails = await uploadMedia(buffer, contentType, "peopulse");
        mediaUrl = mediaDetails.url; // Set media URL for database storage
      } catch (uploadError) {
        console.error(uploadError.message);
        return NextResponse.json(
          {
            error: "Failed to upload file to Cloudinary.",
            details: uploadError.message,
          },
          { status: 500 }
        );
      }
    }

    // Connect to the database
    await dbConnect();

    // Save the post in the database
    const post = new Post({
      user: userId,
      content: content,
      mediaUrl: mediaUrl,
      contentType: contentType || "text/plain",
    });
    await post.save();

    return NextResponse.json(
      {
        message: "Post created successfully!",
        post,
        mediaDetails: mediaDetails || "No media file uploaded.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
};

export const GET = async () => {
  try {
    // Connect to the database
    await dbConnect();

    // Fetch all posts, sorting by creation date (newest first)
    const posts = await Post.find()

    // Return the posts as JSON
    return NextResponse.json(
      {
        message: "Posts fetched successfully!",
        posts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching posts:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
};