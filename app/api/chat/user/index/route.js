import { NextResponse } from "next/server";
import dbConnect from '@/lib/db'; // Utility to connect to MongoDB
import Message from '@/models/messagesModel'; // User model
import User from "@/models/UserModel";

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

export async function PUT(req) {
  try {
    await dbConnect(); // Ensure the database is connected

    const { currentUser, UserId } = await req.json(); // Parse request body

    if (!currentUser || !UserId) {
      return NextResponse.json(
        { error: "currentUser and UserId are required" },
        { status: 400 }
      );
    }

    // Find the current user
    const user = await User.findById(currentUser);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find the chat entry in recentChats
    const chatEntry = user.recentChats.find(
      (chat) => chat.id.toString() === UserId
    );

    if (!chatEntry) {
      return NextResponse.json(
        { error: "Chat entry not found in recentChats" },
        { status: 404 }
      );
    }

    // Toggle the isBlocked status
    chatEntry.isBlocked = !chatEntry.isBlocked;

    // Save the updated user document
    await user.save();

    return NextResponse.json({
      success: true,
      message: `User ${chatEntry.isBlocked ? "blocked" : "unblocked"} successfully`,
      updatedChat: chatEntry,
    });
  } catch (error) {
    console.error("Error toggling block status:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}


