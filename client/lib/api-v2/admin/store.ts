"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { login } from "./service/auth/login";
import { logout } from "./service/auth/logout";
import type { UserResource } from "../types/UserResource";

interface AuthState {
  token: string | null;
  user: UserResource | null;
  _hasHydrated: boolean;
}

interface AuthActions {
  login: (credentials: { email: string; password: string }) => Promise<{ token: string, user: UserResource }>;
  logout: () => Promise<void>;
  setHasHydrated: (state: boolean) => void;
  setAuth: (token: string, user: UserResource) => void;
  updateUser: (updates: Partial<UserResource>) => void;
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
      user: null,
      _hasHydrated: false,

      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },

      login: async ({ email, password }) => {
        try {
          const response = await login({ email, password });
          const { access_token, user } = response.data;

          // Also set legacy user_info for compatibility with existing pages
          if (typeof window !== 'undefined') {
            const names = user.name.split(' ');
            localStorage.setItem('user_info', JSON.stringify({
              firstName: names[0],
              lastName: names.slice(1).join(' '),
              email: user.email,
              roles: user.roles
            }));
            localStorage.setItem('auth_token', access_token);
          }

          set({
            token: access_token,
            user: user
          });
          return { token: access_token, user };
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
          if (typeof window !== 'undefined') {
            localStorage.removeItem('user_info');
            localStorage.removeItem('auth_token');
          }
          set({
            token: null,
            user: null,
          });
        }
      },

      setAuth: (token: string, user: UserResource) => {
        if (typeof window !== 'undefined') {
          const names = user.name.split(' ');
          localStorage.setItem('user_info', JSON.stringify({
            firstName: names[0],
            lastName: names.slice(1).join(' '),
            email: user.email,
            roles: user.roles
          }));
          localStorage.setItem('auth_token', token);
        }

        set({
          token: token,
          user: user
        });
      },

      updateUser: (updates: Partial<UserResource>) => {
        set((state) => {
          if (!state.user) return state;

          const updatedUser = { ...state.user, ...updates };

          if (typeof window !== 'undefined') {
            const names = updatedUser.name.split(' ');
            localStorage.setItem('user_info', JSON.stringify({
              firstName: updatedUser.first_name || names[0],
              lastName: updatedUser.last_name || names.slice(1).join(' '),
              email: updatedUser.email,
              roles: updatedUser.roles,
              avatar: updatedUser.avatar
            }));
          }

          return { ...state, user: updatedUser };
        });
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
