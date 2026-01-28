/**
 * Base Fetch Client Configuration
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export type FetchOptions = RequestInit & {
  params?: Record<string, string | number | boolean | null | undefined>;
};

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(data?.message || response.statusText, response.status, data);
  }

  return data as T;
}

export const client = {
  async get<T>(path: string, options?: FetchOptions): Promise<T> {
    const url = new URL(`${API_BASE_URL}${path}`);

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
