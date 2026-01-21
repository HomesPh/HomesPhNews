"use client";

import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface CalendarHeaderProps {
    onCreateEvent: () => void;
}

export default function CalendarHeader({ onCreateEvent }: CalendarHeaderProps) {
    return (
        <div className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-[30px] font-bold text-[#111827] tracking-[-0.5px] leading-[36px]">
                    Event Calendar
                </h1>
                <p className="text-[14px] text-[#6b7280] mt-1 tracking-[-0.5px] leading-[20px]">
                    Manage events and view public holidays across all countries
                </p>
            </div>

            <Button
                onClick={onCreateEvent}
                className="bg-[#C10007] hover:bg-[#a10006] text-white px-5 py-3 h-[44px] rounded-[6px] flex items-center gap-2 shadow-sm transition-all"
            >
                <Plus className="w-4 h-4" />
                <span className="text-[14px] font-medium tracking-[-0.5px]">Create Event</span>
            </Button>
        </div>
    );
}
