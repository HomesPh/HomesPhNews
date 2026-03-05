"use client";

import { Search, ChevronDown, MapPin, Tag, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface FilterOption {
    name: string;
    count: number;
}

interface ArticlesFiltersProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    categoryFilter: string;
    setCategoryFilter: (category: string) => void;
    countryFilter: string;
    cityFilter: string;
    setFilters: (updates: any) => void;
    availableCategories?: (string | FilterOption)[];
    availableCountries?: (string | FilterOption)[];
}

// Dummy city data mapped by country name
export const DUMMY_CITIES: Record<string, string[]> = {
    'Philippines': ['Cebu City', 'Manila', 'Davao City', 'Makati', 'Quezon City', 'Taguig'],
    'United Arab Emirates': ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman'],
    'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth'],
    'United States': ['New York', 'Los Angeles', 'Chicago', 'Houston'],
};

/**
 * Modernized ArticlesFilters component with single-line layout and premium aesthetic.
 */
export default function ArticlesFilters({
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    countryFilter,
    cityFilter,
    setFilters,
    availableCategories = [],
    availableCountries = []
}: ArticlesFiltersProps) {
    // Filter out "Restaurant" categories
    const filteredCategories = availableCategories.filter((cat) => {
        const name = typeof cat === 'string' ? cat : cat.name;
        return name.toLowerCase() !== 'restaurant' && name.toLowerCase() !== 'restaurants';
    });

    const getOptionData = (opt: string | FilterOption) => {
        if (typeof opt === 'string') return { value: opt, name: opt, count: 0 };
        return { value: opt.name, name: opt.name, count: opt.count };
    };

    // Get cities based on selected country
    const [cities, setCities] = useState<string[]>([]);

    useEffect(() => {
        if (countryFilter && DUMMY_CITIES[countryFilter]) {
            setCities(DUMMY_CITIES[countryFilter]);
        } else {
            setCities([]);
            // Only clear city if it's not already empty to prevent infinite loops
            if (cityFilter !== '') {
                setFilters({ city: '' });
            }
        }
    }, [countryFilter, cityFilter, setFilters]);

    return (
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#e5e7eb] bg-white">
            {/* Search Input - Expands to fill available space */}
            <div className="flex-1 min-w-[200px] relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9ca3af] group-focus-within:text-[#C10007] transition-colors" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title, keywords or content..."
                    className="w-full h-[48px] pl-12 pr-4 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl text-[14px] text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#C10007]/10 focus:border-[#C10007] focus:bg-white transition-all duration-200"
                />
            </div>

            {/* Category Filter - Fixed width */}
            <div className="w-[180px] flex-none">
                <Select value={categoryFilter || "all"} onValueChange={(val) => setCategoryFilter(val === "all" ? "" : val)}>
                    <SelectTrigger className="w-full h-[48px] !h-[48px] px-4 bg-[#f9fafb] border-[#e5e7eb] rounded-xl text-[14px] text-[#111827] focus:ring-[#C10007]/10 focus:border-[#C10007] transition-all">
                        <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {filteredCategories.map((cat) => {
                            const data = getOptionData(cat);
                            return (
                                <SelectItem key={data.value} value={data.value}>
                                    {data.name} <span className="text-[#C10007] ml-1">({data.count})</span>
                                </SelectItem>
                            );
                        })}
                    </SelectContent>
                </Select>
            </div>

            {/* Country Filter - Fixed width */}
            <div className="w-[170px] flex-none">
                <Select value={countryFilter || "all"} onValueChange={(val) => setFilters({ country: val === "all" ? "" : val, city: '' })}>
                    <SelectTrigger className="w-full h-[48px] !h-[48px] px-4 bg-[#f9fafb] border-[#e5e7eb] rounded-xl text-[14px] text-[#111827] focus:ring-[#C10007]/10 focus:border-[#C10007] transition-all">
                        <SelectValue placeholder="All Countries" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Countries</SelectItem>
                        {availableCountries.map((country) => {
                            const data = getOptionData(country);
                            return (
                                <SelectItem key={data.value} value={data.value}>
                                    {data.name} <span className="text-[#C10007] ml-1">({data.count})</span>
                                </SelectItem>
                            );
                        })}
                    </SelectContent>
                </Select>
            </div>

            {/* City Filter - Fixed width */}
            <div className="w-[150px] flex-none">
                <Select
                    value={cityFilter || "all"}
                    onValueChange={(val) => setFilters({ city: val === "all" ? "" : val })}
                    disabled={!countryFilter}
                >
                    <SelectTrigger className={cn(
                        "w-full h-[48px] !h-[48px] px-4 rounded-xl text-[14px] focus:outline-none transition-all duration-200",
                        !countryFilter
                            ? 'bg-gray-50 border-[#e5e7eb] text-[#9ca3af] cursor-not-allowed'
                            : 'bg-[#f9fafb] border-[#e5e7eb] text-[#111827] focus:ring-[#C10007]/10 focus:border-[#C10007]'
                    )}>
                        <SelectValue placeholder={countryFilter ? 'All Cities' : 'Select Country'} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">{countryFilter ? 'All Cities' : 'Select Country First'}</SelectItem>
                        {cities.map((city) => (
                            <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
