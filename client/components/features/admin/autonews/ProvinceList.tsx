"use client";

import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, MapPin, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { getProvinces, deleteProvince, getCountries } from '@/lib/api-v2';
import type { ProvinceResource, CountryResource } from '@/lib/api-v2';
import { Skeleton } from "@/components/ui/skeleton";
import { ProvinceModal } from './ProvinceModal';

export default function ProvinceList() {
    const [provinces, setProvinces] = useState<ProvinceResource[]>([]);
    const [countries, setCountries] = useState<CountryResource[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProvince, setEditingProvince] = useState<ProvinceResource | null>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [provincesRes, countriesRes] = await Promise.all([
                getProvinces().catch(err => {
                    console.error("Failed to fetch provinces:", err);
                    return { data: [] };
                }),
                getCountries().catch(err => {
                    console.error("Failed to fetch countries:", err);
                    return { data: [] };
                })
            ]);

            // Handle Laravel Resource Collection wrapping if present
            const provincesData = (provincesRes.data as any).data || provincesRes.data;
            const countriesData = (countriesRes.data as any).data || countriesRes.data;

            setProvinces(Array.isArray(provincesData) ? provincesData : []);
            setCountries(Array.isArray(countriesData) ? countriesData : []);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleCreate = () => {
        setEditingProvince(null);
        setIsModalOpen(true);
    };

    const handleEdit = (province: ProvinceResource) => {
        setEditingProvince(province);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number, name: string) => {
        if (confirm(`Are you sure you want to delete ${name}?`)) {
            try {
                await deleteProvince(id);
                fetchData();
            } catch (error) {
                console.error("Failed to delete province:", error);
                alert("Failed to delete province.");
            }
        }
    };

    const handleSaveSuccess = () => {
        setIsModalOpen(false);
        fetchData();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-[#e5e7eb]">
                <h2 className="text-lg font-semibold text-[#111827]">Managed Provinces</h2>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-4 py-2 bg-[#1428AE] text-white rounded-lg hover:bg-[#000785] transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Province</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    Array(6).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-[150px] rounded-xl bg-white" />
                    ))
                ) : provinces.length > 0 ? (
                    provinces.map((province) => (
                        <div key={province.id} className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-50 flex items-center justify-center rounded-full border border-gray-100 text-[#1428AE]">
                                            <MapPin className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-[#111827]">{province.name}</h3>
                                            <p className="text-sm text-gray-500">{province.country_id}</p>
                                            <div className="flex items-center gap-1.5 mt-1">
                                                {province.is_active ? (
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                                                ) : (
                                                    <XCircle className="w-3.5 h-3.5 text-gray-400" />
                                                )}
                                                <span className={`text-[11px] font-bold uppercase ${province.is_active ? 'text-green-600' : 'text-gray-400'}`}>
                                                    {province.is_active ? 'Active' : 'Paused'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 mt-4">
                                    <button
                                        onClick={() => handleEdit(province)}
                                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-[#3b82f6] hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                        <span>Edit</span>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(province.id, province.name)}
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
                        <p className="text-gray-500">No provinces configured yet.</p>
                    </div>
                )}
            </div>

            <ProvinceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleSaveSuccess}
                initialData={editingProvince}
                countries={countries}
            />
        </div>
    );
}
