"use client";

import { Edit, Trash2, Link as LinkIcon } from 'lucide-react';
import { Site } from "@/app/admin/sites/data";
import StatusBadge from "@/components/features/admin/shared/StatusBadge";

interface SiteListItemProps {
    site: Site;
    onEdit?: (site: Site) => void;
    onDelete?: (id: number) => void;
    onToggleStatus?: (id: number) => void;
}

/**
 * SiteListItem component for displaying a single site in the management list
 */
export default function SiteListItem({ site, onEdit, onDelete, onToggleStatus }: SiteListItemProps) {
    const isActive = site.status === 'active';

    return (
        <div className="bg-white border border-[#e5e7eb] rounded-[12px] p-6 hover:shadow-md transition-shadow">
            <div className="flex gap-6">
                {/* Site Logo */}
                <div className="w-[100px] h-[100px] rounded-[8px] overflow-hidden flex-shrink-0 bg-gray-100">
                    <img 
                        src={site.image} 
                        alt={site.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/images/HomesTV.png";
                        }}
                    />
                </div>

                {/* Site Content Details */}
                <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-[18px] font-bold text-[#111827] tracking-[-0.5px]">
                                    {site.name}
                                </h3>
                                <StatusBadge status={site.status} />
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                                <LinkIcon className="w-3.5 h-3.5 text-[#3b82f6]" />
                                <a 
                                    href={`https://${site.domain}`} 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[13px] text-[#3b82f6] hover:underline tracking-[-0.5px]"
                                >
                                    {site.domain}
                                </a>
                                <span className="text-[13px] text-[#6b7280] tracking-[-0.5px]">
                                    Contact: {site.contact}
                                </span>
                            </div>
                            <p className="text-[14px] text-[#6b7280] tracking-[-0.5px] mb-3 leading-relaxed">
                                {site.description}
                            </p>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-[13px] text-[#6b7280] tracking-[-0.5px]">Categories:</span>
                        {site.categories.map((category, idx) => (
                            <span
                                key={idx}
                                className="px-2.5 py-1 bg-[#f3f4f6] text-[#374151] rounded-[4px] text-[12px] tracking-[-0.5px]"
                            >
                                {category}
                            </span>
                        ))}
                    </div>

                    {/* Site Stats */}
                    <div className="flex items-center gap-8 text-[13px] tracking-[-0.5px]">
                        <div>
                            <span className="text-[#6b7280]">Requested: </span>
                            <span className="font-medium text-[#111827]">{site.requested}</span>
                        </div>
                        <div>
                            <span className="text-[#6b7280]">Articles: </span>
                            <span className="font-medium text-[#111827]">{site.articles}</span>
                        </div>
                        <div>
                            <span className="text-[#6b7280]">Monthly Views: </span>
                            <span className="font-medium text-[#111827]">{site.monthlyViews}</span>
                        </div>
                    </div>
                </div>

                {/* Interaction Actions */}
                <div className="flex items-start gap-3">
                    <button
                        onClick={() => onToggleStatus?.(site.id)}
                        className={`px-4 py-2 text-[13px] font-medium rounded-[6px] transition-colors tracking-[-0.5px] ${
                            isActive
                                ? 'text-[#C10007] hover:bg-red-50'
                                : 'text-[#10b981] hover:bg-green-50'
                        }`}
                    >
                        {isActive ? 'Suspend' : 'Activate'}
                    </button>
                    <button
                        onClick={() => onEdit?.(site)}
                        className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit"
                    >
                        <Edit className="w-5 h-5 text-[#3b82f6]" />
                    </button>
                    <button
                        onClick={() => onDelete?.(site.id)}
                        className="p-2.5 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                    >
                        <Trash2 className="w-5 h-5 text-[#ef4444]" />
                    </button>
                </div>
            </div>
        </div>
    );
}

