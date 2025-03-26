// api.js
import axios from 'axios';
const API_HOST = process.env.API_HOST || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_HOST, 
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       // Token expired or invalid, perform logout
//       localStorage.removeItem('token');
//       // Redirect to login page or perform other actions
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

export default api;
