import dbConnect from "@/lib/db";
import Follow from "@/models/FollowModel";
import User from "@/models/UserModel";

export async function GET(req, {params}) {
  await dbConnect(); // Ensure database connection

  const {id} = await params;

  try {
    // Fetch all users except the current user
    const users = await User.find({ _id: { $ne: id } }) // Ensure exclusion of the current user
      .select("_id username email bio profilePicture followersCount followingCount") // Specify required fields
      .lean();

    // Fetch follow relationships involving the current user
    const follows = await Follow.find({
      $or: [
        { userId: id },
        { targetUserId: id },
      ],
    })
      .select("_id userId targetUserId isBlocked actionType status") // Fetch necessary fields
      .lean();

    // Combine user details and relevant follow relationships
    const combinedUsers = users
      .filter((user) => user._id.toString() !== id) // Explicitly filter out currentUserID
      .map((user) => {
        // Find the associated follow relationship for the user
        const associatedFollow = follows.find(
          (follow) =>
            follow.userId.toString() === user._id.toString() ||
            follow.targetUserId.toString() === user._id.toString()
        );

        // Return the user details and associated follow relationship
        return {
          ...user, // Include user details
          follows: associatedFollow || null, // Include the associated follow relationship or null
        };
      });

    // Return the combined response
    return new Response(
      JSON.stringify({
        success: true,
        users: combinedUsers,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching users and follow data:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to fetch users and follow data. Please try again later.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
