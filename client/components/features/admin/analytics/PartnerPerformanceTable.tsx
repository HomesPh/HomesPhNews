import { PartnerPerformance } from "@/app/admin/analytics/data";

interface PartnerPerformanceTableProps {
    data: PartnerPerformance[];
}

/**
 * PartnerPerformanceTable component for displaying partner site metrics in a tabular format
 */
export default function PartnerPerformanceTable({ data }: PartnerPerformanceTableProps) {
    const totalArticlesShared = data.reduce((sum, site) => sum + site.articlesShared, 0);
    const totalMonthlyViews = data.reduce((sum, site) => sum + site.monthlyViews, 0);
    const totalRevenue = data.reduce((sum, site) => {
        const amount = parseFloat(site.revenueGenerated.replace(/[$,]/g, ''));
        return sum + amount;
    }, 0);

    return (
        <div className="bg-white border border-[#f3f4f6] rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="p-6 border-b border-[#f3f4f6]">
                <h3 className="text-[18px] font-bold text-[#111827] tracking-[-0.5px]">Partner Sites Performance</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-[#f3f4f6] bg-[#f9fafb]">
                            <th className="text-left px-6 py-4 font-semibold text-[#111827] tracking-[-0.5px]">
                                Partner Site
                            </th>
                            <th className="text-left px-6 py-4 font-semibold text-[#111827] tracking-[-0.5px]">
                                Articles Shared
                            </th>
                            <th className="text-left px-6 py-4 font-semibold text-[#111827] tracking-[-0.5px]">
                                Monthly Views
                            </th>
                            <th className="text-left px-6 py-4 font-semibold text-[#111827] tracking-[-0.5px]">
                                Revenue Generated
                            </th>
                            <th className="text-left px-6 py-4 font-semibold text-[#111827] tracking-[-0.5px]">
                                Avg Engagement
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f3f4f6]">
                        {data.map((site, index) => (
                            <tr key={index} className="hover:bg-[#f9fafb] transition-colors">
                                <td className="px-6 py-4 text-[#111827] font-medium tracking-[-0.5px]">
                                    {site.site}
                                </td>
                                <td className="px-6 py-4 text-[#6b7280] tracking-[-0.5px]">
                                    {site.articlesShared}
                                </td>
                                <td className="px-6 py-4 text-[#6b7280] tracking-[-0.5px]">
                                    {site.monthlyViews.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 font-semibold text-[#10b981] tracking-[-0.5px]">
                                    {site.revenueGenerated}
                                </td>
                                <td className="px-6 py-4 text-[#6b7280] tracking-[-0.5px]">
                                    {site.avgEngagement}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="bg-[#f9fafb] font-bold border-t border-[#f3f4f6]">
                            <td className="px-6 py-4 text-[#111827] tracking-[-0.5px]">
                                Total
                            </td>
                            <td className="px-6 py-4 text-[#111827] tracking-[-0.5px]">
                                {totalArticlesShared}
                            </td>
                            <td className="px-6 py-4 text-[#111827] tracking-[-0.5px]">
                                {totalMonthlyViews.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-[#10b981] tracking-[-0.5px]">
                                ${totalRevenue.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-[#6b7280] tracking-[-0.5px]">
                                -
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}
