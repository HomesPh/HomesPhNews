"use client";

import { useState, useEffect, useMemo } from 'react';
import { Zap, Loader2, CheckCircle, XCircle, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { getCountries, type CountryResource } from '@/lib/api-v2';
import {
    triggerTargetedRestaurantScraper,
    getRestaurantScraperLocations,
    type RestaurantTriggerScraperResponse,
    type ScraperLocation,
    type LocationPair,
} from '@/lib/api-v2/admin/service/restaurant';
import { Skeleton } from '@/components/ui/skeleton';

const locationKey = (country: string, city: string) => `${country}|${city}`;

export default function RestaurantTargetedManualScrapePanel() {
    const [countries, setCountries] = useState<CountryResource[]>([]);
    const [locations, setLocations] = useState<ScraperLocation[]>([]);
    const [selectedCountries, setSelectedCountries] = useState<Set<string>>(new Set());
    /** Set of "country|city" so each city is scoped to that country. */
    const [selectedCityPairs, setSelectedCityPairs] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);

    const [isScraping, setIsScraping] = useState(false);
    const [result, setResult] = useState<RestaurantTriggerScraperResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showResultsTable, setShowResultsTable] = useState(false);

    const citiesByCountry = useMemo(() => {
        const map = new Map<string, string[]>();
        for (const loc of locations) {
            const country = (loc.country_name || "").trim();
            const city = (loc.city_name || "").trim();
            if (!city) continue;
            if (!map.has(country)) map.set(country, []);
            const arr = map.get(country)!;
            if (!arr.includes(city)) arr.push(city);
        }
        return map;
    }, [locations]);

    // Only show cities for the currently selected countries
    const visibleCitiesByCountry = useMemo(() => {
        const map = new Map<string, string[]>();
        citiesByCountry.forEach((cityList, countryName) => {
            if (selectedCountries.size === 0) return;
            if (selectedCountries.has(countryName)) {
                map.set(countryName, cityList);
            }
        });
        return map;
    }, [citiesByCountry, selectedCountries]);

    const allLocationKeys = useMemo(() => {
        const keys: string[] = [];
        visibleCitiesByCountry.forEach((cityList, countryName) =>
            cityList.forEach((cityName) => keys.push(locationKey(countryName, cityName)))
        );
        return keys;
    }, [visibleCitiesByCountry]);

    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const [countriesRes, locs] = await Promise.all([
                    getCountries(),
                    getRestaurantScraperLocations(),
                ]);
                setCountries(countriesRes.data);
                setLocations(locs);
                setSelectedCountries(new Set(countriesRes.data.filter((c) => c.is_active).map((c) => c.name)));
            } catch (e) {
                console.error("Failed to load countries/locations for restaurant scraper", e);
                setError("Failed to load countries or locations.");
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, []);

    const toggleCountry = (name: string) => {
        setSelectedCountries((prev) => {
            const next = new Set(prev);
            if (next.has(name)) {
                // Turning a country off also clears its city selections
                next.delete(name);
                setSelectedCityPairs((prevPairs) => {
                    const updated = new Set<string>();
                    prevPairs.forEach((key) => {
                        if (!key.startsWith(`${name}|`)) {
                            updated.add(key);
                        }
                    });
                    return updated;
                });
            } else {
                next.add(name);
            }
            return next;
        });
    };

    const toggleCity = (countryName: string, cityName: string) => {
        const key = locationKey(countryName, cityName);
        setSelectedCityPairs((prev) => {
            const next = new Set(prev);
            next.has(key) ? next.delete(key) : next.add(key);
            return next;
        });
    };

    const selectAllCountries = () => setSelectedCountries(new Set(countries.map((c) => c.name)));
    const deselectAllCountries = () => {
        setSelectedCountries(new Set());
        setSelectedCityPairs(new Set());
    };
    const selectAllCities = () => setSelectedCityPairs(new Set(allLocationKeys));
    const deselectAllCities = () => setSelectedCityPairs(new Set());

    const hasSelection = selectedCountries.size > 0;

    const buildLocationPairs = (): LocationPair[] => {
        const pairs: LocationPair[] = [];
        const seen = new Set<string>();

        // Map of country -> set of explicitly selected cities
        const selectedCitiesByCountry = new Map<string, Set<string>>();
        selectedCityPairs.forEach((key) => {
            const [country, city] = key.split("|");
            if (!country && !city) return;
            if (!selectedCitiesByCountry.has(country)) {
                selectedCitiesByCountry.set(country, new Set());
            }
            selectedCitiesByCountry.get(country)!.add(city);
        });

        for (const loc of locations) {
            const country = (loc.country_name || "").trim();
            const city = (loc.city_name || "").trim();
            if (!country && !city) continue;
            if (!selectedCountries.has(country)) continue;

            const citySet = selectedCitiesByCountry.get(country);
            if (citySet && citySet.size > 0 && !citySet.has(city)) {
                continue;
            }

            const key = locationKey(country, city);
            if (!seen.has(key)) {
                seen.add(key);
                pairs.push({ country_name: country, city_name: city });
            }
        }
        return pairs;
    };

    const handleScrape = async () => {
        if (!hasSelection) return;
        const locationPairs = buildLocationPairs();
        if (locationPairs.length === 0) return;
        setIsScraping(true);
        setResult(null);
        setError(null);
        setShowResultsTable(false);
        try {
            const res = await triggerTargetedRestaurantScraper([], [], locationPairs);
            setResult(res);
            setShowResultsTable(true);
        } catch (err: any) {
            setError(err.message || "Scrape failed");
        } finally {
            setIsScraping(false);
        }
    };

    const totalCombinations = buildLocationPairs().length;

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-semibold text-[#111827]">Manual Targeted Scrape</h2>
                        <p className="text-sm text-[#6b7280] mt-0.5">
                            Select specific countries and cities, then run a one-time scrape.
                        </p>
                    </div>
                    <button
                        onClick={handleScrape}
                        disabled={isScraping || !hasSelection}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#1428AE] text-white text-sm font-semibold rounded-lg hover:bg-[#000785] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isScraping
                            ? <Loader2 className="w-4 h-4 animate-spin" />
                            : <Zap className="w-4 h-4" />
                        }
                        {isScraping
                            ? `Scraping ${selectedCountries.size} locations...`
                            : totalCombinations > 0
                                ? `Scrape ${totalCombinations} location${totalCombinations !== 1 ? 's' : ''}`
                                : 'Select countries'
                        }
                    </button>
                </div>

                {/* Loading state */}
                {isScraping && (
                    <div className="mb-6 flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <Loader2 className="w-4 h-4 animate-spin text-amber-600 shrink-0" />
                        <div>
                            <p className="text-sm font-semibold text-amber-800">
                                Scraping {totalCombinations} restaurant location{totalCombinations !== 1 ? 's' : ''}...
                            </p>
                            <p className="text-xs text-amber-600 mt-0.5">This may take a few minutes. Please wait.</p>
                        </div>
                    </div>
                )}

                {/* Info box (optional, aligned with autonews design which usually doesn't have it, but useful here) */}
                {!isScraping && !result && !error && (
                    <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                        <div className="text-sm text-blue-800">
                            <p className="font-semibold mb-1">How it works:</p>
                            <p>Pick countries to scrape all their cities, or drill down to select specific cities. Selected combinations will be scraped once.</p>
                        </div>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="mb-6 flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
                        <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                {/* Results summary (re-using autonews table style) */}
                {result && (
                    <div className="mb-6 border border-emerald-200 rounded-lg overflow-hidden">
                        <div
                            className="flex items-center justify-between px-4 py-3 bg-emerald-50 cursor-pointer"
                            onClick={() => setShowResultsTable(v => !v)}
                        >
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span className="text-sm font-semibold text-emerald-800">
                                    Scrape complete — {result.results?.length || 0} locations processed
                                    {' '}· took {Math.round(result.duration_seconds || 0)}s
                                </span>
                            </div>
                            {showResultsTable
                                ? <ChevronUp className="w-4 h-4 text-emerald-600" />
                                : <ChevronDown className="w-4 h-4 text-emerald-600" />
                            }
                        </div>
                        {showResultsTable && result.results && result.results.length > 0 && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 border-b border-[#e5e7eb]">
                                        <tr>
                                            <th className="px-4 py-2.5 text-left text-[11px] uppercase font-bold text-gray-500">Country</th>
                                            <th className="px-4 py-2.5 text-left text-[11px] uppercase font-bold text-gray-500">City</th>
                                            <th className="px-4 py-2.5 text-left text-[11px] uppercase font-bold text-gray-500">Status</th>
                                            <th className="px-4 py-2.5 text-left text-[11px] uppercase font-bold text-gray-500">Result</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {result.results.map((r, i) => (
                                            <tr key={i} className="hover:bg-gray-50">
                                                <td className="px-4 py-2.5 font-medium text-[#111827]">{r.country_name || '—'}</td>
                                                <td className="px-4 py-2.5 text-[#6b7280]">{r.city_name || '—'}</td>
                                                <td className="px-4 py-2.5">
                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold uppercase ${r.status === 'success'
                                                        ? 'bg-emerald-100 text-emerald-700'
                                                        : r.status === 'error'
                                                            ? 'bg-red-100 text-red-700'
                                                            : 'bg-gray-100 text-gray-600'
                                                        }`}>
                                                        {r.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2.5 text-[#6b7280] text-xs">
                                                    {r.status === 'success' ? `${r.saved || 0} saved, ${r.skipped_duplicate || 0} skipped` : r.error || r.status}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Selection grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Countries */}
                    <div className="border border-[#e5e7eb] rounded-xl overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-[#e5e7eb]">
                            <span className="text-sm font-semibold text-[#111827]">
                                Countries <span className="text-[#1428AE]">({selectedCountries.size}/{countries.length})</span>
                            </span>
                            <div className="flex gap-2">
                                <button onClick={selectAllCountries} className="text-xs text-[#3b82f6] hover:underline">All</button>
                                <span className="text-gray-300">|</span>
                                <button onClick={deselectAllCountries} className="text-xs text-gray-500 hover:underline">None</button>
                            </div>
                        </div>
                        <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                            {isLoading ? (
                                Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)
                            ) : (
                                countries.map(country => (
                                    <label
                                        key={country.id}
                                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedCountries.has(country.name)}
                                            onChange={() => toggleCountry(country.name)}
                                            className="w-4 h-4 accent-[#1428AE] rounded"
                                        />
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                            <span className="text-xs font-mono font-bold text-[#1428AE] w-6 shrink-0">{country.id}</span>
                                            <span className="text-sm text-[#111827] truncate">{country.name}</span>
                                        </div>
                                        <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${country.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                            }`}>
                                            {country.is_active ? 'On' : 'Off'}
                                        </span>
                                    </label>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Cities (Cities per country) */}
                    <div className="border border-[#e5e7eb] rounded-xl overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-[#e5e7eb]">
                            <span className="text-sm font-semibold text-[#111827]">
                                Cities (per country) <span className="text-[#1428AE]">({selectedCityPairs.size}/{allLocationKeys.length})</span>
                            </span>
                            <div className="flex gap-2">
                                <button onClick={selectAllCities} className="text-xs text-[#3b82f6] hover:underline">All</button>
                                <span className="text-gray-300">|</span>
                                <button onClick={deselectAllCities} className="text-xs text-gray-500 hover:underline">None</button>
                            </div>
                        </div>
                        <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                            {isLoading ? (
                                Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)
                            ) : selectedCountries.size === 0 ? (
                                <div className="px-4 py-10 text-center text-sm text-[#6b7280]">
                                    Select a country to view cities
                                </div>
                            ) : allLocationKeys.length === 0 ? (
                                <div className="px-4 py-10 text-center text-sm text-[#6b7280]">
                                    No cities found for selected countries
                                </div>
                            ) : (
                                Array.from(visibleCitiesByCountry.entries())
                                    .sort(([a], [b]) => a.localeCompare(b))
                                    .map(([countryName, cityList]) => (
                                        <div key={countryName} className="divide-y divide-gray-50">
                                            <div className="px-4 py-1.5 text-[10px] font-bold uppercase text-[#1428AE] bg-blue-50/50 sticky top-0">
                                                {countryName}
                                            </div>
                                            {cityList.sort().map((cityName) => (
                                                <label
                                                    key={locationKey(countryName, cityName)}
                                                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedCityPairs.has(locationKey(countryName, cityName))}
                                                        onChange={() => toggleCity(countryName, cityName)}
                                                        className="w-4 h-4 accent-[#1428AE] rounded"
                                                    />
                                                    <span className="text-sm text-[#111827]">{cityName}</span>
                                                </label>
                                            ))}
                                        </div>
                                    ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
