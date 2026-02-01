"use client";

import { useState, useEffect } from 'react';
import { Calendar, TrendingUp as TrendingUpIcon } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TrafficData {
    month: string;
    pageViews: number;
    visitors: number;
}

interface TrafficTrendsChartProps {
    data: TrafficData[];
}

export default function TrafficTrendsChart({ data }: TrafficTrendsChartProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="h-[400px] w-full bg-white animate-pulse rounded-2xl shadow-sm" />;

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">Growth Trends</h3>
                    <p className="text-sm text-gray-500 font-medium">Daily traffic patterns and volume</p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600" />
                </div>
            </div>

            <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                            tickFormatter={(value) => value >= 1000 ? `${value / 1000}K` : value}
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: '16px',
                                border: 'none',
                                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
                                padding: '12px'
                            }}
                            itemStyle={{ fontWeight: 700, fontSize: '12px' }}
                            labelStyle={{ marginBottom: '8px', color: '#94a3b8', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="pageViews"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorViews)"
                            name="Page Views"
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                        <Area
                            type="monotone"
                            dataKey="visitors"
                            stroke="#8b5cf6"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorVisitors)"
                            name="Unique Visitors"
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-6 flex items-center justify-between pt-6 border-t border-gray-50">
                <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Page Views</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500" />
                        <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Visitors</span>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs">
                    <TrendingUpIcon className="w-3.5 h-3.5" />
                    <span>+24.5% TREND</span>
                </div>
            </div>
        </div>
    );
}
