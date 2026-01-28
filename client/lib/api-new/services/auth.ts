import { client } from "../client";
import {
  LoginRequest,
  UserResource
} from "../types";

export interface LoginResponse {
  access_token: string;
  token_type: "Bearer";
  user: UserResource;
}

/**
 * Auth service
 */
export const authService = {
  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return client.post<LoginResponse>("/login", credentials);
  },

  /**
   * Logout user
   */
  async logout(): Promise<{ message: string }> {
    return client.post<{ message: string }>("/logout");
  },

  /**
   * Get current authenticated user
   */
  async me(): Promise<UserResource> {
    return client.get<UserResource>("/user");
  },
};
