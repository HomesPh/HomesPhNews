'use client';

import { useAdMetrics } from "@/hooks/useAdMetrics";
import StatCard from "@/components/features/admin/shared/StatCard";
import AdMetricsFilters from "./AdMetricsFilters";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface AdMetricsOverviewProps {
  adUnitId?: number | string;
  campaignId?: number | string;
  campaignCount?: number | string;
  adUnitCount?: number | string;
}

export default function AdMetricsOverview({
  adUnitId,
  campaignId,
  campaignCount,
  adUnitCount
}: AdMetricsOverviewProps) {
  const {
    data,
    filters,
    isLoading,
    error,
    totalImpressions,
    totalClicks,
    averageCtr,
    setFilters
  } = useAdMetrics({ adUnitId, campaignId });

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-600 mb-8">
        Error loading metrics: {error}
      </div>
    );
  }

  const showCounts = campaignCount !== undefined && adUnitCount !== undefined;

  return (
    <div className="space-y-6 mb-8">
      {/* Filters */}
      <AdMetricsFilters filters={filters} onFilterChange={setFilters} />

      {/* Stats Summary */}
      <div className={cn("grid gap-6", showCounts ? "grid-cols-5" : "grid-cols-3")}>
        <StatCard
          title="Impressions"
          value={isLoading ? "" : totalImpressions.toLocaleString()}
          trend={`${filters.period} total`}
          iconName="Eye"
          iconColor="text-[#8b5cf6]"
        />
        <StatCard
          title="Clicks"
          value={isLoading ? "" : totalClicks.toLocaleString()}
          trend={`${filters.period} total`}
          iconName="MousePointerClick"
          iconColor="text-[#f59e0b]"
        />
        <StatCard
          title="CTR"
          value={isLoading ? "" : `${averageCtr.toFixed(2)}%`}
          trend="Click-through rate"
          iconName="TrendingUp"
          iconColor="text-[#10b981]"
        />
        {showCounts && (
          <>
            <StatCard
              title="Campaigns"
              value={campaignCount}
              trend="Total active"
              iconName="Target"
              iconColor="text-[#10b981]"
            />
            <StatCard
              title="Ad Units"
              value={adUnitCount}
              trend="Placements"
              iconName="LayoutTemplate"
              iconColor="text-[#3b82f6]"
            />
          </>
        )}
      </div>

      {/* Chart */}
      <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-[#111827] mb-6">Performance Over Time</h3>
        <div className="h-80 w-full">
          {isLoading ? (
            <Skeleton className="h-full w-full rounded-lg" />
          ) : data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Line
                  type="monotone"
                  dataKey="impressions"
                  name="Impressions"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 0 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
                <Line
                  type="monotone"
                  dataKey="clicks"
                  name="Clicks"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#f59e0b', strokeWidth: 0 }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full w-full flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
              No data available for the selected range
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
