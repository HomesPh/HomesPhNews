/**
 * Base Fetch Client Configuration
 * This module provides a clean wrapper around the native Fetch API
 * with support for TypeScript types, automatic JSON parsing, and error handling.
 */

/**
 * Base URL for the API, defaults to localhost if environment variable is not set.
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

/**
 * Extended Fetch options including support for typed query parameters.
 */
export type FetchOptions = RequestInit & {
  /**
   * Optional query parameters to be appended to the URL.
   */
  params?: Record<string, string | number | boolean | null | undefined>;
};

/**
 * Custom error class for API-related failures.
 * Includes status code and response data for better error handling.
 */
export class ApiError extends Error {
  /** HTTP status code */
  status: number;
  /** Response data (usually parsed JSON) */
  data: any;

  constructor(message: string, status: number, data: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

/**
 * Internal helper to handle the fetch Response.
 * Parses JSON if available and throws an ApiError if the response is not OK.
 * 
 * @template T The expected response data type
 * @param response The fetch Response object
 * @returns The parsed response data
 * @throws {ApiError} If the response status is not in the 200-299 range
 */
async function handleResponse<T>(response: Response): Promise<T> {
  // Attempt to parse JSON response, fallback to null if parsing fails
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    // Construct meaningful error message or use default status text
    throw new ApiError(data?.message || response.statusText, response.status, data);
  }

  return data as T;
}

/**
 * The core API client providing methods for common HTTP operations.
 */
export const client = {
  /**
   * Performs a GET request.
   * 
   * @template T The expected response data type
   * @param path The endpoint path (relative to API_BASE_URL)
   * @param options Additional fetch options and query parameters
   * @returns A promise that resolves to the response data
   */
  async get<T>(path: string, options?: FetchOptions): Promise<T> {
    const url = new URL(`${API_BASE_URL}${path}`);

    // Append query parameters to the URL if provided
    if (options?.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(url.toString(), {
      ...options,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    return handleResponse<T>(response);
  },

  /**
   * Performs a POST request.
   * 
   * @template T The expected response data type
   * @param path The endpoint path (relative to API_BASE_URL)
   * @param body The request body to be stringified as JSON
   * @param options Additional fetch options
   * @returns A promise that resolves to the response data
   */
  async post<T>(path: string, body?: any, options?: FetchOptions): Promise<T> {
    const url = new URL(`${API_BASE_URL}${path}`);

    const response = await fetch(url.toString(), {
      ...options,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    return handleResponse<T>(response);
  },

  /**
   * Performs a PUT request.
   * 
   * @template T The expected response data type
   * @param path The endpoint path (relative to API_BASE_URL)
   * @param body The request body to be stringified as JSON
   * @param options Additional fetch options
   * @returns A promise that resolves to the response data
   */
  async put<T>(path: string, body?: any, options?: FetchOptions): Promise<T> {
    const url = new URL(`${API_BASE_URL}${path}`);

    const response = await fetch(url.toString(), {
      ...options,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    return handleResponse<T>(response);
  },

  /**
   * Performs a PATCH request.
   * 
   * @template T The expected response data type
   * @param path The endpoint path (relative to API_BASE_URL)
   * @param body The request body to be stringified as JSON
   * @param options Additional fetch options
   * @returns A promise that resolves to the response data
   */
  async patch<T>(path: string, body?: any, options?: FetchOptions): Promise<T> {
    const url = new URL(`${API_BASE_URL}${path}`);

    const response = await fetch(url.toString(), {
      ...options,
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    return handleResponse<T>(response);
  },

  /**
   * Performs a DELETE request.
   * 
   * @template T The expected response data type
   * @param path The endpoint path (relative to API_BASE_URL)
   * @param options Additional fetch options
   * @returns A promise that resolves to the response data
   */
  async delete<T>(path: string, options?: FetchOptions): Promise<T> {
    const url = new URL(`${API_BASE_URL}${path}`);

    const response = await fetch(url.toString(), {
      ...options,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    return handleResponse<T>(response);
  },
};
