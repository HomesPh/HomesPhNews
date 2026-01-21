"use client";

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { CalendarEvent } from './event-types';

interface CreateEventModalProps {
    onClose: () => void;
    onCreateEvent?: (event: any) => void;
    onEditEvent?: (event: CalendarEvent) => void;
    editingEvent?: CalendarEvent | null;
}

const colorOptions = [
    { bg: '#dbeafe', text: '#1447e7', border: '#93c5fd', name: 'Blue' },
    { bg: '#f3e7ff', text: '#8228e5', border: '#e9d4ff', name: 'Purple' },
    { bg: '#dbfce7', text: '#008236', border: '#a7f3d0', name: 'Green' },
    { bg: '#fef3c6', text: '#bb4d20', border: '#fde68a', name: 'Yellow' },
    { bg: '#ffe4e6', text: '#c70036', border: '#fecaca', name: 'Pink' },
];

export default function CreateEventModal({ onClose, onCreateEvent, onEditEvent, editingEvent }: CreateEventModalProps) {
    const isEditMode = !!editingEvent;

    // Get color index from editingEvent if in edit mode
    const getColorIndex = () => {
        if (!editingEvent) return 0;
        const index = colorOptions.findIndex(opt => opt.bg === editingEvent.bgColor);
        return index >= 0 ? index : 0;
    };

    const [formData, setFormData] = useState({
        eventTitle: editingEvent?.title || '',
        date: editingEvent?.date || '',
        time: editingEvent?.time || '',
        location: editingEvent?.location || '',
        details: editingEvent?.details || '',
        category: editingEvent?.category || 'Business',
        country: editingEvent?.country || 'Philippines',
        selectedColorIndex: getColorIndex()
    });

    useEffect(() => {
        if (editingEvent) {
            setFormData({
                eventTitle: editingEvent.title,
                date: editingEvent.date,
                time: editingEvent.time,
                location: editingEvent.location,
                details: editingEvent.details || '',
                category: editingEvent.category,
                country: editingEvent.country,
                selectedColorIndex: getColorIndex()
            });
        }
    }, [editingEvent]);

    const handleSubmit = () => {
        if (!formData.eventTitle || !formData.date) {
            alert('Please fill in required fields (Event Title and Date)');
            return;
        }

        const selectedColor = colorOptions[formData.selectedColorIndex];

        const eventData = {
            id: editingEvent?.id || Date.now(),
            title: formData.eventTitle,
            date: formData.date,
            time: formData.time || 'All Day',
            location: formData.location,
            details: formData.details,
            category: formData.category,
            country: formData.country,
            color: selectedColor.text,
            bgColor: selectedColor.bg,
            borderColor: selectedColor.border,
            isPublicHoliday: false
        };

        if (isEditMode && onEditEvent) {
            onEditEvent(eventData as CalendarEvent);
        } else if (onCreateEvent) {
            onCreateEvent(eventData);
        }

        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[150] p-4 animate-in fade-in duration-200 backdrop-blur-[2px]">
            <div className="bg-white rounded-[16px] shadow-[0px_25px_50px_0px_rgba(0,0,0,0.25)] w-full max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-8 py-6 border-b border-[#e5e7eb]">
                    <div className="flex items-center justify-between">
                        <h2 className="text-[24px] font-bold text-[#111827] tracking-[-0.5px]">
                            {isEditMode ? 'Edit Event' : 'Create Event'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-1 px-3 hover:bg-gray-100 rounded-full transition-colors group"
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
                            <label className="flex items-center gap-1 text-[14px] font-bold text-[#111827] mb-2 tracking-[-0.5px]">
                                Event Title
                                <span className="text-[#ef4444]">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.eventTitle}
                                onChange={(e) => setFormData({ ...formData, eventTitle: e.target.value })}
                                placeholder="Enter event title"
                                className="w-full h-12 px-4 border border-[#d1d5db] rounded-[8px] text-[14px] text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#C10007] focus:border-transparent tracking-[-0.5px] transition-all"
                            />
                        </div>

                        {/* Date and Time */}
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="flex items-center gap-1 text-[14px] font-bold text-[#111827] mb-2 tracking-[-0.5px]">
                                    Date
                                    <span className="text-[#ef4444]">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full h-12 px-4 border border-[#d1d5db] rounded-[8px] text-[14px] text-[#111827] bg-white focus:outline-none focus:ring-2 focus:ring-[#C10007] focus:border-transparent tracking-[-0.5px] transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[14px] font-bold text-[#111827] mb-2 tracking-[-0.5px]">
                                    Time
                                </label>
                                <div className="relative">
                                    <input
                                        type="time"
                                        value={formData.time}
                                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                        className="w-full h-12 px-4 border border-[#d1d5db] rounded-[8px] text-[14px] text-[#111827] bg-white focus:outline-none focus:ring-2 focus:ring-[#C10007] focus:border-transparent tracking-[-0.5px] transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-[14px] font-bold text-[#111827] mb-2 tracking-[-0.5px]">
                                Location
                            </label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                placeholder="Enter event location"
                                className="w-full h-12 px-4 border border-[#d1d5db] rounded-[8px] text-[14px] text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#C10007] focus:border-transparent tracking-[-0.5px] transition-all"
                            />
                        </div>

                        {/* Details */}
                        <div>
                            <label className="block text-[14px] font-bold text-[#111827] mb-2 tracking-[-0.5px]">
                                Details
                            </label>
                            <textarea
                                value={formData.details}
                                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                                placeholder="Enter event details"
                                rows={3}
                                className="w-full px-4 py-3 border border-[#d1d5db] rounded-[8px] text-[14px] text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#C10007] focus:border-transparent tracking-[-0.5px] resize-none transition-all"
                            />
                        </div>

                        {/* Category and Country */}
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[14px] font-bold text-[#111827] mb-2 tracking-[-0.5px]">
                                    Category
                                </label>
                                <div className="relative">
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full h-12 px-4 border border-[#d1d5db] rounded-[8px] text-[14px] text-[#111827] bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#C10007] focus:border-transparent tracking-[-0.5px] transition-all cursor-pointer"
                                    >
                                        <option>Business</option>
                                        <option>Conference</option>
                                        <option>Meeting</option>
                                        <option>Other</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg className="w-4 h-4 text-[#6b7280]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[14px] font-bold text-[#111827] mb-2 tracking-[-0.5px]">
                                    Country
                                </label>
                                <div className="relative">
                                    <select
                                        value={formData.country}
                                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                        className="w-full h-12 px-4 border border-[#d1d5db] rounded-[8px] text-[14px] text-[#111827] bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#C10007] focus:border-transparent tracking-[-0.5px] transition-all cursor-pointer"
                                    >
                                        <option>Philippines</option>
                                        <option>UAE</option>
                                        <option>Singapore</option>
                                        <option>USA</option>
                                        <option>Canada</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg className="w-4 h-4 text-[#6b7280]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Color */}
                        <div>
                            <label className="block text-[14px] font-bold text-[#111827] mb-3 tracking-[-0.5px]">
                                Color Profile
                            </label>
                            <div className="flex items-center gap-4">
                                {colorOptions.map((option, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, selectedColorIndex: index })}
                                        className="rounded-full transition-all"
                                        style={{
                                            width: formData.selectedColorIndex === index ? '34px' : '29px',
                                            height: formData.selectedColorIndex === index ? '34px' : '29px',
                                            backgroundColor: option.bg,
                                            border: formData.selectedColorIndex === index ? '2px solid #C10007' : '1px solid #d1d5db',
                                        }}
                                        title={option.name}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-[#e5e7eb] px-8 py-6 flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 text-[14px] text-[#6b7280] hover:text-[#111827] transition-colors tracking-[-0.5px] font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="bg-[#C10007] hover:bg-[#a10006] text-white px-7 py-2.5 rounded-[8px] transition-all text-[14px] font-bold tracking-[-0.5px]"
                    >
                        {isEditMode ? 'Update Event' : 'Create Event'}
                    </button>
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
