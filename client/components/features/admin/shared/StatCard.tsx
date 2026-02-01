"use client";

import {
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
    Link as LinkIcon
} from 'lucide-react';
import { cn } from "@/lib/utils";

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

export default function StatCard({
    title,
    value,
    trend,
    iconName,
    iconBgColor = "bg-red-50",
    iconColor = "text-[#C10007]",
    iconSize = "w-4 h-4",
    hasIconBg = true,
}: StatCardProps) {
    const Icon = ICONS[iconName];
    const isPositive = trend.startsWith('+');

    return (
        <div className="bg-white rounded-[16px] border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex justify-between items-start mb-2">
                <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110",
                    iconBgColor || "bg-gray-50",
                    !hasIconBg && "bg-transparent w-auto h-auto"
                )}>
                    {Icon && <Icon className={cn(iconSize, iconColor)} />}
                </div>
                <div className={cn(
                    "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold",
                    isPositive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                )}>
                    {trend}
                </div>
            </div>

            <div>
                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{title}</h4>
                <p className="text-2xl font-black text-gray-900 tracking-tighter">{value}</p>
            </div>
        </div>
    );
}
