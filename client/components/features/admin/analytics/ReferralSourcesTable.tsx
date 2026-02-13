"use client";

interface ReferralSource {
    name: string;
    value: number; // Visits
    color?: string;
}

interface ReferralSourcesTableProps {
    data: ReferralSource[];
}

export default function ReferralSourcesTable({ data }: ReferralSourcesTableProps) {
    // Calculate percentages
    const totalVisits = data.reduce((sum, item) => sum + item.value, 0);

    const processedData = data.map(item => ({
        ...item,
        percentage: totalVisits > 0 ? ((item.value / totalVisits) * 100).toFixed(1) : "0.0",
        // Mock data for missing backend fields
        avgDuration: "0m 00s",
        conversionRate: "0.00"
    }));

    return (
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] h-full">
            <div className="mb-4">
                <h3 className="text-[18px] font-bold text-[#111827] tracking-[-0.5px]">Referral Sources</h3>
                <p className="text-sm text-gray-600">Traffic source analysis</p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Source</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Visits</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Percentage</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Avg. Duration</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Conversion Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        {processedData.length > 0 ? (
                            processedData.map((source, index) => (
                                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 last:border-0">
                                    <td className="py-3 px-4 font-medium text-gray-900">{source.name}</td>
                                    <td className="py-3 px-4 text-gray-700">{source.value.toLocaleString()}</td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 max-w-[100px] bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-[#C10007] h-2 rounded-full"
                                                    style={{ width: `${Number(source.percentage)}%` }}
                                                />
                                            </div>
                                            <span className="text-sm font-medium text-gray-700">{source.percentage}%</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-gray-600">{source.avgDuration}</td>
                                    <td className="py-3 px-4 text-gray-600">{source.conversionRate}%</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="py-8 text-center text-gray-500">
                                    No referral data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
