"use client";

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Plus, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Globe } from 'lucide-react';
import { Button } from "@/components/ui/button";
import CalendarHeader from "@/components/features/admin/calendar/CalendarHeader";
import CalendarViewSelector from "../../../components/features/admin/calendar/CalendarViewSelector";
import CalendarGrid from "../../../components/features/admin/calendar/CalendarGrid";
import CreateEventModal from "../../../components/features/admin/calendar/CreateEventModal";
import EventDetailModal from "../../../components/features/admin/calendar/EventDetailModal";
import { ViewMode, CalendarEvent } from "@/components/features/admin/calendar/event-types";
import { mockEvents } from "./data";

export default function CalendarPage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Initial state from URL params
    const viewParam = searchParams.get('view') as ViewMode | null;
    const countryParam = searchParams.get('country');
    const dateParam = searchParams.get('date');

    const initializeDate = () => {
        if (dateParam) {
            const parsedDate = new Date(dateParam);
            if (!isNaN(parsedDate.getTime())) {
                return parsedDate;
            }
        }
        return new Date(2026, 0, 21);
    };

    const [viewMode, setViewModeState] = useState<ViewMode>(viewParam || 'day');
    const [currentDate, setCurrentDateState] = useState(initializeDate());
    const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedCountry, setSelectedCountryState] = useState(countryParam || 'All Countries');

    // Event State
    const [events, setEvents] = useState<CalendarEvent[]>(mockEvents);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [showEventDetail, setShowEventDetail] = useState(false);
    const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

    // Update URL helper
    const createQueryString = useCallback(
        (params: Record<string, string | number | null>) => {
            const newParams = new URLSearchParams(searchParams.toString());
            Object.entries(params).forEach(([key, value]) => {
                if (value === null || value === 'All Countries') {
                    newParams.delete(key);
                } else {
                    newParams.set(key, String(value));
                }
            });
            return newParams.toString();
        },
        [searchParams]
    );

    // State setters with URL sync
    const setViewMode = (mode: ViewMode) => {
        setViewModeState(mode);
        const query = createQueryString({ view: mode });
        router.push(`${pathname}?${query}`, { scroll: false });
    };

    const setSelectedCountry = (country: string) => {
        setSelectedCountryState(country);
        const query = createQueryString({ country: country });
        router.push(`${pathname}?${query}`, { scroll: false });
    };

    const setCurrentDate = (date: Date) => {
        setCurrentDateState(date);
        const dateStr = date.toISOString().split('T')[0];
        const query = createQueryString({ date: dateStr });
        router.push(`${pathname}?${query}`, { scroll: false });

        // Sync selectedYear if needed
        if (date.getFullYear() !== selectedYear) {
            setSelectedYear(date.getFullYear());
        }
    };

    // Sync state with URL changes (handling browser back/forward)
    useEffect(() => {
        if (viewParam && viewParam !== viewMode) setViewModeState(viewParam);
        if (countryParam && countryParam !== selectedCountry) setSelectedCountryState(countryParam);
        if (dateParam) {
            const parsedDate = new Date(dateParam);
            if (!isNaN(parsedDate.getTime()) && parsedDate.getTime() !== currentDate.getTime()) {
                setCurrentDateState(parsedDate);
                setSelectedYear(parsedDate.getFullYear());
            }
        }
    }, [viewParam, countryParam, dateParam]);


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

    const handleCreateEvent = (newEvent: any) => {
        setEvents([...events, { ...newEvent, id: Date.now() }]);
        setCurrentDate(new Date(newEvent.date));
        // setViewMode('day'); // Optional: switch to day view on create
    };

    const handleEditEvent = (event: CalendarEvent) => {
        setEditingEvent(event);
        setShowEventDetail(false);
        setShowCreateModal(true);
    };

    const handleUpdateEvent = (updatedEvent: CalendarEvent) => {
        setEvents(events.map(e => e.id === updatedEvent.id ? updatedEvent : e));
        setEditingEvent(null);
    };

    const handleDeleteEvent = (eventId: number) => {
        setEvents(events.filter(e => e.id !== eventId));
    };

    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
        setEditingEvent(null);
    };

    return (
        <div className="p-8 bg-[#f9fafb] min-h-screen">
            <CalendarHeader
                onCreateEvent={() => setShowCreateModal(true)}
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
                        events={events}
                        selectedCountry={selectedCountry}
                        onEventClick={handleEventClick}
                        onDateClick={handleDateClick}
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
