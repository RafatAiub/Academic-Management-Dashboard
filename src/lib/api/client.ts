// ============================================
// API Configuration and Base Service
// ============================================

import axios, { AxiosInstance, AxiosError } from 'axios';

// Base URL for JSON Server
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Create axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Request interceptor for logging and token handling
apiClient.interceptors.request.use(
    (config) => {
        // Add any authentication headers here if needed
        console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error('[API] Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error: AxiosError) => {
        const message = error.response?.data || error.message || 'An error occurred';
        console.error('[API] Response Error:', message);
        return Promise.reject(error);
    }
);

export default apiClient;
export { API_BASE_URL };
