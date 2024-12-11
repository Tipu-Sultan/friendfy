import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db'; // Utility to connect to MongoDB
import GroupMessage from '@/models/groupMessagesModel'; // GroupMessage model

export async function POST(req) {
  await dbConnect(); // Ensure the database is connected

  const { tempId, sender, receiver, content, media, contentType } = await req.json(); // Parse the incoming request body

  // Ensure all necessary fields are provided
  if (!sender || !receiver || !content) {
    return NextResponse.json(
      { error: 'Sender, groupId, and content are required' },
      { status: 400 }
    );
  }

  try {
    // Create a new group message
    const groupMessage = new GroupMessage({
      tempId,        
      sender,       
      receiver,      
      content,       // Message content
      contentType,   // Content type (text, image, video, etc.)
      media: media || null, // Optional media URL
      reactions: [], // Initialize reactions as an empty array
      deleted: false, // Message is not deleted by default
      deletedAt: null, // No deletion timestamp initially
      edited: false,  // Message is not edited by default
      editedAt: null, // No edited timestamp initially
    });

    // Save the message to the database
    await groupMessage.save();

    // Respond with the newly created message
    return NextResponse.json(
      { success: true, message: groupMessage },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error storing message:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
