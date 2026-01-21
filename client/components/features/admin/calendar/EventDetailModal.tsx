import { X, Clock, MapPin, Calendar, Edit2, Trash2 } from 'lucide-react';
import { CalendarEvent } from "./event-types";

interface EventDetailModalProps {
    event: CalendarEvent;
    onClose: () => void;
    onEdit?: (event: CalendarEvent) => void;
    onDelete?: (eventId: number) => void;
}

export default function EventDetailModal({ event, onClose, onEdit, onDelete }: EventDetailModalProps) {
    const handleEdit = () => {
        if (onEdit) {
            onEdit(event);
        }
    };

    const handleDelete = () => {
        if (onDelete && confirm('Are you sure you want to delete this event?')) {
            onDelete(event.id);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex items-center justify-center z-[150] p-4 animate-in fade-in duration-200 backdrop-blur-[2px]">
            <div className="bg-white rounded-[16px] shadow-[0px_25px_50px_0px_rgba(0,0,0,0.25)] w-full max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-8 py-6 border-b border-[#e5e7eb]">
                    <div className="flex items-center justify-between">
                        <h2 className="text-[24px] font-bold text-[#111827] tracking-[-0.5px]">
                            Event Details
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors group"
                        >
                            <X className="w-5 h-5 text-[#6b7280] group-hover:text-[#111827]" />
                        </button>
                    </div>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto px-8 py-8 custom-scrollbar">
                    <div className="space-y-6">
                        {/* Event Title */}
                        <div>
                            <h3 className="text-[20px] font-bold tracking-[-0.5px]" style={{ color: event.color }}>
                                {event.title}
                            </h3>
                        </div>

                        {/* Category Badge */}
                        <div>
                            <span
                                className="inline-flex items-center px-4 py-1.5 rounded-[4px] text-[14px] font-semibold tracking-[-0.5px]"
                                style={{
                                    backgroundColor: 'white',
                                    color: event.color,
                                    border: `1px solid ${event.color}`
                                }}
                            >
                                {event.category}
                            </span>
                        </div>

                        {/* Date & Time */}
                        <div className="flex items-start gap-3">
                            <Calendar className="w-5 h-5 mt-0.5" style={{ color: event.color }} />
                            <div>
                                <p className="text-[14px] font-medium text-[#111827] tracking-[-0.5px]">Date & Time</p>
                                <p className="text-[14px] text-[#6b7280] tracking-[-0.5px] mt-1">
                                    {new Date(event.date).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                                {event.time && (
                                    <p className="text-[14px] tracking-[-0.5px] mt-0.5" style={{ color: event.color }}>
                                        {event.time}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Location */}
                        {event.location && (
                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 mt-0.5" style={{ color: event.color }} />
                                <div>
                                    <p className="text-[14px] font-medium text-[#111827] tracking-[-0.5px]">Location</p>
                                    <p className="text-[14px] tracking-[-0.5px] mt-1" style={{ color: event.color }}>
                                        {event.location}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Country */}
                        <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 mt-0.5" fill="none" viewBox="0 0 24 24" stroke={event.color}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <p className="text-[14px] font-medium text-[#111827] tracking-[-0.5px]">Country</p>
                                <p className="text-[14px] text-[#6b7280] tracking-[-0.5px] mt-1">
                                    {event.country}
                                </p>
                            </div>
                        </div>

                        {/* Details */}
                        {event.details && (
                            <div>
                                <p className="text-[14px] font-medium text-[#111827] tracking-[-0.5px] mb-2">Details</p>
                                <p className="text-[14px] text-[#6b7280] tracking-[-0.5px] leading-relaxed">
                                    {event.details}
                                </p>
                            </div>
                        )}

                        {/* Public Holiday Notice */}
                        {event.isPublicHoliday && (
                            <div className="bg-[#fef3c7] border border-[#fbbf24] rounded-[8px] p-4">
                                <p className="text-[14px] text-[#92400e] tracking-[-0.5px]">
                                    ℹ️ This is a public holiday and cannot be edited or deleted.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-[#e5e7eb] px-8 py-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {!event.isPublicHoliday && onDelete && (
                            <button
                                onClick={handleDelete}
                                className="flex items-center gap-2 px-4 py-2 text-[#ef4444] hover:bg-[#fef2f2] rounded-[8px] transition-colors text-[14px] font-medium tracking-[-0.5px]"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 text-[14px] text-[#6b7280] hover:text-[#111827] transition-colors tracking-[-0.5px] font-medium"
                        >
                            Close
                        </button>
                        {!event.isPublicHoliday && onEdit && (
                            <button
                                onClick={handleEdit}
                                className="flex items-center gap-2 px-6 py-2.5 bg-[#C10007] text-white rounded-[8px] hover:bg-[#a10006] transition-colors text-[14px] font-medium tracking-[-0.5px]"
                            >
                                <Edit2 className="w-4 h-4" />
                                Edit Event
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #d1d5db;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #9ca3af;
                }
            `}</style>
        </div>
    );
}
