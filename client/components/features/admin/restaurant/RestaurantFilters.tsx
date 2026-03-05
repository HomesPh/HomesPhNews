import { Search, ChevronDown } from 'lucide-react';
import { RestaurantCategories, Countries } from "@/app/data";
import { useState, useEffect } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface FilterOption {
    name: string;
    count: number;
}

interface RestaurantFiltersProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    categoryFilter: string;
    setCategoryFilter: (category: string) => void;
    countryFilter: string;
    cityFilter: string;
    setFilters: (updates: any) => void;
    availableCategories?: FilterOption[];
    availableCountries?: FilterOption[];
}

// Dummy city data mapped by country name (same as in ArticlesFilters)
const DUMMY_CITIES: Record<string, string[]> = {
    'Philippines': ['Cebu City', 'Manila', 'Davao City', 'Makati', 'Quezon City', 'Taguig'],
    'United Arab Emirates': ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman'],
    'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth'],
    'United States': ['New York', 'Los Angeles', 'Chicago', 'Houston'],
};

/**
 * RestaurantFilters component matching ArticlesFilters design
 */
export default function RestaurantFilters({
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    countryFilter,
    cityFilter,
    setFilters,
    availableCategories = [],
    availableCountries = []
}: RestaurantFiltersProps) {
    // Get cities based on selected country
    const [cities, setCities] = useState<string[]>([]);

    useEffect(() => {
        // Find country label from country key if necessary
        const countryLabel = Countries.find(c => c.id === countryFilter)?.label || countryFilter;

        if (countryLabel && DUMMY_CITIES[countryLabel]) {
            setCities(DUMMY_CITIES[countryLabel]);
        } else {
            setCities([]);
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
                    placeholder="Search restaurants..."
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
                        {availableCategories.map((cat) => (
                            <SelectItem key={cat.name} value={cat.name}>
                                {cat.name} <span className="text-[#C10007] ml-1">({cat.count})</span>
                            </SelectItem>
                        ))}
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
                        {availableCountries.map((country) => (
                            <SelectItem key={country.name} value={country.name}>
                                {country.name} <span className="text-[#C10007] ml-1">({country.count})</span>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* City Filter - Fixed width */}
            <div className="w-[150px] flex-none">
                <Select
                    value={cityFilter || "all"}
                    onValueChange={(val) => setFilters({ city: val === "all" ? "" : val })}
                    disabled={!countryFilter || countryFilter === 'All Countries'}
                >
                    <SelectTrigger className={cn(
                        "w-full h-[48px] !h-[48px] px-4 rounded-xl text-[14px] focus:outline-none transition-all duration-200",
                        (!countryFilter || countryFilter === 'All Countries')
                            ? "bg-gray-50 border-[#e5e7eb] text-[#9ca3af] cursor-not-allowed"
                            : "bg-[#f9fafb] border-[#e5e7eb] text-[#111827] focus:ring-[#C10007]/10 focus:border-[#C10007]"
                    )}>
                        <SelectValue placeholder={(!countryFilter || countryFilter === 'All Countries') ? 'Select Country' : 'All Cities'} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">{(!countryFilter || countryFilter === 'All Countries') ? 'Select Country First' : 'All Cities'}</SelectItem>
                        {cities.map((city) => (
                            <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
