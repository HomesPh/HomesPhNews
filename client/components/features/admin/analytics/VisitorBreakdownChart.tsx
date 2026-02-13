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

    // Calculate total for percentage if needed, but data usually comes as percentage or raw count
    // For now assuming `value` is the metric to display

    return (
        <div className="bg-white p-6 rounded-[12px] border border-[#f3f4f6] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] h-full">
            <h3 className="text-[18px] font-bold text-[#111827] mb-6 tracking-[-0.5px]">Visitor Devices</h3>

            <div className="flex flex-col md:flex-row items-center">
                {/* Donut Chart */}
                <div className="h-[250px] w-full md:w-1/2">
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
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Custom Legend / Details */}
                <div className="w-full md:w-1/2 pl-0 md:pl-6 mt-4 md:mt-0 space-y-4">
                    {data.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: item.color || COLORS[index % COLORS.length] }}
                                />
                                <span className="text-sm text-gray-700 font-medium">{item.name}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-bold text-gray-900">{item.value}%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
