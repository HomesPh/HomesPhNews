"use client";

import { create } from "zustand";
import { login } from "./admin/service/auth/login";
import { logout } from "./admin/service/auth/logout";

interface AuthState {
  token: string | null;
}

interface AuthActions {
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

export interface AuthStore extends AuthState, AuthActions { }

/**
 * The authentication store hook.
 * Use this hook to access authentication state and actions in any component.
 */
export const useAuth = create<AuthStore>((set) => ({
  // Default values for AuthState
  token: typeof window !== "undefined" ? (localStorage.getItem("access_token") || localStorage.getItem("token") || localStorage.getItem("auth_token")) : null,

  // Actions for handling AuthState
  /**
   * Logs in the user.
   * Tries to login to the API. If successful, stores user data 
   * and token, and sets isAuthenticated to true.
   * @param email The email of the user.
   * @param password The password of the user.
   */
  login: async ({ email, password }) => {
    try {
      const response = await login({ email, password });
      const { access_token } = response.data;

      set({
        token: access_token
      });
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  },

  /**
   * Logs out the user.
   * Clears out auth data from the store and removes token from localStorage.
   */
  logout: async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("access_token");
        localStorage.removeItem("token");
      }
      set({
        token: null,
      });
    }
  },

}));
