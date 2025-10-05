import axios from "axios";
import { env } from "@/env";

// Check if running in browser
const isBrowser = typeof window !== "undefined";

/**
 * Axios instance configured with:
 * - Base URL from environment variables
 * - Request interceptor for auth token
 * - Response interceptor for 401 handling
 */
export const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add auth token from localStorage
api.interceptors.request.use(
  (config) => {
    if (isBrowser) {
      const token = localStorage.getItem("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - Handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && isBrowser) {
      // Clear auth token and redirect to login
      localStorage.removeItem("auth_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
