"use client";

import { useState, useEffect } from 'react';
import { X, Upload, Calendar, Search, Check, Image as ImageIcon } from 'lucide-react';
import { FormInput, FormLabel, FormSelect } from "@/components/features/admin/shared/FormFields";
import { adSettings, Ad } from "@/app/admin/ads/data";

interface AdEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: 'create' | 'edit';
    initialData?: Ad;
    onSave: (data: any) => void;
}

export default function AdEditorModal({ isOpen, onClose, mode, initialData, onSave }: AdEditorModalProps) {
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        client: initialData?.client || '',
        type: initialData?.type || adSettings.types[0],
        targetUrl: '', // New field from reference
        placements: {
            newsPortalTop: true,
            newsPortalSidebar: false,
            newsPortalBottom: false,
            articlePagesBottom: false,
            articlePagesTop: false,
            articlePagesInFeed: false,
            sidebarAllPages: false,
            categoryPagesTop: false,
            homepageBanner: false,
            homepageSidebar: false
        },
        startDate: '',
        endDate: '',
        revenue: '',
        status: initialData?.status || 'active',
        image: initialData?.image || null
    });

    useEffect(() => {
        if (isOpen && initialData) {
            setFormData(prev => ({
                ...prev,
                title: initialData.title,
                client: initialData.client,
                type: initialData.type,
                status: initialData.status,
                image: initialData.image
            }));
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handlePlacementChange = (placement: keyof typeof formData.placements) => {
        setFormData({
            ...formData,
            placements: {
                ...formData.placements,
                [placement]: !formData.placements[placement]
            }
        });
    };

    const handleSave = () => {
        onSave(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-[#00000066] flex items-center justify-center z-[110] p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[16px] shadow-[0px_25px_50px_0px_rgba(0,0,0,0.25)] w-full max-w-[560px] max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-8 py-6 border-b border-[#e5e7eb] flex items-center justify-between sticky top-0 bg-white z-10">
                    <h2 className="text-[24px] font-bold text-[#111827] tracking-[-0.5px] leading-[32px]">
                        {mode === 'create' ? 'Create New Advertisement' : 'Edit Advertisement'}
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
                            label="Ad Name / Campaign Title"
                            required
                            placeholder="Real Estate Expo 2026"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />

                        <FormInput
                            label="Client / Advertiser Name"
                            required
                            placeholder="Dubai Property Developers"
                            value={formData.client}
                            onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                        />

                        <FormSelect
                            label="Ad Size"
                            required
                            options={adSettings.types.map(t => ({ value: t, label: t }))}
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        />

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <FormLabel required>Ad Image</FormLabel>
                                <button className="text-[14px] font-semibold text-[#3b82f6] hover:underline tracking-[-0.5px]">
                                    Generate Image
                                </button>
                            </div>
                            <div className="border-2 border-dashed border-[#d1d5db] rounded-[12px] bg-[#f9fafb] py-7 px-6 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                                {formData.image ? (
                                    <div className="relative group mx-auto w-full max-w-[200px]">
                                        <img src={formData.image} alt="Preview" className="w-full h-auto rounded border" />
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="text-white text-[12px] font-medium">Change Image</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-1">
                                        <p className="text-[16px] font-medium text-[#374151] tracking-[-0.5px]">
                                            Drag image here or click to browse
                                        </p>
                                        <Upload className="w-8 h-8 text-[#9ca3af] my-2" />
                                        <p className="text-[14px] text-[#6b7280] tracking-[-0.5px]">
                                            Recommended: 300×250, max 5MB
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Image URL Field */}
                        <div className="relative">
                            <FormInput
                                label="Or enter image URL:"
                                placeholder="https://example.com/ad-image.jpg"
                                value={formData.image || ''}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            />
                            <div className="absolute right-4 top-[42px]">
                                <ImageIcon className="w-5 h-5 text-[#9ca3af]" />
                            </div>
                        </div>

                        <FormInput
                            label="Target URL"
                            required
                            placeholder="https://example.com/landing-page"
                            helperText="Where users will be redirected when clicking the ad"
                            value={formData.targetUrl}
                            onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
                        />

                        <div>
                            <FormLabel required>Ad Placement</FormLabel>
                            <p className="text-[12px] text-[#6b7280] mb-4 tracking-[-0.5px] leading-[16px]">
                                Select where this ad should appear (choose one or more)
                            </p>
                            <div className="bg-[#f9fafb] rounded-[12px] p-6 grid grid-cols-2 gap-y-4 gap-x-6">
                                {Object.entries(formData.placements).map(([key, value]) => (
                                    <label key={key} className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative w-4 h-4">
                                            <input
                                                type="checkbox"
                                                checked={value}
                                                onChange={() => handlePlacementChange(key as keyof typeof formData.placements)}
                                                className="peer w-4 h-4 rounded-[1px] border-[0.5px] border-black appearance-none checked:bg-[#111827] checked:border-[#111827] cursor-pointer"
                                            />
                                            <Check className="absolute inset-0 w-4 h-4 text-white p-0.5 hidden peer-checked:block pointer-events-none" />
                                        </div>
                                        <span className="text-[14px] text-[#111827] tracking-[-0.5px] group-hover:font-medium transition-all">
                                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <FormInput
                                label="Start Date"
                                required
                                placeholder="mm/ dd / yyyy"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            />
                            <FormInput
                                label="End Date"
                                required
                                placeholder="mm/ dd / yyyy"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            />
                        </div>

                        <FormInput
                            label="Campaign Revenue (₱)"
                            placeholder="0"
                            helperText="Expected or actual revenue from this ad campaign"
                            value={formData.revenue}
                            onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-[#e5e7eb] px-8 py-8 flex flex-col gap-6">
                    <label className="flex items-start gap-3 cursor-pointer">
                        <div className="relative w-4 h-4 mt-1">
                            <input
                                type="checkbox"
                                checked={formData.status === 'active'}
                                onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'active' : 'inactive' })}
                                className="peer w-4 h-4 rounded-[1px] border-[0.5px] border-black appearance-none checked:bg-[#C10007] checked:border-[#C10007] cursor-pointer"
                            />
                            <Check className="absolute inset-0 w-4 h-4 text-white p-0.5 hidden peer-checked:block pointer-events-none" />
                        </div>
                        <div>
                            <span className="text-[14px] font-semibold text-[#111827] tracking-[-0.5px] block">
                                Set ad as active immediately
                            </span>
                            <p className="text-[12px] text-[#6b7280] tracking-[-0.5px]">
                                Active ads will be displayed on selected placements
                            </p>
                        </div>
                    </label>

                    <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#e5e7eb]">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 text-[14px] font-medium text-[#6b7280] hover:text-[#111827] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 px-6 py-2.5 bg-[#3b82f6] text-white rounded-[8px] text-[14px] font-medium hover:bg-[#2563eb] transition-all active:scale-95 shadow-sm"
                        >
                            <span className="text-[20px] leading-none">+</span>
                            {mode === 'create' ? 'Create Advertisement' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
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
