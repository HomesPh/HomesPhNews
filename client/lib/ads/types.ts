export type RotationType = "random" | "sequential";

export type CampaignBanner = {
  id: number;
  image_url: string;
  width: number | null;
  height: number | null;
  resolution: string | null;
}

export type Campaign = {
  id: string;
  name: string;
  status: "active" | "paused" | "archived";
  start_date: string | null;
  end_date: string | null;
  image_url: string | null;
  target_url: string;
  headline: string | null;
  banners?: CampaignBanner[];
  created_at: string;
  updated_at: string;
  ad_units?: AdUnit[];
}

export type AdUnit = {
  id: string;
  name: string;
  type: "image" | "text" | null;
  size?: string | null;
  page_url: string | null;
  created_at: string;
  updated_at: string;
  campaigns?: Campaign[];
}