"use client";

import { Search } from 'lucide-react';

interface SitesFiltersProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

/**
 * Premium SitesFilters component with single-line layout
 */
export default function SitesFilters({
    searchQuery,
    setSearchQuery
}: SitesFiltersProps) {
    return (
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#e5e7eb] bg-white">
            {/* Search Input - Expands to fill available space */}
            <div className="flex-1 min-w-[200px] relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9ca3af] group-focus-within:text-[#C10007] transition-colors" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search sites, domains, or contacts..."
                    className="w-full h-[48px] pl-12 pr-4 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl text-[14px] text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#C10007]/10 focus:border-[#C10007] focus:bg-white transition-all duration-200"
                />
            </div>
        </div>
    );
}

