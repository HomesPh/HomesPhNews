"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { AdUnit } from "../../../../lib/ads/types";
import { CreateAdUnitPayload } from "../../../../lib/ads/useAdUnits";

const adUnitSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["image", "text"]).nullable(),
  page_url: z.string().optional().or(z.literal("")),
  size: z.enum(["adaptive"]).nullable(),
});

interface AdUnitFormProps {
  initialData?: AdUnit;
  onSave: (data: CreateAdUnitPayload) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function AdUnitForm({
  initialData,
  onSave,
  onCancel,
  isSubmitting = false,
}: AdUnitFormProps) {
  const form = useForm<z.infer<typeof adUnitSchema>>({
    resolver: zodResolver(adUnitSchema),
    defaultValues: {
      name: "",
      type: "image",
      page_url: "",
      size: "adaptive",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        type: initialData.type || "image",
        page_url: initialData.page_url || "",
        size: initialData.size || "adaptive",
      });
    } else {
      form.reset({
        name: "",
        type: "image",
        page_url: "",
        size: "adaptive",
      });
    }
  }, [initialData, form]);

  const onSubmit = async (values: z.infer<typeof adUnitSchema>) => {
    try {
      const payload: CreateAdUnitPayload = {
        name: values.name,
        type: values.type,
        page_url: values.page_url || null,
        size: values.size,
        campaigns: null // Handled separately
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
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Homepage Top Banner" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || "image"}
                  value={field.value || "image"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="text">Text</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Size</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || "adaptive"}
                  value={field.value || "adaptive"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="adaptive">Adaptive</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="page_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Page URL / Pattern (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., /articles/*" {...field} value={field.value || ""} />
              </FormControl>
              <FormDescription>
                Restrict this unit to specific pages. Leave blank for global or check implementation.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {initialData ? "Save Changes" : "Create Ad Unit"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
