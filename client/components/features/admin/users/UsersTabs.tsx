"use client";

import { cn } from "@/lib/utils";

export type UserTab = 'all' | 'active' | 'suspended' | 'banned';

interface UsersTabsProps {
    activeTab: UserTab;
    setActiveTab: (tab: UserTab) => void;
    counts: Record<UserTab, number>;
}

export default function UsersTabs({ activeTab, setActiveTab, counts }: UsersTabsProps) {
    const tabs = [
        { id: 'all' as UserTab, label: 'All Users' },
        { id: 'active' as UserTab, label: 'Active' },
        { id: 'suspended' as UserTab, label: 'Suspended' },
        { id: 'banned' as UserTab, label: 'Banned' },
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
                                isActive ? "border-b-4 border-[#C10007]" : ""
                            )}
                        >
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
