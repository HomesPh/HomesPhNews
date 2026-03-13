"use client";

import { useState, useEffect, useRef } from 'react';
import { Play, Square, Power, PowerOff, Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';

interface RestaurantScraperStatus {
    is_running: boolean;
    last_run?: string;
    scheduler_enabled: boolean;
    next_run?: string;
    total_runs: number;
    total_success: number;
    total_errors: number;
    cancel_requested?: boolean;
}

interface RestaurantScraperResponse {
    status: string;
    message: string;
    duration_seconds: number;
    success_count: number;
    error_count?: number;
    results?: any[];
    timestamp: string;
}

const SCRAPER_API_URL = process.env.NEXT_PUBLIC_RESTAURANTS_SERVICE_URL || 'http://localhost:8012';

export default function RestaurantScraperControlPanel() {
    const [status, setStatus] = useState<RestaurantScraperStatus | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [isStoppingJob, setIsStoppingJob] = useState(false);
    const [isTogglingScheduler, setIsTogglingScheduler] = useState(false);
    const [lastRunResult, setLastRunResult] = useState<RestaurantScraperResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const runRef = useRef(false);

    const fetchStatus = async () => {
        try {
            const response = await fetch(`${SCRAPER_API_URL}/status/restaurants`);
            if (response.ok) {
                const s = await response.json();
                setStatus(s);
            }
        } catch {
            // Restaurant service may be offline — ignore
        }
    };

    useEffect(() => {
        fetchStatus();
    }, []);

    const handleRun = async () => {
        if (runRef.current) return;
        runRef.current = true;
        setIsRunning(true);
        setLastRunResult(null);
        setError(null);
        try {
            const response = await fetch(`${SCRAPER_API_URL}/trigger/restaurants`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.status === 409) {
                throw new Error("Job is already running. Please wait for it to complete.");
            }
            const result = await response.json();
            setLastRunResult(result);
            await fetchStatus();
        } catch (err: any) {
            setError(err.message || 'Failed to run scraper');
        } finally {
            setIsRunning(false);
            runRef.current = false;
        }
    };

    const handleStop = async () => {
        setIsStoppingJob(true);
        try {
            await fetch(`${SCRAPER_API_URL}/trigger/cancel`, { method: 'POST' });
            await fetchStatus();
        } catch (err: any) {
            setError(err.message || 'Failed to stop scraper');
        } finally {
            setIsStoppingJob(false);
        }
    };

    const handleToggleScheduler = async () => {
        if (!status) return;
        setIsTogglingScheduler(true);
        setError(null);
        try {
            const endpoint = status.scheduler_enabled ? '/scheduler/off' : '/scheduler/on';
            const response = await fetch(`${SCRAPER_API_URL}${endpoint}`, { method: 'POST' });
            const res = await response.json();
            setStatus(prev => prev ? { ...prev, scheduler_enabled: res.scheduler_enabled } : prev);
        } catch (err: any) {
            setError(err.message || 'Failed to toggle scheduler');
        } finally {
            setIsTogglingScheduler(false);
        }
    };

    const schedulerOn = status?.scheduler_enabled ?? false;
    const jobRunning = status?.is_running || isRunning;

    return (
        <div className="mb-6 bg-white border border-[#e5e7eb] rounded-2xl shadow-[0px_1px_3px_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#f3f4f6]">
                <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${jobRunning ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
                    <span className="text-[14px] font-bold text-[#111827]">Restaurant Scraper</span>
                    <span className="text-[12px] text-[#6b7280]">
                        {jobRunning
                            ? isRunning ? 'Running...' : `Running${status?.cancel_requested ? ' (stopping after batch)' : ''}`
                            : status?.last_run
                                ? `Last run: ${new Date(status.last_run).toLocaleString('en-PH', { dateStyle: 'short', timeStyle: 'short' })}`
                                : 'Never run'}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    {/* Scheduler toggle */}
                    <button
                        type="button"
                        onClick={handleToggleScheduler}
                        disabled={isTogglingScheduler || status === null}
                        title={schedulerOn ? 'Turn off auto-schedule' : 'Turn on auto-schedule'}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${schedulerOn
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                            }`}
                    >
                        {isTogglingScheduler
                            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            : schedulerOn
                                ? <Power className="w-3.5 h-3.5" />
                                : <PowerOff className="w-3.5 h-3.5" />
                        }
                        Schedule {schedulerOn ? 'ON' : 'OFF'}
                    </button>

                    {/* Run / Stop */}
                    {jobRunning ? (
                        <button
                            type="button"
                            onClick={handleStop}
                            disabled={isStoppingJob || status?.cancel_requested}
                            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[12px] font-semibold bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isStoppingJob
                                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                : <Square className="w-3.5 h-3.5 fill-red-600" />
                            }
                            {status?.cancel_requested ? 'Stopping...' : 'Stop'}
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleRun}
                            disabled={isRunning}
                            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[12px] font-semibold bg-[#1428AE] text-white hover:bg-[#000785] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                            {isRunning
                                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                : <Play className="w-3.5 h-3.5 fill-white" />
                            }
                            {isRunning ? 'Running...' : 'Run Now'}
                        </button>
                    )}
                </div>
            </div>

            {/* Run result */}
            {lastRunResult && (
                <div className="px-5 py-3 bg-emerald-50 border-b border-emerald-100 flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                        <p className="text-[13px] font-semibold text-emerald-800">
                            Crawl complete — {lastRunResult.success_count} restaurants scraped
                            {lastRunResult.error_count && lastRunResult.error_count > 0 && `, ${lastRunResult.error_count} errors`}
                            {' '}in {Math.round(lastRunResult.duration_seconds)}s
                        </p>
                        {lastRunResult.results && lastRunResult.results.length > 0 && (
                            <p className="text-[12px] text-emerald-700 mt-0.5">
                                {lastRunResult.results
                                    .filter(r => r.status === 'success' && r.count)
                                    .slice(0, 5)
                                    .map(r => `${r.country || r.name} (${r.count})`)
                                    .join(', ')}
                                {lastRunResult.results.filter(r => r.status === 'success').length > 5 && ' ...'}
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="px-5 py-3 bg-red-50 border-b border-red-100 flex items-center gap-3">
                    <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <p className="text-[13px] text-red-700">{error}</p>
                </div>
            )}

            {/* Stats row */}
            {status && (
                <div className="px-5 py-2.5 flex items-center gap-6">
                    <span className="text-[12px] text-[#6b7280] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Next: {status.next_run ? new Date(status.next_run).toLocaleString('en-PH', { dateStyle: 'short', timeStyle: 'short' }) : '—'}
                    </span>
                    <span className="text-[12px] text-[#6b7280]">Total runs: {status.total_runs}</span>
                    <span className="text-[12px] text-emerald-600">✓ {status.total_success} success</span>
                    {status.total_errors > 0 && (
                        <span className="text-[12px] text-red-500">✗ {status.total_errors} errors</span>
                    )}
                </div>
            )}
        </div>
    );
}
