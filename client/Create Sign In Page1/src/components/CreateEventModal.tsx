import { useState } from 'react';
import { X } from 'lucide-react';

interface CreateEventModalProps {
  onClose: () => void;
  onCreateEvent?: (event: any) => void;
  onEditEvent?: (event: any) => void;
  editingEvent?: any | null;
}

// Color mapping from Figma frames
const colorOptions = [
  { bg: '#dbeafe', text: '#1447e7', border: '#93c5fd', name: 'Blue' },
  { bg: '#f3e7ff', text: '#8228e5', border: '#e9d4ff', name: 'Purple' },
  { bg: '#dbfce7', text: '#008236', border: '#a7f3d0', name: 'Green' },
  { bg: '#fef3c6', text: '#bb4d20', border: '#fde68a', name: 'Yellow' },
  { bg: '#ffe4e6', text: '#c70036', border: '#fecaca', name: 'Pink' },
];

export function CreateEventModal({ onClose, onCreateEvent, onEditEvent, editingEvent }: CreateEventModalProps) {
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
      onEditEvent(eventData);
    } else if (onCreateEvent) {
      onCreateEvent(eventData);
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[16px] shadow-[0px_25px_50px_0px_rgba(0,0,0,0.25)] w-full max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-[#e5e7eb]">
          <div className="flex items-center justify-between px-8 py-6">
            <h2 className="text-[24px] font-bold text-[#111827] tracking-[-0.5px] leading-[32px]">
              {isEditMode ? 'Edit Event' : 'Create Event'}
            </h2>
            <button
              onClick={onClose}
              className="rounded-full size-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <X className="w-[15px] h-5 text-[#6b7280]" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-8 py-8 flex flex-col gap-6">
            {/* Event Title */}
            <div className="flex flex-col gap-2 w-full">
              <label className="flex items-center gap-[5px] px-0 py-px">
                <span className="text-[14px] font-semibold text-[#111827] tracking-[-0.5px] leading-[normal]">Event Title</span>
                <span className="text-[14px] font-semibold text-[#ef4444] tracking-[-0.5px] leading-[normal]">*</span>
              </label>
              <input
                type="text"
                value={formData.eventTitle}
                onChange={(e) => setFormData({ ...formData, eventTitle: e.target.value })}
                placeholder="Enter event title"
                className="w-full h-12 px-4 border border-[#d1d5db] rounded-[8px] text-[14px] text-[#111827] placeholder:text-[#adaebc] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent tracking-[-0.5px] leading-5"
              />
            </div>

            {/* Date and Time Row */}
            <div className="flex gap-6 w-full">
              {/* Date */}
              <div className="flex-1 flex flex-col gap-2">
                <label className="flex items-center gap-[5px] px-0 py-px">
                  <span className="text-[14px] font-semibold text-[#111827] tracking-[-0.5px] leading-[normal]">Date</span>
                  <span className="text-[14px] font-semibold text-[#ef4444] tracking-[-0.5px] leading-[normal]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full h-12 px-4 pr-12 border border-[#d1d5db] rounded-[8px] text-base text-black bg-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent tracking-[-0.5px] leading-6"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 2V6" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 2V6" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 10H21" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Time */}
              <div className="flex-1 flex flex-col gap-2">
                <label className="px-0 py-px">
                  <span className="text-[14px] font-semibold text-[#111827] tracking-[-0.5px] leading-[normal]">Time</span>
                </label>
                <div className="relative">
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full h-12 px-4 pr-12 border border-[#d1d5db] rounded-[8px] text-base text-black bg-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent tracking-[-0.5px] leading-6"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg width="18" height="18" viewBox="0 0 19.6 19.6" fill="none">
                      <circle cx="9.8" cy="9.8" r="8" stroke="#1E1E1E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9.8 4.8V9.8L13.4 11.6" stroke="#1E1E1E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="flex flex-col gap-2 w-full">
              <label className="px-0 py-px">
                <span className="text-[14px] font-semibold text-[#111827] tracking-[-0.5px] leading-[normal]">Location</span>
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Enter even location"
                className="w-full h-12 px-4 border border-[#d1d5db] rounded-[8px] text-[14px] text-[#111827] placeholder:text-[#adaebc] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent tracking-[-0.5px] leading-5"
              />
            </div>

            {/* Details */}
            <div className="flex flex-col gap-2 w-full">
              <label className="px-0 py-px">
                <span className="text-[14px] font-semibold text-[#111827] tracking-[-0.5px] leading-[normal]">Details</span>
              </label>
              <textarea
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                placeholder="Enter event details"
                rows={3}
                className="w-full px-4 py-3 border border-[#d1d5db] rounded-[8px] text-[14px] text-[#111827] placeholder:text-[#adaebc] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent tracking-[-0.5px] leading-5 resize-none"
              />
            </div>

            {/* Category and Country Row */}
            <div className="flex gap-6 w-full">
              {/* Category */}
              <div className="flex-1 flex flex-col gap-2">
                <label className="h-5">
                  <span className="text-[14px] font-semibold text-[#111827] tracking-[-0.5px] leading-[normal]">Category</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-12 px-[10px] border border-[#d1d5db] rounded-[8px] text-base text-black bg-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent tracking-[-0.5px] leading-[normal] appearance-none"
                  >
                    <option>Business</option>
                    <option>Conference</option>
                    <option>Meeting</option>
                    <option>Other</option>
                  </select>
                  <div className="absolute right-[10px] top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <path fillRule="evenodd" clipRule="evenodd" d="M9.293 12.293a1 1 0 0 1 1.414 0L16 17.586l5.293-5.293a1 1 0 1 1 1.414 1.414l-6 6a1 1 0 0 1-1.414 0l-6-6a1 1 0 0 1 0-1.414z" fill="black"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Country */}
              <div className="flex-1 flex flex-col gap-2">
                <label className="h-5">
                  <span className="text-[14px] font-semibold text-[#111827] tracking-[-0.5px] leading-[normal]">Country</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full h-12 px-[10px] border border-[#d1d5db] rounded-[8px] text-base text-black bg-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent tracking-[-0.5px] leading-[normal] appearance-none"
                  >
                    <option>Philippines</option>
                    <option>UAE</option>
                    <option>Singapore</option>
                    <option>USA</option>
                    <option>Canada</option>
                  </select>
                  <div className="absolute right-[10px] top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <path fillRule="evenodd" clipRule="evenodd" d="M9.293 12.293a1 1 0 0 1 1.414 0L16 17.586l5.293-5.293a1 1 0 1 1 1.414 1.414l-6 6a1 1 0 0 1-1.414 0l-6-6a1 1 0 0 1 0-1.414z" fill="black"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Color */}
            <div className="flex flex-col gap-2 w-full">
              <label className="px-0 py-px">
                <span className="text-[14px] font-semibold text-[#111827] tracking-[-0.5px] leading-[normal]">Color</span>
              </label>
              <div className="flex items-center gap-[14px]">
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
                      border: formData.selectedColorIndex === index ? '2px solid black' : '1px solid #d1d5db',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#e5e7eb] px-8 py-4 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-[14px] text-[#6b7280] hover:text-[#111827] transition-colors tracking-[-0.5px] font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-[#3b82f6] text-white rounded-[8px] hover:bg-[#2563eb] transition-colors text-[14px] font-medium tracking-[-0.5px]"
          >
            {isEditMode ? 'Update Event' : 'Create Event'}
          </button>
        </div>
      </div>
    </div>
  );
}