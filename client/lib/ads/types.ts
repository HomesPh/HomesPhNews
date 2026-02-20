export type RotationType = "random" | "sequential";


export type Campaign = {
  id: string;
  name: string;
  status: "active" | "paused" | "archived";
  start_date: string | null;
  end_date: string | null;
  image_url: string | null;
  target_url: string;
  headline: string | null;
  banner_image_urls: string[] | null;
  created_at: string;
  updated_at: string;
  ad_units?: AdUnit[];
}

export type AdUnit = {
  id: string;
  name: string;
  type: "image" | "text" | null;
  page_url: string | null;
  size: "adaptive" | null;
  created_at: string;
  updated_at: string;
  campaigns?: Campaign[];
}