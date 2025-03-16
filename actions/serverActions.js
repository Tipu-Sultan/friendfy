"use server";

import { revalidatePath } from "next/cache";
import Post from "@/models/PostModel";
import dbConnect from "@/lib/db";
import { uploadMedia } from "@/utils/uploadMedia";

export async function createNewPost(formData) {
  try {
    // Connect to DB
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

    // Create a new post
    const post = await Post.create({
      user: userId,
      content,
      mediaUrl,
      contentType: contentType || "text/plain",
    });

    // **Revalidate UI to show new post**
    revalidatePath("/"); // Re-fetch the posts on home page

    return { success: "Post created successfully!", post };
  } catch (error) {
    console.error("Post creation error:", error);
    return { error: "Failed to create post" };
  }
}
