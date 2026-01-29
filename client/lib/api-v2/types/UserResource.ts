export default interface UserResource {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  email_verified_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}