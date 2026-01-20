import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrafficData } from "@/app/admin/analytics/data";

interface TrafficTrendsChartProps {
    data: TrafficData[];
}

/**
 * TrafficTrendsChart component for visualizing page views and visitors over time
 */
export default function TrafficTrendsChart({ data }: TrafficTrendsChartProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="h-[300px] w-full bg-[#f9fafb] animate-pulse rounded-lg" />;

    return (
        <div className="bg-white border border-[#f3f4f6] rounded-[12px] p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-[18px] font-bold text-[#111827] tracking-[-0.5px]">Traffic Trends</h3>
                <Calendar className="w-5 h-5 text-[#9ca3af]" />
            </div>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                            dataKey="month"
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                            stroke="#e5e7eb"
                        />
                        <YAxis
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                            stroke="#e5e7eb"
                            tickFormatter={(value) => `${value / 1000}K`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                fontSize: '14px'
                            }}
                            formatter={(value: any) => value.toLocaleString()}
                        />
                        <Legend
                            wrapperStyle={{ fontSize: '14px' }}
                            iconType="line"
                        />
                        <Line
                            type="monotone"
                            dataKey="pageViews"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            name="Page Views"
                            dot={{ fill: '#3b82f6', r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="visitors"
                            stroke="#8b5cf6"
                            strokeWidth={2}
                            name="Visitors"
                            dot={{ fill: '#8b5cf6', r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
