"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ChartDataPoint {
    name: string;
    value: number;
    color?: string;
    [key: string]: any;
}

interface VisitorBreakdownChartProps {
    data: ChartDataPoint[];
}

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'];

export default function VisitorBreakdownChart({ data }: VisitorBreakdownChartProps) {
    if (!data || data.length === 0) return null;

    return (
        <div className="bg-white p-6 rounded-[12px] border border-[#f3f4f6] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] h-full">
            <h3 className="text-[18px] font-bold text-[#111827] mb-6 tracking-[-0.5px]">Visitor Devices</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            cursor={{ fill: '#f3f4f6' }}
                        />
                        <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                {data.map((item, i) => (
                    <div key={i} className="flex flex-col">
                        <span className="text-[24px] font-bold text-[#111827]">{item.value}%</span>
                        <span className="text-[12px] text-gray-500 font-medium">{item.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
