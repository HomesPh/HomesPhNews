"use client";

import { Search, ChevronDown } from 'lucide-react';
import { adSettings } from "@/app/admin/ads/data";

interface AdsFiltersProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    activeTab: 'all' | 'active' | 'inactive';
    setActiveTab: (tab: 'all' | 'active' | 'inactive') => void;
    counts: { all: number; active: number; inactive: number };
}

/**
 * AdsFilters component following DRY principles from the Article side
 */
export default function AdsFilters({
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    counts
}: AdsFiltersProps) {
    const tabs = [
        { id: 'all' as const, label: 'All' },
        { id: 'active' as const, label: 'Active' },
        { id: 'inactive' as const, label: 'Inactive' },
    ];

    return (
        <div className="bg-white border border-[#e5e7eb] rounded-[12px] p-6 mb-6">
            <div className="flex items-center justify-between gap-6">
                {/* Search - spans flex-1 */}
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search ads or clients..."
                        className="w-full pl-11 pr-4 py-3 border border-[#e5e7eb] rounded-[8px] text-[14px] text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#C10007] focus:border-transparent tracking-[-0.5px]"
                    />
                </div>

                {/* Status Tabs */}
                <div className="flex items-center gap-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-5 py-2.5 rounded-[8px] text-[14px] font-medium tracking-[-0.5px] transition-colors ${activeTab === tab.id
                                    ? 'bg-[#C10007] text-white'
                                    : 'bg-white text-[#6b7280] border border-[#e5e7eb] hover:bg-gray-50'
                                }`}
                        >
                            {tab.label} ({counts[tab.id]})
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
