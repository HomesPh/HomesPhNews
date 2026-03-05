"use client";

import axios from "axios";

const SCRAPER_API_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || "http://localhost:8001";

export interface ScraperResultItem {
    country?: string;
    category?: string;
    status: "success" | "error" | "skipped";
    message?: string;
    count?: number;
}

export interface TriggerScraperResponse {
    status: "completed";
    message: string;
    duration_seconds: number;
    success_count: number;
    error_count: number;
    results?: ScraperResultItem[];
    timestamp: string;
}

/**
 * Manually trigger the news scraper job (synchronous; waits for completion).
 * Uses NEXT_PUBLIC_AI_SERVICE_URL (Script service, e.g. http://localhost:8001).
 */
export async function triggerScraper(): Promise<TriggerScraperResponse> {
    const response = await axios.post<TriggerScraperResponse>(`${SCRAPER_API_URL}/trigger`, {}, {
        timeout: 60 * 60 * 1000, // 60 minutes for full crawl
        validateStatus: (status) => status === 200 || status === 409,
    });
    if (response.status === 409) {
        throw new Error("Job is already running. Please wait for it to complete.");
    }
    return response.data;
}

export interface CancelScraperResponse {
    message: string;
    cancelled: boolean;
}

/**
 * Request the running news scraper to stop. It will stop after the current batch (up to 5 countries).
 * Uses NEXT_PUBLIC_AI_SERVICE_URL (Script service).
 */
export async function stopScraper(): Promise<CancelScraperResponse> {
    const response = await axios.post<CancelScraperResponse>(`${SCRAPER_API_URL}/trigger/cancel`, {}, {
        timeout: 10000,
    });
    return response.data;
}

export interface SchedulerToggleResponse {
    message: string;
    scheduler_enabled: boolean;
}

/**
 * Turn off automatic scraper schedule (hourly + twice-daily). Manual "Run scraper now" still works.
 */
export async function setSchedulerOff(): Promise<SchedulerToggleResponse> {
    const response = await axios.post<SchedulerToggleResponse>(`${SCRAPER_API_URL}/scheduler/off`, {}, { timeout: 10000 });
    return response.data;
}

/**
 * Turn on automatic scraper schedule again.
 */
export async function setSchedulerOn(): Promise<SchedulerToggleResponse> {
    const response = await axios.post<SchedulerToggleResponse>(`${SCRAPER_API_URL}/scheduler/on`, {}, { timeout: 10000 });
    return response.data;
}
