"use client";

import { useState } from 'react';
import { Zap, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Info } from 'lucide-react';

const SCRAPER_API_URL = process.env.NEXT_PUBLIC_RESTAURANTS_SERVICE_URL || 'http://localhost:8012';

interface ScrapeResult {
    status: string;
    message: string;
    duration_seconds: number;
    success_count: number;
    error_count?: number;
    results?: any[];
    timestamp: string;
}

export default function RestaurantManualScrapePanel() {
    const [isScraping, setIsScraping] = useState(false);
    const [result, setResult] = useState<ScrapeResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleScrape = async () => {
        setIsScraping(true);
        setResult(null);
        setError(null);
        try {
            // Create an AbortController for timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 60 * 60 * 1000); // 60 minutes timeout

            const response = await fetch(`${SCRAPER_API_URL}/trigger/restaurants`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (response.status === 409) {
                throw new Error("Restaurant scraper is already running. Please wait for it to complete.");
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || "Failed to trigger restaurant scraper");
            }

            const data = await response.json();
            setResult(data);
        } catch (err: any) {
            if (err.name === 'AbortError') {
                setError('Request timed out. The scraper may still be running in the background.');
            } else {
                setError(err.message || 'Scrape failed');
            }
        } finally {
            setIsScraping(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-semibold text-[#111827]">Manual Restaurant Scrape</h2>
                        <p className="text-sm text-[#6b7280] mt-0.5">
                            Trigger a one-time restaurant scraper run to find new restaurants.
                        </p>
                    </div>
                    <button
                        onClick={handleScrape}
                        disabled={isScraping}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#1428AE] text-white text-sm font-semibold rounded-lg hover:bg-[#000785] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isScraping ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin text-[#F4AA1D]" />
                                <span>Scraping...</span>
                            </>
                        ) : (
                            <>
                                <Zap className="w-4 h-4 text-[#F4AA1D]" />
                                <span>Run Scraper</span>
                            </>
                        )}
                    </button>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                    <div className="text-sm text-blue-800">
                        <p className="font-semibold mb-1">How it works:</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>The scraper searches for restaurant-related news articles</li>
                            <li>Articles are processed and converted into restaurant profiles</li>
                            <li>New restaurants are stored in Redis for review</li>
                            <li>You can review and publish them from the Restaurant page</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Result */}
            {result && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
                    <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                        <div className="flex-1">
                            <h3 className="font-semibold text-emerald-800 mb-2">Scrape Completed</h3>
                            <p className="text-sm text-emerald-700 mb-2">
                                {result.message || `Found ${result.success_count} restaurants in ${Math.round(result.duration_seconds)}s`}
                            </p>
                            {result.results && result.results.length > 0 && (
                                <div className="mt-3">
                                    <p className="text-xs font-semibold text-emerald-800 mb-1">Results:</p>
                                    <div className="space-y-1">
                                        {result.results.slice(0, 10).map((r, i) => (
                                            <p key={i} className="text-xs text-emerald-700">
                                                • {r.country || r.name || 'Unknown'}: {r.status === 'success' ? `${r.count || 0} found` : 'Error'}
                                            </p>
                                        ))}
                                        {result.results.length > 10 && (
                                            <p className="text-xs text-emerald-600">... and {result.results.length - 10} more</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                    <div className="flex items-start gap-3">
                        <XCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                        <div>
                            <h3 className="font-semibold text-red-800 mb-1">Scrape Failed</h3>
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
