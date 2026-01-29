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
  token: string | null;
}

export interface AuthActions {
  login: ({ email, password }: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

export interface AuthStore extends AuthState, AuthActions { }