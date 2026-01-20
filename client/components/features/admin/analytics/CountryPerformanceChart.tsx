import { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CountryPerformance } from "@/app/admin/analytics/data";

interface CountryPerformanceChartProps {
    data: CountryPerformance[];
}

/**
 * CountryPerformanceChart component for visualizing article performance by country
 */
export default function CountryPerformanceChart({ data }: CountryPerformanceChartProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="h-[300px] w-full bg-[#f9fafb] animate-pulse rounded-lg" />;

    return (
        <div className="bg-white border border-[#f3f4f6] rounded-[12px] p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] mb-8">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-[18px] font-bold text-[#111827] tracking-[-0.5px]">Performance by Country</h3>
                <Globe className="w-5 h-5 text-[#9ca3af]" />
            </div>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                            dataKey="country"
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                            stroke="#e5e7eb"
                        />
                        <YAxis
                            yAxisId="left"
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                            stroke="#e5e7eb"
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                            stroke="#e5e7eb"
                            tickFormatter={(value: number) => `${value / 1000000}M`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                fontSize: '14px'
                            }}
                            formatter={(value: any, name: string | undefined) => {
                                if (name === 'Total Views') {
                                    return value.toLocaleString();
                                }
                                return value;
                            }}
                        />
                        <Legend
                            wrapperStyle={{ fontSize: '14px' }}
                        />
                        <Bar
                            yAxisId="left"
                            dataKey="articlesPublished"
                            fill="#3b82f6"
                            name="Articles Published"
                            radius={[4, 4, 0, 0]}
                        />
                        <Bar
                            yAxisId="right"
                            dataKey="totalViews"
                            fill="#10b981"
                            name="Total Views"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
