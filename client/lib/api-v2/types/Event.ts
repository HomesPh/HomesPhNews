export interface Event {
  id: number;
  event_title: string;
  date: string;
  time: string | null;
  location: string | null;
  description: string | null;
  created_at: string | null;
  updated_at: string | null;
}

