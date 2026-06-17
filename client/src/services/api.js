import axios from 'axios';

// Get base API URL from environment variables, fallback to Render in production and local proxy in development
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? '/api/v1'
    : 'https://caia-system-design-backend.onrender.com/api/v1');

// Create Axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user && user.token) {
        // Support both Bearer token format and raw token format as expected by backend protect middleware
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh or session expiration
api.interceptors.response.use(
  (response) => {
    // If the response returns a new accessToken (e.g., after login or registration)
    if (response.data && response.data.accessToken) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        user.token = response.data.accessToken;
        localStorage.setItem('user', JSON.stringify(user));
      }
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle Token Expired or Unauthorized Error
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Attempt to refresh token
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          const refreshRes = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
            refreshToken: user.refreshToken || '',
          });
          
          if (refreshRes.data && refreshRes.data.success) {
            user.token = refreshRes.data.accessToken;
            user.refreshToken = refreshRes.data.refreshToken;
            localStorage.setItem('user', JSON.stringify(user));
            
            originalRequest.headers.Authorization = `Bearer ${refreshRes.data.accessToken}`;
            return axios(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error('Session expired. Please sign in again.');
        // We do not clear localStorage immediately to allow users to view cached dashboard, 
        // but they will need to log in for server operations.
      }
    }
    return Promise.reject(error);
  }
);

export default api;
