"use client";

import { useState } from 'react';
import StatCard from "@/components/features/admin/dashboard/StatCard";
import AnalyticsHeader from "@/components/features/admin/analytics/AnalyticsHeader";
import AnalyticsStats from "@/components/features/admin/analytics/AnalyticsStats";
import TrafficTrendsChart from "@/components/features/admin/analytics/TrafficTrendsChart";
import CategoryDistributionChart from "@/components/features/admin/analytics/CategoryDistributionChart";
import CountryPerformanceChart from "@/components/features/admin/analytics/CountryPerformanceChart";
import PartnerPerformanceTable from "@/components/features/admin/analytics/PartnerPerformanceTable";
import {
    analyticsStats,
    trafficData,
    categoryData,
    countryData,
    partnerPerformanceData
} from "./data";

/**
 * AnalyticsPage component for the admin dashboard
 */
export default function AnalyticsPage() {
    const [dateRange, setDateRange] = useState('Last 7 Days');
    const [exportFormat, setExportFormat] = useState('CSV');

    const handleExportData = () => {
        if (exportFormat === 'CSV') {
            // Create CSV content logic
            let csv = 'Metric,Value\n';
            csv += 'Total Page Views,4.7M\n';
            csv += 'Unique Visitors,1477K\n';
            csv += 'Total Clicks,264K\n';
            csv += 'Avg Engagement,5.65%\n';
            csv += '\nCategory,Percentage\n';
            categoryData.forEach(cat => {
                csv += `${cat.name},${cat.value}%\n`;
            });

            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `analytics-${dateRange.toLowerCase().replace(/\s+/g, '-')}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);
        } else {
            alert(`${exportFormat} export would be implemented here`);
        }
    };

    return (
        <div className="p-8 bg-[#f9fafb] min-h-screen">
            <AnalyticsHeader
                dateRange={dateRange}
                setDateRange={setDateRange}
                exportFormat={exportFormat}
                setExportFormat={setExportFormat}
                onExport={handleExportData}
            />

            <AnalyticsStats stats={analyticsStats} />

            {/* Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <TrafficTrendsChart data={trafficData} />
                <CategoryDistributionChart data={categoryData} />
            </div>

            {/* Country Performance Chart */}
            <CountryPerformanceChart data={countryData} />

            {/* Partner Performance Table */}
            <PartnerPerformanceTable data={partnerPerformanceData} />
        </div>
    );
}
