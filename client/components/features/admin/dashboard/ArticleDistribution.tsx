import { cn } from "@/lib/utils";
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import ProgressTracker from "@/components/features/admin/shared/ProgressTracker";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface SiteDistribution {
    name: string;
    count: number;
    totalViews: number;
}

interface ArticleDistributionProps {
    sites: SiteDistribution[];
    totalArticles: number;
    className?: string;
}

export default function ArticleDistribution({ sites, totalArticles, className }: ArticleDistributionProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Sort and take top 5 for the main view
    const sortedSites = [...sites].sort((a, b) => b.count - a.count);
    const topSites = sortedSites.slice(0, 5);
    const hasMore = sites.length > 5;

    return (
        <div className={cn("bg-white rounded-[12px] border border-[#f3f4f6] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] p-6", className)}>
            <h2 className="text-[18px] font-bold text-[#111827] mb-6 tracking-[-0.5px]">Article Distribution</h2>

            <div className="space-y-4">
                {topSites.map((site, index) => (
                    <ProgressTracker
                        key={index}
                        label={site.name}
                        value={site.count}
                        max={totalArticles}
                    />
                ))}

                {sites.length === 0 && (
                    <div className="flex items-center justify-center h-20 text-gray-400 text-xs italic">
                        No distribution data available
                    </div>
                )}
            </div>

            <div className="mt-6 flex justify-center">
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <button
                            className="text-[14px] font-medium text-[#C10007] hover:underline tracking-[-0.5px]"
                        >
                            {hasMore ? `View All ${sites.length} Distributions` : 'View Detailed Distribution'}
                        </button>
                    </DialogTrigger>
                    <DialogContent className="force-light max-w-4xl max-h-[90vh] overflow-y-auto bg-white text-gray-900 border-[#f3f4f6]" aria-describedby={undefined}>
                        <DialogHeader>
                            <DialogTitle className="text-[20px] font-bold text-[#111827] tracking-[-0.5px]">Full Article Distribution</DialogTitle>
                        </DialogHeader>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
                            {/* Column 1: List with Scroll */}
                            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                                {sortedSites.map((site, index) => (
                                    <div key={index} className="p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                        <div className="flex justify-between items-end mb-1">
                                            <span className="text-[14px] font-bold text-[#111827] tracking-[-0.5px]">{site.name}</span>
                                            <div className="text-right">
                                                <span className="block text-[12px] text-gray-500 font-medium tracking-[-0.5px]">
                                                    {site.totalViews.toLocaleString()} total views
                                                </span>
                                                <span className="text-[11px] text-[#C10007] font-bold tracking-[-0.5px]">
                                                    {site.count} articles
                                                </span>
                                            </div>
                                        </div>
                                        <ProgressTracker
                                            label=""
                                            value={site.count}
                                            max={totalArticles}
                                            color={index < 3 ? "bg-[#C10007]" : "bg-gray-300"}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Column 2: Graph */}
                            <div className="bg-[#f9fafb] rounded-[12px] p-6 flex flex-col items-center justify-center min-h-[400px]">
                                <h3 className="text-sm font-bold text-gray-500 mb-8 uppercase tracking-widest">Visual Overview</h3>
                                <div className="w-full h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={sortedSites} layout="vertical" margin={{ left: 20 }}>
                                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                                            <XAxis type="number" hide />
                                            <YAxis
                                                dataKey="name"
                                                type="category"
                                                width={100}
                                                tick={{ fontSize: 10, fontWeight: 'bold', fill: '#4b5563' }}
                                                axisLine={false}
                                                tickLine={false}
                                            />
                                            <Tooltip
                                                cursor={{ fill: 'transparent' }}
                                                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                            />
                                            <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                                                {sortedSites.map((_, index) => (
                                                    <Cell key={`cell-${index}`} fill={index < 3 ? '#C10007' : '#9ca3af'} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="mt-6 text-center">
                                    <p className="text-[12px] text-gray-500 tracking-[-0.5px]">
                                        Total of <span className="font-bold text-[#111827]">{totalArticles}</span> articles distributed across <span className="font-bold text-[#111827]">{sites.length}</span> partner sites.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
