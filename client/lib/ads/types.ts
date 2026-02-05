export type RotationType = "random" | "sequential";

export type Ad = {
  id: string;
  title: string;
  image_url: string;
  destination_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  campaign_id: string;
}

export type Campaign = {
  id: string;
  name: string;
  is_active: boolean;
  rotation_type: RotationType;
  ads: Ad[];
}