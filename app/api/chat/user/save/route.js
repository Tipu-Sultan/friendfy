import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db'; // Utility to connect to MongoDB
import Message from '@/models/messagesModel'; // User model

export async function POST(req) {
  await dbConnect(); // Ensure the database is connected

  const {tempId, sender, receiver, content, media,contentType } = await req.json(); // Parse the incoming request body

  if (!sender || !receiver || !content) {
    return NextResponse.json(
      { error: 'Sender, receiver, and content are required' },
      { status: 400 }
    );
  }

  try {
    // Create a new message
    const newMessage = new Message({
      tempId,
      sender,
      receiver,
      content,
      contentType,
      media: media || null, 
      isRead: false,
      reactions: [],
      deletedBySender: false,
      deletedByReceiver: false,
      edited: false,
      editedAt: null,
    });

    // Save the message to the database
    await newMessage.save();

    return NextResponse.json(
      { success: true, message: newMessage },
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
