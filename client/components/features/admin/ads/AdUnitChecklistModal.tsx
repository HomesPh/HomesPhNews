"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Campaign, AdUnit } from "../../../../lib/ads/types";
import { LayoutTemplate } from "lucide-react";

interface AdUnitChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: Campaign | null;
  adUnits: AdUnit[] | undefined;
  onSave: (campaignId: string, adUnitIds: string[]) => Promise<void>;
}

export default function AdUnitChecklistModal({
  isOpen,
  onClose,
  campaign,
  adUnits = [],
  onSave,
}: AdUnitChecklistModalProps) {
  const [selectedAdUnitIds, setSelectedAdUnitIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen && campaign) {
      // Pre-select ad units that are already associated with this campaign
      // Note: The campaign object needs to have 'ad_units' loaded.
      // If the API returns it as 'ad_units', we use that.
      // Based on types.ts: ad_units?: AdUnit[];
      const currentIds = campaign.ad_units?.map((au) => au.id) || [];
      setSelectedAdUnitIds(currentIds);
    } else {
      setSelectedAdUnitIds([]);
    }
  }, [isOpen, campaign]);

  const handleToggle = (adUnitId: string) => {
    setSelectedAdUnitIds((prev) =>
      prev.includes(adUnitId)
        ? prev.filter((id) => id !== adUnitId)
        : [...prev, adUnitId]
    );
  };

  const handleSave = async () => {
    if (!campaign) return;

    setIsSaving(true);
    try {
      await onSave(campaign.id, selectedAdUnitIds);
      onClose();
    } catch (error) {
      console.error("Failed to save ad units", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Ad Units</DialogTitle>
          <DialogDescription>
            Select which ad units (placements) should display the campaign "
            <span className="font-semibold text-foreground">
              {campaign?.name}
            </span>
            ".
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <ScrollArea className="h-[300px] pr-4">
            {adUnits.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No ad units available. Create one first.
              </p>
            ) : (
              <div className="space-y-4">
                {adUnits.map((au) => (
                  <div key={au.id} className="flex items-start space-x-3 space-y-0">
                    <Checkbox
                      id={`ad-unit-${au.id}`}
                      checked={selectedAdUnitIds.includes(au.id)}
                      onCheckedChange={() => handleToggle(au.id)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor={`ad-unit-${au.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                      >
                        <LayoutTemplate className="h-3 w-3 text-muted-foreground" />
                        {au.name}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {au.size ? au.size : "Unspecified size"} •{" "}
                        {au.type ? au.type.toUpperCase() : "ANY"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Selection"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
