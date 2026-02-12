"use client";

import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, Tag, Loader2 } from 'lucide-react';
import { getCategories, createCategory, updateCategory, deleteCategory, ApiError } from '@/lib/api-v2';
import type { CategoryResource } from '@/lib/api-v2';
import { Skeleton } from "@/components/ui/skeleton";
import CategoryModal from './CategoryModal';

export default function CategoryList() {
    const [categories, setCategories] = useState<CategoryResource[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CategoryResource | null>(null);
    const [formErrors, setFormErrors] = useState<Record<string, string[]> | null>(null);

    const fetchCategories = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getCategories();
            setCategories(response.data);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleCreate = () => {
        setEditingCategory(null);
        setFormErrors(null);
        setIsModalOpen(true);
    };

    const handleEdit = (category: CategoryResource) => {
        setEditingCategory(category);
        setFormErrors(null);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this category?")) {
            try {
                await deleteCategory(id);
                fetchCategories();
            } catch (error) {
                console.error("Failed to delete category:", error);
                alert("Failed to delete category.");
            }
        }
    };

    const handleSave = async (data: any) => {
        setFormErrors(null);
        try {
            if (editingCategory) {
                await updateCategory(editingCategory.id, data);
            } else {
                await createCategory(data);
            }
            setIsModalOpen(false);
            fetchCategories();
        } catch (error) {
            console.error("Failed to save category:", error);
            if (error instanceof ApiError && error.errors) {
                setFormErrors(error.errors);
            } else {
                alert("Failed to save category.");
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-[#e5e7eb]">
                <h2 className="text-lg font-semibold text-[#111827]">Scraper Categories</h2>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-4 py-2 bg-[#C10007] text-white rounded-lg hover:bg-[#A00006] transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Category</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {isLoading ? (
                    Array(6).fill(0).map((_, i) => (
                        <Skeleton key={i} className="h-[120px] rounded-xl bg-white" />
                    ))
                ) : categories.length > 0 ? (
                    categories.map((category) => (
                        <div key={category.id} className="bg-white p-5 rounded-xl border border-[#e5e7eb] hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-100 rounded-lg">
                                        <Tag className="w-5 h-5 text-[#C10007]" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#111827]">{category.name}</h3>
                                        <p className="text-xs text-[#6b7280]">slug: {category.slug}</p>
                                    </div>
                                </div>
                                <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${category.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                    {category.is_active ? 'Active' : 'Hidden'}
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 border-t pt-4 border-gray-50">
                                <button
                                    onClick={() => handleEdit(category)}
                                    className="p-2 hover:bg-gray-100 rounded-lg text-[#3b82f6]"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(category.id)}
                                    className="p-2 hover:bg-red-50 rounded-lg text-[#ef4444]"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center bg-white rounded-xl border border-[#e5e7eb]">
                        <p className="text-gray-500">No categories found. Start by adding one!</p>
                    </div>
                )}
            </div>

            <CategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                initialData={editingCategory}
                errors={formErrors}
            />
        </div>
    );
}

