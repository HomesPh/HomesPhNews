import { FileText, CheckCircle2, AlertCircle, Eye, Users, MousePointerClick, TrendingUp, DollarSign, SquareStack, ToggleRight, XCircle, Link as LinkIcon, CheckCircle } from 'lucide-react';
import { cn } from "@/lib/utils";

/**
 * Stat Icons mapping
 */
const ICONS = {
    FileText,
    CheckCircle2,
    CheckCircle,
    AlertCircle,
    Eye,
    Users,
    MousePointerClick,
    TrendingUp,
    DollarSign,
    SquareStack,
    ToggleRight,
    XCircle,
    Link: LinkIcon,
};

interface StatCardProps {
    title: string;
    value: string | number;
    trend: string;
    iconName: keyof typeof ICONS;
    iconBgColor?: string;
    iconColor?: string;
    iconSize?: string;
    hasIconBg?: boolean;
}

/**
 * StatCard component for displaying key metrics with icons and trends
 */
export default function StatCard({
    title,
    value,
    trend,
    iconName,
    iconBgColor = "bg-[#dbeafe]",
    iconColor = "text-[#155DFC]",
    iconSize = "w-4 h-4",
    hasIconBg = false,
}: StatCardProps) {
    const Icon = ICONS[iconName];

    return (
        <div className="bg-white rounded-[12px] border border-[#f3f4f6] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] p-6">
            {/* Header: Title and Icon */}
            <div className="flex items-start justify-between mb-3">
                <p className="text-[16px] font-medium text-[#4b5563] tracking-[-0.5px]">{title}</p>
                {hasIconBg ? (
                    <div className={cn("w-[24px] h-[24px] rounded flex items-center justify-center", iconBgColor)}>
                        <Icon className={cn(iconSize, iconColor)} />
                    </div>
                ) : (
                    <Icon className={cn(iconSize, iconColor)} />
                )}
            </div>

            {/* Value */}
            <p className="text-[38px] font-bold text-[#111827] mb-3 tracking-[-0.5px]">{value}</p>

            {/* Trend Indicator */}
            <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#10b981]" />
                <span className="text-[14px] font-semibold text-[#10b981] tracking-[-0.5px]">{trend}</span>
            </div>
        </div>
    );
}
