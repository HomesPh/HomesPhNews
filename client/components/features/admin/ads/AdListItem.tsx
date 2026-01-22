"use client";

import { Edit, Trash2, ToggleLeft, ToggleRight, ExternalLink } from 'lucide-react';
import { Ad } from "@/app/admin/ads/data";
import { cn } from "@/lib/utils";
import StatusBadge from "@/components/features/admin/shared/StatusBadge";

interface AdListItemProps {
    ad: Ad;
    onEdit?: (ad: Ad) => void;
    onDelete?: (id: number) => void;
    onToggleStatus?: (id: number) => void;
}

/**
 * AdListItem component for displaying a single advertisement in the management list
 */
export default function AdListItem({ ad, onEdit, onDelete, onToggleStatus }: AdListItemProps) {
    const isActive = ad.status === 'active';

    return (
        <div className="bg-white border border-[#e5e7eb] rounded-[12px] p-6 hover:shadow-md transition-shadow">
            <div className="flex gap-6">
                {/* Ad Image Thumbnail */}
                <div className="w-[120px] h-[90px] rounded-[8px] overflow-hidden flex-shrink-0">
                    <img src={ad.image} alt={ad.title} className="w-full h-full object-cover" />
                </div>

                {/* Ad Content Details */}
                <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-[18px] font-bold text-[#111827] tracking-[-0.5px]">
                                    {ad.title}
                                </h3>
                                <StatusBadge status={ad.status} />
                            </div>
                            <p className="text-[14px] text-[#6b7280] tracking-[-0.5px] mb-1">
                                <span className="font-medium">Client:</span> {ad.client} | <span className="font-medium">Type:</span> {ad.type}
                            </p>
                        </div>
                    </div>

                    {/* Ad Placement Info */}
                    <div className="flex items-center gap-6 mb-3">
                        <div>
                            <span className="text-[13px] text-[#6b7280] tracking-[-0.5px]">Ad Placement: </span>
                            <span className="text-[13px] font-medium text-[#111827] tracking-[-0.5px]">{ad.placement}</span>
                        </div>
                        <div>
                            <span className="text-[13px] font-medium text-[#111827] tracking-[-0.5px]">{ad.articlePages}</span>
                        </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="flex items-center gap-8 text-[13px] tracking-[-0.5px]">
                        <div>
                            <span className="text-[#6b7280]">Revenue: </span>
                            <span className="font-semibold text-[#10b981]">{ad.revenue}</span>
                        </div>
                        <div>
                            <span className="text-[#6b7280]">Impressions: </span>
                            <span className="font-medium text-[#111827]">{ad.impressions}</span>
                        </div>
                        <div>
                            <span className="text-[#6b7280]">Clicks: </span>
                            <span className="font-medium text-[#111827]">{ad.clicks}</span>
                        </div>
                        <div>
                            <span className="text-[#6b7280]">Period: </span>
                            <span className="font-medium text-[#111827]">{ad.period}</span>
                        </div>
                    </div>
                </div>

                {/* Interaction Actions */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => onToggleStatus?.(ad.id)}
                        className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
                        title={isActive ? "Deactivate" : "Activate"}
                    >
                        {isActive ? (
                            <ToggleRight className="w-5 h-5 text-[#10b981]" />
                        ) : (
                            <ToggleLeft className="w-5 h-5 text-[#6b7280]" />
                        )}
                    </button>
                    <button
                        onClick={() => onEdit?.(ad)}
                        className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit Ad"
                    >
                        <Edit className="w-5 h-5 text-[#3b82f6]" />
                    </button>
                    <button
                        onClick={() => onDelete?.(ad.id)}
                        className="p-2.5 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Ad"
                    >
                        <Trash2 className="w-5 h-5 text-[#ef4444]" />
                    </button>
                </div>
            </div>
        </div>
    );
}
