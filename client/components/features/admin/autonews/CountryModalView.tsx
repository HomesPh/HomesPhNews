"use client";

import { useState, useEffect } from 'react';
import { X, Globe } from 'lucide-react';
import { FormInput, FormSelect } from "@/components/features/admin/shared/FormFields";
import type { CountryResource } from '@/lib/api-v2';

interface CountryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    initialData?: CountryResource | null;
    errors?: Record<string, string[]> | null;
}

export default function CountryModalView({ isOpen, onClose, onSave, initialData, errors }: CountryModalProps) {
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        gl: '',
        h1: '',
        ceid: '',
        is_active: true
    });

    useEffect(() => {
        if (isOpen && initialData) {
            setFormData({
                id: initialData.id,
                name: initialData.name,
                gl: initialData.gl,
                h1: initialData.h1,
                ceid: initialData.ceid,
                is_active: initialData.is_active
            });
        } else if (isOpen) {
            setFormData({
                id: '',
                name: '',
                gl: '',
                h1: '',
                ceid: '',
                is_active: true
            });
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[110] p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0">
                    <div className="flex items-center gap-2">
                        <Globe className="w-5 h-5 text-[#C10007]" />
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                            {initialData ? `Edit Region: ${initialData.name}` : 'Register New Region'}
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6 custom-scrollbar">
                    {errors && !Object.keys(errors).length && (
                        <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
                            An error occurred while saving. Please check your input.
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <FormInput
                            label="Country ID (Code)"
                            required
                            disabled={!!initialData}
                            placeholder="e.g. PH"
                            value={formData.id}
                            onChange={(e) => setFormData({ ...formData, id: e.target.value.toUpperCase() })}
                            error={errors?.id?.[0]}
                            helperText="Unique code (e.g., PH, US, AE)"
                        />
                        <FormInput
                            label="Country Name"
                            required
                            placeholder="e.g. Philippines"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            error={errors?.name?.[0]}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FormInput
                            label="GL Code"
                            required
                            placeholder="e.g. PH"
                            value={formData.gl}
                            onChange={(e) => setFormData({ ...formData, gl: e.target.value.toUpperCase() })}
                            error={errors?.gl?.[0]}
                            helperText="Google region code"
                        />
                        <FormInput
                            label="HL Code"
                            required
                            placeholder="e.g. en-PH"
                            value={formData.h1}
                            onChange={(e) => setFormData({ ...formData, h1: e.target.value })}
                            error={errors?.h1?.[0]}
                            helperText="Language code (h1)"
                        />
                    </div>

                    <FormInput
                        label="CEID"
                        required
                        placeholder="e.g. PH:en"
                        value={formData.ceid}
                        onChange={(e) => setFormData({ ...formData, ceid: e.target.value })}
                        error={errors?.ceid?.[0]}
                        helperText="Collection Identifier"
                    />

                    <FormSelect
                        label="Scraper Status"
                        required
                        options={[
                            { value: 'true', label: 'Enabled (Daily Scraping)' },
                            { value: 'false', label: 'Disabled (Manual Only)' }
                        ]}
                        value={formData.is_active.toString()}
                        onChange={(e: any) => setFormData({ ...formData, is_active: e.target.value === 'true' })}
                        error={errors?.is_active?.[0]}
                    />
                </div>

                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-[#C10007] text-white rounded-lg hover:bg-[#A00006] transition-colors text-sm font-bold shadow-lg shadow-red-100"
                    >
                        {initialData ? 'Update Region' : 'Register Region'}
                    </button>
                </div>
            </div>
        </div>
    );
}

