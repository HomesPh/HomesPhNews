"use client";

import { Flame } from "lucide-react";
import { useRouter } from "next/navigation";

interface TrendingTopicsProps {
    items: { id: number | string; label: string; }[]
    className?: string;
}

export default function TrendingTopicsCard({ items, className }: TrendingTopicsProps) {
    const router = useRouter();

    const handleItemClick = (label: string) => {
        router.push(`/search?q=${encodeURIComponent(label)}`);
    };

    return (
        <section className={className}>
            <div className="bg-[#1428AE] px-4 py-1 mb-6">
                <h3 className="text-white text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <Flame className="w-3 h-3" />
                    Trending Topics
                </h3>
            </div>

            <div className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800 transition-colors">
                {items.slice(0, 5).map((item, index) => (
                    <button
                        key={item.id}
                        onClick={() => handleItemClick(item.label)}
                        className="w-full py-3 flex items-center justify-between group text-left transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <div className="flex items-center gap-4">
                            <span className="text-[14px] font-black text-gray-500 dark:text-gray-400 transition-colors group-hover:text-[#F4AA1D] dark:group-hover:text-[#F4AA1D]">
                                {index + 1}
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 group-hover:text-[#F4AA1D] dark:group-hover:text-[#F4AA1D] transition-colors line-clamp-1">
                                {item.label}
                            </span>
                        </div>
                        <span className="text-[#F4AA1D] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    </button>
                ))}
            </div>
        </section>
    );
}
