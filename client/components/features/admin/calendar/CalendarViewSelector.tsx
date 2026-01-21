"use client";

import { ChevronLeft, ChevronRight, Globe } from 'lucide-react';
import { ViewMode } from "@/components/features/admin/calendar/event-types";
import { cn } from "@/lib/utils";

interface CalendarViewSelectorProps {
    viewMode: ViewMode;
    setViewMode: (mode: ViewMode) => void;
    currentDate: Date;
    setCurrentDate: (date: Date) => void;
    selectedYear: number;
    setSelectedYear: (year: number) => void;
    onNavigate: (direction: 'prev' | 'next') => void;
    selectedCountry: string;
    setSelectedCountry: (country: string) => void;
}

export default function CalendarViewSelector({
    viewMode,
    setViewMode,
    currentDate,
    setCurrentDate,
    selectedYear,
    setSelectedYear,
    onNavigate,
    selectedCountry,
    setSelectedCountry
}: CalendarViewSelectorProps) {
    const modes: ViewMode[] = ['day', 'week', 'month', 'year'];
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    return (
        <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-6 flex items-center justify-between mb-4">
            {/* View Mode Tabs */}
            <div className="flex items-center gap-2">
                {modes.map((mode) => (
                    <button
                        key={mode}
                        onClick={() => setViewMode(mode)}
                        className={cn(
                            "px-5 py-2 rounded-[8px] text-[14px] font-medium transition-colors capitalize",
                            viewMode === mode
                                ? 'bg-[#C10007] text-white shadow-sm'
                                : 'bg-[#f3f4f6] text-[#374151] hover:bg-gray-200'
                        )}
                    >
                        {mode}
                    </button>
                ))}
            </div>

            {/* Date Navigation */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => onNavigate('prev')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ChevronLeft className="w-5 h-5 text-[#111827]" />
                </button>

                {viewMode !== 'year' && (
                    <input
                        type="date"
                        value={currentDate.toISOString().split('T')[0]}
                        onChange={(e) => setCurrentDate(new Date(e.target.value))}
                        className="px-4 py-2 border border-[#d1d5db] rounded-[8px] text-[14px] font-medium bg-white focus:outline-none focus:ring-2 focus:ring-[#C10007] focus:border-transparent cursor-pointer"
                    />
                )}

                {viewMode === 'month' && (
                    <select
                        value={monthNames[currentDate.getMonth()]}
                        onChange={(e) => {
                            const newDate = new Date(currentDate);
                            newDate.setMonth(monthNames.indexOf(e.target.value));
                            setCurrentDate(newDate);
                        }}
                        className="px-4 py-2 border border-[#d1d5db] rounded-[8px] text-[14px] font-medium bg-white focus:outline-none focus:ring-2 focus:ring-[#C10007]"
                    >
                        {monthNames.map(month => <option key={month} value={month}>{month}</option>)}
                    </select>
                )}

                <select
                    value={viewMode === 'year' ? selectedYear : currentDate.getFullYear()}
                    onChange={(e) => {
                        if (viewMode === 'year') {
                            setSelectedYear(Number(e.target.value));
                        } else {
                            const newDate = new Date(currentDate);
                            newDate.setFullYear(Number(e.target.value));
                            setCurrentDate(newDate);
                        }
                    }}
                    className="px-4 py-2 border border-[#d1d5db] rounded-[8px] text-[14px] font-medium bg-white focus:outline-none focus:ring-2 focus:ring-[#C10007]"
                >
                    {Array.from({ length: 11 }, (_, i) => 2020 + i).map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>

                <button
                    onClick={() => onNavigate('next')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ChevronRight className="w-5 h-5 text-[#111827]" />
                </button>
            </div>

            {/* Country Filter */}
            <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#6b7280]" />
                <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="px-4 py-2 border border-[#d1d5db] rounded-[8px] text-[14px] bg-white focus:outline-none focus:ring-2 focus:ring-[#C10007]"
                >
                    <option>All Countries</option>
                    <option>Philippines</option>
                    <option>UAE</option>
                    <option>Singapore</option>
                    <option>USA</option>
                    <option>Canada</option>
                </select>
            </div>
        </div>
    );
}
