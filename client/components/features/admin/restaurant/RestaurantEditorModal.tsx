"use client";

import { useState, useEffect } from 'react';
import { X, ArrowLeft, Save, Send, Loader2 } from 'lucide-react';
import { createRestaurant } from "@/lib/api-v2/admin/service/restaurant/createRestaurant";
import { updateRestaurant } from "@/lib/api-v2/admin/service/restaurant/updateRestaurant";
import { uploadArticleImage, getSiteNames } from "@/lib/api-v2";
import RestaurantEditorForm from "./editor/RestaurantEditorForm";
import RestaurantEditorPreview from "@/components/features/admin/restaurant/editor/RestaurantEditorPreview";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface RestaurantEditorModalProps {
    mode: 'create' | 'edit';
    isOpen: boolean;
    onClose: () => void;
    initialData?: any;
}

const EMPTY_STATE = {
    name: '',
    description: '',
    image_url: null as string | null,
    category: 'Restaurant',
    rating: 0,
    location: '',
    country: 'Philippines',
    cuisine_type: '',
    price_range: '',
    address: '',
    google_maps_url: '',
    specialty_dish: '',
    opening_hours: '',
    contact_info: '',
    is_filipino_owned: false,
    is_featured: false,
    budget_category: '',
    social_media: '',
    website: '',
    tags: [] as string[],
    features: [] as string[],
    why_filipinos_love_it: '',
    original_url: '',
    clickbait_hook: '',
    avg_meal_cost: '',
    brand_story: '',
    owner_info: '',
    menu_highlights: '',
    food_topics: '',
    // Client-only fields (not in DB yet — stripped before sending to server)
    company: '',
    content: '',
    published_sites: [] as string[],
    scheduled_at: null as string | null,
};

export default function RestaurantEditorModal({ mode, isOpen, onClose, initialData }: RestaurantEditorModalProps) {
    const [restaurantData, setRestaurantData] = useState({ ...EMPTY_STATE });
    const [availableSites, setAvailableSites] = useState<string[]>([]);
    const [showPublishDialog, setShowPublishDialog] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        getSiteNames().then(res => setAvailableSites(res.data as unknown as string[])).catch(console.error);
    }, []);

    useEffect(() => {
        if (isOpen && initialData) {
            setRestaurantData({
                name: initialData.name || '',
                description: initialData.description || '',
                image_url: initialData.image_url || null,
                category: initialData.category || 'Restaurant',
                rating: initialData.rating || 0,
                location: initialData.location || initialData.city || '',
                country: initialData.country || 'Philippines',
                cuisine_type: initialData.cuisine_type || '',
                price_range: initialData.price_range || '',
                address: initialData.address || '',
                google_maps_url: initialData.google_maps_url || '',
                specialty_dish: initialData.specialty_dish || '',
                opening_hours: initialData.opening_hours || '',
                contact_info: initialData.contact_info || '',
                is_filipino_owned: initialData.is_filipino_owned || false,
                is_featured: initialData.is_featured ?? false,
                budget_category: initialData.budget_category || '',
                social_media: initialData.social_media || '',
                website: initialData.website || '',
                tags: initialData.tags || [],
                features: initialData.features || [],
                why_filipinos_love_it: initialData.why_filipinos_love_it || '',
                original_url: initialData.original_url || '',
                clickbait_hook: initialData.clickbait_hook || '',
                avg_meal_cost: initialData.avg_meal_cost || '',
                brand_story: initialData.brand_story || '',
                owner_info: initialData.owner_info || '',
                menu_highlights: initialData.menu_highlights || '',
                food_topics: initialData.food_topics || '',
                company: initialData.company || '',
                content: initialData.content || '',
                published_sites: initialData.published_sites || initialData.sites || [],
                scheduled_at: initialData.scheduled_at || null,
            });
        } else if (isOpen) {
            setRestaurantData({ ...EMPTY_STATE });
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleDataChange = (field: string, value: any) => {
        setRestaurantData(prev => ({ ...prev, [field]: value }));
    };

    const isDataUrl = (str: string) => str?.startsWith('data:') || str?.startsWith('blob:');

    const dataUrlToFile = async (dataUrl: string, filename: string): Promise<File> => {
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        return new File([blob], filename, { type: blob.type });
    };

    const handleSave = async (isPublish: boolean = false) => {
        setIsProcessing(true);
        try {
            let finalImage = restaurantData.image_url;
            if (isDataUrl(finalImage || '')) {
                const file = await dataUrlToFile(finalImage!, `res-image-${Date.now()}.jpg`);
                const response = await uploadArticleImage(file);
                finalImage = response.data.url;
            }

            // Strip client-only fields that don't exist in the DB yet
            const { company, content, scheduled_at, ...dbFields } = restaurantData;

            const payload: any = {
                ...dbFields,
                image_url: finalImage || '',
                status: isPublish ? 'published' : 'draft',
                is_featured: restaurantData.is_featured ?? false,
            };

            if (mode === 'create') {
                await createRestaurant(payload);
                alert(`Restaurant ${isPublish ? 'published' : 'saved as draft'} successfully!`);
            } else {
                await updateRestaurant(initialData.id, payload);
                alert(`Restaurant ${isPublish ? 'published' : 'updated'} successfully!`);
            }

            onClose();
            window.location.reload();
        } catch (error: any) {
            console.error("Failed to save restaurant", error);
            const msg = error.response?.data?.message || "Failed to save changes.";
            alert(`Error: ${msg}`);
        } finally {
            setIsProcessing(false);
            setShowPublishDialog(false);
        }
    };

    return (
        <div className="force-light fixed inset-0 bg-white z-[100] flex flex-col animate-in fade-in duration-200">
            {/* Full Screen Header */}
            <div className="h-[70px] border-b border-[#e5e7eb] px-6 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
                    >
                        <ArrowLeft className="w-5 h-5 text-[#6b7280] group-hover:text-[#111827]" />
                    </button>
                    <div>
                        <h2 className="text-[18px] font-bold text-[#111827] tracking-[-0.5px]">
                            {mode === 'create' ? 'Add New Restaurant' : 'Edit Restaurant'}
                        </h2>
                        <p className="text-[12px] text-[#6b7280] tracking-[-0.5px]">
                            {mode === 'create' ? 'Adding a new dining spot' : `Editing: ${restaurantData.name}`}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => handleSave(false)}
                        disabled={isProcessing}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-[#d1d5db] text-[#374151] rounded-[8px] hover:bg-gray-50 transition-all text-[14px] font-bold tracking-[-0.5px] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save as Draft
                    </button>
                    <button
                        onClick={() => setShowPublishDialog(true)}
                        disabled={isProcessing}
                        className="flex items-center gap-2 px-6 py-2 bg-[#C10007] text-white rounded-[8px] hover:bg-[#a10006] transition-all text-[14px] font-bold tracking-[-0.5px] shadow-md shadow-red-900/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        {mode === 'create' ? 'Publish' : 'Update & Publish'}
                    </button>
                    <div className="w-px h-8 bg-gray-200 mx-2" />
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-[#9ca3af]" />
                    </button>
                </div>
            </div>

            {/* Main Dual Panel Body */}
            <div className="flex-1 flex overflow-hidden">
                <RestaurantEditorForm
                    data={restaurantData}
                    onDataChange={handleDataChange}
                    availableSites={availableSites}
                />
                <RestaurantEditorPreview
                    data={{ ...restaurantData, timestamp: Date.now() / 1000 }}
                    onDataChange={handleDataChange}
                />
            </div>

            {/* Publish Confirmation Dialog */}
            <AlertDialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
                <AlertDialogContent className="z-[200]">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Ready to Publish?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {restaurantData.scheduled_at
                                ? `"${restaurantData.name || 'This restaurant'}" will be scheduled for ${new Date(restaurantData.scheduled_at).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}.`
                                : restaurantData.published_sites.length > 0
                                    ? `"${restaurantData.name || 'This restaurant'}" will be published to: ${restaurantData.published_sites.join(', ')}.`
                                    : `"${restaurantData.name || 'This restaurant'}" will be published. Manage which sites it appears on from the detail page.`
                            }
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleSave(true);
                            }}
                            disabled={isProcessing}
                            className="bg-[#C10007] hover:bg-[#a10006]"
                        >
                            {isProcessing ? 'Publishing...' : 'Confirm Publish'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
