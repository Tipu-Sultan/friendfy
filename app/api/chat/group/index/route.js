import { NextResponse } from "next/server";
import dbConnect from '@/lib/db'; // Utility to connect to MongoDB
import GroupMessage from '@/models/groupMessagesModel'; // GroupMessage model

export async function POST(req) {
  try {
    await dbConnect(); // Ensure the database is connected

    const body = await req.json(); // Parse the incoming JSON body
    const { sender, receiver, page } = body; // Extract sender, receiver, and page from the request body

    if (!sender || !receiver) {
      return NextResponse.json({ error: "Sender and receiver IDs are required" }, { status: 400 });
    }

    // Pagination variables
    const limit = 20; // Messages per page
    const skip = (page - 1) * limit; // Skip messages for previous pages

    // Fetch messages with pagination and populate sender details
    const messages = await GroupMessage.find({
      receiver,
      deletedBySender: false, // Exclude messages deleted by the sender
    })
      .sort({ createdAt: 1 }) // Sort messages by oldest first
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'sender', // Path to the sender field
        select: 'username profilePicture', // Fields to select from the User model
      });

    // Count total messages with proper filtering
    const totalMessages = await GroupMessage.countDocuments({
      receiver,
      deletedBySender: false, // Exclude messages deleted by the sender
      deletedByReceiver: { $ne: true }, // Exclude messages deleted by the receiver
    });

    // Respond with paginated messages and metadata
    return NextResponse.json({
      success: true,
      messages,
      totalMessages,
      totalPages: Math.ceil(totalMessages / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

