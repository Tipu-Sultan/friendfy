import dbConnect from '@/lib/db'; // Utility to connect to MongoDB
import Group from '@/models/GroupModel'; // Group model
import User from '@/models/UserModel'; // User model
import { NextResponse } from 'next/server'; // Use NextResponse for handling responses
import { generateGroupId } from '@/utils/groupId'; // Import utility function

// Ensure the database connection
dbConnect();

export async function POST(req) {
  try {
    const body = await req.json(); // Parse the incoming JSON body
    const {
      name,
      description = '',
      createdBy,
      admins = [createdBy],
      members = [],
      groupImage = '',
      settings = {},
      groupType = 'public',
    } = body;

    // Validate required fields
    if (!name || !createdBy || !Array.isArray(members) || members.length === 0) {
      return NextResponse.json(
        { error: 'Name, createdBy, and at least one member are required fields.' },
        { status: 400 }
      );
    }

    // Ensure createdBy is part of members and admins
    if (!members.includes(createdBy)) members.push(createdBy);
    if (!admins.includes(createdBy)) admins.push(createdBy);

    // Generate a unique group ID
    const groupId = generateGroupId(name);

    // Create a new group
    const newGroup = await Group.create({
      name,
      groupId, 
      description,
      createdBy,
      admins,
      members,
      groupImage,
      settings,
      groupType,
    });

    // Add the new group to recentChats and return only the newly added object
    const updatedUser = await User.findByIdAndUpdate(
      createdBy,
      {
        $push: {
          recentChats: {
            groupId, // Add generated group ID to recentChats
            id: newGroup._id,
            name: newGroup.name,
            type: 'group',
            profilePicture: newGroup.groupImage || '',
            lastMessage: 'created now',
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
      message: 'Group created successfully!',
      status: 201,
      recentChat: updatedUser?.recentChats[0], // Return only the recently added object
    });
  } catch (error) {
    console.error('Error creating group:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export const config = {
  runtime: 'edge', // Ensures the use of Edge Runtime
};
