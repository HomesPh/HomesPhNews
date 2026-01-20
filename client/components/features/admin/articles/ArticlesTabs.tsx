import { ChevronDown, CheckCircle2, Clock, XCircle, FileText } from 'lucide-react';
import { cn } from "@/lib/utils";

export type ArticleTab = 'all' | 'published' | 'pending' | 'rejected';

interface ArticlesTabsProps {
    activeTab: ArticleTab;
    setActiveTab: (tab: ArticleTab) => void;
    counts: Record<ArticleTab, number>;
}

/**
 * ArticlesTabs component for filtering articles by status
 */
export default function ArticlesTabs({ activeTab, setActiveTab, counts }: ArticlesTabsProps) {
    const tabs = [
        { id: 'all' as ArticleTab, label: 'All Articles', icon: FileText },
        { id: 'published' as ArticleTab, label: 'Published', icon: CheckCircle2 },
        { id: 'pending' as ArticleTab, label: 'Pending Review', icon: Clock },
        { id: 'rejected' as ArticleTab, label: 'Rejected', icon: XCircle },
    ];

    return (
        <div className="border-b border-[#e5e7eb] pt-5 px-0">
            <div className="flex gap-8 px-5">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-[15px] px-2 pb-3 relative transition-all",
                                isActive ? "border-b-4 border-[#C10007]" : "hover:text-[#111827]"
                            )}
                        >
                            <Icon
                                className={cn(
                                    "w-4 h-4",
                                    isActive ? "text-[#C10007]" : "text-[#4B5563]"
                                )}
                            />
                            <span className={cn(
                                "text-[16px] tracking-[-0.5px]",
                                isActive ? "text-[#C10007] font-semibold" : "text-[#4b5563] font-medium"
                            )}>
                                {tab.label}
                            </span>
                            <span
                                className={cn(
                                    "inline-flex items-center justify-center min-w-[25px] h-[25px] px-2 rounded-full text-[14px] tracking-[-0.5px]",
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
