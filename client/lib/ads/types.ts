export type RotationType = "random" | "sequential";

export type Ad = {
  id: string;
  title: string;
  image_url: string;
  destination_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  campaigns?: Campaign[];
}

export type Campaign = {
  id: string;
  name: string;
  rotation_type: RotationType;
  start_date: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}