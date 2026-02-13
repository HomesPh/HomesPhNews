"use client";

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SubscriptionMetric {
    title: string;
    value: string | number;
    trend: number;
    trendLabel?: string;
    color: 'blue' | 'green' | 'default';
}

const mockMetrics: SubscriptionMetric[] = [
    {
        title: "Subscriptions Growth in Last Day",
        value: "0",
        trend: 0.00,
        color: 'blue'
    },
    {
        title: "Cumulative Subscriptions",
        value: "100.34K",
        trend: 0.00,
        color: 'green'
    },
    {
        title: "Average Subscriptions",
        value: "144",
        trend: 0.00,
        trendLabel: "Than last period",
        color: 'blue'
    }
];

const mockTrendData = [
    { name: 'Mon', thisWeek: 90, weekOnWeek: 85 },
    { name: 'Tue', thisWeek: 92, weekOnWeek: 88 },
    { name: 'Wed', thisWeek: 95, weekOnWeek: 90 },
    { name: 'Thu', thisWeek: 94, weekOnWeek: 92 },
    { name: 'Fri', thisWeek: 98, weekOnWeek: 95 },
    { name: 'Sat', thisWeek: 100, weekOnWeek: 98 },
    { name: 'Sun', thisWeek: 102, weekOnWeek: 100 },
];


export default function SubscriptionGrowth() {
    return (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="mb-1 text-lg font-bold text-gray-900">Cumulative Subscriptions Trends</h3>
                    <p className="text-sm text-gray-600">Week-over-week comparison</p>
                </div>
                <div className="text-sm text-red-600 font-medium cursor-pointer hover:underline">THIS WEEK →</div>
            </div>
            <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockTrendData}>
                        <defs>
                            <linearGradient id="colorThisWeek" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#DC2626" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                        <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'white',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px'
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="thisWeek"
                            stroke="#DC2626"
                            strokeWidth={2}
                            fill="url(#colorThisWeek)"
                            name="This Week"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
