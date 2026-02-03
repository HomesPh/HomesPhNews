"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import useAds from "../hooks/useAds";
import type { AdPlacement } from "../types";

interface AdSpaceProps {
    className?: string;
    placement?: AdPlacement;
    /** Auto-rotate ads at this interval (ms). Set to 0 to disable. */
    rotateInterval?: number;
    /** Show placeholder when no ads available */
    showPlaceholder?: boolean;
}

export default function AdSpace({
    className,
    placement = "sidebar-top",
    rotateInterval = 0,
    showPlaceholder = true,
}: AdSpaceProps) {
    const { ad, isLoading, trackClick } = useAds({
        placement,
        rotateInterval,
    });

    // Loading state
    if (isLoading) {
        return (
            <div
                className={cn(
                    "bg-white dark:bg-[#1a1d2e] rounded-[12px] border border-dashed border-[#e5e7eb] dark:border-[#2a2d3e] shadow-sm p-[25px] flex items-center justify-center animate-pulse",
                    className
                )}
            >
                <div className="w-8 h-8 border-2 border-gray-300 dark:border-gray-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // No ad available - show placeholder or nothing
    if (!ad) {
        if (!showPlaceholder) return null;

        return (
            <div
                className={cn(
                    "bg-white dark:bg-[#1a1d2e] rounded-[12px] border border-dashed border-[#e5e7eb] dark:border-[#2a2d3e] shadow-sm p-[25px] text-center flex flex-col items-center justify-center",
                    className
                )}
            >
                <p className="font-semibold text-[16px] text-[#111827] dark:text-white tracking-[-0.5px] mb-2">
                    Advertisement Space
                </p>
                <p className="font-normal text-[12px] text-[#6b7280] dark:text-gray-400 tracking-[-0.5px]">
                    {placement}
                </p>
            </div>
        );
    }

    // Render the ad
    const handleClick = () => {
        trackClick();
        if (ad.link) {
            window.open(ad.link, "_blank", "noopener,noreferrer");
        }
    };

    return (
        <div
            className={cn(
                "bg-white dark:bg-[#1a1d2e] rounded-[12px] border border-[#e5e7eb] dark:border-[#2a2d3e] shadow-sm overflow-hidden cursor-pointer transition-transform hover:scale-[1.01] hover:shadow-md",
                className
            )}
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleClick()}
            aria-label={`Advertisement: ${ad.name}`}
        >
            {ad.type === "image" && (
                <div className="relative w-full h-full min-h-[100px]">
                    <Image
                        src={ad.content}
                        alt={ad.alt || ad.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 300px"
                    />
                    {/* Subtle "Ad" label */}
                    <span className="absolute bottom-1 right-1 text-[10px] font-medium text-white/70 bg-black/30 px-1.5 py-0.5 rounded">
                        Ad
                    </span>
                </div>
            )}

            {ad.type === "html" && (
                <div
                    className="w-full h-full"
                    dangerouslySetInnerHTML={{ __html: ad.content }}
                />
            )}

            {ad.type === "script" && (
                <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    Script ads not supported in preview
                </div>
            )}
        </div>
    );
}
