import { NextResponse } from "next/server";
import dbConnect from '@/lib/db'; // Utility to connect to MongoDB
import GroupMessage from '@/models/groupMessagesModel'; // GroupMessage model
import Group from '@/models/GroupModel'; // GroupMessage model



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
        const result = await GroupMessage.updateOne({ tempId: id }, updateQuery);

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


export async function GET(req, { params }) {
    const { id } = await params; // Extract the message ID from the parameters

    try {
        await dbConnect(); // Connect to the database

        // Retrieve group data by group ID and populate admins and members
        const result = await Group.findOne({ groupId: id })
            .populate({
                path: 'admins',
                select: '_id username profilePicture email',
            })
            .populate({
                path: 'members',
                select: '_id username profilePicture email',
            });

        if (!result) {
            return NextResponse.json(
                { error: 'Group not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { groupData: result },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error handling group data request:', error);
        return NextResponse.json(
            { error: 'Error retrieving group data', details: error.message },
            { status: 500 }
        );
    }
}



