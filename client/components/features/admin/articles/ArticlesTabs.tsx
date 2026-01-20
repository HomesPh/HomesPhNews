"use client";

import { useMemo } from 'react';
import { cn } from "@/lib/utils";

export type ArticleTab = 'all' | 'published' | 'pending' | 'rejected';

interface ArticlesTabsProps {
    activeTab: ArticleTab;
    setActiveTab: (tab: ArticleTab) => void;
    counts: Record<ArticleTab, number>;
}

/**
 * ArticlesTabs component exactly matching Create Sign In Page design
 */
export default function ArticlesTabs({ activeTab, setActiveTab, counts }: ArticlesTabsProps) {
    const tabs = [
        { id: 'all' as ArticleTab, label: 'All Articles' },
        { id: 'published' as ArticleTab, label: 'Published' },
        { id: 'pending' as ArticleTab, label: 'Pending Review' },
        { id: 'rejected' as ArticleTab, label: 'Rejected' },
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
                            {/* Icons matching reference SVG paths roughly with Lucide fallback if needed, but here we can use SVGs if we want exact */}
                            {index === 1 && (
                                <svg className="w-[14px] h-[16px]" fill="none" viewBox="0 0 14 16">
                                    <path d="M12.916 3.667a.833.833 0 00-1.167 0L4.916 10.5 2.25 7.833a.833.833 0 10-1.167 1.167l3.25 3.25a.833.833 0 001.167 0l7.417-7.417a.833.833 0 000-1.167z" fill={isActive ? '#C10007' : '#4B5563'} />
                                </svg>
                            )}
                            {index === 2 && (
                                <svg className="w-[16px] h-[16px]" fill="none" viewBox="0 0 16 16">
                                    <path d="M8 1.333A6.667 6.667 0 1014.667 8 6.667 6.667 0 008 1.333zm0 12A5.333 5.333 0 1113.333 8 5.333 5.333 0 018 13.333zM8.333 4h-1v4.667h4v-1h-3V4z" fill={isActive ? '#C10007' : '#4B5563'} />
                                </svg>
                            )}
                            {index === 3 && (
                                <svg className="w-[12px] h-[16px]" fill="none" viewBox="0 0 12 16">
                                    <path d="M11.667 3.518l-1.185-1.185L6 6.815 1.518 2.333.333 3.518l4.482 4.482-4.482 4.482 1.185 1.185L6 9.185l4.482 4.482 1.185-1.185-4.482-4.482 4.482-4.482z" fill={isActive ? '#C10007' : '#4B5563'} />
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
