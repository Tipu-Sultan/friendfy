import dbConnect from '@/lib/db'; // Helper to connect to MongoDB
import Follow from "@/models/FollowModel";
import User from "@/models/UserModel";
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { username } = await params;

  try {
    // Connect to MongoDB
    await dbConnect();

    // Fetch the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json(
        { message: 'User not found', data: null },
        { status: 404 }
      );
    }

    // Return the processed list of friends
    return NextResponse.json({
      message: 'Friends data fetched successfully',
      recentChats: user?.recentChats,
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', data: null },
      { status: 500 }
    );
  }
}
