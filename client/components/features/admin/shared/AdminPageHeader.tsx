import { Plus, LucideIcon, ArrowLeft } from 'lucide-react';
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
    showBackButton?: boolean;
    onBack?: () => void;
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
    children,
    showBackButton,
    onBack
}: AdminPageHeaderProps) {
    return (
        <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8", className)}>
            <div className="flex items-start gap-3 sm:gap-4">
                {showBackButton && onBack && (
                    <Button variant="ghost" size="icon" onClick={onBack} className="mt-1 flex-shrink-0">
                        <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                    </Button>
                )}
                <div>
                    <h1 className="text-[24px] sm:text-[30px] font-bold text-[#111827] tracking-[-0.5px] leading-tight sm:leading-[36px]">
                        {title}
                    </h1>
                    {description && (
                        <p className="text-[13px] sm:text-[14px] text-[#4b5563] mt-1 tracking-[-0.5px] leading-snug sm:leading-[20px]">
                            {description}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
                {children}
                {actionLabel && onAction && (
                    <Button
                        onClick={onAction}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-[8px] sm:gap-[10px] px-4 sm:px-5 py-2.5 sm:py-3 bg-[#1428AE] text-white rounded-[6px] hover:bg-[#000785] transition-colors h-[44px] sm:h-[50px]"
                    >
                        <ActionIcon className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px]" />
                        <span className="text-[14px] sm:text-[16px] font-medium tracking-[-0.5px] whitespace-nowrap">{actionLabel}</span>
                    </Button>
                )}
            </div>
        </div>
    );
}
