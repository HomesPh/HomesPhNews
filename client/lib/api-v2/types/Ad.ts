export interface Ad {
  id: number;
  title: string;
  description: string | null;
  image_url: string;
  destination_url: string;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
  // Relationships
  campaigns?: any[]; // Avoiding circular dependency for now, or use mapped type if available
  // For payloads
  campaign_ids?: number[];
}
