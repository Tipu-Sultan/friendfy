import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Post from "@/models/PostModel";
import { v2 as cloudinary } from "cloudinary";
import { deleteMediaFromCloudinary } from "@/utils/deleteMedia";
import { uploadMedia } from "@/utils/uploadMedia";
import User from "@/models/UserModel";

// Configure Cloudinary (if not already done)
cloudinary.config({
  cloud_name: process.env.MY_CLOUD_NAME,
  api_key: process.env.MY_API_KEY,
  api_secret: process.env.MY_API_SECRET,
});

export const DELETE = async (req, { params }) => {
  try {
    const { postId } = await params;

    // Connect to the database
    await dbConnect();

    // Find the post by ID
    const post = await Post.findById(postId);

    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    // Check if the post has a media URL
    if (post.mediaUrl) {
      // Extract the public ID and resource type
      const publicId = post.mediaUrl.split('/').slice(-1)[0].split('.')[0];
      const lastId = `peopulse/${publicId}`;

      // Check the file type (image or video)
      const isVideo = post.mediaUrl.includes('video');

      console.log('Deleting from Cloudinary:', lastId, isVideo ? 'video' : 'image');

      // Delete the media from Cloudinary
      const cloudinaryResult = await cloudinary.uploader.destroy(lastId, {
        resource_type: isVideo ? 'video' : 'image',
      });

      if (cloudinaryResult.result !== 'ok') {
        console.error('Error deleting file from Cloudinary:', cloudinaryResult);
        return NextResponse.json(
          { error: 'Error deleting file from Cloudinary.' },
          { status: 500 }
        );
      }
    }

    // Delete the post from the database
    await Post.deleteOne({ _id: postId });

    // Return a success response
    return NextResponse.json({ message: 'Post deleted successfully', status: 200 }, { status: 200 });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};

export const PUT = async (req) => {
  try {
    // Parse request body
    const formData = await req.formData();
    const postId = formData.get("postId");
    const content = formData.get("content");
    const contentType = formData.get("contentType");
    const file = formData.get("file");

    // Validate post ID
    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required." },
        { status: 400 }
      );
    }

    await dbConnect();

    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }

    let newMediaUrl = post.mediaUrl;
    let newMediaDetails = null;
    let updatedFields = {}; // Object to track updated fields

    // Handle media update
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Delete old media if it exists
      if (post.mediaUrl) {
        try {
          await deleteMediaFromCloudinary(post.mediaUrl, contentType);
        } catch (deleteError) {
          console.error("Error deleting old media:", deleteError.message);
        }
      }

      // Upload new media
      try {
        newMediaDetails = await uploadMedia(buffer, contentType, "peopulse");
        newMediaUrl = newMediaDetails.url;
        updatedFields.mediaUrl = newMediaUrl;
      } catch (uploadError) {
        console.error(uploadError.message);
        return NextResponse.json(
          {
            error: "Failed to upload new media.",
            details: uploadError.message,
          },
          { status: 500 }
        );
      }
    }

    // Check for updated fields
    if (content && content !== post.content) {
      updatedFields.content = content;
      updatedFields.isEdited = true;
    }
    if (contentType && contentType !== post.contentType) {
      updatedFields.contentType = contentType;
    }

    // If no changes, return a message
    if (Object.keys(updatedFields).length === 0) {
      return NextResponse.json(
        { message: "No changes made to the post." },
        { status: 200 }
      );
    }

    // Apply updates
    Object.assign(post, updatedFields);
    post.updatedAt = new Date();

    await post.save();

    updatedFields.updatedAt = post.updatedAt;

    return NextResponse.json(
      {
        status: 200,
        message: "Post updated successfully!",
        updatedFields, // Return only the changed fields
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
};

