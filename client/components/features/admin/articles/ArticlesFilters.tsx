import { Search, ChevronDown, MapPin, Tag, Globe, Map as MapIcon } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { getCategories } from "@/lib/api-v2/admin/service/scraper/getCategories";
import { getCountries } from "@/lib/api-v2/admin/service/scraper/getCountries";
import { getProvinces } from "@/lib/api-v2/admin/service/scraper/getProvinces";
import { getCities } from "@/lib/api-v2/admin/service/cities/getCities";

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
    provinceFilter?: string;
    cityFilter: string;
    setFilters: (updates: any) => void;
    availableCategories?: (string | FilterOption)[];
    availableCountries?: (string | FilterOption)[];
    availableProvinces?: (string | FilterOption)[];
    availableCities?: (string | FilterOption)[];
}

/**
 * Modernized ArticlesFilters component with single-line layout and premium aesthetic.
 */
export default function ArticlesFilters({
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    countryFilter,
    provinceFilter = '',
    cityFilter,
    setFilters,
    availableCategories = [],
    availableCountries = [],
    availableProvinces = [],
    availableCities = []
}: ArticlesFiltersProps) {
    const [exhaustiveCategories, setExhaustiveCategories] = useState<string[]>([]);
    const [exhaustiveCountries, setExhaustiveCountries] = useState<{ id: string; name: string }[]>([]);
    const [exhaustiveProvinces, setExhaustiveProvinces] = useState<{ id: string; name: string; country_id: string }[]>([]);
    const [exhaustiveCities, setExhaustiveCities] = useState<{ id: string; name: string; country_id: string; province_id: string }[]>([]);

    useEffect(() => {
        getCategories().then(res => {
            if (Array.isArray(res.data)) {
                setExhaustiveCategories(res.data.map((c: any) => typeof c === 'string' ? c : c.name));
            }
        }).catch(err => console.error("ArticlesFilters: Failed to fetch categories:", err));

        getCountries().then(res => {
            const data = (res.data as any).data || res.data;
            if (Array.isArray(data)) setExhaustiveCountries(data);
        }).catch(err => console.error("ArticlesFilters: Failed to fetch countries:", err));

        getProvinces().then(res => {
            const data = (res.data as any).data || res.data;
            if (Array.isArray(data)) setExhaustiveProvinces(data);
        }).catch(err => console.error("ArticlesFilters: Failed to fetch provinces:", err));

        getCities().then(res => {
            const data = (res.data as any).data || res.data;
            if (Array.isArray(data)) setExhaustiveCities(data);
        }).catch(err => console.error("ArticlesFilters: Failed to fetch cities:", err));
    }, []);

    // Merge logic: Combine exhaustive lists with counts from availableFilters props
    const finalCategories = useMemo(() => {
        const counts = new Map<string, number>();
        availableCategories.forEach(c => {
            if (typeof c === 'string') counts.set(c, 0);
            else counts.set(c.name, c.count);
        });

        const merged = exhaustiveCategories.map(name => ({
            name,
            count: counts.get(name) || 0
        }));

        // Filter out "Restaurant" categories
        return merged.filter(cat => 
            cat.name.toLowerCase() !== 'restaurant' && cat.name.toLowerCase() !== 'restaurants'
        );
    }, [exhaustiveCategories, availableCategories]);

    const finalCountries = useMemo(() => {
        const counts = new Map<string, number>();
        availableCountries.forEach(c => {
            if (typeof c === 'string') counts.set(c, 0);
            else counts.set(c.name, c.count);
        });

        return exhaustiveCountries.map(c => ({
            name: c.name,
            count: counts.get(c.name) || 0
        }));
    }, [exhaustiveCountries, availableCountries]);

    const selectedCountryId = useMemo(() => {
        if (!countryFilter) return null;
        return exhaustiveCountries.find(c => 
            c.name.toLowerCase() === countryFilter.toLowerCase()
        )?.id || null;
    }, [countryFilter, exhaustiveCountries]);

    const finalProvinces = useMemo(() => {
        const counts = new Map<string, number>();
        availableProvinces.forEach(p => {
            if (typeof p === 'string') counts.set(p, 0);
            else counts.set(p.name, p.count);
        });

        let baseProvinces = exhaustiveProvinces;
        if (selectedCountryId) {
            baseProvinces = exhaustiveProvinces.filter(p => String(p.country_id) === String(selectedCountryId));
        } else if (!countryFilter) {
            baseProvinces = [];
        }

        return baseProvinces.map(p => ({
            name: p.name,
            count: counts.get(p.name) || 0
        })).sort((a, b) => a.name.localeCompare(b.name));
    }, [exhaustiveProvinces, availableProvinces, selectedCountryId, countryFilter]);

    const selectedProvinceId = useMemo(() => {
        if (!provinceFilter) return null;
        return exhaustiveProvinces.find(p => 
            p.name.toLowerCase() === provinceFilter.toLowerCase()
        )?.id || null;
    }, [provinceFilter, exhaustiveProvinces]);

    const finalCities = useMemo(() => {
        const counts = new Map<string, number>();
        availableCities.forEach(c => {
            if (typeof c === 'string') counts.set(c, 0);
            else counts.set(c.name, c.count);
        });

        // If a country is selected, filterCities by country_id
        let baseCities = exhaustiveCities;
        if (selectedCountryId) {
            baseCities = exhaustiveCities.filter(c => String(c.country_id) === String(selectedCountryId));
            if (selectedProvinceId) {
                baseCities = baseCities.filter(c => String(c.province_id) === String(selectedProvinceId));
            }
        } else if (!countryFilter) {
            baseCities = []; 
        }

        return baseCities.map(c => ({
            name: c.name,
            count: counts.get(c.name) || 0
        })).sort((a, b) => a.name.localeCompare(b.name));
    }, [exhaustiveCities, availableCities, selectedCountryId, selectedProvinceId, countryFilter]);

    const getOptionData = (opt: string | FilterOption) => {
        if (typeof opt === 'string') return { value: opt, name: opt, count: 0 };
        return { value: opt.name, name: opt.name, count: opt.count };
    };

    // Handle city/province filter reset when country changes
    useEffect(() => {
        if (!countryFilter) {
            if (provinceFilter !== '' || cityFilter !== '') {
                setFilters({ province: '', city: '' });
            }
        }
    }, [countryFilter, provinceFilter, cityFilter, setFilters]);

    // Handle city reset when province changes
    useEffect(() => {
        if (!provinceFilter && cityFilter !== '') {
            // Only clear city if province was cleared and city is not empty
            // (Note: we allow city selection without province if country matches, 
            // but the UI typically follows hierarchy)
        }
    }, [provinceFilter, cityFilter]);

    return (
        <div className="flex flex-wrap items-center gap-3 px-4 sm:px-5 py-3 sm:py-4 border-b border-[#e5e7eb] bg-white">
            {/* Search Input - Expands to fill available space */}
            <div className="w-full lg:flex-1 lg:min-w-[200px] relative group order-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9ca3af] group-focus-within:text-[#1428AE] transition-colors" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title, keywords or content..."
                    className="w-full h-[44px] sm:h-[48px] pl-11 sm:pl-12 pr-4 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl text-[13px] sm:text-[14px] text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#1428AE]/10 focus:border-[#1428AE] focus:bg-white transition-all duration-200"
                />
            </div>

            {/* Category Filter - Fixed width on desktop, flexible on mobile */}
            <div className="w-[calc(50%-6px)] sm:w-[180px] flex-none order-2 lg:order-2">
                <Select value={categoryFilter || "all"} onValueChange={(val) => setCategoryFilter(val === "all" ? "" : val)}>
                    <SelectTrigger className="w-full h-[44px] sm:h-[48px] px-3 sm:px-4 bg-[#f9fafb] border-[#e5e7eb] rounded-xl text-[13px] sm:text-[14px] text-[#111827] focus:ring-[#1428AE]/10 focus:border-[#1428AE] transition-all">
                        <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {finalCategories.map((cat) => {
                            const data = getOptionData(cat);
                            return (
                                <SelectItem key={data.value} value={data.value}>
                                    {data.name} <span className="text-[#1428AE] ml-1">({data.count})</span>
                                </SelectItem>
                            );
                        })}
                    </SelectContent>
                </Select>
            </div>

            {/* Country Filter - Fixed width on desktop, flexible on mobile */}
            <div className="w-[calc(50%-6px)] sm:w-[170px] flex-none order-3 lg:order-3">
                <Select value={countryFilter || "all"} onValueChange={(val) => setFilters({ country: val === "all" ? "" : val, province: '', city: '' })}>
                    <SelectTrigger className="w-full h-[44px] sm:h-[48px] px-3 sm:px-4 bg-[#f9fafb] border-[#e5e7eb] rounded-xl text-[13px] sm:text-[14px] text-[#111827] focus:ring-[#1428AE]/10 focus:border-[#1428AE] transition-all">
                        <SelectValue placeholder="All Countries" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Countries</SelectItem>
                        {finalCountries.map((country) => {
                            const data = getOptionData(country);
                            return (
                                <SelectItem key={data.value} value={data.value}>
                                    {data.name} <span className="text-[#1428AE] ml-1">({data.count})</span>
                                </SelectItem>
                            );
                        })}
                    </SelectContent>
                </Select>
            </div>

            {/* Province Filter - Fixed width on desktop, flexible on mobile */}
            <div className="w-[calc(50%-6px)] sm:w-[150px] flex-none order-4 lg:order-4 group relative">
                <MapIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af] z-10 pointer-events-none group-focus-within:text-[#1428AE] transition-colors" />
                <Select
                    value={provinceFilter || "all"}
                    onValueChange={(val) => setFilters({ province: val === "all" ? "" : val, city: '' })}
                    disabled={!countryFilter}
                >
                    <SelectTrigger className={cn(
                        "w-full h-[44px] sm:h-[48px] px-3 sm:px-4 rounded-xl text-[13px] sm:text-[14px] focus:outline-none transition-all duration-200",
                        !countryFilter
                            ? 'bg-gray-50 border-[#e5e7eb] text-[#9ca3af] cursor-not-allowed'
                            : 'bg-[#f9fafb] border-[#e5e7eb] text-[#111827] focus:ring-[#1428AE]/10 focus:border-[#1428AE]'
                    )}>
                        <SelectValue placeholder={countryFilter ? 'All Provinces' : 'Select Country'} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">{countryFilter ? 'All Provinces' : 'Select Country First'}</SelectItem>
                        {finalProvinces.map((prov) => {
                            const data = getOptionData(prov);
                            return (
                                <SelectItem key={data.value} value={data.value}>
                                    {data.name} <span className="text-[#1428AE] ml-1">({data.count})</span>
                                </SelectItem>
                            );
                        })}
                    </SelectContent>
                </Select>
            </div>

            {/* City Filter - Fixed width on desktop, flexible on mobile */}
            <div className="w-full sm:w-[150px] flex-none order-5 lg:order-5">
                <Select
                    value={cityFilter || "all"}
                    onValueChange={(val) => setFilters({ city: val === "all" ? "" : val })}
                    disabled={!countryFilter}
                >
                    <SelectTrigger className={cn(
                        "w-full h-[44px] sm:h-[48px] px-3 sm:px-4 rounded-xl text-[13px] sm:text-[14px] focus:outline-none transition-all duration-200",
                        !countryFilter
                            ? 'bg-gray-50 border-[#e5e7eb] text-[#9ca3af] cursor-not-allowed'
                            : 'bg-[#f9fafb] border-[#e5e7eb] text-[#111827] focus:ring-[#1428AE]/10 focus:border-[#1428AE]'
                    )}>
                        <SelectValue placeholder={countryFilter ? 'All Cities' : 'Select Country'} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">{countryFilter ? 'All Cities' : 'Select Country First'}</SelectItem>
                        {finalCities.map((city) => {
                            const data = getOptionData(city);
                            return (
                                <SelectItem key={data.value} value={data.value}>
                                    {data.name} <span className="text-[#1428AE] ml-1">({data.count})</span>
                                </SelectItem>
                            );
                        })}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
