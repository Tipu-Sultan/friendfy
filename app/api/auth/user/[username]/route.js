import dbConnect from '../../../../../lib/db'; // Helper to connect to MongoDB
import Follow from "@/models/FollowModel";
import User from "@/models/UserModel";
import Post from '@/models/PostModel'; // Import the Post model
import { NextResponse } from 'next/server';
import { comment } from 'postcss';

export async function GET(request, { params }) {

  const {username} = await params;

  try {
    // Connect to MongoDB
    await dbConnect();

    // Fetch the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json({ message: 'User not found', data: null }, { status: 404 });
    }

    // Fetch followers
    const followers = await Follow.find({ targetUserId: user._id, actionType: 'following' })
      .populate('userId', 'username email profilePicture')
      .exec();


    // Fetch following
    const following = await Follow.find({ userId: user._id, actionType: 'following' })
      .populate('targetUserId', 'username email profilePicture')
      .exec();

    // Fetch posts
    const posts = await Post.find({ user: user._id })
      .populate('user', 'username profilePicture')
      .exec();

    // Prepare the response
    const userData = {
      _id: user._id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      locations: user.location,
      profilePicture: user.profilePicture,
      isVerified: user.isVerified,
      recentChats: user.recentChats,
      lastLogin: user.lastLogin,
      followers,
      following,
      posts
    };

    // Return the user data using NextResponse
    return NextResponse.json({ message: 'User data fetched successfully', data: userData });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ message: 'Internal Server Error', data: null }, { status: 500 });
  }
}
