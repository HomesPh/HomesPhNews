"use client";

import React from 'react';
import {
    MapPin,
    Utensils,
    Star,
    Clock,
    Globe,
    Phone,
    DollarSign,
    Heart,
    ChefHat,
    ExternalLink,
    Tag,
    BookOpen
} from 'lucide-react';
import type { ArticleResource } from '@/lib/api-v2/types/ArticleResource';

interface RestaurantDetailsProps {
    restaurant: ArticleResource;
}

export default function RestaurantDetails({ restaurant }: RestaurantDetailsProps) {
    // Only show if it's a restaurant
    if (restaurant.category !== "Restaurant") return null;

    return (
        <div className="space-y-12 my-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* 1. Quick Info Grid - Matches Admin Page UI */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-[#1a1d2e] p-5 rounded-2xl border border-gray-100 dark:border-[#2a2d3e] shadow-[0px_1px_3px_rgba(0,0,0,0.05)]">
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-black tracking-widest mb-1">
                        PRICE RANGE
                    </p>
                    <div className="flex flex-col">
                        <p className="text-[16px] font-bold text-gray-900 dark:text-white leading-tight">{restaurant.price_range || "N/A"}</p>
                        {restaurant.avg_meal_cost && (
                            <p className="text-[10px] text-gray-500 mt-1 font-medium">{restaurant.avg_meal_cost}</p>
                        )}
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1a1d2e] p-5 rounded-2xl border border-gray-100 dark:border-[#2a2d3e] shadow-[0px_1px_3px_rgba(0,0,0,0.05)]">
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-black tracking-widest mb-1">
                        BUDGET
                    </p>
                    <p className="text-[16px] font-bold text-gray-900 dark:text-white leading-tight">{restaurant.budget_category || "N/A"}</p>
                </div>

                <div className="bg-white dark:bg-[#1a1d2e] p-5 rounded-2xl border border-gray-100 dark:border-[#2a2d3e] shadow-[0px_1px_3px_rgba(0,0,0,0.05)]">
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-black tracking-widest mb-1">
                        SPECIALTY
                    </p>
                    <p className="text-[16px] font-bold text-gray-900 dark:text-white leading-tight truncate" title={restaurant.specialty_dish}>
                        {restaurant.specialty_dish || "N/A"}
                    </p>
                </div>

                <div className="bg-white dark:bg-[#1a1d2e] p-5 rounded-2xl border border-gray-100 dark:border-[#2a2d3e] shadow-[0px_1px_3px_rgba(0,0,0,0.05)]">
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-black tracking-widest mb-1">
                        CONTACT
                    </p>
                    <p className="text-[16px] font-bold text-gray-900 dark:text-white leading-tight truncate" title={restaurant.contact_info}>
                        {restaurant.contact_info || "N/A"}
                    </p>
                </div>
            </div>

            {/* 2. About / Content Section */}
            {restaurant.content && (
                <div className="prose prose-lg dark:prose-invert max-w-none 
                    prose-headings:font-bold prose-a:text-[#C10007] dark:prose-a:text-[#ff3d3d]
                    prose-img:rounded-2xl prose-img:shadow-lg">
                    <h3 className="text-[24px] font-bold text-gray-900 dark:text-white mb-6">About</h3>
                    <div
                        className="text-gray-600 dark:text-gray-300 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: restaurant.content }}
                    />
                </div>
            )}

            {/* 3. Why Filipinos Love It & Menu Highlights */}
            <div className="space-y-8 pt-8 border-t border-gray-100 dark:border-[#2a2d3e]">
                {restaurant.why_filipinos_love_it && (
                    <div className="group">
                        <h4 className="flex items-center gap-2 font-bold text-gray-900 dark:text-white mb-3 text-[16px]">
                            <Heart className="w-5 h-5 text-[#C10007] fill-[#C10007]/10" /> Why Filipinos Love It
                        </h4>
                        <p className="text-[15px] text-gray-600 dark:text-gray-400 leading-relaxed font-normal">
                            {restaurant.why_filipinos_love_it}
                        </p>
                    </div>
                )}

                {restaurant.menu_highlights && (
                    <div className="group">
                        <h4 className="flex items-center gap-2 font-bold text-gray-900 dark:text-white mb-3 text-[16px]">
                            <ChefHat className="w-5 h-5 text-emerald-600" /> Menu Highlights
                        </h4>
                        <p className="text-[15px] text-gray-600 dark:text-gray-400 leading-relaxed font-normal">
                            {restaurant.menu_highlights}
                        </p>
                    </div>
                )}
            </div>

            {/* 4. Location Map Section */}
            <div className="bg-white dark:bg-[#1a1d2e] rounded-2xl border border-gray-100 dark:border-[#2a2d3e] p-6 md:p-8 shadow-[0px_1px_3px_rgba(0,0,0,0.05)]">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                    <h3 className="text-[18px] font-bold text-[#111827] dark:text-white flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-[#C10007]" /> Location & Directions
                    </h3>
                    {restaurant.google_maps_url && (
                        <a
                            href={restaurant.google_maps_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#C10007] text-white rounded-lg text-xs font-bold hover:bg-[#a10006] transition-colors shadow-sm"
                        >
                            <ExternalLink className="w-3.5 h-3.5" /> View on Google Maps
                        </a>
                    )}
                </div>

                <div className="w-full h-[350px] md:h-[500px] bg-gray-50 dark:bg-[#1a1d2e] rounded-xl overflow-hidden border border-gray-100 dark:border-[#2a2d3e] relative shadow-inner">
                    {(restaurant.address || restaurant.location || restaurant.google_maps_url) ? (
                        <iframe
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                            src={`https://www.google.com/maps/embed/v1/search?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(restaurant.address || restaurant.location || restaurant.title)}&zoom=15`}
                        ></iframe>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center p-6 bg-gray-50 dark:bg-[#1a1d2e]">
                            <div className="text-center">
                                <MapPin className="w-12 h-12 text-gray-300 dark:text-gray-700 mb-3 mx-auto" />
                                <p className="text-gray-500 dark:text-gray-400 mb-4 font-medium">Map Preview Unavailable</p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="mt-5 p-4 bg-gray-50 dark:bg-[#252836] rounded-xl flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#C10007] shrink-0 mt-0.5" />
                    <div className="space-y-1">
                        <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">Address</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            {restaurant.address || restaurant.location}
                        </p>
                    </div>
                </div>
            </div>

            {/* 5. Online Presence & Opening Hours Cards */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-[#1a1d2e] rounded-2xl border border-gray-100 dark:border-[#2a2d3e] p-6 shadow-sm">
                    <h3 className="text-[16px] font-bold text-[#111827] dark:text-white mb-4 flex items-center gap-2 tracking-tight">
                        <Globe className="w-4 h-4 text-blue-500" /> Online Presence
                    </h3>
                    <div className="space-y-3">
                        {restaurant.website ? (
                            <div className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-[#252836] rounded-xl">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Website</span>
                                <a href={restaurant.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold">
                                    Visit <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>
                        ) : <p className="text-sm text-gray-400 italic">No website added</p>}

                        {restaurant.social_media ? (
                            <div className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-[#252836] rounded-xl">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Social Media</span>
                                <a href={restaurant.social_media} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold">
                                    Profile <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>
                        ) : <p className="text-sm text-gray-400 italic">No social media added</p>}
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1a1d2e] rounded-2xl border border-gray-100 dark:border-[#2a2d3e] p-6 shadow-sm">
                    <h3 className="text-[16px] font-bold text-[#111827] dark:text-white mb-4 flex items-center gap-2 tracking-tight">
                        <Clock className="w-4 h-4 text-emerald-500" /> Opening Hours
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line leading-relaxed font-medium">
                        {restaurant.opening_hours || "No opening hours available"}
                    </p>
                </div>
            </div>

            {/* 6. Brand Story (The Story) & Original Source */}
            <div className="bg-white dark:bg-[#1a1d2e] rounded-2xl border border-gray-100 dark:border-[#2a2d3e] p-8 shadow-sm">
                <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6">
                    More Details
                </h3>
                <div className="space-y-8 pt-4 border-t border-gray-50 dark:border-[#2a2d3e]">
                    {restaurant.brand_story && (
                        <div className="group">
                            <h4 className="text-[12px] font-black text-gray-900 dark:text-white mb-3 uppercase tracking-widest text-[#6b7280]">THE STORY</h4>
                            <p className="text-[15px] text-gray-600 dark:text-gray-400 leading-relaxed font-normal">
                                {restaurant.brand_story}
                            </p>
                        </div>
                    )}

                    {restaurant.original_url && (
                        <div className="group pt-4 border-t border-gray-50 dark:border-[#2a2d3e]">
                            <h4 className="text-[12px] font-black text-gray-900 dark:text-white mb-3 uppercase tracking-widest text-[#6b7280]">ORIGINAL SOURCE</h4>
                            <a
                                href={restaurant.original_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[14px] text-blue-600 dark:text-blue-400 hover:underline break-all font-medium"
                            >
                                {restaurant.original_url}
                            </a>
                        </div>
                    )}

                    {(restaurant.tags || []).length > 0 && (
                        <div className="group pt-4 border-t border-gray-50 dark:border-[#2a2d3e]">
                            <h4 className="text-[12px] font-black text-gray-900 dark:text-white mb-4 uppercase tracking-widest text-[#6b7280]">FOOD TAGS</h4>
                            <div className="flex flex-wrap gap-2.5">
                                {restaurant.tags?.map((tag, i) => (
                                    <span key={i} className="px-3.5 py-1.5 bg-gray-50 dark:bg-[#252836] border border-gray-100 dark:border-[#374151] rounded-full text-xs font-bold text-gray-600 dark:text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-[#2d3142]">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
