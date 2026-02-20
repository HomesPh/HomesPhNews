"use client";

import { useEffect, useState } from 'react';
import { X, Loader2, Building2 } from 'lucide-react';
import { createCity, updateCity, ApiError } from '@/lib/api-v2';
import type { CityResource, CountryResource } from '@/lib/api-v2';
import { FormInput, FormSelect, FormCheckbox } from "@/components/features/admin/shared/FormFields";

interface CityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData: CityResource | null;
    countries: CountryResource[];
}

export function CityModal({ isOpen, onClose, onSuccess, initialData, countries }: CityModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        country_id: '',
        is_active: true
    });
    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string[]> | null>(null);

    useEffect(() => {
        if (isOpen && initialData) {
            setFormData({
                name: initialData.name,
                country_id: initialData.country_id,
                is_active: initialData.is_active
            });
        } else if (isOpen) {
            setFormData({
                name: '',
                country_id: countries.length > 0 ? countries[0].id : '',
                is_active: true
            });
        }
        setErrors(null);
    }, [initialData, isOpen, countries]);

    if (!isOpen) return null;

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setErrors(null);

        try {
            if (initialData) {
                await updateCity(initialData.city_id, formData);
            } else {
                await createCity(formData);
            }
            onSuccess();
        } catch (error) {
            console.error("Failed to save city:", error);
            if (error instanceof ApiError && error.errors) {
                setErrors(error.errors);
            } else {
                alert("Failed to save city. Please check the form.");
            }
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[110] p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0">
                    <div className="flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-[#C10007]" />
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                            {initialData ? `Edit City: ${initialData.name}` : 'Add New City'}
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSave} className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
                    <FormSelect
                        label="Country"
                        required
                        value={formData.country_id}
                        onChange={(e) => setFormData({ ...formData, country_id: e.target.value })}
                        options={[
                            { value: '', label: 'Select a country' },
                            ...countries.map(c => ({ value: c.id, label: `${c.name} (${c.id})` }))
                        ]}
                        error={errors?.country_id?.[0]}
                    />

                    <FormInput
                        label="City Name"
                        required
                        placeholder="e.g. Dubai, New York, Hong Kong"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        error={errors?.name?.[0]}
                    />

                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <FormCheckbox
                            label="Active Status (Enable news scraping)"
                            checked={formData.is_active}
                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        />
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex items-center gap-2 px-6 py-2 bg-[#C10007] text-white rounded-lg hover:bg-[#A00006] transition-colors text-sm font-bold shadow-lg shadow-red-100 disabled:opacity-50"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <span>{initialData ? 'Update City' : 'Save City'}</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
