"use client";

import { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface CountryPerformance {
    country: string;
    articlesPublished: number;
    totalViews: number;
}

interface CountryPerformanceChartProps {
    data: CountryPerformance[];
}

export default function CountryPerformanceChart({ data }: CountryPerformanceChartProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="h-[400px] w-full bg-white animate-pulse rounded-2xl shadow-sm" />;

    return (
        <div className="bg-white border border-[#f3f4f6] rounded-[12px] p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-[18px] font-bold text-[#111827] tracking-[-0.5px]">Global Performance</h3>
                <Globe className="w-5 h-5 text-[#9ca3af]" />
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data} layout="vertical" margin={{ left: 10, right: 30 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                        <XAxis
                            type="number"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                            tickFormatter={(value) => value >= 1000 ? `${value / 1000}K` : value}
                            stroke="#e5e7eb"
                        />
                        <YAxis
                            dataKey="country"
                            type="category"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#111827', fontWeight: 600 }}
                            width={100}
                        />
                        <Tooltip
                            cursor={{ fill: '#f9fafb' }}
                            contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                fontSize: '14px'
                            }}
                            formatter={(value: any) => value.toLocaleString()}
                        />
                        <Bar
                            dataKey="totalViews"
                            fill="#10b981"
                            radius={[0, 4, 4, 0]}
                            barSize={18}
                            name="Total Views"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#34d399'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
