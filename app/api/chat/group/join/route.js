import dbConnect from '@/lib/db'; // Utility to connect to MongoDB
import Group from '@/models/GroupModel'; // Group model
import User from '@/models/UserModel'; // User model
import { NextResponse } from 'next/server'; // Use NextResponse for handling responses

// Ensure the database connection
dbConnect();

export async function POST(req) {
  try {
    const body = await req.json(); // Parse the incoming JSON body
    const { groupId, joinBy } = body;

    // Validate required fields
    if (!groupId || !joinBy) {
      return NextResponse.json(
        { error: 'groupId and joinBy are required fields.' },
        { status: 400 }
      );
    }

    // Find the group to join
    const joinGroup = await Group.findOne({ groupId });
    if (!joinGroup) {
      return NextResponse.json(
        { error: 'Group not found.' },
        { status: 404 }
      );
    }

    const lastMessage = {
      text: 'Created Now', // Default message when the group is created
      date: new Date(),
    };

    // Update the user's recentChats with the new group
    const updatedUser = await User.findByIdAndUpdate(
      joinBy,
      {
        $push: {
          recentChats: {
            groupId, // Add generated group ID to recentChats
            id: joinGroup._id,
            name: joinGroup.name,
            type: 'group',
            profilePicture: joinGroup.groupImage || '',
            lastMessage,
            updatedAt: new Date(),
          },
        },
      },
      {
        new: true, // Ensure the updated document is returned
        projection: { recentChats: { $slice: -1 } }, // Return only the last added item
      }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found.' },
        { status: 404 }
      );
    }

    // Return success response
    return NextResponse.json({
      message: 'Group joined successfully!',
      status: 201,
      recentChat: updatedUser.recentChats[0], // Return only the recently added object
    });
  } catch (error) {
    console.error('Error joining group:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export const config = {
  runtime: 'edge', // Ensures the use of Edge Runtime
};
