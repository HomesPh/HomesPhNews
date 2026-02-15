export interface Campaign {
  id: number;
  name: string;
  rotation_type: "random" | "sequential";
  start_date: string | null;
  end_date: string | null;
  created_at: string | null;
  updated_at: string | null;
  is_active: boolean; // Changed from string to boolean
  ads_count?: number;
  ads?: number[]; // For update/create payloads
}
