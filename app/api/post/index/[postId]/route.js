import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Post from "@/models/PostModel";
import { v2 as cloudinary } from "cloudinary";


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



