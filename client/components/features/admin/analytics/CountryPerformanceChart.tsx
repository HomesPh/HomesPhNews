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
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">Global Performance</h3>
                    <p className="text-sm text-gray-500 font-medium">Views by geographic location</p>
                </div>
                <div className="p-2 bg-emerald-50 rounded-lg">
                    <Globe className="w-5 h-5 text-emerald-600" />
                </div>
            </div>

            <div className="flex-grow">
                <div className="h-[320px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 30 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                            <XAxis
                                type="number"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                                tickFormatter={(value) => value >= 1000 ? `${value / 1000}K` : value}
                            />
                            <YAxis
                                dataKey="country"
                                type="category"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#1e293b', fontWeight: 700 }}
                                width={100}
                            />
                            <Tooltip
                                cursor={{ fill: '#f8fafc' }}
                                contentStyle={{
                                    borderRadius: '16px',
                                    border: 'none',
                                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                                    padding: '12px'
                                }}
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

            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-gray-50 pt-6">
                <div className="text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Top Region</p>
                    <p className="text-sm font-extrabold text-gray-900">{data[0]?.country || 'N/A'}</p>
                </div>
                <div className="text-center border-x border-gray-100 px-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Avg Views</p>
                    <p className="text-sm font-extrabold text-gray-900">
                        {data.length ? (data.reduce((acc, curr) => acc + curr.totalViews, 0) / data.length).toLocaleString(undefined, { maximumFractionDigits: 0 }) : 0}
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Coverage</p>
                    <p className="text-sm font-extrabold text-gray-900">{data.length} Countries</p>
                </div>
            </div>
        </div>
    );
}
