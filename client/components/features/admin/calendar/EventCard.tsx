"use client";

import { cn } from "@/lib/utils";
import type { CalendarEvent } from "./event-types";

interface EventCardProps {
    event: CalendarEvent;
    variant: 'day' | 'week' | 'month' | 'year';
    onClick?: () => void;
}

export default function EventCard({ event, variant, onClick }: EventCardProps) {
    if (variant === 'day') {
        return (
            <div
                onClick={onClick}
                className="rounded-[12px] p-4 cursor-pointer hover:opacity-90 transition-opacity border shadow-sm"
                style={{
                    backgroundColor: event.bgColor,
                    borderColor: event.borderColor
                }}
            >
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <h3
                            className="text-[20px] font-extrabold tracking-[-0.5px] leading-normal mb-2"
                            style={{ color: event.color }}
                        >
                            {event.title}
                        </h3>
                        <div className="flex items-center gap-4 text-[14px] font-medium tracking-[-0.5px]" style={{ color: event.color }}>
                            <div className="flex items-center gap-1">
                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                                    <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M7.5 4.5v3.5l2.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                                <span>{event.time || 'All Day'}</span>
                            </div>
                            {event.location && (
                                <div className="flex items-center gap-1">
                                    <svg width="12" height="15" viewBox="0 0 12 15" fill="currentColor">
                                        <path d="M6 0C2.7 0 0 2.7 0 6c0 4.5 6 9 6 9s6-4.5 6-9c0-3.3-2.7-6-6-6zm0 8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
                                    </svg>
                                    <span>{event.location}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="bg-white rounded-[4px] px-4 py-1.5 border" style={{ borderColor: event.borderColor }}>
                        <span
                            className="text-[14px] font-semibold tracking-[-0.5px] whitespace-nowrap"
                            style={{ color: event.color }}
                        >
                            {event.category}
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    if (variant === 'week') {
        return (
            <div
                onClick={onClick}
                className="rounded-[6px] border shadow-sm p-3 cursor-pointer hover:opacity-90 transition-opacity"
                style={{
                    backgroundColor: event.bgColor,
                    borderColor: event.borderColor
                }}
            >
                <div className="flex items-center gap-1 mb-1">
                    <span className="text-[15px]">{event.category === 'Holiday' ? '🎊' : '🎉'}</span>
                    <p className="text-[14px] font-bold tracking-[-0.5px] leading-normal truncate" style={{ color: event.color }}>
                        {event.title}
                    </p>
                </div>
                <p className="text-[12px] text-[#6b7280] tracking-[-0.5px] leading-[12px]">
                    {event.time || 'All Day'}
                </p>
            </div>
        );
    }

    if (variant === 'month' || variant === 'year') {
        return (
            <div
                onClick={variant === 'month' ? (e) => { e.stopPropagation(); onClick?.(); } : onClick}
                className="h-[23px] rounded-[6px] border px-3 flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity shadow-sm"
                style={{
                    backgroundColor: event.bgColor,
                    borderColor: event.borderColor
                }}
            >
                {variant === 'year' && (
                    <p className="text-[12px] font-semibold text-[#111827] tracking-[-0.5px] leading-[normal] mr-1">
                        {new Date(event.date).getDate()}
                    </p>
                )}
                <span className="text-[12px]">{event.category === 'Holiday' ? '🎊' : '🎉'}</span>
                <p className="text-[12px] font-semibold tracking-[-0.5px] truncate leading-[normal]" style={{ color: event.color }}>
                    {event.title}
                </p>
            </div>
        );
    }

    return null;
}
