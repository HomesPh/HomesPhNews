"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Ad, Campaign } from "@/lib/ads/types";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";

type FormValues = {
  campaign_ids: string[];
};

interface CampaignChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  ad: Ad | null;
  campaigns?: Campaign[];
  onSave: (adId: string, campaignIds: string[]) => Promise<void>;
}

export default function CampaignChecklistModal({
  isOpen,
  onClose,
  ad,
  campaigns = [],
  onSave,
}: CampaignChecklistModalProps) {
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      campaign_ids: [],
    },
  });

  useEffect(() => {
    if (isOpen && ad) {
      const currentCampaignIds = ad.campaigns?.map((c) => c.id) || [];
      form.reset({
        campaign_ids: currentCampaignIds,
      });
    } else {
      form.reset({
        campaign_ids: [],
      });
    }
  }, [isOpen, ad, form]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  async function onSubmit(data: FormValues) {
    console.log(data);

    if (!ad) return;
    try {
      setIsSaving(true);
      await onSave(ad.id, data.campaign_ids);
      onClose();
    } catch (error) {
      console.error("Error saving campaigns:", error);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Campaigns for {ad?.title}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="campaign_ids"
              render={({ field }) => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Select Campaigns</FormLabel>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto space-y-2 border rounded-md p-2">
                    {campaigns.map((campaign) => (
                      <FormItem
                        key={campaign.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(campaign.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, campaign.id])
                                : field.onChange(
                                  field.value?.filter(
                                    (value) => value !== campaign.id
                                  )
                                );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          {campaign.name}
                        </FormLabel>
                      </FormItem>
                    ))}
                    {campaigns.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No campaigns available.
                      </p>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
