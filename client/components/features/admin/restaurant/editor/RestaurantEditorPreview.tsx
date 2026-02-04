"use client";

import {
    ArrowLeft, MapPin, Star, Utensils, ExternalLink, Phone, DollarSign, Clock,
    Wallet, Heart, Map, Globe, Instagram, ChefHat, Tag, Users
} from 'lucide-react';

interface RestaurantEditorPreviewProps {
    data: any;
}

export default function RestaurantEditorPreview({ data }: RestaurantEditorPreviewProps) {
    const formatDate = (timestamp: number) => {
        if (!timestamp) return "N/A";
        return new Date(timestamp * 1000).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <div className="flex-1 bg-gray-50 overflow-y-auto custom-scrollbar h-full p-4 md:p-8">
            <div className="max-w-[1000px] mx-auto bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden min-h-full">

                {/* Hero Image */}
                <div className="relative h-[300px] w-full bg-gray-200">
                    <img
                        src={data.image_url || "https://placehold.co/1200x600?text=No+Image"}
                        alt={data.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                    {/* Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                        <div className="max-w-4xl mx-auto">
                            {/* Badges Row */}
                            <div className="flex items-center gap-2 mb-3 flex-wrap">
                                <span className="px-3 py-1 bg-[#C10007] text-white rounded-full text-xs font-bold uppercase tracking-wider">
                                    {data.cuisine_type || 'Cuisine'}
                                </span>
                                {data.is_filipino_owned && (
                                    <span className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-full text-xs font-bold">
                                        🇵🇭 Filipino-Owned
                                    </span>
                                )}
                                {data.rating > 0 && (
                                    <span className="flex items-center gap-1 px-3 py-1 bg-yellow-400 text-white rounded-full text-xs font-bold">
                                        <Star className="w-3 h-3 fill-white" />
                                        {data.rating}
                                    </span>
                                )}
                                {data.budget_category && (
                                    <span className="px-3 py-1 bg-emerald-500 text-white rounded-full text-xs font-bold">
                                        {data.budget_category}
                                    </span>
                                )}
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black text-white mb-2 leading-tight">
                                {data.name || 'Restaurant Name'}
                            </h1>
                            <div className="flex items-center gap-2 text-white/80">
                                <MapPin className="w-4 h-4" />
                                <span className="font-medium">
                                    {data.location ? `${data.location}, ` : ""}{data.country}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Body */}
                <div className="p-8">
                    {/* Clickbait Hook */}
                    {data.clickbait_hook && (
                        <div className="bg-gradient-to-r from-[#C10007] to-[#ff4444] rounded-2xl p-6 mb-6 text-white shadow-md">
                            <p className="text-xl font-black text-center">
                                {data.clickbait_hook}
                            </p>
                        </div>
                    )}

                    {/* Quick Info Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                            <DollarSign className="w-5 h-5 text-[#C10007] mb-2" />
                            <p className="text-xs text-gray-400 uppercase font-bold">Price Range</p>
                            <p className="text-lg font-black text-gray-900">{data.price_range || "N/A"}</p>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                            <Star className="w-5 h-5 text-yellow-400 mb-2" />
                            <p className="text-xs text-gray-400 uppercase font-bold">Rating</p>
                            <p className="text-lg font-black text-gray-900">{data.rating || "N/A"}</p>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                            <Utensils className="w-5 h-5 text-emerald-500 mb-2" />
                            <p className="text-xs text-gray-400 uppercase font-bold">Cuisine</p>
                            <p className="text-lg font-black text-gray-900 truncate">{data.cuisine_type || "N/A"}</p>
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                            <Wallet className="w-5 h-5 text-blue-500 mb-2" />
                            <p className="text-xs text-gray-400 uppercase font-bold">Budget</p>
                            <p className="text-lg font-black text-gray-900 truncate">{data.budget_category || "N/A"}</p>
                        </div>
                    </div>

                    {/* Main Description */}
                    <div className="prose max-w-none text-gray-700 leading-relaxed mb-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">About</h3>
                        <p>{data.description || 'Description will appear here...'}</p>
                    </div>

                    {/* Why Filipinos Love It */}
                    {data.why_filipinos_love_it && (
                        <div className="bg-blue-50 rounded-2xl p-6 mb-8 border border-blue-100">
                            <h3 className="text-lg font-black text-gray-900 mb-3 flex items-center gap-2">
                                <Heart className="w-5 h-5 text-[#C10007]" />
                                Why Filipinos Love It
                            </h3>
                            <p className="text-gray-700">
                                {data.why_filipinos_love_it}
                            </p>
                        </div>
                    )}

                    {/* Brand Story */}
                    {data.brand_story && (
                        <div className="mb-8">
                            <h3 className="text-lg font-black text-gray-900 mb-3 flex items-center gap-2">
                                <Users className="w-5 h-5 text-purple-500" />
                                The Story
                            </h3>
                            <p className="text-gray-600">{data.brand_story}</p>
                        </div>
                    )}

                    {/* Two Column Details */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <h3 className="text-lg font-black text-gray-900 mb-3 flex items-center gap-2">
                                <ChefHat className="w-5 h-5 text-[#C10007]" />
                                Specialty Dish
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {data.specialty_dish || "N/A"}
                            </p>

                            <h3 className="text-lg font-black text-gray-900 mb-3 flex items-center gap-2">
                                <Utensils className="w-5 h-5 text-emerald-500" />
                                Menu Highlights
                            </h3>
                            <p className="text-gray-600">
                                {data.menu_highlights || "N/A"}
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-6">
                            <h3 className="text-lg font-black text-gray-900 mb-3 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-blue-500" />
                                Address
                            </h3>
                            <p className="text-gray-600 mb-4">
                                {data.address || data.location || "N/A"}
                            </p>
                            <h3 className="text-lg font-black text-gray-900 mb-3 flex items-center gap-2">
                                <Phone className="w-5 h-5 text-emerald-500" />
                                Contact
                            </h3>
                            <p className="text-gray-600 mb-2">
                                {data.contact_info || "N/A"}
                            </p>
                            {data.website && (
                                <div className="text-sm text-blue-500 truncate">{data.website}</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
