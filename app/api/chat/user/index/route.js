import { NextResponse } from "next/server";
import dbConnect from '@/lib/db'; // Utility to connect to MongoDB
import Message from '@/models/messagesModel'; // User model

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

    // Fetch messages with pagination and sort by createdAt in ascending order to get oldest first
    const messages = await Message.find({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender }, // Include reverse direction
      ]
    })
      .sort({ createdAt: 1 }) // Sort messages by oldest first
      .skip(skip)
      .limit(limit)

    // Count total messages
    const totalMessages = await Message.countDocuments({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender },
      ]
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
