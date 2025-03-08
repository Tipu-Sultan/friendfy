import { verifySession } from "./server-only";
import User from "@/models/UserModel";

export const getAuthUser = async () => {
    try {
  console.log('userData')

      const session = await verifySession();
  console.log(session)

      if (!session?.userId) {
        throw new Error('No user session found');
      }

  console.log(session.userId)   

  
      const user = await User.findOne({ _id: session.userId});
  
      if (!user || user.length === 0) {
        throw new Error('User not found');
      }
  
      return user[0]; // Return the first (and expected to be the only) user
    } catch (error) {
      console.error('Failed to fetch user:', error.message);
      return null; // Gracefully handle errors by returning null
    }
  };