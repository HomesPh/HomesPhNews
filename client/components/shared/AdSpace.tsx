"use client";

import { cn } from "@/lib/utils";

interface AdSpaceProps {
    className?: string;
    width?: string;
    height?: string;
    label?: string;
}

export default function AdSpace({
    className,
    width = "300x600",
    height = "Leader board Ad",
    label = "Advertisement Space"
}: AdSpaceProps) {
    return (
        <div className={cn(
            "bg-white dark:bg-[#1a1d2e] rounded-[12px] border border-dashed border-[#e5e7eb] dark:border-[#2a2d3e] shadow-sm p-[25px] text-center flex flex-col items-center justify-center",
            className
        )}>
            <p className="font-semibold text-[16px] text-[#111827] dark:text-white tracking-[-0.5px] mb-2">
                {label}
            </p>
            <p className="font-normal text-[12px] text-[#6b7280] dark:text-gray-400 tracking-[-0.5px]">
                {width} {height}
            </p>
        </div>
    );
}
