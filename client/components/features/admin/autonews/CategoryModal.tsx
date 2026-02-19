"use client";

import { useState, useEffect } from 'react';
import { X, Tag } from 'lucide-react';
import { FormInput, FormSelect } from "@/components/features/admin/shared/FormFields";
import type { CategoryResource } from '@/lib/api-v2';

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    initialData?: CategoryResource | null;
    errors?: Record<string, string[]> | null;
}

export default function CategoryModal({ isOpen, onClose, onSave, initialData, errors }: CategoryModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        is_active: true
    });

    useEffect(() => {
        if (isOpen && initialData) {
            setFormData({
                name: initialData.name,
                is_active: initialData.is_active
            });
        } else if (isOpen) {
            setFormData({
                name: '',
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
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0">
                    <div className="flex items-center gap-2">
                        <Tag className="w-5 h-5 text-[#C10007]" />
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                            {initialData ? 'Edit Category' : 'New Category'}
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {errors && !Object.keys(errors).length && (
                        <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
                            An error occurred while saving. Please check your input.
                        </div>
                    )}

                    <FormInput
                        label="Category Name"
                        required
                        placeholder="e.g. Luxury Real Estate"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        error={errors?.name?.[0]}
                        helperText="The slug will be automatically generated."
                    />

                    <FormSelect
                        label="Status"
                        required
                        options={[
                            { value: 'true', label: 'Active (Visible for Scraper)' },
                            { value: 'false', label: 'Hidden (Paused)' }
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
                        {initialData ? 'Update Category' : 'Create Category'}
                    </button>
                </div>
            </div>
        </div>
    );
}

