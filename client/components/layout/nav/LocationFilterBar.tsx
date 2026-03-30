"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { MapPin, ChevronDown, X } from "lucide-react";
import type { ProvinceResource } from "@/lib/api-v2/types/ProvinceResource";
import type { CityResource } from "@/lib/api-v2/types/CityResource";

type Props = {
    provinces: ProvinceResource[];
};

export default function LocationFilterBar({ provinces }: Props) {
    return (
        <div className="bg-white dark:bg-[#1a1d2e] w-full border-b border-[#e5e7eb] dark:border-[#2a2d3e]">
            <Suspense fallback={<div className="h-[48px]" />}>
                <LocationFilterContent provinces={provinces} />
            </Suspense>
        </div>
    );
}

function LocationFilterContent({ provinces: provincesRaw }: Props) {
    const provinces = Array.isArray(provincesRaw) ? provincesRaw : (provincesRaw as any)?.data ?? [];
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const activeProvince = searchParams.get("province") || "";
    const activeCity = searchParams.get("city") || "";

    const [cities, setCities] = useState<CityResource[]>([]);
    const [loadingCities, setLoadingCities] = useState(false);

    // Load cities when province changes
    useEffect(() => {
        if (!activeProvince) {
            setCities([]);
            return;
        }
        const province = provinces.find(p => p.name === activeProvince);
        if (!province) return;

        setLoadingCities(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
        fetch(`${apiUrl}/v1/cities?province_id=${province.id}`)
            .then(r => r.json())
            .then(data => setCities(Array.isArray(data) ? data : data.data ?? []))
            .catch(() => setCities([]))
            .finally(() => setLoadingCities(false));
    }, [activeProvince, provinces]);

    const applyLocation = (province: string, city: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (province) {
            params.set("province", province);
        } else {
            params.delete("province");
        }

        if (city) {
            params.set("city", city);
        } else {
            params.delete("city");
        }

        // Save to cookie
        const locationValue = JSON.stringify({ province: province || undefined, city: city || undefined });
        document.cookie = `user_location=${encodeURIComponent(locationValue)}; path=/; max-age=${60 * 60 * 24 * 30}`;

        const q = params.get("q");
        const targetPath = (q || pathname.startsWith("/search")) ? "/search" : pathname;
        const queryString = params.toString() ? `?${params.toString()}` : "";
        router.push(`${targetPath}${queryString}`, { scroll: false });
    };

    const clearLocation = () => {
        applyLocation("", "");
        document.cookie = "user_location=; path=/; max-age=0";
    };

    const hasLocation = !!(activeProvince || activeCity);

    return (
        <div className="w-full max-w-[1280px] mx-auto px-4 py-2 flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1 text-[12px] font-semibold text-gray-500 dark:text-gray-400 shrink-0">
                <MapPin className="w-3.5 h-3.5" />
                Filter by location:
            </span>

            {/* Province dropdown */}
            <div className="relative">
                <select
                    value={activeProvince}
                    onChange={e => applyLocation(e.target.value, "")}
                    className="appearance-none pl-3 pr-8 py-1.5 text-[12px] font-medium rounded-md border border-gray-200 dark:border-[#2a2d3e] bg-white dark:bg-[#12141f] text-gray-700 dark:text-gray-200 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#1428AE] dark:focus:ring-[#F4AA1D]"
                >
                    <option value="">All Provinces</option>
                    {provinces.map(p => (
                        <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            </div>

            {/* City dropdown — only shown when province is selected */}
            {activeProvince && (
                <div className="relative">
                    <select
                        value={activeCity}
                        onChange={e => applyLocation(activeProvince, e.target.value)}
                        disabled={loadingCities}
                        className="appearance-none pl-3 pr-8 py-1.5 text-[12px] font-medium rounded-md border border-gray-200 dark:border-[#2a2d3e] bg-white dark:bg-[#12141f] text-gray-700 dark:text-gray-200 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#1428AE] dark:focus:ring-[#F4AA1D] disabled:opacity-50"
                    >
                        <option value="">All Cities</option>
                        {cities.map(c => (
                            <option key={c.city_id} value={c.name}>{c.name}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                </div>
            )}

            {/* Active location badge + clear */}
            {hasLocation && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#1428AE]/10 dark:bg-[#F4AA1D]/10 text-[11px] font-semibold text-[#1428AE] dark:text-[#F4AA1D]">
                    <MapPin className="w-3 h-3" />
                    <span>{[activeProvince, activeCity].filter(Boolean).join(", ")}</span>
                    <button onClick={clearLocation} className="ml-1 hover:opacity-70">
                        <X className="w-3 h-3" />
                    </button>
                </div>
            )}
        </div>
    );
}
