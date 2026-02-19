"use client";

import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
    Calendar, Eye, Edit, Trash2, RotateCcw, Loader2, MapPin,
    Star, Utensils, DollarSign, Badge, Globe, Phone, ExternalLink,
    Map as MapIcon, Heart, ChefHat, Clock
} from 'lucide-react';
import { getAdminRestaurantById } from "@/lib/api-v2/admin/service/restaurant/getAdminRestaurantById";
import { publishRestaurant } from "@/lib/api-v2/admin/service/restaurant/publishRestaurant";
import { deleteRestaurant } from "@/lib/api-v2/admin/service/restaurant/deleteRestaurant";
import { restoreRestaurant } from "@/lib/api-v2/admin/service/restaurant/restoreRestaurant";
import type { Restaurant } from "@/lib/api-v2/types/RestaurantResource";
import RestaurantEditorModal from "@/components/features/admin/restaurant/RestaurantEditorModal";
import StatusBadge from "@/components/features/admin/shared/StatusBadge";
import RestaurantBreadcrumb from "@/components/features/admin/restaurant/RestaurantBreadcrumb";
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
import { getSiteNames } from "@/lib/api-v2/admin/service/sites/getSiteNames";

/**
 * Restaurant Details Page
 * Redesigned to match Article Admin Page consistency
 */
function RestaurantDetailContent() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const from = searchParams.get('from') || '/admin/restaurant';
    const id = params.id as string;

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPublishing, setIsPublishing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isRestoring, setIsRestoring] = useState(false);

    // Dialog states
    const [showPublishDialog, setShowPublishDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showRestoreDialog, setShowRestoreDialog] = useState(false);

    // Publish sites logic (reused from articles if applicable, or simplified)
    const [availableSites, setAvailableSites] = useState<string[]>([]);
    const [publishToSites, setPublishToSites] = useState<string[]>([]);

    useEffect(() => {
        if (id) {
            fetchRestaurant();
        }
    }, [id]);

    useEffect(() => {
        getSiteNames().then(res => setAvailableSites(res.data as unknown as string[])).catch(console.error);
    }, []);

    // Effect to initialize publishToSites when restaurant loads
    useEffect(() => {
        if (restaurant && availableSites.length > 0) {
            // For simplicity, if restaurant is published, assume it's published to all or check specific field if exists
            // Since RestaurantResource might not have published_sites yet, we default to all available or none
            setPublishToSites(availableSites);
        }
    }, [restaurant, availableSites.length]);

    const fetchRestaurant = async () => {
        try {
            setIsLoading(true);
            const response = await getAdminRestaurantById(id);
            setRestaurant(response.data);
        } catch (err) {
            console.error("Failed to fetch restaurant:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePublishClick = () => {
        if (!restaurant) return;
        setShowPublishDialog(true);
    };

    const confirmPublish = async () => {
        setIsPublishing(true);
        try {
            await publishRestaurant(id, {
                published_sites: publishToSites
            });
            // Update local state or refetch
            setRestaurant(prev => prev ? { ...prev, status: 'published' } : null);
            router.refresh();
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to publish restaurant';
            alert(`Error: ${message}`);
        } finally {
            setIsPublishing(false);
            setShowPublishDialog(false);
        }
    };

    const handleDeleteClick = () => {
        if (!restaurant) return;
        setShowDeleteDialog(true);
    };

    const confirmDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteRestaurant(id);
            setRestaurant(prev => prev ? { ...prev, status: 'deleted' } : null);
            router.push('/admin/restaurants');
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to delete restaurant';
            alert(`Error: ${message}`);
        } finally {
            setIsDeleting(false);
            setShowDeleteDialog(false);
        }
    };

    const handleRestoreClick = () => {
        if (!restaurant) return;
        setShowRestoreDialog(true);
    };

    const confirmRestore = async () => {
        setIsRestoring(true);
        try {
            await restoreRestaurant(id);
            setRestaurant(prev => prev ? { ...prev, status: 'draft' } : null); // Or whatever default status
            window.location.reload();
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to restore restaurant';
            alert(`Error: ${message}`);
        } finally {
            setIsRestoring(false);
            setShowRestoreDialog(false);
        }
    };

    const toggleSite = (site: string) => {
        if (publishToSites.includes(site)) {
            setPublishToSites(prev => prev.filter(s => s !== site));
        } else {
            setPublishToSites(prev => [...prev, site]);
        }
    };

    if (isLoading) return <div className="p-20 text-center text-[#6b7280]">Loading restaurant details...</div>;
    if (!restaurant) return (
        <div className="p-20 text-center">
            <h2 className="text-2xl font-bold mb-4">Restaurant Not Found</h2>
            <button onClick={() => router.push('/admin/restaurants')} className="text-[#C10007] hover:underline">
                Back to Restaurants
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f9fafb]">
            <div className="max-w-[1400px] mx-auto px-6 py-8">
                <div className="mb-6">
                    <RestaurantBreadcrumb name={restaurant.name} homeHref={from} />
                </div>

                <div className="flex gap-8">
                    {/* Main Content Column */}
                    <div className="flex-1 max-w-[900px]">

                        {/* Summary Card (Hero) */}
                        <div className="bg-white rounded-[12px] border border-[#e5e7eb] overflow-hidden shadow-[0px_1px_3px_rgba(0,0,0,0.05)] mb-8">
                            <div className="relative h-[300px] w-full">
                                <img
                                    src={restaurant.image_url || 'https://placehold.co/1200x600?text=No+Image+Available'}
                                    alt={restaurant.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.currentTarget.src = 'https://placehold.co/1200x600?text=No+Image'; }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                <div className="absolute bottom-0 left-0 p-8 text-white">
                                    <h1 className="text-[32px] font-bold leading-tight mb-2 shadow-sm">{restaurant.name}</h1>
                                    {restaurant.clickbait_hook && (
                                        <p className="text-lg text-white/90 font-medium mb-3 italic">{restaurant.clickbait_hook}</p>
                                    )}
                                    <div className="flex items-center gap-4 text-sm font-medium">
                                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {restaurant.city || restaurant.location || 'Manila'}</span>
                                        <span className="flex items-center gap-1"><Utensils className="w-4 h-4" /> {restaurant.cuisine_type || 'Restaurant'}</span>
                                        {restaurant.rating > 0 && <span className="flex items-center gap-1 text-yellow-400"><Star className="w-4 h-4 fill-current" /> {restaurant.rating}</span>}
                                    </div>
                                </div>
                            </div>

                            <div className="p-8">
                                <div className="mb-6 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="px-3 py-1 bg-gray-100 border border-gray-200 rounded-[4px] text-[12px] font-semibold text-gray-700 uppercase tracking-wider">
                                            {restaurant.category}
                                        </span>
                                        {restaurant.is_filipino_owned && (
                                            <span className="px-3 py-1 bg-blue-50 border border-blue-100 rounded-[4px] text-[12px] font-semibold text-blue-700 uppercase tracking-wider">
                                                Filipino Owned
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <StatusBadge status={restaurant.status as any} />
                                        {restaurant.status === 'published' && (
                                            <a
                                                href={`/restaurants/${restaurant.id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-[12px] font-medium text-blue-600 hover:text-blue-700 hover:underline"
                                            >
                                                View Live <ExternalLink className="w-3 h-3" />
                                            </a>
                                        )}
                                    </div>
                                </div>

                                <div className="prose prose-lg max-w-none text-gray-600 mb-8">
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 block">About</h3>
                                    <p>{restaurant.description || "No description provided."}</p>
                                </div>

                                {/* Quick Info Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                                        <p className="text-xs text-gray-400 uppercase font-bold mb-1">Price Range</p>
                                        <div className="flex flex-col">
                                            <p className="text-lg font-bold text-gray-900 leading-tight">{restaurant.price_range || "N/A"}</p>
                                            {restaurant.avg_meal_cost && (
                                                <p className="text-xs text-gray-500 mt-1 font-medium">{restaurant.avg_meal_cost}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                                        <p className="text-xs text-gray-400 uppercase font-bold mb-1">Budget</p>
                                        <p className="text-lg font-bold text-gray-900">{restaurant.budget_category || "N/A"}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                                        <p className="text-xs text-gray-400 uppercase font-bold mb-1">Specialty</p>
                                        <p className="text-lg font-bold text-gray-900 truncate" title={restaurant.specialty_dish}>{restaurant.specialty_dish || "N/A"}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                                        <p className="text-xs text-gray-400 uppercase font-bold mb-1">Contact</p>
                                        <p className="text-sm font-bold text-gray-900 truncate" title={restaurant.contact_info}>{restaurant.contact_info || "N/A"}</p>
                                    </div>
                                </div>

                                {/* Extra Details Section */}
                                <div className="space-y-6 border-t border-gray-100 pt-8">
                                    {restaurant.why_filipinos_love_it && (
                                        <div>
                                            <h4 className="flex items-center gap-2 font-bold text-gray-900 mb-2">
                                                <Heart className="w-4 h-4 text-[#C10007]" /> Why Filipinos Love It
                                            </h4>
                                            <p className="text-gray-600">{restaurant.why_filipinos_love_it}</p>
                                        </div>
                                    )}
                                    {restaurant.menu_highlights && (
                                        <div>
                                            <h4 className="flex items-center gap-2 font-bold text-gray-900 mb-2">
                                                <ChefHat className="w-4 h-4 text-emerald-600" /> Menu Highlights
                                            </h4>
                                            <p className="text-gray-600">{restaurant.menu_highlights}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Map Section */}
                        <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-8 shadow-[0px_1px_3px_rgba(0,0,0,0.05)] mb-8">
                            <h3 className="text-[18px] font-bold text-[#111827] mb-4 flex items-center gap-2">
                                <MapIcon className="w-5 h-5 text-gray-500" /> Location Map
                            </h3>
                            <div className="w-full aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden border border-gray-200 relative flex items-center justify-center">
                                {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && restaurant.google_maps_url ? (
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        frameBorder="0"
                                        style={{ border: 0 }}
                                        src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(restaurant.address || restaurant.name)}`}
                                        allowFullScreen
                                    ></iframe>
                                ) : (
                                    <div className="text-center p-6 flex flex-col items-center">
                                        <MapPin className="w-12 h-12 text-gray-300 mb-3" />
                                        <p className="text-gray-500 mb-4 font-medium">Map Preview Unavailable</p>
                                        <div className="flex flex-col gap-2">
                                            <p className="text-xs text-gray-400 max-w-[200px]">
                                                {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
                                                    ? "Invalid Coordinates or Address"
                                                    : "Google Maps API Key missing in environment"}
                                            </p>
                                            {restaurant.google_maps_url && (
                                                <a
                                                    href={restaurant.google_maps_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-colors flex items-center gap-2"
                                                >
                                                    <ExternalLink className="w-4 h-4" /> Open in Google Maps
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <p className="mt-4 text-sm text-gray-500 flex items-center gap-2">
                                <MapPin className="w-4 h-4" /> {restaurant.address || restaurant.location}
                            </p>
                        </div>

                        {/* Additional Info Grid */}
                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-6 shadow-sm">
                                <h3 className="text-[16px] font-bold text-[#111827] mb-4 flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-blue-500" /> Online Presence
                                </h3>
                                <div className="space-y-3">
                                    {restaurant.website ? (
                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <span className="text-sm font-medium text-gray-600">Website</span>
                                            <a href={restaurant.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                                                Visit <ExternalLink className="w-3 h-3" />
                                            </a>
                                        </div>
                                    ) : <p className="text-sm text-gray-400 italic">No website added</p>}

                                    {restaurant.social_media ? (
                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <span className="text-sm font-medium text-gray-600">Social Media</span>
                                            <a href={restaurant.social_media} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                                                Profile <ExternalLink className="w-3 h-3" />
                                            </a>
                                        </div>
                                    ) : <p className="text-sm text-gray-400 italic">No social media added</p>}
                                </div>
                            </div>

                            <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-6 shadow-sm">
                                <h3 className="text-[16px] font-bold text-[#111827] mb-4 flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-emerald-500" /> Opening Hours
                                </h3>
                                {restaurant.opening_hours ? (
                                    <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
                                        {restaurant.opening_hours}
                                    </p>
                                ) : (
                                    <p className="text-sm text-gray-400 italic">No opening hours available</p>
                                )}
                            </div>
                        </div>

                        {/* Additional Details: Story, Tags, Source */}
                        <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-6 shadow-sm mt-6">
                            <h3 className="text-[16px] font-bold text-[#111827] mb-4 pb-2 border-b border-gray-100">
                                More Details
                            </h3>
                            <div className="space-y-6">
                                {restaurant.brand_story && (
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">The Story</h4>
                                        <p className="text-gray-600 leading-relaxed">{restaurant.brand_story}</p>
                                    </div>
                                )}

                                {(restaurant.tags || []).length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Food Tags</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {(restaurant.tags || []).map((tag, i) => (
                                                <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {restaurant.original_url && (
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Original Source</h4>
                                        <div className="flex items-center gap-2">
                                            <a
                                                href={restaurant.original_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline text-sm truncate max-w-[500px] block"
                                            >
                                                {restaurant.original_url}
                                            </a>
                                            <a
                                                href={restaurant.original_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-semibold hover:bg-blue-100 transition-colors"
                                            >
                                                View Source
                                            </a>
                                        </div>
                                    </div>
                                )}

                                <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                                    <p>Added: {new Date((restaurant.timestamp || 0) * 1000).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    {restaurant.address && <p className="text-right max-w-[300px] truncate">{restaurant.address}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <aside className="w-[320px] flex-shrink-0 space-y-6">
                        {/* Publish Widget */}
                        <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-6 shadow-sm">
                            <h3 className="text-[16px] font-semibold text-[#111827] mb-4 tracking-[-0.5px]">Publish Status</h3>
                            <div className="space-y-3 mb-6">
                                {availableSites.map((site) => (
                                    <label key={site} className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={publishToSites.includes(site)}
                                            onChange={() => toggleSite(site)}
                                            className="w-4 h-4 rounded border-[#d1d5db] text-[#C10007] focus:ring-[#C10007] focus:ring-offset-0 cursor-pointer"
                                        />
                                        <span className="text-[14px] text-[#374151] group-hover:text-[#C10007] transition-colors tracking-[-0.5px]">{site}</span>
                                    </label>
                                ))}
                            </div>
                            <button
                                onClick={handlePublishClick}
                                disabled={isPublishing || restaurant.status === 'published'}
                                className="w-full px-4 py-2.5 bg-[#3b82f6] text-white rounded-[8px] text-[14px] font-semibold hover:bg-[#2563eb] transition-all active:scale-95 tracking-[-0.5px] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isPublishing && <Loader2 className="w-4 h-4 animate-spin" />}
                                {isPublishing ? 'Publishing...' : (restaurant.status === 'published' ? 'Published' : 'Publish')}
                            </button>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-6 shadow-sm">
                            <h3 className="text-[16px] font-semibold text-[#111827] mb-4 tracking-[-0.5px]">Quick Actions</h3>
                            <div className="space-y-3">
                                <button onClick={() => setIsEditModalOpen(true)} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-[#d1d5db] rounded-[8px] text-[14px] font-medium text-[#374151] hover:bg-gray-50 transition-all active:scale-95 tracking-[-0.5px]">
                                    <Edit className="w-4 h-4" /> Edit Details
                                </button>
                                {restaurant.status === 'deleted' ? (
                                    <button
                                        onClick={handleRestoreClick}
                                        disabled={isRestoring}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-emerald-200 bg-emerald-50 rounded-[8px] text-[14px] font-medium text-emerald-700 hover:bg-emerald-100 transition-all active:scale-95 tracking-[-0.5px] disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isRestoring ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                                        {isRestoring ? 'Restoring...' : 'Restore'}
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleDeleteClick}
                                        disabled={isDeleting}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-[#d1d5db] rounded-[8px] text-[14px] font-medium text-[#ef4444] hover:bg-red-50 transition-all active:scale-95 tracking-[-0.5px] disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                        {isDeleting ? 'Deleting...' : 'Delete'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            <RestaurantEditorModal
                mode="edit"
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                initialData={restaurant}
            />

            {/* Dialogs */}
            <AlertDialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Ready to Publish?</AlertDialogTitle>
                        <AlertDialogDescription>This restaurant will be visible on the selected sites.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmPublish} className="bg-[#3b82f6] hover:bg-[#2563eb]">Confirm Publish</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-red-600">Delete Restaurant?</AlertDialogTitle>
                        <AlertDialogDescription>Are you sure you want to delete this restaurant?</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-emerald-600">Restore Restaurant?</AlertDialogTitle>
                        <AlertDialogDescription>Are you sure you want to restore this restaurant?</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmRestore} className="bg-emerald-600 hover:bg-emerald-700">Restore</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

export default function RestaurantDetailPage() {
    return (
        <Suspense fallback={<div className="p-20 text-center text-[#6b7280]">Loading restaurant details...</div>}>
            <RestaurantDetailContent />
        </Suspense>
    );
}
