"use client";

import { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface SourceData {
    name: string;
    value: number;
}

interface SubscriberSourceChartProps {
    data: SourceData[];
    title?: string;
    description?: string;
    compact?: boolean;
}

export default function SubscriberSourceChart({
    data,
    title = "Subscriber Source Sites",
    description = "Distribution of subscribers by their origin site",
    compact = false
}: SubscriberSourceChartProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className={`${compact ? 'h-[200px]' : 'h-[400px]'} w-full bg-white animate-pulse rounded-2xl shadow-sm`} />;
    
    // Helper to format hours from HH:mm to 12-hour format
    const formatLabel = (label: string) => {
        if (!label || !/^\d{2}:\d{2}$/.test(label)) return label;
        const [h, m] = label.split(':').map(Number);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayH = h % 12 || 12;
        return `${displayH}:${m.toString().padStart(2, '0')} ${ampm}`;
    };

    // Sort data by value descending to match the template style
    const sortedData = [...data].sort((a, b) => b.value - a.value).slice(0, 10);

    return (
        <div className={`bg-white border border-[#f3f4f6] rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] h-full ${compact ? 'p-4' : 'p-6'}`}>
            <div className={`flex items-center justify-between ${compact ? 'mb-2' : 'mb-6'}`}>
                <div>
                    <h3 className={`${compact ? 'text-[14px]' : 'text-[18px]'} font-bold text-[#111827] tracking-[-0.5px]`}>{title}</h3>
                    {!compact && <p className="text-sm text-gray-500 mt-1">{description}</p>}
                </div>
                {!compact && <Globe className="w-5 h-5 text-[#9ca3af]" />}
            </div>

            <div className={`${compact ? 'h-[200px]' : 'h-[320px]'} w-full`}>
                <ResponsiveContainer width="100%" height={compact ? 200 : 320}>
                    <BarChart data={sortedData} layout="vertical" margin={{ left: 10, right: 30, top: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                        <XAxis
                            type="number"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                            stroke="#e5e7eb"
                        />
                        <YAxis
                            dataKey="name"
                            type="category"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#111827', fontWeight: 600, dx: -15 }}
                            tickFormatter={formatLabel}
                            width={200}
                            interval={0}
                        />
                        <Tooltip
                            cursor={{ fill: '#f9fafb' }}
                            contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: 600
                            }}
                            labelFormatter={formatLabel}
                            formatter={(value: any) => [value.toLocaleString(), 'Subscribers']}
                        />
                        <Bar
                            dataKey="value"
                            fill="#10b981"
                            radius={[0, 4, 4, 0]}
                            barSize={18}
                            name="Subscribers"
                        >
                            {sortedData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#34d399'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
