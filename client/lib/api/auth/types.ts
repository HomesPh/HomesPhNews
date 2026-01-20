export interface User {
  id: number;
  email: string;
  name: string;
}

/**
 * The authentication state interface.
 * It is how the authentication state is stored in the global state.
 */
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface AuthActions {
  login: ({ email, password }: { email: string; password: string }) => void;
  logout: () => void;
}

export interface AuthStore extends AuthState, AuthActions { }