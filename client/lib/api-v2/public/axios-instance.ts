"use server";

/**
 * This instance is intended to host the axios instance for public API calls.
 * Will be called server side a lot.
 */

import axios, { AxiosInstance } from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const AXIOS_INSTANCE_PUBLIC: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  },
  withCredentials: true
});

export default AXIOS_INSTANCE_PUBLIC;