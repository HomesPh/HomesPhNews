"use client";

// CampaignListItem component

import { Campaign } from "../../../../lib/ads/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, ExternalLink, Calendar, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import { format } from "date-fns";

interface CampaignListItemProps {
  campaign: Campaign;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (campaign: Campaign) => void;
  onEditAdUnits: (campaign: Campaign) => void;
}

export default function CampaignListItem({
  campaign,
  onToggleStatus,
  onDelete,
  onEdit,
  onEditAdUnits,
}: CampaignListItemProps) {
  const statusColor =
    campaign.status === "active"
      ? "bg-green-100 text-green-800"
      : campaign.status === "paused"
        ? "bg-yellow-100 text-yellow-800"
        : "bg-gray-100 text-gray-800";

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 flex items-center gap-4">
        {/* Image / Icon */}
        <div className="h-16 w-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 border border-gray-200 flex items-center justify-center">
          {campaign.image_url ? (
            <img
              src={campaign.image_url}
              alt={campaign.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <ImageIcon className="h-6 w-6 text-gray-400" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 truncate">
              {campaign.name}
            </h3>
            <Badge variant="secondary" className={statusColor}>
              {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
            </Badge>
          </div>

          <div className="text-sm text-gray-500 space-y-1">
            {campaign.headline && (
              <p className="truncate">"{campaign.headline}"</p>
            )}

            <div className="flex items-center gap-4">
              <a
                href={campaign.target_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-blue-600 transition-colors"
              >
                <LinkIcon className="h-3 w-3" />
                <span className="truncate max-w-[200px]">{campaign.target_url}</span>
              </a>

              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>
                  {campaign.start_date ? format(new Date(campaign.start_date), "MMM d, yyyy") : "No start date"}
                  {campaign.end_date && ` - ${format(new Date(campaign.end_date), "MMM d, yyyy")}`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(campaign)}
          >
            <Pencil className="h-4 w-4 mr-1" />
            Edit
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onEdit(campaign)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEditAdUnits(campaign)}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Manage Ad Units
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onToggleStatus(campaign.id)}>
                {campaign.status === "active" ? "Pause Campaign" : "Activate Campaign"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={() => onDelete(campaign.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
