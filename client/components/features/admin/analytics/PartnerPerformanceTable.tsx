"use client";

import { ExternalLink, TrendingUp, Users, FileText, ArrowUpRight } from 'lucide-react';

interface PartnerPerformance {
    site: string;
    articlesShared: number;
    monthlyViews: number;
    revenueGenerated: string;
    avgEngagement: string;
}

interface PartnerPerformanceTableProps {
    data: PartnerPerformance[];
}

export default function PartnerPerformanceTable({ data }: PartnerPerformanceTableProps) {
    return (
        <div className="bg-white border border-[#f3f4f6] rounded-[12px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="p-8 border-b border-[#f3f4f6] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-[24px] font-bold text-[#111827] tracking-[-0.5px]">Partner Performance Hub</h3>
                    <p className="text-[#6b7280] font-medium mt-1 tracking-[-0.5px]">Detailed performance metrics across all distribution channels</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-[#f9fafb] rounded-[12px] text-[#4b5563] font-bold text-sm border border-[#f3f4f6] italic">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    Live Performance Tracking
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-[#f9fafb]/50">
                            <th className="text-left px-8 py-5 text-[11px] font-extrabold text-[#9ca3af] uppercase tracking-widest border-b border-[#f3f4f6]">Partner Channel</th>
                            <th className="text-left px-8 py-5 text-[11px] font-extrabold text-[#9ca3af] uppercase tracking-widest border-b border-[#f3f4f6]">Articles</th>
                            <th className="text-left px-8 py-5 text-[11px] font-extrabold text-[#9ca3af] uppercase tracking-widest border-b border-[#f3f4f6]">Traffic (Views)</th>
                            <th className="text-left px-8 py-5 text-[11px] font-extrabold text-[#9ca3af] uppercase tracking-widest border-b border-[#f3f4f6]">Revenue Contribution</th>
                            <th className="text-left px-8 py-5 text-[11px] font-extrabold text-[#9ca3af] uppercase tracking-widest border-b border-[#f3f4f6] text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {data.map((site, index) => (
                            <tr key={index} className="group hover:bg-[#f9fafb]/80 transition-all duration-200">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-[#f3f4f6] flex items-center justify-center text-[#9ca3af] group-hover:bg-white group-hover:text-[#C10007] group-hover:shadow-sm border border-transparent group-hover:border-[#f3f4f6] transition-all">
                                            <LayersIcon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[14px] font-extrabold text-[#111827] group-hover:text-[#C10007] transition-colors tracking-[-0.5px]">{site.site}</p>
                                            <p className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-tighter">Verified Partner</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-3.5 h-3.5 text-blue-500 opacity-60" />
                                        <span className="text-[14px] font-bold text-[#374151] tracking-[-0.5px]">{site.articlesShared}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2">
                                        <Users className="w-3.5 h-3.5 text-purple-500 opacity-60" />
                                        <span className="text-[14px] font-bold text-[#374151] tracking-[-0.5px]">{site.monthlyViews.toLocaleString()}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-2">
                                        <div className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-black italic tracking-tight border border-emerald-100 group-hover:bg-emerald-100 transition-colors">
                                            {site.revenueGenerated}
                                        </div>
                                        <ArrowUpRight className="w-3 h-3 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <button className="p-2.5 rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-[#C10007] hover:border-[#C10007] hover:bg-red-50 transition-all shadow-sm">
                                        <ExternalLink className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {data.length === 0 && (
                <div className="p-20 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                        <LayersIcon className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="text-gray-400 font-bold italic tracking-tight">No partner performance data detected for this period.</p>
                </div>
            )}
        </div>
    );
}

function LayersIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
    )
}
