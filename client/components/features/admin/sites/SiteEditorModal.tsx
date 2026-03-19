"use client";

import { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import { FormInput, FormTextarea, FormSelect, FormMultiSelect } from "@/components/features/admin/shared/FormFields";
import { ImageUploader } from "@/components/shared/ImageUploader";
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
        logoUrl: initialData?.original_logo || initialData?.image || '',
        darkLogoUrl: initialData?.dark_logo || '',
        lightLogoUrl: initialData?.light_logo || '',
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
                logoUrl: initialData.original_logo || initialData.image || '',
                darkLogoUrl: initialData.dark_logo || '',
                lightLogoUrl: initialData.light_logo || '',
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
                darkLogoUrl: '',
                lightLogoUrl: '',
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
            image: formData.logoUrl || "/images/HomesLogo.png",
            original_logo: formData.logoUrl || "/images/HomesLogo.png",
            dark_logo: formData.darkLogoUrl,
            light_logo: formData.lightLogoUrl,
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

                        {/* Logo Uploads */}
                        <div className="space-y-4">
                            <ImageUploader
                                label="Original Logo"
                                value={formData.logoUrl || null}
                                onChange={(url) => setFormData({ ...formData, logoUrl: (url as string) || '' })}
                                uploadType="partner_logo"
                                hideUrlInput={true}
                            />
                            <ImageUploader
                                label="Dark Logo (optional)"
                                value={formData.darkLogoUrl || null}
                                onChange={(url) => setFormData({ ...formData, darkLogoUrl: (url as string) || '' })}
                                uploadType="partner_logo"
                                hideUrlInput={true}
                            />
                            <ImageUploader
                                label="Light Logo (optional)"
                                value={formData.lightLogoUrl || null}
                                onChange={(url) => setFormData({ ...formData, lightLogoUrl: (url as string) || '' })}
                                uploadType="partner_logo"
                                hideUrlInput={true}
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
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#1428AE] text-white rounded-[8px] hover:bg-[#000785] transition-colors text-[14px] font-medium tracking-[-0.5px]"
                    >
                        {mode === 'create' ? 'Add Partner Site' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}

