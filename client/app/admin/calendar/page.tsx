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
    const { filters, setFilters, setFilter } = useUrlFilters(CALENDAR_FILTERS_CONFIG);

    // View state from URL
    const viewMode = filters.view as ViewMode;
    const selectedCountry = filters.country;
    const currentDate = new Date(filters.date);

    const [selectedYear, setSelectedYearState] = useState(currentDate.getFullYear());
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Event State
    const [events, setEvents] = useState<CalendarEvent[]>(mockEvents);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [showEventDetail, setShowEventDetail] = useState(false);
    const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

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
