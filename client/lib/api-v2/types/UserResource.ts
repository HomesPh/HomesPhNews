export interface UserResource {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  roles: unknown[];
  email_verified_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}