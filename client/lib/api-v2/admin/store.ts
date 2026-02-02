"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { login } from "./service/auth/login";
import { logout } from "./service/auth/logout";

interface AuthState {
  token: string | null;
  _hasHydrated: boolean;
}

interface AuthActions {
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  setHasHydrated: (state: boolean) => void;
}

export interface AuthStore extends AuthState, AuthActions { }

/**
 * The authentication store hook.
 * Use this hook to access authentication state and actions in any component.
 */
export const useAuth = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      _hasHydrated: false,

      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },

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

      logout: async () => {
        try {
          await logout();
        } catch (error) {
          console.error("Logout failed:", error);
        } finally {
          set({
            token: null,
          });
        }
      },

    }),
    {
      name: "homesph-auth", // unique name for localStorage
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: (state) => {
        return () => state.setHasHydrated(true);
      },
    }
  )
);
