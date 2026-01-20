import { create } from "zustand";
import { AuthStore } from "./types";

/**
 * The authentication store hook.
 * Use this hook to access authentication state and actions in any component.
 */
export const useAuth = create<AuthStore>((set) => ({
  // Default values for AuthState
  user: null,
  token: null,
  isAuthenticated: false,

  // Actions for handling AuthState
  /**
   * Logs in the user.
   * Tries to login to the API. If sucessful, stores user data 
   * and token, and sets isAuthenticated to true.
   * @param email The email of the user.
   * @param password The password of the user.
   */
  login: ({ email, password }: { email: string; password: string; }) => set(() => {
    // TODO: Implement actual auth logic if the API is ready.
    const mockUser = {
      id: 1,
      email: "admin@admin.com",
      name: "Admin"
    };

    // TODO: Implement actual auth logic if the API is ready.
    return {
      user: mockUser,
      token: "mock-token",
      isAuthenticated: true
    };
  }),

  /**
   * Logs out the user.
   * Clears out auth data from the store.
   */
  logout: () => set(() => ({
    user: null,
    token: null,
    isAuthenticated: false
  }))
}));