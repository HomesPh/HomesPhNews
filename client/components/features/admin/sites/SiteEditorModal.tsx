"use client";

import { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import { FormInput, FormTextarea, FormSelect, FormMultiSelect } from "@/components/features/admin/shared/FormFields";
import { SiteResource } from "@/lib/api-v2/types/SiteResource";
import { Countries, Categories } from "@/app/data";

interface SiteEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: 'create' | 'edit';
    initialData?: SiteResource;
    onSave: (data: any) => void;
}

export default function SiteEditorModal({ isOpen, onClose, mode, initialData, onSave }: SiteEditorModalProps) {
    const [formData, setFormData] = useState({
        siteName: initialData?.name || '',
        domain: initialData?.domain || '',
        contactName: initialData?.contact_name || '',
        contactEmail: initialData?.contact_email || '',
        description: initialData?.description || '',
        categories: initialData?.categories || [],
        country: initialData?.country || ['Philippines'],
        logoUrl: initialData?.image || '',
    });

    useEffect(() => {
        if (isOpen && initialData) {
            setFormData({
                siteName: initialData.name,
                domain: initialData.domain,
                contactName: initialData.contact_name || '',
                contactEmail: initialData.contact_email || '',
                description: initialData.description || '',
                categories: initialData.categories || [],
                country: initialData.country || ['Philippines'],
                logoUrl: initialData.image || '',
            });
        } else if (isOpen && mode === 'create') {
            setFormData({
                siteName: '',
                domain: '',
                contactName: '',
                contactEmail: '',
                description: '',
                categories: [],
                country: ['Philippines'],
                logoUrl: '',
            });
        }
    }, [isOpen, initialData, mode]);

    if (!isOpen) return null;

    const handleSave = () => {
        const siteData = {
            name: formData.siteName,
            domain: formData.domain,
            contact_name: formData.contactName,
            contact_email: formData.contactEmail,
            description: formData.description,
            categories: formData.categories,
            country: formData.country,
            image: formData.logoUrl || "/images/HomesTV.png",
            // Remove legacy fields if not in request type, or keep if harmless? 
            // Better to match request type. Status is handled by updateSite but mainly via toggle?
            // UpdateSiteRequest supports status.
            status: initialData?.status || 'active',
        };
        onSave(siteData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-[#00000066] flex items-center justify-center z-[110] p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[16px] shadow-[0px_25px_50px_0px_rgba(0,0,0,0.25)] w-full max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-8 py-6 border-b border-[#e5e7eb] flex items-center justify-between sticky top-0 bg-white z-10">
                    <h2 className="text-[24px] font-bold text-[#111827] tracking-[-0.5px] leading-[32px]">
                        {mode === 'create' ? 'Add Partner Site' : 'Edit Partner Site'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
                    >
                        <X className="w-5 h-5 text-[#6b7280] group-hover:text-[#111827]" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-8 pt-8 pb-8 custom-scrollbar">
                    <div className="space-y-6">
                        <FormInput
                            label="Site Name"
                            required
                            placeholder="Enter site name"
                            value={formData.siteName}
                            onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                        />

                        <FormInput
                            label="Domain"
                            required
                            placeholder="example.com"
                            value={formData.domain}
                            onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                        />

                        <div className="grid grid-cols-2 gap-6">
                            <FormInput
                                label="Contact Name"
                                required
                                placeholder="John Doe"
                                value={formData.contactName}
                                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                            />
                            <FormInput
                                label="Contact Email"
                                required
                                type="email"
                                placeholder="john@example.com"
                                value={formData.contactEmail}
                                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                            />
                        </div>

                        <FormTextarea
                            label="Description"
                            required
                            rows={4}
                            placeholder="Brief description of the partner site"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />

                        <FormMultiSelect
                            label="Countries"
                            required
                            placeholder="Select countries..."
                            options={Countries.map(c => ({ value: c.id, label: c.label }))}
                            value={Array.isArray(formData.country) ? formData.country : [formData.country].filter(Boolean)}
                            onChange={(vals) => setFormData({ ...formData, country: vals })}
                            helperText="Select one or more countries"
                            allLabel="All Countries"
                        />

                        <FormMultiSelect
                            label="Categories"
                            required
                            placeholder="Select categories..."
                            options={Categories.map(c => ({ value: c.id, label: c.label }))}
                            value={formData.categories}
                            onChange={(vals) => setFormData({ ...formData, categories: vals })}
                            helperText="Select one or more categories"
                            allLabel="All Categories"
                        />

                        {/* Logo Upload */}
                        <div>
                            <label className="flex items-center gap-1 text-[14px] font-bold text-[#111827] mb-3 tracking-[-0.5px]">
                                Logo
                                {mode === 'create' && <span className="text-[#ef4444]">*</span>}
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
                            <input
                                type="text"
                                value={formData.logoUrl}
                                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                                placeholder="https://example.com/logo.jpg"
                                className="w-full px-4 py-3 border border-[#d1d5db] rounded-[8px] text-[14px] text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#C10007] focus:border-transparent tracking-[-0.5px]"
                            />
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
                        onClick={handleSave}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#3b82f6] text-white rounded-[8px] hover:bg-[#2563eb] transition-colors text-[14px] font-medium tracking-[-0.5px]"
                    >
                        {mode === 'create' ? 'Add Partner Site' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}

