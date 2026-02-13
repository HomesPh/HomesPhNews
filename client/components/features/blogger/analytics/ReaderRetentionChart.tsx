"use client";

import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Info } from 'lucide-react';

interface ReaderRetentionChartProps {
    data: {
        point: string;
        percentage: number;
    }[];
}

export default function ReaderRetentionChart({ data }: ReaderRetentionChartProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="h-[300px] w-full bg-white animate-pulse rounded-2xl shadow-sm" />;

    return (
        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm h-full">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 tracking-tight">Reader Retention</h3>
                    <p className="text-sm text-gray-500 font-medium">Where readers drop off</p>
                </div>
                <div className="group relative">
                    <Info className="w-4 h-4 text-gray-400 cursor-help" />
                    <div className="absolute right-0 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        Shows the percentage of readers still reading at different scroll depths.
                    </div>
                </div>
            </div>

            <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorRetention" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#C10007" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#C10007" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="point"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                            tickFormatter={(value) => `${value}%`}
                            domain={[0, 100]}
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: '12px',
                                border: 'none',
                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                                padding: '12px'
                            }}
                            itemStyle={{ fontWeight: 600, fontSize: '12px', color: '#111827' }}
                            labelStyle={{ marginBottom: '4px', color: '#94a3b8', fontSize: '11px', fontWeight: 700 }}
                            formatter={(value: any) => [`${value}%`, 'Readers Remaining']}
                        />
                        <Area
                            type="monotone"
                            dataKey="percentage"
                            stroke="#C10007"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorRetention)"
                            activeDot={{ r: 6, strokeWidth: 0, fill: '#C10007' }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
