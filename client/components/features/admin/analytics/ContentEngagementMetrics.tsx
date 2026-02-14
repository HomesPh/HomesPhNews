"use client";

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface Metric {
    metric: string;
    average: string;
    median: string;
    top10: string;
}

const mockMetrics: Metric[] = [
    { metric: "Read Time", average: "3m 45s", median: "3m 12s", top10: "8m 20s" },
    { metric: "Scroll Depth", average: "65%", median: "60%", top10: "85%" },
    { metric: "Shares", average: "12", median: "5", top10: "45" },
    { metric: "Return Rate", average: "22%", median: "15%", top10: "40%" },
];

export default function ContentEngagementMetrics() {
    return (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="mb-4">
                <h3 className="mb-1 text-[18px] font-bold text-[#111827] tracking-[-0.5px]">Content Engagement Metrics</h3>
                <p className="text-sm text-gray-600">Average engagement indicators</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {mockMetrics.map((metric) => (
                    <div key={metric.metric} className="p-4 border border-gray-200 rounded-lg">
                        <div className="text-sm font-medium text-gray-600 mb-2">{metric.metric}</div>
                        <div className="space-y-1">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">Average</span>
                                <span className="text-sm font-bold">{metric.average}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">Median</span>
                                <span className="text-sm font-medium">{metric.median}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">Top 10%</span>
                                <span className="text-sm font-medium text-green-600">{metric.top10}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
