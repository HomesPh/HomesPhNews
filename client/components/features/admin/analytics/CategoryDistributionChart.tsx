"use client";

import { useState, useEffect } from 'react';
import { PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { CategoryData } from "@/app/admin/analytics/data";

interface CategoryDistributionChartProps {
    data: CategoryData[];
}

/**
 * CategoryDistributionChart component for visualizing content distribution by category
 */
export default function CategoryDistributionChart({ data }: CategoryDistributionChartProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="h-[300px] w-full bg-[#f9fafb] animate-pulse rounded-lg" />;

    return (
        <div className="bg-white border border-[#f3f4f6] rounded-[12px] p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-[18px] font-bold text-[#111827] tracking-[-0.5px]">Content by Category</h3>
                <PieChartIcon className="w-5 h-5 text-[#9ca3af]" />
            </div>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            label={({ name, value }: any) => `${name} ${value}%`}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                fontSize: '14px'
                            }}
                            formatter={(value: any) => `${value}%`}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
