import api from "@/lib/api/axios";
import { create } from "zustand";
import { AuthStore, User } from "./types";

/**
 * The authentication store hook.
 * Use this hook to access authentication state and actions in any component.
 */
export const useAuth = create<AuthStore>((set) => ({
  // Default values for AuthState
  token: typeof window !== "undefined" ? localStorage.getItem("auth_token") : null,

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
      const response = await api.post("/login", { email, password });
      const { token } = response.data;

      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", token);
      }

      set({
        token
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
      await api.post("/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
      }
      set({
        token: null,
      });
    }
  },

}));