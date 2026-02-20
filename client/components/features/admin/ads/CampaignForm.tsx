"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ImageUploader } from "@/components/shared/ImageUploader";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Campaign } from "../../../../lib/ads/types";
import { CreateCampaignPayload } from "../../../../lib/ads/useCampaigns";

const campaignSchema = z.object({
  name: z.string().min(1, "Name is required"),
  status: z.enum(["active", "paused", "archived"]),
  start_date: z.string().nullable(),
  end_date: z.string().nullable(),
  image_url: z.string().url("Must be a valid URL").optional().or(z.literal("")).nullable(),
  target_url: z.string().url("Must be a valid URL"),
  headline: z.string().optional(),
  banner_image_urls: z.array(z.string().url()).optional().nullable(),
});

interface CampaignFormProps {
  initialData?: Campaign;
  onSave: (data: CreateCampaignPayload) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function CampaignForm({
  initialData,
  onSave,
  onCancel,
  isSubmitting = false,
}: CampaignFormProps) {
  const form = useForm<z.infer<typeof campaignSchema>>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: "",
      status: "active",
      start_date: null,
      end_date: null,
      image_url: "",
      target_url: "",
      headline: "",
      banner_image_urls: [],
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        status: initialData.status,
        start_date: initialData.start_date ? initialData.start_date.split('T')[0] : null,
        end_date: initialData.end_date ? initialData.end_date.split('T')[0] : null,
        image_url: initialData.image_url || null,
        target_url: initialData.target_url,
        headline: initialData.headline || "",
        banner_image_urls: initialData.banner_image_urls || [],
      });
    } else {
      form.reset({
        name: "",
        status: "active",
        start_date: new Date().toISOString().split('T')[0],
        end_date: null,
        image_url: null,
        target_url: "",
        headline: "",
        banner_image_urls: [],
      });
    }
  }, [initialData, form]);

  const onSubmit = async (values: z.infer<typeof campaignSchema>) => {
    try {
      const payload: CreateCampaignPayload = {
        name: values.name,
        status: values.status,
        start_date: values.start_date || null,
        end_date: values.end_date || null,
        image_url: values.image_url || null,
        target_url: values.target_url,
        headline: values.headline || null,
        banner_image_urls: values.banner_image_urls && values.banner_image_urls.length > 0 ? values.banner_image_urls : null,
        ad_units: null // Handled separately if needed, or update API to accept here
      };

      await onSave(payload);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Campaign Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Summer Sale 2024" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} value={field.value || ''} onChange={e => field.onChange(e.target.value || null)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date (Optional)</FormLabel>
                <FormControl>
                  <Input type="date" {...field} value={field.value || ''} onChange={e => field.onChange(e.target.value || null)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="target_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/promo" {...field} />
              </FormControl>
              <FormDescription>Where the user will be redirected on click.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ImageUploader
                  label="Main Image"
                  value={field.value || null}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="banner_image_urls"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ImageUploader
                  label="Banner Images (Multiple)"
                  multiple
                  value={field.value || []}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="headline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Headline</FormLabel>
              <FormControl>
                <Input placeholder="Catchy text for the ad" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {initialData ? "Save Changes" : "Create Campaign"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
