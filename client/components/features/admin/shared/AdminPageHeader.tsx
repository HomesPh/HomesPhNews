"use client";

import { Plus, LucideIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdminPageHeaderProps {
    title: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
    actionIcon?: LucideIcon;
    className?: string;
    children?: React.ReactNode;
}

/**
 * Shared Page Header component for all admin pages
 */
export default function AdminPageHeader({
    title,
    description,
    actionLabel,
    onAction,
    actionIcon: ActionIcon = Plus,
    className,
    children
}: AdminPageHeaderProps) {
    return (
        <div className={cn("flex items-center justify-between mb-8", className)}>
            <div>
                <h1 className="text-[30px] font-bold text-[#111827] tracking-[-0.5px] leading-[36px]">
                    {title}
                </h1>
                {description && (
                    <p className="text-[14px] text-[#4b5563] mt-1 tracking-[-0.5px] leading-[20px]">
                        {description}
                    </p>
                )}
            </div>

            <div className="flex items-center gap-4">
                {children}
                {actionLabel && onAction && (
                    <Button
                        onClick={onAction}
                        className="flex items-center gap-[10px] px-5 py-3 bg-[#C10007] text-white rounded-[6px] hover:bg-[#a10006] transition-colors h-[50px]"
                    >
                        <ActionIcon className="w-[18px] h-[18px]" />
                        <span className="text-[16px] font-medium tracking-[-0.5px]">{actionLabel}</span>
                    </Button>
                )}
            </div>
        </div>
    );
}
