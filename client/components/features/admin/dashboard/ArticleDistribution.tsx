"use client";

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
}

export default function ArticleDistribution({ sites, totalArticles }: ArticleDistributionProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Sort and take top 5 for the main view
    const sortedSites = [...sites].sort((a, b) => b.count - a.count);
    const topSites = sortedSites.slice(0, 5);
    const hasMore = sites.length > 5;

    const colors = ['#C10007', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

    return (
        <div className="bg-white rounded-[16px] border border-gray-100 shadow-sm p-5">
            <h2 className="text-[16px] font-bold text-gray-900 mb-4 tracking-tight">Article Distribution</h2>

            <div className="space-y-3">
                {topSites.map((site, index) => (
                    <div key={index}>
                        <div className="flex justify-between items-end mb-1">
                            <span className="text-[13px] font-bold text-gray-800">{site.name}</span>
                            <span className="text-[11px] text-gray-400 font-bold">
                                {site.totalViews.toLocaleString()} views
                            </span>
                        </div>
                        <ProgressTracker
                            label=""
                            value={site.count}
                            max={totalArticles || 1}
                            color={index === 0 ? "bg-[#C10007]" : "bg-gray-300"}
                        />
                    </div>
                ))}

                {sites.length === 0 && (
                    <div className="flex items-center justify-center h-20 text-gray-400 text-xs italic">
                        No distribution data available
                    </div>
                )}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-center">
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <button
                            className="text-[12px] font-bold text-[#C10007] hover:underline"
                        >
                            {hasMore ? `View All ${sites.length} Distributions` : 'View Detailed Distribution'}
                        </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold tracking-tight">Full Article Distribution</DialogTitle>
                        </DialogHeader>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
                            {/* Column 1: List with Scroll */}
                            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                                {sortedSites.map((site, index) => (
                                    <div key={index} className="p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                        <div className="flex justify-between items-end mb-1">
                                            <span className="text-[14px] font-bold text-gray-900">{site.name}</span>
                                            <div className="text-right">
                                                <span className="block text-[12px] text-gray-500 font-medium">
                                                    {site.totalViews.toLocaleString()} total views
                                                </span>
                                                <span className="text-[11px] text-[#C10007] font-bold">
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
                            <div className="bg-gray-50 rounded-xl p-6 flex flex-col items-center justify-center min-h-[400px]">
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
                                                tick={{ fontSize: 10, fontWeight: 'bold' }}
                                                axisLine={false}
                                                tickLine={false}
                                            />
                                            <Tooltip
                                                cursor={{ fill: 'transparent' }}
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
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
                                    <p className="text-[12px] text-gray-500">
                                        Total of <span className="font-bold text-gray-900">{totalArticles}</span> articles distributed across <span className="font-bold text-gray-900">{sites.length}</span> partner sites.
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
