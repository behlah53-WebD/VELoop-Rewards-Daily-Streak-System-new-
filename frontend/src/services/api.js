import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor to attach Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('veloop_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to normalize errors and handle 401 session expiration safely
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Never leak raw AxiosError, network error objects, or stack traces
    let normalizedError = {
      code: 'SERVER_ERROR',
      message: 'Unable to communicate with the server. Please check your connection.',
    };

    if (error.response?.data?.error) {
      normalizedError = error.response.data.error;
    } else if (error.response?.status === 401) {
      normalizedError = {
        code: 'UNAUTHENTICATED',
        message: 'Your session has expired. Please log in again.',
      };
      localStorage.removeItem('veloop_token');
      localStorage.removeItem('veloop_user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    } else if (error.response?.status === 429) {
      normalizedError = {
        code: 'RATE_LIMITED',
        message: 'Too many requests. Please slow down and wait a moment.',
      };
    } else if (error.message === 'Network Error') {
      normalizedError = {
        code: 'NETWORK_ERROR',
        message: 'Network error. Please verify the backend server is running.',
      };
    }

    return Promise.reject(normalizedError);
  }
);

export default api;
