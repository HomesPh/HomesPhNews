"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import AXIOS_INSTANCE_ADMIN from "@/lib/api-v2/admin/axios-instance";

interface ImageUploaderProps {
  value: string | string[] | null;
  onChange: (value: string | string[] | null) => void;
  multiple?: boolean;
  label?: string;
  className?: string;
}

export function ImageUploader({
  value,
  onChange,
  multiple = false,
  label,
  className,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const images = Array.isArray(value)
    ? value
    : value
      ? [value]
      : [];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const uploadedUrls: string[] = [];

    try {
      // Upload each file sequentially
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("image", file);

        const response = await AXIOS_INSTANCE_ADMIN.post(
          "/v1/admin/upload/image",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data && response.data.url) {
          uploadedUrls.push(response.data.url);
        }
      }

      if (multiple) {
        onChange([...images, ...uploadedUrls]);
      } else {
        // Single mode: replace value with the last uploaded image
        onChange(uploadedUrls[uploadedUrls.length - 1]);
      }
    } catch (error) {
      console.error("Upload failed", error);
      // Ideally show a toast notification here
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = (indexToRemove: number) => {
    if (multiple) {
      const newImages = images.filter((_, index) => index !== indexToRemove);
      onChange(newImages.length > 0 ? newImages : null);
    } else {
      onChange(null);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}

      {/* Image Grid */}
      {(images.length > 0 || isUploading) && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {images.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="relative group aspect-video rounded-md overflow-hidden border border-border bg-muted"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Uploaded ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {isUploading && (
            <div className="aspect-video rounded-md border border-border bg-muted flex flex-col items-center justify-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Uploading...</span>
            </div>
          )}
        </div>
      )}

      {/* Upload Button Area */}
      {(!value || multiple) && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 rounded-lg p-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            multiple={multiple}
          />
          <div className="p-4 rounded-full bg-muted">
            <Upload className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              Click to upload {multiple ? "images" : "an image"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              SVG, PNG, JPG or GIF (max 5MB)
            </p>
            {/* Direct URL Input Option */}
            <div className="mt-4 flex items-center justify-center w-full" onClick={(e) => e.stopPropagation()}>
              <div className="flex w-full items-center space-x-2">
                {/* This could be expanded to allow manual URL entry if file upload fails */}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Optional: URL Input Fallback */}
      <div className="flex gap-2">
        <Input
          placeholder="Or enter image URL directly..."
          value={!multiple && typeof value === 'string' ? value : ''}
          onChange={(e) => {
            if (!multiple) onChange(e.target.value);
          }}
          className="flex-1"
        />
      </div>
    </div>
  );
}
