"use client";

import { useState, useEffect } from 'react';
import { PieChart as PieChartIcon, Layers } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface CategoryData {
    name: string;
    value: number;
    color: string;
    [key: string]: any; // Recharts requires an index signature
}

interface CategoryDistributionChartProps {
    data: CategoryData[];
}

export default function CategoryDistributionChart({ data }: CategoryDistributionChartProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="h-[400px] w-full bg-white animate-pulse rounded-2xl shadow-sm" />;

    const total = data.reduce((acc, curr) => acc + curr.value, 0);

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">Content Mix</h3>
                    <p className="text-sm text-gray-500 font-medium">Distribution by category</p>
                </div>
                <div className="p-2 bg-purple-50 rounded-lg">
                    <Layers className="w-5 h-5 text-purple-600" />
                </div>
            </div>

            <div className="relative flex-grow flex items-center justify-center">
                <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    borderRadius: '16px',
                                    border: 'none',
                                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                                    padding: '12px'
                                }}
                                formatter={(value: any) => [`${value} articles`, 'Volume']}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-10">
                    <span className="text-3xl font-extrabold text-gray-900">{total}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Articles</span>
                </div>
            </div>

            {/* Premium Legend */}
            <div className="mt-8 grid grid-cols-2 gap-3 pb-2">
                {data.slice(0, 6).map((entry, index) => (
                    <div key={index} className="flex items-center gap-2 group cursor-default">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-tight truncate group-hover:text-gray-900 transition-colors">
                            {entry.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
