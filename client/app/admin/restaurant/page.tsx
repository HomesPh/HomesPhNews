"use client";

import { useState } from 'react';
import AdminPageHeader from "@/components/features/admin/shared/AdminPageHeader";
import { Plus, Utensils, Search, Filter } from 'lucide-react';

// MOCK DATA: Use this structure for the scraper
// Ensure captured data maps to these fields: title, summary, image, category="Restaurant", topics, source, etc.
const MOCK_RESTAURANT_ARTICLES = [
    {
        id: 1,
        title: "The Ultimate Guide to Cebu's Street Food Scene",
        summary: "Experience the vibrant flavors of Cebu's best street food stalls, from pungko-pungko to tuslob buwa.",
        image: "https://images.unsplash.com/photo-1552611052-33e04de081de?q=80&w=800&auto=format&fit=crop",
        location: "Cebu City",
        category: "Restaurant",
        topics: ["Street Food", "Guide", "Local"],
        source: "Cebu Eats",
        date: "Feb 1, 2026",
        status: "published",
        views: "1.2k"
    },
    {
        id: 2,
        title: "New Michelin-Star Experience Opens in Taguig",
        summary: "A world-renowned chef brings their signature tasting menu to the heart of BGC.",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop",
        location: "Taguig",
        category: "Restaurant",
        topics: ["Fine Dining", "Michelin", "BGC"],
        source: "Manila Dining",
        date: "Jan 28, 2026",
        status: "published",
        views: "850"
    },
    {
        id: 3,
        title: "Local Farm-to-Table: Why This Davao Resto is Viral",
        summary: "Sustainability meets flavor in this trending farm-to-table concept restaurant.",
        image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=800&auto=format&fit=crop",
        location: "Davao City",
        category: "Restaurant",
        topics: ["Farm-to-Table", "Sustainable", "Viral"],
        source: "Davao Life",
        date: "Jan 30, 2026",
        status: "pending",
        views: "0"
    },
    {
        id: 4,
        title: "Top 10 Romantic Dinner Spots for Valentine's Day",
        summary: "Planning a special date? Here are the most romantic restaurants with the best views.",
        image: "https://images.unsplash.com/photo-1514362545857-3bc16549766b?q=80&w=800&auto=format&fit=crop",
        location: "Metro Manila",
        category: "Restaurant",
        topics: ["Reviews", "Date Night", "Top 10"],
        source: "Foodie Guide",
        date: "Feb 2, 2026",
        status: "draft",
        views: "0"
    },
    {
        id: 5,
        title: "Coffee Culture: The Rise of Third-Wave Cafes in Clark",
        summary: "Exploring the booming coffee scene in Pampanga and its must-visit aesthetic cafes.",
        image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=800&auto=format&fit=crop",
        location: "Clark, Pampanga",
        category: "Restaurant",
        topics: ["Coffee", "Cafe", "Lifestyle"],
        source: "Pampanga Brews",
        date: "Jan 25, 2026",
        status: "published",
        views: "3.5k"
    }
];

/**
 * RestaurantPage - For restaurant news and articles
 */
export default function RestaurantPage() {
    return (
        <div className="p-8 bg-[#f9fafb] min-h-screen">
            <AdminPageHeader
                title="Restaurant News Scraper Details"
                description="Target data structure for the restaurant news scraper (matches Public Page)"
                actionLabel="Configure Scraper"
                onAction={() => alert("Scraper Configuration")}
                actionIcon={Plus}
            />

            <div className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden shadow-sm">
                {/* Search and Filters Bar */}
                <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search articles..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C10007]/10 focus:border-[#C10007] transition-all"
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">
                            <Filter className="w-4 h-4" />
                            Filters
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {MOCK_RESTAURANT_ARTICLES.map((item) => (
                            <div key={item.id} className="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border-b-4 border-b-[#C10007]">
                                <div className="relative h-48 w-full overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 left-4 flex gap-1 flex-wrap max-w-[80%]">
                                        {item.topics.slice(0, 2).map((topic, i) => (
                                            <span key={i} className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-md text-[9px] font-black text-gray-800 uppercase tracking-wider shadow-sm">
                                                {topic}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="absolute top-4 right-4">
                                        <div className={`w-3 h-3 rounded-full ${item.status === 'published' ? 'bg-emerald-500' : 'bg-orange-500'} shadow-[0_0_10px_rgba(0,0,0,0.2)]`} />
                                    </div>
                                </div>

                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex items-center gap-2 mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        <Utensils className="w-3 h-3" />
                                        {item.location} • {item.source}
                                    </div>
                                    <h3 className="text-lg font-black text-gray-900 leading-tight mb-2 line-clamp-2 group-hover:text-[#C10007] transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed font-medium">
                                        {item.summary}
                                    </p>

                                    <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-bold text-gray-400 uppercase">Published</span>
                                            <span className="text-[11px] font-black text-gray-700">{item.date}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[9px] font-bold text-gray-400 uppercase">Traffic</span>
                                            <span className="text-[11px] font-black text-[#C10007] block">{item.views} Views</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
