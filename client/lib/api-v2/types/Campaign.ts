export interface Campaign {
  id: number;
  name: string;
  rotation_type: string;
  start_date: string | null;
  end_date: string | null;
  created_at: string | null;
  updated_at: string | null;
  is_active: string;
}
