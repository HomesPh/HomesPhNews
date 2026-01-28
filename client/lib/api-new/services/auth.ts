import { client } from "../client";
import {
  LoginRequest,
  UserResource
} from "../types";

/**
 * Detailed response for a successful login attempt.
 */
export interface LoginResponse {
  /** The access token used for subsequent authenticated requests */
  access_token: string;
  /** The type of token (usually "Bearer") */
  token_type: "Bearer";
  /** The user information */
  user: UserResource;
}

/**
 * Service for handling user authentication and session management.
 */
export const authService = {
  /**
   * Authenticates a user with the provided credentials.
   * 
   * @param credentials Email and password
   * @returns The login response containing the access token and user info
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return client.post<LoginResponse>("/login", credentials);
  },

  /**
   * Invalidates the current user session (logout).
   * 
   * @returns Success message
   */
  async logout(): Promise<{ message: string }> {
    return client.post<{ message: string }>("/logout");
  },

  /**
   * Retrieves the currently authenticated user's profile.
   * 
   * @returns The user resource
   */
  async me(): Promise<UserResource> {
    return client.get<UserResource>("/user");
  },
};

