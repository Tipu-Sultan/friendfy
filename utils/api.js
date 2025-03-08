import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Replace with your API's base URL
  timeout: 10000, // Set request timeout (in milliseconds)
});

// Request Interceptor (optional)
api.interceptors.request.use(
  (config) => {
    // Add authorization token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

// Response Interceptor (optional)
api.interceptors.response.use(
  (response) => {
    // You can modify response data here if needed
    return response;
  },
  (error) => {
    // Handle response errors (e.g., redirect to login on 401)
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized! Redirecting to login...');
      localStorage.removeItem('authToken'); // Clear token on 401
      window.location.href = '/login'; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default api;
