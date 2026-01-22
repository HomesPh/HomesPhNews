"use client";

import { useState } from 'react';
import StatCard from "@/components/features/admin/shared/StatCard";
import AdminPageHeader from "@/components/features/admin/shared/AdminPageHeader";
import { ChevronDown, Download } from 'lucide-react';
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
            <AdminPageHeader
                title="Analytics Dashboard"
                description="Track performance metrics and insights across all platforms"
            >
                <div className="flex items-center gap-4">
                    {/* Date Range Filter */}
                    <div className="relative">
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="appearance-none px-4 pr-10 h-[50px] border border-[#d1d5db] rounded-[8px] text-[16px] text-black bg-white focus:outline-none focus:ring-2 focus:ring-[#C10007] focus:border-transparent tracking-[-0.5px] cursor-pointer"
                        >
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                            <option>Last 3 Months</option>
                            <option>Last 6 Months</option>
                            <option>Last Year</option>
                            <option>Custom Range</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af] pointer-events-none" />
                    </div>

                    {/* Export Format Filter */}
                    <div className="relative">
                        <select
                            value={exportFormat}
                            onChange={(e) => setExportFormat(e.target.value)}
                            className="appearance-none px-4 pr-10 h-[50px] border border-[#d1d5db] rounded-[8px] text-[16px] text-black bg-white focus:outline-none focus:ring-2 focus:ring-[#C10007] focus:border-transparent tracking-[-0.5px] cursor-pointer"
                        >
                            <option>CSV</option>
                            <option>PDF</option>
                            <option>Excel</option>
                            <option>JSON</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af] pointer-events-none" />
                    </div>

                    {/* Export Data Button */}
                    <button
                        onClick={handleExportData}
                        className="flex items-center gap-2 px-5 h-[50px] bg-[#C10007] text-white rounded-[6px] hover:bg-[#a10006] transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        <span className="text-[16px] font-medium tracking-[-0.5px]">Export Data</span>
                    </button>
                </div>
            </AdminPageHeader>

            {/* Analytics Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {analyticsStats.map((stat, index) => (
                    <StatCard
                        key={index}
                        {...stat}
                    />
                ))}
            </div>

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
