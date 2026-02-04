"use client";

import { Search, ChevronDown } from 'lucide-react';

// Using the same structure as ArticleSettings but for Restaurants. 
// Ideally these come from a shared config or API.
const RESTAURANT_CATEGORIES = [
    "Fine Dining",
    "Casual Dining",
    "Cafe",
    "Fast Food",
    "Buffet",
    "Bar & Grill",
    "Street Food"
];

const RESTAURANT_COUNTRIES = [
    "Philippines",
    "Japan",
    "USA",
    "Italy",
    "China",
    "Korea"
];

interface RestaurantFiltersProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    categoryFilter: string;
    setCategoryFilter: (category: string) => void;
    countryFilter: string;
    setCountryFilter: (country: string) => void;
}

/**
 * RestaurantFilters component exactly matching ArticlesFilters design
 */
export default function RestaurantFilters({
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    countryFilter,
    setCountryFilter
}: RestaurantFiltersProps) {
    return (
        <div className="flex items-center gap-4 p-5 border-b border-[#e5e7eb] bg-white">
            <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search restaurants..."
                    className="w-full h-[50px] pl-12 pr-4 border border-[#d1d5db] rounded-[8px] text-[16px] text-[#111827] placeholder:text-[#adaebc] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent tracking-[-0.5px] transition-all"
                />
            </div>
            <div className="relative min-w-[159px]">
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full h-[50px] pl-3 pr-10 border border-[#d1d5db] rounded-[8px] text-[16px] text-[#111827] bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent tracking-[-0.5px] cursor-pointer"
                >
                    <option>All Category</option>
                    {RESTAURANT_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af] pointer-events-none" />
            </div>
            <div className="relative min-w-[163px]">
                <select
                    value={countryFilter}
                    onChange={(e) => setCountryFilter(e.target.value)}
                    className="w-full h-[50px] pl-3 pr-10 border border-[#d1d5db] rounded-[8px] text-[16px] text-[#111827] bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent tracking-[-0.5px] cursor-pointer"
                >
                    <option>All Countries</option>
                    {RESTAURANT_COUNTRIES.map((country) => (
                        <option key={country} value={country}>{country}</option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af] pointer-events-none" />
            </div>
        </div>
    );
}
