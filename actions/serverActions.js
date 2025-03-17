"use server";

import { revalidatePath } from "next/cache";
import Post from "@/models/PostModel";
import dbConnect from "@/lib/db";
import { uploadMedia } from "@/utils/uploadMedia";
import { getAblyClient } from "@/server/ablyClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// Helper function to get Ably client session
async function getPostChannel() {
  const session = await getServerSession(authOptions);
  const ablyClient = getAblyClient(session?.user?.id);
  return ablyClient.channels.get("post-actions");
}

// **Create a New Post**
export async function createNewPost(formData) {
  try {
    await dbConnect();

    const content = formData.get("content");
    const file = formData.get("file");
    const contentType = formData.get("contentType");
    const userId = formData.get("userId");

    if (!content && !file) {
      return { error: "Content or file is required." };
    }

    let mediaUrl = null;
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const mediaDetails = await uploadMedia(buffer, contentType, "peopulse");
      mediaUrl = mediaDetails?.url || null;
    }

    // Create the new post
    const post = await Post.create({
      user: userId,
      content,
      mediaUrl,
      contentType: contentType || "text/plain",
    });

    // Notify Ably about the new post
    const postChannel = await getPostChannel();
    postChannel.publish("new-post", { post });

    // Revalidate homepage
    revalidatePath("/");

    return { success: "Post created successfully!", post };
  } catch (error) {
    console.error("Post creation error:", error);
    return { error: "Failed to create post" };
  }
}

// **Like/Unlike a Post**
export async function likePost(postId, userId) {
  try {
    if (!postId || !userId) {
      return { error: "Post ID and User ID are required" };
    }

    await dbConnect();
    const post = await Post.findById(postId);
    if (!post) {
      return { error: "Post not found" };
    }

    const hasLiked = post.likes.includes(userId);
    if (hasLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    // Notify Ably about like/unlike action
    const postChannel = await getPostChannel();
    postChannel.publish("like-post", {
      postId,
      userId,
      likesCount: post.likes.length,
    });

    return {
      success: true,
      message: hasLiked ? "Post unliked" : "Post liked",
      likesCount: post.likes.length,
    };
  } catch (error) {
    console.error("Error liking post:", error);
    return { error: "Failed to like/unlike post" };
  }
}

// **Delete a Post**
export async function deletePost(postId) {
  try {
    await dbConnect();
    const deletedPost = await Post.findByIdAndDelete(postId);
    if (!deletedPost) return { error: "Post not found" };

    // Notify Ably about post deletion
    const postChannel = await getPostChannel();
    postChannel.publish("delete-post", { postId });

    // Revalidate homepage
    revalidatePath("/");

    return { success: "Post deleted successfully" };
  } catch (error) {
    console.error("Error deleting post:", error);
    return { error: "Failed to delete post" };
  }
}
