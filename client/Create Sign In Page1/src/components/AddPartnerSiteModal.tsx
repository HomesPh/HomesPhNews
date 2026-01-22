import { useState } from 'react';
import { X, Upload, ChevronDown } from 'lucide-react';

interface AddPartnerSiteModalProps {
  onClose: () => void;
}

export function AddPartnerSiteModal({ onClose }: AddPartnerSiteModalProps) {
  const [formData, setFormData] = useState({
    siteName: '',
    domain: '',
    contactName: '',
    contactEmail: '',
    description: '',
    logo: '',
    logoUrl: ''
  });

  const handleSubmit = () => {
    alert('Partner site added successfully!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[16px] shadow-[0px_25px_50px_0px_rgba(0,0,0,0.25)] w-full max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-8 py-6 border-b border-[#e5e7eb]">
          <div className="flex items-center justify-between">
            <h2 className="text-[24px] font-bold text-[#111827] tracking-[-0.5px]">
              Add Partner Site
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-[#6b7280]" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-8 py-8">
          <div className="space-y-6">
            {/* Site Name */}
            <div>
              <label className="flex items-center gap-1 text-[14px] font-semibold text-[#111827] mb-2 tracking-[-0.5px]">
                Site Name
                <span className="text-[#ef4444]">*</span>
              </label>
              <input
                type="text"
                value={formData.siteName}
                onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                placeholder="Enter site name"
                className="w-full px-4 py-3 border border-[#d1d5db] rounded-[8px] text-[14px] text-[#111827] placeholder:text-[#adaebc] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent tracking-[-0.5px]"
              />
            </div>

            {/* Domain */}
            <div>
              <label className="flex items-center gap-1 text-[14px] font-semibold text-[#111827] mb-2 tracking-[-0.5px]">
                Domain
                <span className="text-[#ef4444]">*</span>
              </label>
              <input
                type="text"
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                placeholder="example.com"
                className="w-full px-4 py-3 border border-[#d1d5db] rounded-[8px] text-[14px] text-[#111827] placeholder:text-[#adaebc] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent tracking-[-0.5px]"
              />
            </div>

            {/* Contact Name and Contact Email */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-1 text-[14px] font-semibold text-[#111827] mb-2 tracking-[-0.5px]">
                  Contact Name
                  <span className="text-[#ef4444]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-[#d1d5db] rounded-[8px] text-[14px] text-[#111827] placeholder:text-[#adaebc] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent tracking-[-0.5px]"
                />
              </div>
              <div>
                <label className="flex items-center gap-1 text-[14px] font-semibold text-[#111827] mb-2 tracking-[-0.5px]">
                  Contact Email
                  <span className="text-[#ef4444]">*</span>
                </label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 border border-[#d1d5db] rounded-[8px] text-[14px] text-[#111827] placeholder:text-[#adaebc] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent tracking-[-0.5px]"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center gap-1 text-[14px] font-semibold text-[#111827] mb-2 tracking-[-0.5px]">
                Description
                <span className="text-[#ef4444]">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the partner site"
                rows={4}
                className="w-full px-4 py-3 border border-[#d1d5db] rounded-[8px] text-[14px] text-[#111827] placeholder:text-[#adaebc] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent tracking-[-0.5px] resize-none"
              />
            </div>

            {/* Logo */}
            <div>
              <label className="flex items-center gap-1 text-[14px] font-semibold text-[#111827] mb-3 tracking-[-0.5px]">
                Logo
                <span className="text-[#ef4444]">*</span>
              </label>
              <div className="border-2 border-dashed border-[#d1d5db] rounded-[12px] bg-[#f9fafb] py-8 px-6 text-center">
                <Upload className="w-12 h-12 text-[#9ca3af] mx-auto mb-3" />
                <p className="text-[16px] text-[#374151] mb-1 tracking-[-0.5px]">
                  Drag image here or click to browse
                </p>
                <p className="text-[14px] text-[#6b7280] tracking-[-0.5px]">
                  Recommended: 300×250, max 5MB
                </p>
              </div>
            </div>

            {/* Or enter logo URL */}
            <div>
              <label className="block text-[14px] font-light text-[#111827] mb-2 tracking-[-0.5px]">
                Or enter logo URL:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  placeholder="https://example.com/logo.jpg"
                  className="w-full px-4 py-3 pr-12 border border-[#d1d5db] rounded-[8px] text-[14px] text-[#111827] placeholder:text-[#adaebc] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent tracking-[-0.5px]"
                />
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#111827] pointer-events-none" />
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
            className="flex items-center gap-2 px-5 py-2.5 bg-[#3b82f6] text-white rounded-[8px] hover:bg-[#2563eb] transition-colors text-[14px] font-medium tracking-[-0.5px]"
          >
            <X className="w-4 h-4 rotate-45" />
            Add Partner Site
          </button>
        </div>
      </div>
    </div>
  );
}
