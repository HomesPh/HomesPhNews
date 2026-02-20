"use client";

import { AdUnit } from "../../../../lib/ads/types";
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
import { MoreHorizontal, Pencil, Trash2, LayoutTemplate, Eye } from "lucide-react";

interface AdUnitListItemProps {
  adUnit: AdUnit;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (adUnit: AdUnit) => void;
}

export default function AdUnitListItem({
  adUnit,
  onToggleStatus,
  onDelete,
  onEdit,
}: AdUnitListItemProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 flex items-center gap-4">
        {/* Icon */}
        <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0 text-blue-600">
          <LayoutTemplate className="h-6 w-6" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 truncate">
              {adUnit.name}
            </h3>
            {adUnit.type && (
              <Badge variant="outline" className="text-xs">
                {adUnit.type.toUpperCase()}
              </Badge>
            )}
            {adUnit.size && (
              <Badge variant="secondary" className="text-xs">
                {adUnit.size}
              </Badge>
            )}
          </div>

          <div className="text-sm text-gray-500">
            {adUnit.page_url ? (
              <span className="truncate block">{adUnit.page_url}</span>
            ) : (
              <span className="italic">No specific page URL</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.href = `/admin/ads/units/${adUnit.id}/details`}
          >
            <Eye className="h-4 w-4 mr-1" />
            Details
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(adUnit)}
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
              <DropdownMenuItem onClick={() => window.location.href = `/admin/ads/units/${adUnit.id}/details`}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(adUnit)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Ad Unit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={() => onDelete(adUnit.id)}
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
