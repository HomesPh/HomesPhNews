export interface UserResource {
  id: number;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  avatar: string | null;
  roles: string[];
  email_verified_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}