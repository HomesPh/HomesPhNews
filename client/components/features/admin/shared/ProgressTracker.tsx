"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface ProgressTrackerProps {
    label: string;
    value: number;
    max: number;
    suffix?: string;
    color?: string;
}

/**
 * ProgressTracker component for displaying progress bars with labels and smooth animations
 */
export default function ProgressTracker({
    label,
    value,
    max,
    suffix = "articles",
    color = "bg-[#C10007]",
}: ProgressTrackerProps) {
    const [width, setWidth] = useState(0);
    const targetPercentage = Math.min(Math.max((value / max) * 100, 0), 100);

    useEffect(() => {
        // Animate from 0 to target on mount
        const timer = setTimeout(() => {
            setWidth(targetPercentage);
        }, 100);
        return () => clearTimeout(timer);
    }, [targetPercentage]);

    return (
        <div className="group">
            {/* Label and Value */}
            <div className="flex items-center justify-between mb-2">
                <span className="text-[14px] font-medium text-[#111827] tracking-[-0.5px] group-hover:text-[#C10007] transition-colors">
                    {label}
                </span>
                <span className="text-[14px] font-semibold text-[#6b7280] tracking-[-0.5px]">
                    {value} <span className="text-[12px] font-normal text-[#9ca3af]">{suffix}</span>
                </span>
            </div>

            {/* Progress Bar Container */}
            <div className="w-full bg-[#f3f4f6] rounded-full h-[8px] overflow-hidden">
                {/* Active Progress */}
                <div
                    className={cn(
                        "h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden",
                        color
                    )}
                    style={{ width: `${width}%` }}
                >
                    {/* Glossy Overlay Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                </div>
            </div>
        </div>
    );
}
