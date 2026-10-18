// src/lib/axios.ts
import axios from "axios";
import { useAuth } from "@/stores/useAuth";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
});

// Automatically attach the JWT token from Zustand's user.accessToken on every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuth.getState().user?.accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);