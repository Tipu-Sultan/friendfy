import dbConnect from '@/lib/db'; // Utility to connect to MongoDB
import Group from '@/models/GroupModel'; // Group model
import User from '@/models/UserModel'; // User model
import { NextResponse } from 'next/server'; // Use NextResponse for handling responses
import { generateGroupId } from '@/utils/groupId'; // Import utility function
import mongoose from 'mongoose'; // Import mongoose for ObjectId handling

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

    // Create a structured lastMessage object
    const lastMessage = {
      text: 'Created Now', // Default message when the group is created
      date: new Date(),
    };

    // Update recentChats for ALL members
    await User.updateMany(
      { _id: { $in: members } }, // ✅ Find all users in the group
      {
        $push: {
          recentChats: {
            groupId, // Add generated group ID to recentChats
            id: newGroup._id,
            name: newGroup.name,
            type: 'group',
            profilePicture: newGroup.groupImage || '',
            lastMessage, // Insert structured lastMessage
            updatedAt: new Date(),
          },
        },
      }
    );

    // Fetch updated recentChats for the creator to return response
    const updatedUser = await User.findById(createdBy, { recentChats: { $slice: -1 } });

    // Return success response
    return NextResponse.json({
      message: 'Group created successfully!',
      status: 201,
      recentChat: updatedUser?.recentChats[0], // ✅ Return only the recently added chat for the creator
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
