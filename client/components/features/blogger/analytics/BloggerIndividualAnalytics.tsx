"use client";

import { useState } from "react";
import { BloggerAnalyticsData } from "@/lib/api-v2/blogger/service/analytics/getBloggerAnalytics";
import StatCard from "@/components/features/admin/shared/StatCard";
import TrafficTrendsChart from "@/components/features/admin/analytics/TrafficTrendsChart";
import ReferralSourcesTable from "@/components/features/admin/analytics/ReferralSourcesTable";
import ReaderRetentionChart from "@/components/features/blogger/analytics/ReaderRetentionChart";
import { ChevronDown, ArrowLeft } from "lucide-react";

interface BloggerIndividualAnalyticsProps {
    data: BloggerAnalyticsData;
    onBack: () => void;
}

export default function BloggerIndividualAnalytics({ data, onBack }: BloggerIndividualAnalyticsProps) {
    // Default to first article if available
    const [selectedArticleId, setSelectedArticleId] = useState<number>(data.topArticles[0]?.id || 0);

    const selectedArticle = data.topArticles.find(a => a.id === selectedArticleId);

    if (!selectedArticle) return null;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header / Article Selector */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Individual Blog Analysis</h2>
                        <p className="text-sm text-gray-500">Deep dive into specific content performance</p>
                    </div>
                </div>

                <div className="relative min-w-[300px]">
                    <select
                        value={selectedArticleId}
                        onChange={(e) => setSelectedArticleId(Number(e.target.value))}
                        className="w-full appearance-none pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#C10007] focus:border-transparent cursor-pointer text-ellipsis overflow-hidden"
                    >
                        {data.topArticles.map(article => (
                            <option key={article.id} value={article.id}>
                                {article.title}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
            </div>

            {/* Article Header Card */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6">
                <img
                    src={selectedArticle.thumbnail}
                    alt={selectedArticle.title}
                    className="w-full md:w-[200px] h-[120px] object-cover rounded-lg"
                />
                <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="px-2.5 py-0.5 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-100">
                            {selectedArticle.status}
                        </span>
                        <span className="text-xs text-gray-500">{new Date(selectedArticle.publishedDate).toLocaleDateString()}</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedArticle.title}</h1>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Published on <strong>{selectedArticle.sites.join(", ")}</strong></span>
                    </div>
                </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Views"
                    value={selectedArticle.views.toLocaleString()}
                    trend="+12%"
                    iconName="Eye"
                    iconBgColor="bg-blue-50"
                    iconColor="text-blue-600"
                    hasIconBg={true}
                />
                <StatCard
                    title="Avg. Read Time"
                    value={selectedArticle.avgReadTime}
                    trend="High"
                    trendLabel="vs. avg"
                    iconName="Clock"
                    iconBgColor="bg-orange-50"
                    iconColor="text-orange-600"
                    hasIconBg={true}
                />
                <StatCard
                    title="Completion Rate"
                    value={`${selectedArticle.completionRate}%`}
                    trend="+5%"
                    iconName="CheckCircle2"
                    iconBgColor="bg-green-50"
                    iconColor="text-green-600"
                    hasIconBg={true}
                />
                <StatCard
                    title="Shares & Saves"
                    value={(selectedArticle.shares + selectedArticle.saves).toLocaleString()}
                    trend={`${selectedArticle.shares} Shares`}
                    iconName="Share2"
                    iconBgColor="bg-purple-50"
                    iconColor="text-purple-600"
                    hasIconBg={true}
                />
            </div>

            {/* Trends and Retention */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Daily Views Trend */}
                {selectedArticle.dailyViews && (
                    <TrafficTrendsChart
                        data={selectedArticle.dailyViews.map(d => ({
                            month: d.date,
                            pageViews: d.views,
                            visitors: Math.floor(d.views * 0.8) // Mock visitors
                        }))}
                    />
                )}

                {/* Reader Retention */}
                {selectedArticle.retentionData && (
                    <ReaderRetentionChart data={selectedArticle.retentionData} />
                )}
            </div>

            {/* Referral Sources */}
            {selectedArticle.referralSources && (
                <div className="grid grid-cols-1">
                    <ReferralSourcesTable data={selectedArticle.referralSources} />
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Engagement / Bounce Rate */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Engagement Overview</h3>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-700">Engagement Rate</span>
                                <span className="text-sm font-bold text-gray-900">{selectedArticle.engagementRate}%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2.5">
                                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${selectedArticle.engagementRate}%` }}></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Percentage of people who interacted with the blog.</p>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-700">Bounce Rate</span>
                                <span className="text-sm font-bold text-gray-900">{selectedArticle.bounceRate}%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2.5">
                                <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${selectedArticle.bounceRate}%` }}></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Percentage of people who left without interaction.</p>
                        </div>
                    </div>
                </div>

                {/* Audience Context */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Audience Context</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Top Country</div>
                            <div className="text-lg font-semibold text-gray-900">{selectedArticle.topCountry}</div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Top Referrer</div>
                            <div className="text-lg font-semibold text-gray-900">{selectedArticle.topReferrer}</div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg col-span-2">
                            <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Retention Quality</div>
                            <div className="text-lg font-semibold text-gray-900">
                                {selectedArticle.completionRate > 70 ? "High Retention" : "Moderate Retention"}
                            </div>
                            <div className="text-xs text-gray-500">
                                {selectedArticle.completionRate > 70
                                    ? "Most readers are finishing this blog."
                                    : "Readers are dropping off halfway."}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
