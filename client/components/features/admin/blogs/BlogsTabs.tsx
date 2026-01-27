"use client";

import { cn } from "@/lib/utils";

export type BlogTab = 'all' | 'published';

interface BlogsTabsProps {
    activeTab: BlogTab;
    setActiveTab: (tab: BlogTab) => void;
    counts: Record<BlogTab, number>;
}

export default function BlogsTabs({ activeTab, setActiveTab, counts }: BlogsTabsProps) {
    const tabs = [
        { id: 'all' as BlogTab, label: 'All Blogs' },
        { id: 'published' as BlogTab, label: 'Published' },
    ];

    return (
        <div className="border-b border-[#e5e7eb] pt-5 px-0">
            <div className="flex gap-8 px-5">
                {tabs.map((tab, index) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-[15px] px-2 pb-3 relative transition-all",
                                isActive ? "border-b-4 border-[#C10007]" : ""
                            )}
                        >
                            {index === 1 && (
                                <svg className="w-[14px] h-[16px]" fill="none" viewBox="0 0 14 16">
                                    <path d="M12.916 3.667a.833.833 0 00-1.167 0L4.916 10.5 2.25 7.833a.833.833 0 10-1.167 1.167l3.25 3.25a.833.833 0 001.167 0l7.417-7.417a.833.833 0 000-1.167z" fill={isActive ? '#C10007' : '#4B5563'} />
                                </svg>
                            )}
                            <span className={cn(
                                "text-[16px] tracking-[-0.5px]",
                                isActive ? "text-[#C10007] font-semibold" : "text-[#4b5563] font-medium"
                            )}>
                                {tab.label}
                            </span>
                            <span
                                className={cn(
                                    "inline-flex items-center justify-center min-w-[25px] h-[25px] px-2 rounded-full text-[14px] tracking-[-0.5px] transition-colors",
                                    isActive
                                        ? "bg-[#C10007] text-white font-semibold"
                                        : "bg-[#e5e7eb] text-[#4b5563] font-medium"
                                )}
                            >
                                {counts[tab.id]}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
