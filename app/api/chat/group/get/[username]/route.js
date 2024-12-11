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

    // Fetch followers and populate user details
    const friends = await Follow.find({
      $or: [
        { userId: user._id },
        { targetUserId: user._id },
      ],
    }).populate([
      {
        path: 'userId',
        select: '_id username profilePicture', // Fields to include from the User model
      },
      {
        path: 'targetUserId',
        select: '_id username profilePicture', // Fields to include from the User model
      },
    ]);

    // Process the result to consolidate friends
    const friendList = friends.map((friend) => {
      // Determine if the friend is `userId` or `targetUserId`
      const isCurrentUser = String(friend.userId._id) === String(user._id);
      const relatedUser = isCurrentUser ? friend.targetUserId : friend.userId;

      return {
        _id: relatedUser._id,
        username: relatedUser.username,
        profilePicture: relatedUser.profilePicture,
        isBlocked: friend.isBlocked,
        actionType: friend.actionType,
        status: friend.status,
      };
    });

    // Return the processed list of friends
    return NextResponse.json({
      message: 'Friends data fetched successfully',
      data: friendList,
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', data: null },
      { status: 500 }
    );
  }
}
