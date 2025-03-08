import api from '@/utils/api';
export const getUserProfile = async () => {
    try {
      const response = await api.get('/auth/user'); // Replace with your API endpoint
      return response.data.user; // Return the user data from the API response
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error; // Rethrow error to handle it in the calling function
    }
  };