"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, parseISO } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Campaign } from "@/lib/ads/types";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// ============================================================================
// Schema
// ============================================================================

const formSchema = z
  .object({
    name: z.string()
      .min(2, { message: "Campaign name must be at least 2 characters." })
      .regex(/^\S+$/, { message: "Campaign name must not contain spaces." }),
    rotation_type: z.enum(["random", "sequential"], {
      message: "Please select a rotation type.",
    }),
    start_date: z.date(),
    end_date: z.date().nullable(),
  })
  .refine(
    (data) => {
      if (data.start_date && data.end_date) {
        return data.end_date >= data.start_date;
      }
      return true;
    },
    {
      message: "End date must be on or after the start date.",
      path: ["end_date"],
    }
  );

type FormValues = z.infer<typeof formSchema>;

// ============================================================================
// Component
// ============================================================================

interface CampaignEditorProps {
  isOpen: boolean;
  defaultValue?: Campaign | null;
  onClose: () => void;
  onSave: (data: FormValues) => Promise<void>;
}

export default function CampaignEditor({
  isOpen,
  defaultValue,
  onClose,
  onSave,
}: CampaignEditorProps) {
  const isEditMode = !!defaultValue?.id;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      name: "",
      rotation_type: "random",
      // @ts-ignore
      start_date: undefined,
      end_date: null,
    },
  });

  const [isSaving, setIsSaving] = useState(false);

  // Reset form values when dialog opens or defaultValue changes
  useEffect(() => {
    if (isOpen) {
      if (defaultValue) {
        form.reset({
          name: defaultValue.name || "",
          rotation_type: defaultValue.rotation_type || "random",
          start_date: defaultValue.start_date ? parseISO(defaultValue.start_date) : new Date(),
          end_date: defaultValue.end_date ? parseISO(defaultValue.end_date) : null,
        });
      } else {
        form.reset({
          name: "",
          rotation_type: "random",
          // @ts-ignore
          start_date: undefined,
          end_date: null,
        });
      }
    }
  }, [isOpen, defaultValue, form]);

  async function onSubmit(data: FormValues) {
    try {
      setIsSaving(true);
      await onSave(data);
    } catch (error) {
      console.error("Error saving campaign:", error);
    } finally {
      setIsSaving(false);
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-125 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Campaign" : "Create New Campaign"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6">
            {/* Campaign Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Summer Sale 2026" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Rotation Type */}
            <FormField
              control={form.control}
              name="rotation_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rotation Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select rotation type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="random">Random</SelectItem>
                        <SelectItem value="sequential">Sequential</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose how ads rotate within this campaign.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date Fields */}
            <div className="grid grid-cols-2 gap-4">
              {/* Start Date */}
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ?? undefined}
                          onSelect={field.onChange}
                          autoFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* End Date */}
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ?? undefined}
                          onSelect={field.onChange}
                          disabled={(date) => {
                            const startDate = form.getValues("start_date");
                            if (startDate) {
                              return date < startDate;
                            }
                            return false;
                          }}
                          autoFocus
                        />
                        {field.value && (
                          <div className="p-2 border-t">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="w-full text-muted-foreground"
                              onClick={() => field.onChange(null)}
                            >
                              Clear date
                            </Button>
                          </div>
                        )}
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Leave empty to run indefinitely.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="ghost" onClick={onClose} disabled={isSaving}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isSaving}
              >
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSaving
                  ? (isEditMode ? "Saving..." : "Creating...")
                  : (isEditMode ? "Save Changes" : "+ Create Campaign")
                }
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}