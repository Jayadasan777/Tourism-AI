import axios from 'axios';

// Get API URL from environment (defaulting to live Render backend in production)
const defaultApiUrl = import.meta.env.DEV
  ? 'http://localhost:5000/api'
  : 'https://smart-tour-ai-backend.onrender.com/api';

const apiUrl = import.meta.env.VITE_API_URL || defaultApiUrl;

console.log('🌐 Using API URL:', apiUrl);

// Create axios instance with base configuration
const api = axios.create({
  baseURL: apiUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - Add auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle different error cases
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - clear stale token
          localStorage.removeItem('authToken');
          // Only redirect to login for protected routes, not public endpoints
          // (e.g. /itinerary/generate works without auth, so don't redirect)
          if (error.config?.url && (
            error.config.url.includes('/auth/') ||
            error.config.url.includes('/itinerary/my')
          )) {
            window.location.href = '/login';
          }
          break;
        case 403:
          console.error('Forbidden:', data.error || 'Access denied');
          break;
        case 404:
          console.error('Not found:', data.error || 'Resource not found');
          break;
        case 500:
          console.error('Server error:', data.error || 'Internal server error');
          break;
        default:
          console.error('Error:', data.error || 'An error occurred');
      }

      // Return formatted error
      return Promise.reject({
        status,
        message: data.error || data.message || 'An error occurred',
        errors: data.errors || []
      });
    } else if (error.request) {
      // Request made but no response received
      console.error('Network error: No response from server');
      return Promise.reject({
        message: 'Network error. Please check your internet connection.',
        isNetworkError: true
      });
    } else {
      // Something else happened
      console.error('Error:', error.message);
      return Promise.reject({
        message: error.message || 'An unexpected error occurred'
      });
    }
  }
);

export default api;
