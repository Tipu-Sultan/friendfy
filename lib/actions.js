'use server';
import { revalidatePath } from 'next/cache';
import { getAblyClient } from './ablyClient';
import Post from '@/models/PostModel';
import dbConnect from './db';
import { getServerSession } from 'next-auth';
import { authOptions } from './authOptions';

// Ably Client
  const session = await getServerSession(authOptions);

const ablyClient = getAblyClient(session?.user?.id);

export async function likePost(postId, userId) {
  await dbConnect();
  const post = await Post.findById(postId);
  if (!post) return { error: 'Post not found' };

  const alreadyLiked = post.likes.includes(userId);
  if (alreadyLiked) {
    post.likes = post.likes.filter(id => id !== userId);
  } else {
    post.likes.push(userId);
  }
  await post.save();

  // Notify Ably
  const channel = ablyClient.channels.get('post-actions');
  channel.publish('like-post', { postId, userId });

  // Revalidate to update the server component
  revalidatePath('/');
  return { success: true };
}

export async function deletePost(postId) {
  await dbConnect();
  const deletedPost = await Post.findByIdAndDelete(postId);
  if (!deletedPost) return { error: 'Post not found' };

  // Notify Ably
  const channel = ablyClient.channels.get('post-actions');
  channel.publish('delete-post', { postId });

  // Revalidate to update the server component
  revalidatePath('/');
  return { success: true };
}
