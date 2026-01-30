"use client";

import axios, { AxiosInstance } from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const AXIOS_INSTANCE_ADMIN: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  },
  withCredentials: true
});

const getAuthToken = (): string | null => {
  if (typeof window === "undefined")
    return null;

  const token = localStorage.getItem("access_token") || localStorage.getItem("token");

  if (token)
    return token;

  const match = document.cookie.match(/(?:^|; )(?:access_token|token)=([^;]+)/);

  return match ? decodeURIComponent(match[1]) : null;
};

import { handleAxiosError } from "../utils/errorHandler";

// ... existing code ...

AXIOS_INSTANCE_ADMIN.interceptors.request.use(
  (config) => {
    const token = getAuthToken();

    if (token) {
      config.headers = config.headers || {};
      // @ts-ignore - ensure Authorization header is set
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