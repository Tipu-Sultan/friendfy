import dbConnect from '@/lib/db'; // Utility to connect to MongoDB
import User from '@/models/UserModel'; // User model
import { NextResponse } from 'next/server'; // Use NextResponse for handling responses

// Ensure the database connection
dbConnect();

export async function POST(req) {
  try {
    const body = await req.json(); // Parse the incoming JSON body
    const {
      createdBy,
      id,
      name,
      profilePicture,
      type,
      lastMessage,
    } = body;

    // Validate required fields
    if (!id || !name || !profilePicture) {
      return NextResponse.json(
        { error: 'Name, ID, and Profile Picture are required fields.' },
        { status: 400 }
      );
    }

    // Fetch the user's document
    const user = await User.findById(createdBy);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found.' },
        { status: 404 }
      );
    }

    // Check if the user already exists in recentChats
    const alreadyExists = user.recentChats.some(chat => chat.id.toString() === id.toString());

    if (alreadyExists) {
      return NextResponse.json({
        message: 'This chat is already in the recent chats.',
      });
    }

    // Add the new group to recentChats and return only the newly added object
    const updatedUser = await User.findByIdAndUpdate(
        createdBy,
        {
          $push: {
            recentChats: {
              id:id,
              name:name,
              type: type,
              profilePicture: profilePicture || '',
              lastMessage: lastMessage,
              updatedAt: new Date(),
            },
          },
        },
        {
          new: true, // Ensure the updated document is returned
          projection: { recentChats: { $slice: -1 } }, // Return only the last added item
        }
      );
  
      // Return success response
      return NextResponse.json({
        status: 201,
        message: 'User added successfully!',
        recentChat: updatedUser?.recentChats[0], // Return only the recently added object
      });
  } catch (error) {
    console.error('Error adding to recent chats:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export const config = {
  runtime: 'edge', // Ensures the use of Edge Runtime
};
