"use client";

import axios from "axios";

const SCRAPER_API_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || "http://localhost:8001";

export interface ScraperStatusResponse {
    is_running: boolean;
    cancel_requested?: boolean;
    scheduler_enabled?: boolean;
    total_runs: number;
    total_success: number;
    total_errors: number;
    total_skipped: number;
    last_run: string | null;
    next_run: string | null;
    last_results: Array<{ country?: string; category?: string; status: string; message?: string; count?: number }>;
}

/**
 * Get current scraper job status (running, last run, last results).
 * Uses NEXT_PUBLIC_AI_SERVICE_URL (Script service, e.g. http://localhost:8001).
 */
export async function getScraperStatus(): Promise<ScraperStatusResponse> {
    const response = await axios.get<ScraperStatusResponse>(`${SCRAPER_API_URL}/status`, {
        timeout: 10000,
    });
    return response.data;
}
