"use client";

import { Edit, Trash2, ToggleLeft, ToggleRight, Repeat } from 'lucide-react';
import { Campaign } from "@/lib/ads/types";
import StatusBadge from "@/components/features/admin/shared/StatusBadge";

interface CampaignListItemProps {
  campaign: Campaign;
  onEdit?: (campaign: Campaign) => void;
  onDelete?: (id: string) => void;
  onToggleStatus?: (id: string) => void;
}

/**
 * CampaignListItem component for displaying a single campaign in the management list
 */
export default function CampaignListItem({ campaign, onEdit, onDelete, onToggleStatus }: CampaignListItemProps) {
  const isActive = campaign.is_active;

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-[12px] p-6 hover:shadow-md transition-shadow">
      <div className="flex gap-6">
        {/* Campaign Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-[18px] font-bold text-[#111827] tracking-[-0.5px]">
                  {campaign.name}
                </h3>
                <StatusBadge status={isActive ? 'active' : 'inactive'} />
              </div>
              <p className="text-[14px] text-[#6b7280] tracking-[-0.5px] mb-1">
                <span className="font-medium">Rotation Type:</span> <span className="capitalize">{campaign.rotation_type}</span>
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 text-[13px] tracking-[-0.5px]">
            <div className="flex items-center gap-2">
              <Repeat className="w-4 h-4 text-[#6b7280]" />
              <span className="text-[#6b7280]">Ads Count: </span>
              <span className="font-medium text-[#111827]">{campaign.ads_count}</span>
            </div>
          </div>
        </div>

        {/* Interaction Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onToggleStatus?.(campaign.id)}
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
            onClick={() => onEdit?.(campaign)}
            className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
            title="Edit Campaign"
          >
            <Edit className="w-5 h-5 text-[#3b82f6]" />
          </button>
          <button
            onClick={() => onDelete?.(campaign.id)}
            className="p-2.5 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Campaign"
          >
            <Trash2 className="w-5 h-5 text-[#ef4444]" />
          </button>
        </div>
      </div>
    </div>
  );
}
