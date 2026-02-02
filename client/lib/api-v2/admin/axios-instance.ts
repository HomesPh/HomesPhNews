"use client";

import axios, { AxiosInstance } from "axios";
import { useAuth } from "./store";
import { handleAxiosError } from "../utils/errorHandler";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const AXIOS_INSTANCE_ADMIN: AxiosInstance = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  },
  withCredentials: true
});

AXIOS_INSTANCE_ADMIN.interceptors.request.use(
  (config) => {
    // Get token directly from Zustand store
    const token = useAuth.getState().token;

    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

AXIOS_INSTANCE_ADMIN.interceptors.response.use(
  (response) => response,
  (error) => handleAxiosError(error)
);

export default AXIOS_INSTANCE_ADMIN;