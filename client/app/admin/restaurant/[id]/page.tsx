"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft, MapPin, Star, Utensils, ExternalLink, Phone, DollarSign, Clock,
    Badge, Heart, Map, Globe, Instagram, ChefHat, Tag, Users
} from 'lucide-react';
import { getAdminRestaurantById } from "@/lib/api-v2/admin/service/restaurant/getAdminRestaurantById";
import type { Restaurant } from "@/lib/api-v2/types/RestaurantResource";

/**
 * Restaurant Detail Page - Enhanced with all new fields
 * Shows full details including maps, Filipino ownership, food topics, etc.
 */
export default function RestaurantDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            fetchRestaurant();
        }
    }, [id]);

    const fetchRestaurant = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getAdminRestaurantById(id);
            setRestaurant(response.data);
        } catch (err: unknown) {
            console.error("Failed to fetch restaurant:", err);
            setError("Restaurant not found");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (timestamp: number) => {
        if (!timestamp) return "N/A";
        return new Date(timestamp * 1000).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f9fafb] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C10007]"></div>
            </div>
        );
    }

    if (error || !restaurant) {
        return (
            <div className="min-h-screen bg-[#f9fafb] flex flex-col items-center justify-center">
                <Utensils className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-xl text-gray-600 mb-4">{error || "Restaurant not found"}</p>
                <button
                    onClick={() => router.back()}
                    className="px-4 py-2 bg-[#C10007] text-white rounded-xl hover:bg-[#A0000A] transition-colors"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f9fafb]">
            {/* Hero Image */}
            <div className="relative h-[400px] w-full">
                <img
                    src={restaurant.image_url || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-xl text-sm font-medium text-gray-800 hover:bg-white transition-colors shadow-lg"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="max-w-4xl mx-auto">
                        {/* Badges Row */}
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                            <span className="px-3 py-1 bg-[#C10007] text-white rounded-full text-xs font-bold uppercase tracking-wider">
                                {restaurant.cuisine_type}
                            </span>
                            {restaurant.is_filipino_owned && (
                                <span className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-full text-xs font-bold">
                                    🇵🇭 Filipino-Owned
                                </span>
                            )}
                            {restaurant.rating > 0 && (
                                <span className="flex items-center gap-1 px-3 py-1 bg-yellow-400 text-white rounded-full text-xs font-bold">
                                    <Star className="w-3 h-3 fill-white" />
                                    {restaurant.rating}
                                </span>
                            )}
                            {restaurant.budget_category && (
                                <span className="px-3 py-1 bg-emerald-500 text-white rounded-full text-xs font-bold">
                                    {restaurant.budget_category}
                                </span>
                            )}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-2 leading-tight">
                            {restaurant.name}
                        </h1>
                        <div className="flex items-center gap-2 text-white/80">
                            <MapPin className="w-4 h-4" />
                            <span className="font-medium">
                                {restaurant.city ? `${restaurant.city}, ` : ""}{restaurant.country}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-6 py-10">

                {/* Clickbait Hook Banner */}
                {restaurant.clickbait_hook && (
                    <div className="bg-gradient-to-r from-[#C10007] to-[#ff4444] rounded-2xl p-6 mb-6 text-white">
                        <p className="text-xl md:text-2xl font-black text-center">
                            {restaurant.clickbait_hook}
                        </p>
                    </div>
                )}

                {/* Quick Info Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                        <DollarSign className="w-6 h-6 text-[#C10007] mb-2" />
                        <p className="text-xs text-gray-400 uppercase font-bold">Price Range</p>
                        <p className="text-xl font-black text-gray-900">{restaurant.price_range || "₱₱"}</p>
                        {restaurant.avg_meal_cost && (
                            <p className="text-xs text-gray-500 mt-1">{restaurant.avg_meal_cost}</p>
                        )}
                    </div>
                    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                        <Star className="w-6 h-6 text-yellow-400 mb-2" />
                        <p className="text-xs text-gray-400 uppercase font-bold">Rating</p>
                        <p className="text-xl font-black text-gray-900">{restaurant.rating || "N/A"}</p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                        <Utensils className="w-6 h-6 text-emerald-500 mb-2" />
                        <p className="text-xs text-gray-400 uppercase font-bold">Cuisine</p>
                        <p className="text-xl font-black text-gray-900 truncate">{restaurant.cuisine_type}</p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                        <Badge className="w-6 h-6 text-blue-500 mb-2" />
                        <p className="text-xs text-gray-400 uppercase font-bold">Budget</p>
                        <p className="text-xl font-black text-gray-900 truncate">{restaurant.budget_category || "Mid-Range"}</p>
                    </div>
                </div>

                {/* Description */}
                <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm mb-6">
                    <h2 className="text-2xl font-black text-gray-900 mb-4">About</h2>
                    <p className="text-gray-600 leading-relaxed text-lg">
                        {restaurant.description || "No description available."}
                    </p>
                </div>

                {/* Why Filipinos Love It */}
                {restaurant.why_filipinos_love_it && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-6 border border-blue-100">
                        <h3 className="text-lg font-black text-gray-900 mb-3 flex items-center gap-2">
                            <Heart className="w-5 h-5 text-[#C10007]" />
                            Why Filipinos Love It
                        </h3>
                        <p className="text-gray-700">
                            {restaurant.why_filipinos_love_it}
                        </p>
                    </div>
                )}

                {/* Brand Story */}
                {restaurant.brand_story && (
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
                        <h3 className="text-lg font-black text-gray-900 mb-3 flex items-center gap-2">
                            <Users className="w-5 h-5 text-purple-500" />
                            The Story
                        </h3>
                        <p className="text-gray-600">{restaurant.brand_story}</p>
                        {restaurant.owner_info && (
                            <p className="text-sm text-gray-500 mt-2">Owner: {restaurant.owner_info}</p>
                        )}
                    </div>
                )}

                {/* Food Topics */}
                {restaurant.food_topics && (
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
                        <h3 className="text-lg font-black text-gray-900 mb-3 flex items-center gap-2">
                            <Tag className="w-5 h-5 text-orange-500" />
                            Food Tags
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {restaurant.food_topics.split(',').map((topic, i) => (
                                <span key={i} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                                    {topic.trim()}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Details Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* Specialty Dish */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-black text-gray-900 mb-3 flex items-center gap-2">
                            <ChefHat className="w-5 h-5 text-[#C10007]" />
                            Specialty Dish
                        </h3>
                        <p className="text-gray-600">
                            {restaurant.specialty_dish || "Ask the staff for recommendations!"}
                        </p>
                    </div>

                    {/* Menu Highlights */}
                    {restaurant.menu_highlights && (
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <h3 className="text-lg font-black text-gray-900 mb-3 flex items-center gap-2">
                                <Utensils className="w-5 h-5 text-emerald-500" />
                                Menu Highlights
                            </h3>
                            <p className="text-gray-600">{restaurant.menu_highlights}</p>
                        </div>
                    )}

                    {/* Address & Google Maps */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-black text-gray-900 mb-3 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-blue-500" />
                            Address
                        </h3>
                        <p className="text-gray-600 mb-3">
                            {restaurant.address || restaurant.country}
                        </p>
                        {restaurant.google_maps_url && (
                            <a
                                href={restaurant.google_maps_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-bold hover:bg-blue-600 transition-colors"
                            >
                                <Map className="w-4 h-4" />
                                Open in Google Maps
                            </a>
                        )}
                    </div>

                    {/* Contact */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-black text-gray-900 mb-3 flex items-center gap-2">
                            <Phone className="w-5 h-5 text-emerald-500" />
                            Contact
                        </h3>
                        <p className="text-gray-600 mb-2">
                            {restaurant.contact_info || "N/A"}
                        </p>
                        {restaurant.website && (
                            <a href={restaurant.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-500 hover:underline text-sm">
                                <Globe className="w-4 h-4" />
                                {restaurant.website}
                            </a>
                        )}
                        {restaurant.social_media && (
                            <p className="flex items-center gap-2 text-pink-500 text-sm mt-1">
                                <Instagram className="w-4 h-4" />
                                {restaurant.social_media}
                            </p>
                        )}
                    </div>
                </div>

                {/* Added Date */}
                <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-center">
                    <p className="text-sm text-gray-500">
                        <Clock className="w-4 h-4 inline mr-1" />
                        Added: {formatDate(restaurant.timestamp)}
                    </p>
                </div>

                {/* Source Link */}
                {restaurant.original_url && (
                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div>
                                <p className="text-sm text-gray-400 mb-1">Original Source</p>
                                <p className="font-medium truncate max-w-md">{restaurant.original_url}</p>
                            </div>
                            <a
                                href={restaurant.original_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-100 transition-colors"
                            >
                                <ExternalLink className="w-4 h-4" />
                                View Source
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
