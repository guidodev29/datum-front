import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { tokenManager } from '../../utils/tokenManager.ts';

// Base URL for your API
const BASE_URL = 'http://localhost:8082';

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
    baseURL: '',
    timeout: 10000, 
    headers: {
        'Content-Type': 'application/json',
    },
});

// ==================== REQUEST INTERCEPTOR ====================
// Automatically add JWT token to requests
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = tokenManager.getToken();

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// ==================== RESPONSE INTERCEPTOR ====================
// Handle responses and errors globally
axiosInstance.interceptors.response.use(
    (response) => {
        // Return the data directly
        return response;
    },
    (error: AxiosError) => {
        // Handle different error scenarios
        if (error.response) {
            // Server responded with error status
            const status = error.response.status;

            switch (status) {
                case 401:
                    // Unauthorized - clear token and redirect to login
                    tokenManager.clearAuth();
                    window.location.href = '/login';
                    break;
                case 403:
                    // Forbidden
                    console.error('Access forbidden');
                    break;
                case 404:
                    // Not found
                    console.error('Resource not found');
                    break;
                case 500:
                    // Server error
                    console.error('Server error');
                    break;
                default:
                    console.error('An error occurred');
            }
        } else if (error.request) {
            // Request was made but no response received
            console.error('Network error - no response from server');
        } else {
            // Something else happened
            console.error('Error:', error.message);
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;