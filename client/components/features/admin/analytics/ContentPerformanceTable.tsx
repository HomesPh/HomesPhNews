import { Eye, MousePointerClick, Clock, Utensils, Layers, FileText, Mail } from 'lucide-react';
import { ContentPerformance } from "@/app/admin/analytics/data";

interface ContentPerformanceTableProps {
    data: ContentPerformance[];
    title?: string;
    description?: string;
    action?: React.ReactNode;
}

export default function ContentPerformanceTable({
    data,
    title = "Content Performance",
    description = "Detailed metrics for Articles, Blogs, Newsletters, and Restaurants",
    action
}: ContentPerformanceTableProps) {
    return (
        <div className="bg-white border border-[#f3f4f6] rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="p-8 border-b border-[#f3f4f6] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-[24px] font-bold text-[#111827] tracking-[-0.5px]">{title}</h3>
                    <p className="text-[#6b7280] font-medium mt-1 tracking-[-0.5px]">{description}</p>
                </div>
                {action && (
                    <div className="flex-shrink-0">
                        {action}
                    </div>
                )}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-[#f9fafb]/50">
                            <th className="text-left px-8 py-5 text-[11px] font-extrabold text-[#9ca3af] uppercase tracking-widest border-b border-[#f3f4f6]">Title & Type</th>
                            <th className="text-left px-8 py-5 text-[11px] font-extrabold text-[#9ca3af] uppercase tracking-widest border-b border-[#f3f4f6]">Views</th>
                            <th className="text-left px-8 py-5 text-[11px] font-extrabold text-[#9ca3af] uppercase tracking-widest border-b border-[#f3f4f6]">Clicks</th>
                            <th className="text-left px-8 py-5 text-[11px] font-extrabold text-[#9ca3af] uppercase tracking-widest border-b border-[#f3f4f6]">Read Duration</th>
                            <th className="text-left px-8 py-5 text-[11px] font-extrabold text-[#9ca3af] uppercase tracking-widest border-b border-[#f3f4f6]">Top Country</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {data.map((item, index) => (
                            <tr key={index} className="group hover:bg-[#f9fafb]/80 transition-all duration-200">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border border-transparent transition-all ${item.type === 'Article' ? 'bg-blue-50 text-blue-600' :
                                            item.type === 'Blog' ? 'bg-purple-50 text-purple-600' :
                                                item.type === 'Restaurant' ? 'bg-emerald-50 text-emerald-600' :
                                                    'bg-orange-50 text-orange-600'
                                            }`}>
                                            {item.type === 'Article' && <FileText className="w-5 h-5" />}
                                            {item.type === 'Blog' && <Layers className="w-5 h-5" />}
                                            {item.type === 'Newsletter' && <Mail className="w-5 h-5" />}
                                            {item.type === 'Restaurant' && <Utensils className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <p className="text-[14px] font-extrabold text-[#111827] group-hover:text-[#C10007] transition-colors tracking-[-0.5px] line-clamp-1 max-w-[300px]">{item.title}</p>
                                            <p className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-tighter">{item.type}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2">
                                        <Eye className="w-3.5 h-3.5 text-blue-500 opacity-60" />
                                        <span className="text-[14px] font-bold text-[#374151] tracking-[-0.5px]">{item.views.toLocaleString()}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2">
                                        <MousePointerClick className="w-3.5 h-3.5 text-emerald-500 opacity-60" />
                                        <span className="text-[14px] font-bold text-[#374151] tracking-[-0.5px]">{item.clicks.toLocaleString()}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-3.5 h-3.5 text-orange-500 opacity-60" />
                                        <span className="text-[14px] font-bold text-[#374151] tracking-[-0.5px]">{item.read_time}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="px-2.5 py-1 w-fit rounded-full bg-gray-100 text-[#4b5563] text-[11px] font-bold tracking-tight">
                                        {item.country}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {data.length === 0 && (
                <div className="p-20 text-center">
                    <p className="text-gray-400 font-bold italic tracking-tight">No content data available for this filter.</p>
                </div>
            )}
        </div>
    );
}
