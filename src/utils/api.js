import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create an Axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`, // Adjust if deployed
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add the JWT token
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

// Response interceptor to handle errors globally 
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If the token expires or is invalid
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Force reload to redirect to login if auth is completely lost
      // window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;
