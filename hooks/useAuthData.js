
const useAuthData = () => {
  let authToken, userData;

  if (typeof window !== 'undefined') {
    // Retrieve authToken and userData from localStorage
    authToken = localStorage.getItem('authToken');
    userData = JSON.parse(localStorage.getItem('userData')); // Assuming userData is stored as JSON string
  }

  // Check if authToken exists to determine if the user is authenticated
  const isAuthenticated = !!authToken && userData;

  return { user: userData, isAuthenticated };
};

export default useAuthData;
