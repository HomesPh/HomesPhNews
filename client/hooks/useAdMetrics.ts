'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { getAdMetrics, getAdUnitMetrics, getCampaignMetrics } from '@/lib/api-v2/admin/service/ads/getAdMetrics';
import { AdMetricData, AdMetricFilters, AdMetricResponse } from '@/lib/api-v2/types/AdMetric';

// ============================================================
// Types
// ============================================================

interface UseAdMetricsConfig {
  initialFilters?: AdMetricFilters;
  adUnitId?: number | string;
  campaignId?: number | string;
  autoFetch?: boolean;
}

interface UseAdMetricsReturn {
  // State
  data: AdMetricData[];
  filters: AdMetricFilters;
  isLoading: boolean;
  error: string | null;
  totalImpressions: number;
  totalClicks: number;
  averageCtr: number;

  // Actions
  fetchMetrics: (newFilters?: Partial<AdMetricFilters>) => Promise<void>;
  setFilters: (filters: Partial<AdMetricFilters>) => void;
  resetFilters: () => void;
}

// ============================================================
// Hook Implementation
// ============================================================

/**
 * Hook for managing ad metrics with filtering and aggregation.
 */
export function useAdMetrics(config: UseAdMetricsConfig = {}): UseAdMetricsReturn {
  const { initialFilters, adUnitId, campaignId, autoFetch = true } = config;

  // ----------------------
  // State
  // ----------------------
  const [data, setData] = useState<AdMetricData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<AdMetricFilters>({
    period: 'daily',
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
    group_by: 'date',
    ...initialFilters
  });

  // ----------------------
  // Derived State
  // ----------------------
  const stats = useMemo(() => {
    let totalImpressions = 0;
    let totalClicks = 0;

    data.forEach(item => {
      totalImpressions += Number(item.impressions || 0);
      totalClicks += Number(item.clicks || 0);
    });

    const averageCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

    return { totalImpressions, totalClicks, averageCtr };
  }, [data]);

  // ----------------------
  // Actions
  // ----------------------
  const fetchMetrics = useCallback(async (overrides: Partial<AdMetricFilters> = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const activeFilters = { ...filters, ...overrides };
      let response: AdMetricResponse;

      if (adUnitId) {
        response = await getAdUnitMetrics(adUnitId, activeFilters);
      } else if (campaignId) {
        response = await getCampaignMetrics(campaignId, activeFilters);
      } else {
        response = await getAdMetrics(activeFilters);
      }

      setData(response.analytics.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch metrics');
    } finally {
      setIsLoading(false);
    }
  }, [filters, adUnitId, campaignId]);

  const setFilters = useCallback((newFilters: Partial<AdMetricFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState({
      period: 'daily',
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      to: new Date().toISOString().split('T')[0],
      group_by: 'date'
    });
  }, []);

  // ----------------------
  // Effects
  // ----------------------
  useEffect(() => {
    if (autoFetch) {
      fetchMetrics();
    }
  }, [filters.period, filters.from, filters.to, filters.group_by, autoFetch, fetchMetrics]);

  // ----------------------
  // Return
  // ----------------------
  return {
    data,
    filters,
    isLoading,
    error,
    ...stats,
    fetchMetrics,
    setFilters,
    resetFilters,
  };
}
