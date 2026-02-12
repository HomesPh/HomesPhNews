"use client";

import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, Globe, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { getCountries, createCountry, updateCountry, deleteCountry, ApiError } from '@/lib/api-v2';
import type { CountryResource } from '@/lib/api-v2';
import { Skeleton } from "@/components/ui/skeleton";
import CountryModalView from '@/components/features/admin/autonews/CountryModalView';

export default function CountryList() {
    const [countries, setCountries] = useState<CountryResource[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCountry, setEditingCountry] = useState<CountryResource | null>(null);
    const [formErrors, setFormErrors] = useState<Record<string, string[]> | null>(null);

    const fetchCountries = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getCountries();
            setCountries(response.data);
        } catch (error) {
            console.error("Failed to fetch countries:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCountries();
    }, [fetchCountries]);

    const handleCreate = () => {
        setEditingCountry(null);
        setFormErrors(null);
        setIsModalOpen(true);
    };

    const handleEdit = (country: CountryResource) => {
        setEditingCountry(country);
        setFormErrors(null);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm(`Are you sure you want to delete ${id}?`)) {
            try {
                await deleteCountry(id);
                fetchCountries();
            } catch (error) {
                console.error("Failed to delete country:", error);
                alert("Failed to delete country.");
            }
        }
    };

    const handleSave = async (data: any) => {
        setFormErrors(null);
        try {
            if (editingCountry) {
                await updateCountry(editingCountry.id, data);
            } else {
                await createCountry(data);
            }
            setIsModalOpen(false);
            fetchCountries();
        } catch (error) {
            console.error("Failed to save country:", error);
            if (error instanceof ApiError && error.errors) {
                setFormErrors(error.errors);
            } else {
                alert("Failed to save country.");
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-[#e5e7eb]">
                <h2 className="text-lg font-semibold text-[#111827]">Active News Regions</h2>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-4 py-2 bg-[#C10007] text-white rounded-lg hover:bg-[#A00006] transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Region</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    Array(6).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-[180px] rounded-xl bg-white" />
                    ))
                ) : countries.length > 0 ? (
                    countries.map((country) => (
                        <div key={country.id} className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-50 flex items-center justify-center rounded-full border border-gray-100 text-xl font-bold text-[#C10007]">
                                            {country.id}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-[#111827]">{country.name}</h3>
                                            <div className="flex items-center gap-1.5 mt-1">
                                                {country.is_active ? (
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                                                ) : (
                                                    <XCircle className="w-3.5 h-3.5 text-gray-400" />
                                                )}
                                                <span className={`text-[11px] font-bold uppercase ${country.is_active ? 'text-green-600' : 'text-gray-400'}`}>
                                                    {country.is_active ? 'Active Scraper' : 'Paused'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2 py-4 border-y border-gray-50 mb-4">
                                    <div className="text-center">
                                        <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">GL</p>
                                        <p className="font-mono text-sm text-[#374151]">{country.gl}</p>
                                    </div>
                                    <div className="text-center border-x border-gray-50">
                                        <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">HL</p>
                                        <p className="font-mono text-sm text-[#374151]">{country.h1}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">CEID</p>
                                        <p className="font-mono text-xs text-[#374151]">{country.ceid}</p>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() => handleEdit(country)}
                                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-[#3b82f6] hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                        <span>Edit</span>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(country.id)}
                                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-[#ef4444] hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        <span>Delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center bg-white rounded-xl border border-[#e5e7eb]">
                        <p className="text-gray-500">No regions configured yet.</p>
                    </div>
                )}
            </div>

            <CountryModalView
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                initialData={editingCountry}
                errors={formErrors}
            />
        </div>
    );
}

