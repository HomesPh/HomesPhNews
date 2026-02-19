"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Ad } from "@/lib/ads/types";
import { useEffect, useState } from "react";
import Image from "next/image";
import { uploadImage } from "@/lib/api-v2/admin/service/upload/uploadImage";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";


const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  description: z.string().optional().nullable(),
  image_url: z.url({ message: "Please enter a valid URL." }).or(z.literal("")),
  destination_url: z.url({ message: "Please enter a valid URL." }),
  is_active: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface AdEditorModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  initialData?: Ad;
  onClose: () => void;
  onSave: (data: FormValues) => Promise<void>;
}

export default function AdEditorModal({ isOpen, onClose, mode, initialData, onSave }: AdEditorModalProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      title: "",
      description: "",
      image_url: "",
      destination_url: "",
      is_active: false,
    },
  });

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imageUrl = form.watch('image_url');

  useEffect(() => {
    setImageError(false);
  }, [imageUrl]);


  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const response = await uploadImage(file);
        form.setValue('image_url', response.data.url, { shouldValidate: true, shouldDirty: true });
        // also set the title to the filename if it's empty
        if (!form.getValues('title')) {
          form.setValue('title', file.name.split('.').slice(0, -1).join('.'));
        }
      } catch (error) {
        console.error("Failed to upload image", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        form.reset({
          title: initialData.title,
          description: initialData.description || "",
          image_url: initialData.image_url || "",
          destination_url: initialData.destination_url,
          is_active: initialData.is_active,
        });
      } else {
        form.reset({
          title: "",
          description: "",
          image_url: "",
          destination_url: "",
          is_active: false,
        });
      }
    }
  }, [isOpen, initialData, form]);

  async function onSubmit(data: FormValues) {
    try {
      setIsSaving(true);
      await onSave(data);
    } catch (error) {
      console.error("Error saving ad:", error);
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create New Advertisement' : 'Edit Advertisement'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ad Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Real Estate Expo 2026" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter a brief description..."
                      className="resize-none"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-4">
                      {field.value && !imageError && (
                        <div className="relative w-full h-48 bg-gray-100 rounded-md overflow-hidden border">
                          <Image
                            src={field.value}
                            alt="Ad Preview"
                            fill
                            unoptimized={true}
                            className="object-cover"
                            onError={() => setImageError(true)}
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => field.onChange("")}
                          >
                            Remove Image
                          </Button>
                        </div>
                      )}
                      {field.value && imageError && (
                        <div className="relative w-full h-48 bg-red-50 rounded-md border border-red-200 flex flex-col items-center justify-center gap-2">
                          <span className="text-red-500 font-medium">Invalid or Error Loading Image</span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-red-500 border-red-200 hover:bg-red-50"
                            onClick={() => field.onChange("")}
                          >
                            Remove & Try Again
                          </Button>
                        </div>
                      )}
                      {!field.value && (
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <Input
                              type="file"
                              accept="image/*"
                              disabled={isUploading}
                              onChange={handleImageUpload}
                              className="cursor-pointer"
                            />
                            {isUploading && <span className="text-sm text-muted-foreground">Uploading...</span>}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Upload an image for the advertisement. Supported formats: JPG, PNG, WEBP.
                          </p>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="destination_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destination URL</FormLabel>
                  <FormControl>
                    <Input placeholder="http://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="border-t pt-6">
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-[#C10007] data-[state=checked]:border-[#C10007]"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Set ad as active immediately
                      </FormLabel>
                      <FormDescription>
                        Active ads will be displayed on selected placements
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="ghost" onClick={onClose} disabled={isSaving}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isSaving || isUploading}
              >
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSaving
                  ? (mode === 'create' ? 'Creating...' : 'Saving...')
                  : (mode === 'create' ? '+ Create Advertisement' : 'Save Changes')
                }
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
