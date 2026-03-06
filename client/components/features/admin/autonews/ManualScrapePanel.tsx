"use client";

import { useState, useEffect, useCallback } from 'react';
import { Zap, Loader2, CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { getCountries, getCategories } from '@/lib/api-v2';
import type { CountryResource, CategoryResource } from '@/lib/api-v2';
import { triggerTargetedScraper, TriggerScraperResponse } from '@/lib/api-v2/admin/service/scraperRun/triggerScraper';
import { Skeleton } from '@/components/ui/skeleton';

export default function ManualScrapePanel() {
    const [countries, setCountries] = useState<CountryResource[]>([]);
    const [categories, setCategories] = useState<CategoryResource[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedCountries, setSelectedCountries] = useState<Set<string>>(new Set());
    const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());

    const [isScraping, setIsScraping] = useState(false);
    const [result, setResult] = useState<TriggerScraperResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showResultsTable, setShowResultsTable] = useState(false);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [countriesRes, categoriesRes] = await Promise.all([getCountries(), getCategories()]);
            setCountries(countriesRes.data);
            setCategories(categoriesRes.data);
            // Pre-select active ones
            setSelectedCountries(new Set(countriesRes.data.filter(c => c.is_active).map(c => c.name)));
            setSelectedCategories(new Set(categoriesRes.data.filter(c => c.is_active).map(c => c.name)));
        } catch (err) {
            console.error("Failed to load countries/categories", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const toggleCountry = (name: string) => {
        setSelectedCountries(prev => {
            const next = new Set(prev);
            next.has(name) ? next.delete(name) : next.add(name);
            return next;
        });
    };

    const toggleCategory = (name: string) => {
        setSelectedCategories(prev => {
            const next = new Set(prev);
            next.has(name) ? next.delete(name) : next.add(name);
            return next;
        });
    };

    const selectAllCountries = () => setSelectedCountries(new Set(countries.map(c => c.name)));
    const deselectAllCountries = () => setSelectedCountries(new Set());
    const selectAllCategories = () => setSelectedCategories(new Set(categories.map(c => c.name)));
    const deselectAllCategories = () => setSelectedCategories(new Set());

    const handleScrape = async () => {
        if (selectedCountries.size === 0 || selectedCategories.size === 0) return;
        setIsScraping(true);
        setResult(null);
        setError(null);
        setShowResultsTable(false);
        try {
            const res = await triggerTargetedScraper(
                Array.from(selectedCountries),
                Array.from(selectedCategories)
            );
            setResult(res);
            setShowResultsTable(true);
        } catch (err: any) {
            setError(err.message || 'Scrape failed');
        } finally {
            setIsScraping(false);
        }
    };

    const totalCombinations = selectedCountries.size * selectedCategories.size;

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-semibold text-[#111827]">Manual Targeted Scrape</h2>
                        <p className="text-sm text-[#6b7280] mt-0.5">
                            Select specific countries and categories, then run a one-time scrape.
                        </p>
                    </div>
                    <button
                        onClick={handleScrape}
                        disabled={isScraping || selectedCountries.size === 0 || selectedCategories.size === 0}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#C10007] text-white text-sm font-semibold rounded-lg hover:bg-[#A00006] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isScraping
                            ? <Loader2 className="w-4 h-4 animate-spin" />
                            : <Zap className="w-4 h-4" />
                        }
                        {isScraping
                            ? `Scraping ${selectedCountries.size} × ${selectedCategories.size}...`
                            : totalCombinations > 0
                                ? `Scrape ${totalCombinations} combination${totalCombinations !== 1 ? 's' : ''}`
                                : 'Select countries & categories'
                        }
                    </button>
                </div>

                {/* Loading state */}
                {isScraping && (
                    <div className="mb-6 flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <Loader2 className="w-4 h-4 animate-spin text-amber-600 shrink-0" />
                        <div>
                            <p className="text-sm font-semibold text-amber-800">
                                Scraping {selectedCountries.size} countr{selectedCountries.size !== 1 ? 'ies' : 'y'} × {selectedCategories.size} categor{selectedCategories.size !== 1 ? 'ies' : 'y'} ({totalCombinations} combinations)...
                            </p>
                            <p className="text-xs text-amber-600 mt-0.5">This may take a few minutes. Please wait.</p>
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

                {/* Results summary */}
                {result && (
                    <div className="mb-6 border border-emerald-200 rounded-lg overflow-hidden">
                        <div
                            className="flex items-center justify-between px-4 py-3 bg-emerald-50 cursor-pointer"
                            onClick={() => setShowResultsTable(v => !v)}
                        >
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span className="text-sm font-semibold text-emerald-800">
                                    Scrape complete — {result.success_count} article{result.success_count !== 1 ? 's' : ''} scraped
                                    {result.error_count > 0 && `, ${result.error_count} error${result.error_count !== 1 ? 's' : ''}`}
                                    {' '}· took {Math.round(result.duration_seconds)}s
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
                                            <th className="px-4 py-2.5 text-left text-[11px] uppercase font-bold text-gray-500">Category</th>
                                            <th className="px-4 py-2.5 text-left text-[11px] uppercase font-bold text-gray-500">Status</th>
                                            <th className="px-4 py-2.5 text-left text-[11px] uppercase font-bold text-gray-500">Result</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {result.results.map((r, i) => (
                                            <tr key={i} className="hover:bg-gray-50">
                                                <td className="px-4 py-2.5 font-medium text-[#111827]">{r.country || '—'}</td>
                                                <td className="px-4 py-2.5 text-[#6b7280]">{r.category || '—'}</td>
                                                <td className="px-4 py-2.5">
                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                                                        r.status === 'success'
                                                            ? 'bg-emerald-100 text-emerald-700'
                                                            : r.status === 'error'
                                                                ? 'bg-red-100 text-red-700'
                                                                : 'bg-gray-100 text-gray-600'
                                                    }`}>
                                                        {r.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2.5 text-[#6b7280] text-xs max-w-[300px] truncate">{r.message || '—'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Selection grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Skeleton className="h-64 rounded-xl" />
                        <Skeleton className="h-64 rounded-xl" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Countries */}
                        <div className="border border-[#e5e7eb] rounded-xl overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-[#e5e7eb]">
                                <span className="text-sm font-semibold text-[#111827]">
                                    Countries <span className="text-[#C10007]">({selectedCountries.size}/{countries.length})</span>
                                </span>
                                <div className="flex gap-2">
                                    <button onClick={selectAllCountries} className="text-xs text-[#3b82f6] hover:underline">All</button>
                                    <span className="text-gray-300">|</span>
                                    <button onClick={deselectAllCountries} className="text-xs text-gray-500 hover:underline">None</button>
                                </div>
                            </div>
                            <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                                {countries.map(country => (
                                    <label
                                        key={country.id}
                                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedCountries.has(country.name)}
                                            onChange={() => toggleCountry(country.name)}
                                            className="w-4 h-4 accent-[#C10007] rounded"
                                        />
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                            <span className="text-xs font-mono font-bold text-[#C10007] w-6 shrink-0">{country.id}</span>
                                            <span className="text-sm text-[#111827] truncate">{country.name}</span>
                                        </div>
                                        <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                                            country.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                        }`}>
                                            {country.is_active ? 'On' : 'Off'}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="border border-[#e5e7eb] rounded-xl overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-[#e5e7eb]">
                                <span className="text-sm font-semibold text-[#111827]">
                                    Categories <span className="text-[#C10007]">({selectedCategories.size}/{categories.length})</span>
                                </span>
                                <div className="flex gap-2">
                                    <button onClick={selectAllCategories} className="text-xs text-[#3b82f6] hover:underline">All</button>
                                    <span className="text-gray-300">|</span>
                                    <button onClick={deselectAllCategories} className="text-xs text-gray-500 hover:underline">None</button>
                                </div>
                            </div>
                            <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                                {categories.map(category => (
                                    <label
                                        key={category.id}
                                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.has(category.name)}
                                            onChange={() => toggleCategory(category.name)}
                                            className="w-4 h-4 accent-[#C10007] rounded"
                                        />
                                        <span className="text-sm text-[#111827] flex-1">{category.name}</span>
                                        <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                                            category.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                        }`}>
                                            {category.is_active ? 'On' : 'Off'}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
