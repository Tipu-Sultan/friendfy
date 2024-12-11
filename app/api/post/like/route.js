import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import Post from '../../../../models/PostModel';

export async function POST(req) {
  const body = await req.json(); 
  const { postId, userId } = body;

  try {
    if (!postId || !userId) {
        return NextResponse.json(
          { message: 'Post ID and User ID are required' },
          { status: 400 }
        );
      }
    
      await dbConnect();
    
      const post = await Post.findById(postId);
      if (!post) {
        return NextResponse.json({ message: 'Post not found' }, { status: 404 });
      }
    
      // Check if the user has already liked the post
      const hasLiked = post.likes.includes(userId);
    
      if (hasLiked) {
        // Unlike the post
        post.likes = post.likes.filter((id) => id.toString() !== userId);
      } else {
        // Like the post
        post.likes.push(userId);
      }
    
      await post.save();
    
      return NextResponse.json(
        { 
          success: true, 
          message: hasLiked ? 'Post unliked' : 'Post liked', 
          likesCount: post.likes.length 
        },
        { status: 200 }
      );
  } catch (error) {
    return NextResponse.json(
        { 
          success: false
        },
        { status: 500 }
      );
  }
}

