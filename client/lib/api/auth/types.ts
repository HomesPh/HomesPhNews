export interface Author {
  name: string;
  imageUrl: string;
}

export interface RelatedArticle {
  id: string;
  title: string;
  category: string;
  image: string;
  href: string;
}

export interface Article {
  id: string | number;
  country: string;
  category: string;
  title: string;
  subtitle: string;
  author: Author;
  featuredImageUrl: string;
  createdAt: string; // ISO Date string
  views: number;
  content: string;
  topics: string[];
  relatedArticles: RelatedArticle[];
}

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