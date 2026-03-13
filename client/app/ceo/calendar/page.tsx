"use client";

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Plus, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Globe } from 'lucide-react';
import { Button } from "@/components/ui/button";
import AdminPageHeader from "@/components/features/admin/shared/AdminPageHeader";
import CalendarViewSelector from "../../../components/features/admin/calendar/CalendarViewSelector";
import CalendarGrid from "../../../components/features/admin/calendar/CalendarGrid";
import CreateEventModal from "../../../components/features/admin/calendar/CreateEventModal";
import EventDetailModal from "../../../components/features/admin/calendar/EventDetailModal";
import { ViewMode, CalendarEvent } from "@/components/features/admin/calendar/event-types";
import { mockEvents } from "./data";
import useUrlFilters from '@/hooks/useUrlFilters';
import { getScheduledArticles } from '@/lib/api-v2/admin/service/article-publications';
import { getPublicHolidays, NagerHoliday } from '@/lib/api-v2/public/services/metadata/getPublicHolidays';
import { getPublicCountries } from '@/lib/api-v2/public/services/metadata/getCountries';
import { CountryResource } from '@/lib/api-v2/types/CountryResource';
import { getAdminEvents } from '@/lib/api-v2/admin/service/events/getAdminEvents';
import { createEvent } from '@/lib/api-v2/admin/service/events/createEvent';
import { updateEvent } from '@/lib/api-v2/admin/service/events/updateEvent';
import { deleteEvent } from '@/lib/api-v2/admin/service/events/deleteEvent';
import { CreateEventPayload, Event as DBEvent } from '@/lib/api-v2/types/Event';

// Filter configuration for Calendar
const CALENDAR_FILTERS_CONFIG = {
    view: {
        default: 'day' as string,
    },
    country: {
        default: 'All Countries',
        resetValues: ['All Countries']
    },
    date: {
        default: '2026-01-21',
    }
};

export default function CalendarPage() {
    const router = useRouter();
    const { filters, setFilters, setFilter } = useUrlFilters(CALENDAR_FILTERS_CONFIG);

    // View state from URL
    const viewMode = filters.view as ViewMode;
    const selectedCountry = filters.country;
    const currentDate = new Date(filters.date);

    const [selectedYear, setSelectedYearState] = useState(currentDate.getFullYear());
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Event State
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [holidays, setHolidays] = useState<CalendarEvent[]>([]);
    const [activeCountries, setActiveCountries] = useState<CountryResource[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [showEventDetail, setShowEventDetail] = useState(false);
    const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

    // Fetch publications, countries, and custom events
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [pubResponse, countriesResponse, customEventsResponse] = await Promise.allSettled([
                getScheduledArticles(),
                getPublicCountries(),
                getAdminEvents()
            ]);

            if (countriesResponse.status === 'fulfilled') {
                setActiveCountries(countriesResponse.value);
            }

            let allEvents: CalendarEvent[] = [];

            if (pubResponse.status === 'fulfilled') {
                const mappedPubs: CalendarEvent[] = pubResponse.value.data.map((pub: any) => {
                    const dt = new Date(pub.scheduled_at);
                    const timeStr = dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

                    return {
                        id: pub.id as any,
                        title: `Publish: ${pub.title}`,
                        date: pub.scheduled_at.split('T')[0],
                        time: timeStr,
                        location: pub.country || '',
                        details: `Article ID: ${pub.article_id}\nCategory: ${pub.category}`,
                        category: pub.category || 'Article',
                        country: pub.country || 'Global',
                        status: pub.status,
                        color: pub.status === 'published' ? '#6b7280' : pub.status === 'failed' ? '#dc2626' : '#2563eb',
                        bgColor: pub.status === 'published' ? '#f3f4f6' : pub.status === 'failed' ? '#fef2f2' : '#eff6ff',
                        borderColor: pub.status === 'published' ? '#e5e7eb' : pub.status === 'failed' ? '#f87171' : '#3b82f6',
                        isPublicHoliday: false
                    } as CalendarEvent;
                });
                allEvents = [...allEvents, ...mappedPubs];
            }

            if (customEventsResponse.status === 'fulfilled') {
                const mappedCustom: CalendarEvent[] = customEventsResponse.value.data.map((ev: DBEvent) => ({
                    id: ev.id,
                    title: ev.event_title,
                    date: ev.date.split('T')[0],
                    time: ev.time || 'All Day',
                    location: ev.location || '',
                    details: ev.details || '',
                    category: ev.category || 'Business',
                    country: ev.country || 'Philippines',
                    color: ev.color || '#1447e7',
                    bgColor: ev.bg_color || '#dbeafe',
                    borderColor: ev.border_color || '#93c5fd',
                    isPublicHoliday: !!ev.is_public_holiday
                } as CalendarEvent));
                allEvents = [...allEvents, ...mappedCustom];
            }

            setEvents(allEvents);
        } catch (error) {
            console.error("Failed to fetch initial data", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Fetch holidays when year or countries change
    useEffect(() => {
        const fetchAllHolidays = async () => {
            if (activeCountries.length === 0) return;

            try {
                const holidayPromises = activeCountries.map(async (country) => {
                    const nagerHolidays = await getPublicHolidays(country.id, selectedYear);
                    return nagerHolidays.map((h: NagerHoliday, idx: number) => ({
                        id: `holiday-${country.id}-${h.date}-${idx}` as any,
                        title: h.name,
                        date: h.date,
                        time: 'All Day',
                        location: country.name,
                        details: h.localName,
                        category: 'Holiday',
                        country: country.name,
                        color: '#bb4d20',
                        bgColor: '#fef3c6',
                        borderColor: '#fde68a',
                        isPublicHoliday: true
                    } as CalendarEvent));
                });

                const holidayResults = await Promise.all(holidayPromises);
                const allHolidays = holidayResults.flat();
                // Deduplicate by title and date
                const uniqueHolidays = allHolidays.filter((holiday: CalendarEvent, index: number, self: CalendarEvent[]) =>
                    index === self.findIndex((h) => (
                        h.title === holiday.title && h.date === holiday.date
                    ))
                );
                setHolidays(uniqueHolidays);
            } catch (error) {
                console.error("Failed to fetch holidays", error);
            }
        };

        fetchAllHolidays();
    }, [selectedYear, activeCountries]);

    // Navigation and state helpers
    const setViewMode = (mode: ViewMode) => setFilter('view', mode);
    const setSelectedCountry = (country: string) => setFilter('country', country);
    const setCurrentDate = (date: Date) => {
        setFilter('date', date.toISOString().split('T')[0]);
        if (date.getFullYear() !== selectedYear) {
            setSelectedYearState(date.getFullYear());
        }
    };

    const setSelectedYear = (year: number) => {
        setSelectedYearState(year);
        const newDate = new Date(currentDate);
        newDate.setFullYear(year);
        setFilter('date', newDate.toISOString().split('T')[0]);
    };

    const navigateDate = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentDate);
        if (viewMode === 'day') {
            newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
        } else if (viewMode === 'week') {
            newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        } else if (viewMode === 'month') {
            newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        }
        setCurrentDate(newDate);
    };

    const handleEventClick = (event: CalendarEvent) => {
        setSelectedEvent(event);
        setShowEventDetail(true);
    };

    const handleDateClick = (date: Date) => {
        setCurrentDate(date);
        if (viewMode === 'year') {
            setViewMode('day');
        } else {
            setShowCreateModal(true);
        }
    };

    const handleMonthClick = (year: number, month: number) => {
        const newDate = new Date(year, month, 1);
        setCurrentDate(newDate);
        setViewMode('month');
    };

    const handleCreateEvent = async (newEvent: any) => {
        try {
            const payload: CreateEventPayload = {
                event_title: newEvent.title,
                date: newEvent.date,
                time: (newEvent.time === 'All Day' || !newEvent.time) ? null : newEvent.time,
                location: newEvent.location,
                details: newEvent.details,
                category: newEvent.category,
                country: newEvent.country,
                color: newEvent.color,
                bg_color: newEvent.bgColor,
                border_color: newEvent.borderColor,
                is_public_holiday: newEvent.isPublicHoliday
            };
            await createEvent(payload);
            alert("Event created successfully");
            fetchData();
            setCurrentDate(new Date(newEvent.date));
        } catch (error) {
            console.error("Failed to create event", error);
            alert("Failed to create event");
        }
    };

    const handleEditEvent = (event: CalendarEvent) => {
        setEditingEvent(event);
        setShowEventDetail(false);
        setShowCreateModal(true);
    };

    const handleUpdateEvent = async (updatedEvent: CalendarEvent) => {
        try {
            const payload: Partial<CreateEventPayload> = {
                event_title: updatedEvent.title,
                date: updatedEvent.date,
                time: (updatedEvent.time === 'All Day' || !updatedEvent.time) ? null : updatedEvent.time,
                location: updatedEvent.location,
                details: updatedEvent.details,
                category: updatedEvent.category,
                country: updatedEvent.country,
                color: updatedEvent.color,
                bg_color: updatedEvent.bgColor,
                border_color: updatedEvent.borderColor,
                is_public_holiday: updatedEvent.isPublicHoliday
            };
            await updateEvent(Number(updatedEvent.id), payload);
            alert("Event updated successfully");
            fetchData();
            setEditingEvent(null);
        } catch (error) {
            console.error("Failed to update event", error);
            alert("Failed to update event");
        }
    };

    const handleDeleteEvent = async (eventId: number) => {
        try {
            if (!confirm("Are you sure you want to delete this event?")) return;
            await deleteEvent(eventId);
            alert("Event deleted successfully");
            fetchData();
            setShowEventDetail(false);
        } catch (error) {
            console.error("Failed to delete event", error);
            alert("Failed to delete event");
        }
    };

    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
        setEditingEvent(null);
    };

    return (
        <div className="p-8 bg-[#f9fafb] min-h-screen">
            <AdminPageHeader
                title="Event Calendar"
                description="Manage events and view public holidays across all countries"
                actionLabel="Create Event"
                onAction={() => setShowCreateModal(true)}
                actionIcon={Plus}
            />

            <div className="mt-8">
                <CalendarViewSelector
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    currentDate={currentDate}
                    setCurrentDate={setCurrentDate}
                    selectedYear={selectedYear}
                    setSelectedYear={setSelectedYear}
                    onNavigate={navigateDate}
                    selectedCountry={selectedCountry}
                    setSelectedCountry={setSelectedCountry}
                />

                <div className="mt-6">
                    <CalendarGrid
                        viewMode={viewMode}
                        currentDate={currentDate}
                        selectedYear={selectedYear}
                        events={[...mockEvents, ...holidays, ...events]}
                        selectedCountry={selectedCountry}
                        onEventClick={handleEventClick}
                        onDateClick={handleDateClick}
                        onMonthClick={handleMonthClick}
                    />
                </div>
            </div>

            {showCreateModal && (
                <CreateEventModal
                    onClose={handleCloseCreateModal}
                    onCreateEvent={handleCreateEvent}
                    onEditEvent={handleUpdateEvent}
                    editingEvent={editingEvent}
                />
            )}

            {showEventDetail && selectedEvent && (
                <EventDetailModal
                    event={selectedEvent}
                    onClose={() => {
                        setShowEventDetail(false);
                        setSelectedEvent(null);
                    }}
                    onDelete={handleDeleteEvent}
                    onEdit={handleEditEvent}
                />
            )}
        </div>
    );
}
