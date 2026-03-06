"use client";

import { useMemo } from 'react';
import { cn } from "@/lib/utils";

export type EditorArticleTab = 'all' | 'pending_review' | 'edited' | 'published' | 'rejected';

interface EditorArticlesTabsProps {
    activeTab: EditorArticleTab;
    setActiveTab: (tab: EditorArticleTab) => void;
    counts: Record<string, number>;
}

export default function EditorArticlesTabs({ activeTab, setActiveTab, counts }: EditorArticlesTabsProps) {
    const tabs = [
        { id: 'all' as EditorArticleTab, label: 'All Articles' },
        { id: 'pending_review' as EditorArticleTab, label: 'Pending Review' },
        { id: 'edited' as EditorArticleTab, label: 'Edited' },
        { id: 'published' as EditorArticleTab, label: 'Published' },
        { id: 'rejected' as EditorArticleTab, label: 'Rejected' },
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
                            className={cn(
                                "flex items-center gap-[15px] px-2 pb-3 relative transition-all",
                                isActive ? "border-b-4 border-[#F4AA1D]" : ""
                            )}
                        >
                            <span className={cn(
                                "text-[16px] tracking-[-0.5px]",
                                isActive ? "text-[#1428AE] font-semibold" : "text-[#4b5563] font-medium"
                            )}>
                                {tab.label}
                            </span>
                            <span
                                className={cn(
                                    "inline-flex items-center justify-center min-w-[25px] h-[25px] px-2 rounded-full text-[14px] tracking-[-0.5px] transition-colors",
                                    isActive
                                        ? "bg-[#1428AE] text-white font-semibold"
                                        : "bg-[#e5e7eb] text-[#4b5563] font-medium"
                                )}
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
