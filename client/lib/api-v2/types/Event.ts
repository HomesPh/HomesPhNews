export interface Event {
  id: number;
  event_title: string;
  date: string;
  time: string | null;
  location: string | null;
  details: string | null;
  category: string | null;
  country: string | null;
  color: string | null;
  bg_color: string | null;
  border_color: string | null;
  is_public_holiday: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface CreateEventPayload {
  event_title: string;
  date: string;
  time?: string | null;
  location?: string | null;
  details?: string | null;
  category?: string | null;
  country?: string | null;
  color?: string | null;
  bg_color?: string | null;
  border_color?: string | null;
  is_public_holiday?: boolean;
}
