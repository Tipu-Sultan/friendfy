import dbConnect from "@/lib/db"; 
import Follow from "@/models/FollowModel"; 

export async function POST(req) { 
  await dbConnect(); // Ensure DB connection 

  const { userId, targetUserId } = await req.json(); 

  if (!userId || !targetUserId) { 
    return new Response(
      JSON.stringify({ message: "Invalid input." }), { 
      status: 400, 
      headers: { "Content-Type": "application/json" }, 
    }); 
  } 

  try { 
    // Check if a follow request already exists 
    const existingFollow = await Follow.findOne({ userId, targetUserId }); 

    // If a follow relationship already exists, return an error 
    if (existingFollow) { 
      return new Response(
        JSON.stringify({ message: "Follow request already exists." }), { 
        status: 400, 
        headers: { "Content-Type": "application/json" }, 
      }); 
    } 

    // Create a new follow request 
    const follow = new Follow({ 
      userId, 
      targetUserId, 
      actionType: "following", // This is the user who is sending the follow request 
      status: "requested", // Status indicating that it's a requested follow 
    }); 

    // Save the follow request to the database 
    await follow.save(); 

    // Return success response with the actual follow data
    return new Response(
      JSON.stringify({ 
        message: "Follow request sent.", 
        follow: follow, 
      }), 
      { 
        status: 201, 
        headers: { "Content-Type": "application/json" }, 
      } 
    ); 
  } catch (error) { 
    // Handle any errors 
    console.error(error); 
    return new Response(
      JSON.stringify({ message: "Internal server error.", error: error.message }), { 
      status: 500, 
      headers: { "Content-Type": "application/json" }, 
    }); 
  } 
}

export async function DELETE(req) {
  try {
    const { userId, targetUserId } = await req.json();

    if (!userId || !targetUserId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Missing required fields",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    await dbConnect(); // Connect to the database

    // Remove the follow relationship from the database
    const result = await Follow.deleteOne({
      $or: [
        { userId, targetUserId },  // Check if userId is the user and targetUserId is the target
        { userId: targetUserId, targetUserId: userId },  // Check if userId is the target and targetUserId is the user
      ],
    });

    if (result.deletedCount === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Follow relationship not found",
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Follow relationship removed successfully",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error deleting follow relationship:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}


export async function PUT(req) {
  try {
    // Extract userId and targetUserId from the request body
    const { userId, targetUserId } = await req.json();

    if (!userId || !targetUserId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Missing required fields",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    await dbConnect(); // Connect to the database

    // Find the follow relationship that needs to be updated
    const follow = await Follow.findOne({ userId, targetUserId });

    if (!follow) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Follow relationship not found",
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Update the follow status to 'confirmed'
    follow.status = "confirmed";
    await follow.save(); // Save the updated status

    return new Response(
      JSON.stringify({
        success: true,
        message: "Follow relationship confirmed successfully",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error confirming follow relationship:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}




