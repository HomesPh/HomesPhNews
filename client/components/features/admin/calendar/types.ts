export interface CalendarEvent {
    id: number;
    title: string;
    date: string;
    time: string;
    location: string;
    details: string;
    category: string;
    country: string;
    color: string;
    allDay: boolean;
}

export type ViewMode = 'day' | 'week' | 'month' | 'year';

export const CALENDAR_TYPES = true; // Dummy export to ensure module recognition

