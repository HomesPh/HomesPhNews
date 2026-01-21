"use client";

import { Calendar as CalendarIcon } from 'lucide-react';
import { ViewMode, CalendarEvent } from "./event-types";
import EventCard from "./EventCard";

interface CalendarGridProps {
    viewMode: ViewMode;
    currentDate: Date;
    selectedYear: number;
    events: CalendarEvent[];
    selectedCountry: string;
    onEventClick: (event: CalendarEvent) => void;
    onDateClick: (date: Date) => void;
}

export default function CalendarGrid({
    viewMode,
    currentDate,
    selectedYear,
    events: allEvents,
    selectedCountry,
    onEventClick,
    onDateClick
}: CalendarGridProps) {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayNamesShort = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    const events = allEvents.filter(event =>
        selectedCountry === 'All Countries' || event.country === selectedCountry
    );

    const getEventsForDate = (date: Date) => {
        const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        return events.filter(event => event.date === dateStr);
    };

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };

    // --- DAY VIEW ---
    const renderDayView = () => {
        const dayEvents = getEventsForDate(currentDate);
        const dayName = dayNames[currentDate.getDay()].toUpperCase().slice(0, 3);
        const dateNum = currentDate.getDate();

        return (
            <div className="bg-white rounded-[12px] border border-[#e5e7eb] shadow-sm mt-8 max-w-full animate-in fade-in duration-300">
                {/* Date Header */}
                <div className="bg-[#f9fafb] rounded-t-[12px] border-b border-[#e5e7eb] px-6 py-8">
                    <div className="flex flex-col items-center justify-center gap-2">
                        <p className="text-[16px] font-semibold text-[#6b7280] tracking-[0.1px] leading-[12px]">
                            {dayName}
                        </p>
                        <p className="text-[64px] font-bold text-[#111827] tracking-[-0.5px] leading-none">
                            {dateNum}
                        </p>
                    </div>
                </div>

                {/* Events Section */}
                <div className="p-6">
                    {dayEvents.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-16 h-16 mb-4 text-[#d1d5db]">
                                <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3">
                                    <rect x="8" y="12" width="48" height="44" rx="4" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M8 24h48M20 8v8M44 8v8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <p className="text-[16px] text-[#6b7280] tracking-[-0.5px] mb-6">
                                No events scheduled for this day
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {dayEvents.map((event) => (
                                <EventCard key={event.id} event={event} variant="day" onClick={() => onEventClick(event)} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // --- WEEK VIEW ---
    const renderWeekView = () => {
        const startOfWeek = new Date(currentDate);
        const day = startOfWeek.getDay();
        startOfWeek.setDate(startOfWeek.getDate() - day);

        const weekDays = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(startOfWeek);
            date.setDate(date.getDate() + i);
            return date;
        });

        return (
            <div className="bg-white rounded-[12px] border border-[#e5e7eb] shadow-sm mt-8 overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="grid grid-cols-7">
                    {weekDays.map((date, idx) => {
                        const dayEvents = getEventsForDate(date);
                        const isToday = date.toDateString() === new Date().toDateString();

                        return (
                            <div key={idx} className="border-r border-[#e5e7eb] last:border-r-0">
                                {/* Header */}
                                <div className="bg-[#f9fafb] border-b border-[#e5e7eb] px-4 py-4 text-center">
                                    <p className="text-[11px] font-semibold text-[#6b7280] tracking-[-0.5px] uppercase mb-1">
                                        {dayNamesShort[idx]}
                                    </p>
                                    <p className={`text-[24px] font-bold tracking-[-0.5px] ${isToday ? 'text-[#C10007]' : 'text-[#111827]'}`}>
                                        {date.getDate()}
                                    </p>
                                </div>
                                {/* Events */}
                                <div className="bg-white min-h-[500px] p-3 space-y-2">
                                    {dayEvents.map((event) => (
                                        <EventCard key={event.id} event={event} variant="week" onClick={() => onEventClick(event)} />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    // --- MONTH VIEW ---
    const renderMonthView = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);

        const calendarDays = [];

        // Previous month days
        const prevMonth = month === 0 ? 11 : month - 1;
        const prevYear = month === 0 ? year - 1 : year;
        const prevMonthDays = getDaysInMonth(prevYear, prevMonth);
        for (let i = firstDay - 1; i >= 0; i--) {
            calendarDays.push({
                date: new Date(prevYear, prevMonth, prevMonthDays - i),
                isCurrentMonth: false
            });
        }

        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            calendarDays.push({
                date: new Date(year, month, i),
                isCurrentMonth: true
            });
        }

        // Next month days to complete the grid (6 rows)
        const remainingDays = 42 - calendarDays.length;
        const nextMonth = month === 11 ? 0 : month + 1;
        const nextYear = month === 11 ? year + 1 : year;
        for (let i = 1; i <= remainingDays; i++) {
            calendarDays.push({
                date: new Date(nextYear, nextMonth, i),
                isCurrentMonth: false
            });
        }

        return (
            <div className="bg-white rounded-[12px] border border-[#e5e7eb] shadow-sm mt-8 overflow-hidden animate-in slide-in-from-bottom-2 duration-300">
                {/* Header */}
                <div className="grid grid-cols-7 bg-[#f9fafb] border-b border-[#e5e7eb]">
                    {dayNames.map((day) => (
                        <div key={day} className="px-3 py-4 text-center border-r border-[#e5e7eb] last:border-r-0">
                            <p className="text-[13px] font-medium text-[#6b7280] tracking-[-0.5px]">{day}</p>
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7">
                    {calendarDays.map((day, idx) => {
                        const dayEvents = getEventsForDate(day.date);
                        const isToday = day.date.toDateString() === new Date().toDateString();

                        return (
                            <div
                                key={idx}
                                onClick={() => onDateClick(day.date)}
                                className={`min-h-[120px] p-3 border-r border-b border-[#e5e7eb] last:border-r-0 cursor-pointer hover:bg-[#f9fafb] transition-colors ${!day.isCurrentMonth ? 'bg-[#fafafa]' : ''
                                    }`}
                            >
                                {/* Date Number */}
                                <div className="mb-2">
                                    {isToday ? (
                                        <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#C10007] text-white">
                                            <p className="text-[14px] font-semibold tracking-[-0.5px]">
                                                {day.date.getDate()}
                                            </p>
                                        </div>
                                    ) : (
                                        <p className={`text-[14px] font-semibold tracking-[-0.5px] ${!day.isCurrentMonth ? 'text-[#9ca3af]' : 'text-[#111827]'
                                            }`}>
                                            {day.date.getDate()}
                                        </p>
                                    )}
                                </div>

                                {/* Events */}
                                <div className="space-y-1">
                                    {dayEvents.slice(0, 3).map((event) => (
                                        <EventCard key={event.id} event={event} variant="month" onClick={() => onEventClick(event)} />
                                    ))}
                                    {dayEvents.length > 3 && (
                                        <p className="text-[10px] text-[#3b82f6] tracking-[-0.5px] pl-1">
                                            +{dayEvents.length - 3} more
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    // --- YEAR VIEW ---
    const renderYearView = () => {
        const months = Array.from({ length: 12 }, (_, i) => i);

        return (
            <div className="grid grid-cols-3 gap-[16px] mt-8 animate-in fade-in zoom-in-95 duration-500">
                {months.map((monthIdx) => {
                    const daysInMonthNum = getDaysInMonth(selectedYear, monthIdx);
                    const firstDayNum = getFirstDayOfMonth(selectedYear, monthIdx);
                    const monthName = monthNames[monthIdx];

                    const calendarDays = [];
                    for (let i = 0; i < firstDayNum; i++) {
                        calendarDays.push(null);
                    }
                    for (let i = 1; i <= daysInMonthNum; i++) {
                        calendarDays.push(i);
                    }

                    const monthEvents = events.filter(event => {
                        const eventDate = new Date(event.date);
                        return eventDate.getFullYear() === selectedYear && eventDate.getMonth() === monthIdx;
                    });

                    const today = new Date();
                    const isCurrentMonth = today.getFullYear() === selectedYear && today.getMonth() === monthIdx;
                    const todayDate = today.getDate();

                    return (
                        <div key={monthIdx} className="bg-white rounded-[8px] border border-[#e5e7eb] overflow-hidden shadow-sm">
                            {/* Red Header Bar */}
                            <div className="bg-[#C10007] px-4 py-[11px] flex items-center justify-between">
                                <p className="text-[16px] font-bold text-white tracking-[-0.5px] leading-[24px]">
                                    {monthName}
                                </p>
                                <p className="text-[12px] font-medium text-white tracking-[-0.5px] leading-[16px]">
                                    {monthEvents.length} event{monthEvents.length !== 1 ? '(s)' : ''}
                                </p>
                            </div>

                            {/* Mini Calendar */}
                            <div className="p-4">
                                {/* Day Headers */}
                                <div className="grid grid-cols-7 gap-[2px] mb-2">
                                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                                        <div key={idx} className="h-[15px] flex items-center justify-center">
                                            <p className="text-[10px] font-semibold text-[#6b7280] tracking-[-0.5px] leading-[10px]">
                                                {day}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* Calendar Grid */}
                                <div className="grid grid-cols-7 gap-[2px]">
                                    {calendarDays.map((day, idx) => {
                                        if (day === null) {
                                            return <div key={idx} className="aspect-square" />;
                                        }

                                        const hasEvents = monthEvents.some(e => new Date(e.date).getDate() === day);
                                        const isTodayCell = isCurrentMonth && day === todayDate;

                                        return (
                                            <div
                                                key={idx}
                                                onClick={() => onDateClick(new Date(selectedYear, monthIdx, day))}
                                                className={`aspect-square rounded-[4px] flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors ${isTodayCell ? 'bg-[#fca5a5]' : ''
                                                    }`}
                                            >
                                                <p className={`text-[11px] font-medium tracking-[-0.5px] leading-[11px] ${isTodayCell ? 'text-[#7f1d1d]' : hasEvents ? 'text-[#374151]' : 'text-[#6b7280]'
                                                    }`}>
                                                    {day}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Event List */}
                            <div className="border-t border-[#e5e7eb] px-4 py-3">
                                {monthEvents.length === 0 ? (
                                    <p className="text-[11px] text-[#9ca3af] tracking-[-0.5px] text-center py-1">
                                        No events scheduled
                                    </p>
                                ) : (
                                    <div className="space-y-[6px]">
                                        {monthEvents.slice(0, 2).map((event) => (
                                            <EventCard key={event.id} event={event} variant="year" onClick={() => onEventClick(event)} />
                                        ))}
                                        {monthEvents.length > 2 && (
                                            <p className="text-[11px] text-[#3b82f6] tracking-[-0.5px] cursor-pointer hover:underline">
                                                +{monthEvents.length - 2} more event{monthEvents.length - 2 !== 1 ? 's' : ''}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    switch (viewMode) {
        case 'day': return renderDayView();
        case 'week': return renderWeekView();
        case 'month': return renderMonthView();
        case 'year': return renderYearView();
        default: return renderMonthView();
    }
}
