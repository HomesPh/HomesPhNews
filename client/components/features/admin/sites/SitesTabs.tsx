"use client";

import { LayoutGrid, CheckCircle2, AlertCircle } from 'lucide-react';

export type SiteTab = 'all' | 'active' | 'suspended';

interface SitesTabsProps {
    activeTab: SiteTab;
    setActiveTab: (tab: SiteTab) => void;
    counts: {
        all: number;
        active: number;
        suspended: number;
    };
}

/**
 * Premium SitesTabs component following the same design as ArticlesTabs
 */
export default function SitesTabs({ activeTab, setActiveTab, counts }: SitesTabsProps) {
    const tabs = [
        { id: 'all' as const, label: 'All Sites', icon: LayoutGrid },
        { id: 'active' as const, label: 'Active', icon: CheckCircle2 },
        { id: 'suspended' as const, label: 'Suspended', icon: AlertCircle },
    ];

    return (
        <div className="border-b border-[#e5e7eb] pt-5 px-0">
            <div className="flex gap-8 px-5">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-[15px] px-2 pb-3 relative transition-all ${isActive ? "border-b-4 border-[#F4AA1D]" : ""
                                }`}
                        >
                            <span
                                className={`text-[16px] tracking-[-0.5px] ${isActive
                                    ? "text-[#1428AE] font-semibold"
                                    : "text-[#4b5563] font-medium"
                                    }`}
                            >
                                {tab.label}
                            </span>
                            <span
                                className={`inline-flex items-center justify-center min-w-[25px] h-[25px] px-2 rounded-full text-[14px] tracking-[-0.5px] transition-colors ${isActive
                                    ? "bg-[#1428AE] text-white font-semibold"
                                    : "bg-[#e5e7eb] text-[#4b5563] font-medium"
                                    }`}
                            >
                                {counts[tab.id] ?? 0}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
