import dbConnect from "@/lib/db";
import Message from "@/models/messagesModel";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
    const { id } = await params; // Extract the message ID
    const { senderId, isSender } = await req.json(); // Extract senderId and isSender from the request body

    if (!id || !senderId) {
        return NextResponse.json({ error: 'Invalid request parameters' }, { status: 400 });
    }

    try {
        await dbConnect(); // Connect to the database

        // Define update query based on sender or receiver action
        const updateQuery = isSender
            ? { $set: { deletedBySender: true } }
            : { $set: { deletedByReceiver: true } };

        // Update message instead of deleting it
        const result = await Message.updateOne({ tempId: id }, updateQuery);

        if (result.modifiedCount > 0) {
            return NextResponse.json(
                { message: `Message marked as deleted by ${isSender ? 'sender' : 'receiver'}` },
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                { error: 'Message not found or already updated' },
                { status: 404 }
            );
        }
    } catch (error) {
        console.error('Error processing delete request:', error);
        return NextResponse.json(
            { error: 'Error processing the delete request', details: error.message },
            { status: 500 }
        );
    }
}
