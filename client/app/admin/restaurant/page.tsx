"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminPageHeader from "@/components/features/admin/shared/AdminPageHeader";
import { Plus, Utensils, Search, Filter, Trash2, ExternalLink, MapPin, Star, DollarSign, RefreshCw, Eye } from 'lucide-react';
import { getAdminRestaurants } from "@/lib/api-v2/admin/service/restaurant/getAdminRestaurants";
import { deleteAdminRestaurant } from "@/lib/api-v2/admin/service/restaurant/deleteAdminRestaurant";
import type { RestaurantSummary } from "@/lib/api-v2/types/RestaurantResource";

/**
 * RestaurantPage - Admin page for restaurant management
 * Fetches real data from Laravel API (which reads from Redis)
 */
export default function RestaurantPage() {
    const router = useRouter();
    const [restaurants, setRestaurants] = useState<RestaurantSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [deleting, setDeleting] = useState<string | null>(null);

    // Fetch restaurants on mount
    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getAdminRestaurants({ limit: 100 });
            setRestaurants(response.data);
        } catch (err: unknown) {
            console.error("Failed to fetch restaurants:", err);
            setError("Failed to load restaurants. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this restaurant?")) return;

        try {
            setDeleting(id);
            await deleteAdminRestaurant(id);
            // Remove from local state
            setRestaurants(prev => prev.filter(r => r.id !== id));
        } catch (err) {
            console.error("Failed to delete restaurant:", err);
            alert("Failed to delete restaurant");
        } finally {
            setDeleting(null);
        }
    };

    // Filter restaurants by search query
    const filteredRestaurants = restaurants.filter(r =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.cuisine_type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Format timestamp to date
    const formatDate = (timestamp: number) => {
        if (!timestamp) return "N/A";
        return new Date(timestamp * 1000).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="p-8 bg-[#f9fafb] min-h-screen">
            <AdminPageHeader
                title="Restaurant Directory"
                description="AI-scraped restaurant data from around the world"
                actionLabel="Refresh Data"
                onAction={fetchRestaurants}
                actionIcon={RefreshCw}
            />

            <div className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden shadow-sm">
                {/* Search and Filters Bar */}
                <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search restaurants..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C10007]/10 focus:border-[#C10007] transition-all"
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <span className="px-4 py-2 bg-gray-100 rounded-xl text-sm font-medium text-gray-600">
                            {filteredRestaurants.length} restaurants
                        </span>
                    </div>
                </div>

                {/* Content Area */}
                <div className="p-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C10007]"></div>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                            <p className="text-lg mb-4">{error}</p>
                            <button
                                onClick={fetchRestaurants}
                                className="px-4 py-2 bg-[#C10007] text-white rounded-xl hover:bg-[#A0000A] transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    ) : filteredRestaurants.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                            <Utensils className="w-16 h-16 mb-4 text-gray-300" />
                            <p className="text-lg">No restaurants found</p>
                            <p className="text-sm">Trigger the scraper to generate restaurant data</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredRestaurants.map((item) => (
                                <div
                                    key={item.id}
                                    className="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border-b-4 border-b-[#C10007]"
                                >
                                    {/* Image */}
                                    <div className="relative h-48 w-full overflow-hidden">
                                        <img
                                            src={item.image_url || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 left-4 flex gap-1 flex-wrap max-w-[80%]">
                                            <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-md text-[9px] font-black text-gray-800 uppercase tracking-wider shadow-sm">
                                                {item.cuisine_type}
                                            </span>
                                        </div>
                                        {/* Rating Badge */}
                                        {item.rating > 0 && (
                                            <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 bg-yellow-400 rounded-md shadow-sm">
                                                <Star className="w-3 h-3 fill-white text-white" />
                                                <span className="text-xs font-bold text-white">{item.rating}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-5 flex-1 flex flex-col">
                                        <div className="flex items-center gap-2 mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            <MapPin className="w-3 h-3" />
                                            {item.city ? `${item.city}, ` : ""}{item.country}
                                        </div>
                                        <h3 className="text-lg font-black text-gray-900 leading-tight mb-2 line-clamp-2 group-hover:text-[#C10007] transition-colors">
                                            {item.name}
                                        </h3>

                                        {/* Price Range */}
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="text-sm font-bold text-[#C10007]">{item.price_range || "₱₱"}</span>
                                        </div>

                                        {/* Footer */}
                                        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-bold text-gray-400 uppercase">Added</span>
                                                <span className="text-[11px] font-black text-gray-700">{formatDate(item.timestamp)}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => router.push(`/admin/restaurant/${item.id}`)}
                                                    className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    disabled={deleting === item.id}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                    title="Delete"
                                                >
                                                    {deleting === item.id ? (
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                                                    ) : (
                                                        <Trash2 className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
