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
        <div className="bg-white rounded-[12px] border border-[#e5e7eb] p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <Flame className="w-5 h-5 text-[#c10007]" />
                <h3 className="text-[18px] font-bold text-[#111827] tracking-[-0.5px]">
                    Trending Topics
                </h3>
            </div>

            <div className="space-y-3">
                {items.map((item, index) => (
                    <button
                        key={item.id}
                        onClick={() => handleItemClick(item.label)}
                        className="w-full flex items-center gap-3 p-3 rounded-[8px] hover:bg-[#f3f4f6] transition-colors group text-left"
                    >
                        <span className="text-[16px] font-bold text-[#6b7280] group-hover:text-[#c10007]">
                            {index + 1}
                        </span>
                        <span className="text-[14px] font-medium text-[#111827] tracking-[-0.5px] group-hover:text-[#c10007]">
                            {item.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
