"use client";

import { createClient } from "@/lib/supabase/client";
import { ImagePlus, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
  bucket?: string;
}

export function ImageUpload({
  value,
  onChange,
  maxFiles = 3,
  bucket = "item-images",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      const remainingSlots = maxFiles - value.length;
      if (remainingSlots <= 0) return;

      const filesToUpload = Array.from(files).slice(0, remainingSlots);
      setUploading(true);

      try {
        const supabase = createClient();
        const newUrls: string[] = [];

        for (const file of filesToUpload) {
          // Validate
          if (file.size > 5 * 1024 * 1024) {
            alert(`${file.name} is too large. Max 5MB.`);
            continue;
          }
          if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
            alert(`${file.name} is not a supported format. Use JPG, PNG, or WebP.`);
            continue;
          }

          const ext = file.name.split(".").pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

          const { error } = await supabase.storage
            .from(bucket)
            .upload(fileName, file, {
              cacheControl: "3600",
              upsert: false,
            });

          if (error) {
            console.error("Upload error:", error);
            continue;
          }

          const { data: urlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(fileName);

          newUrls.push(urlData.publicUrl);
        }

        onChange([...value, ...newUrls]);
      } catch (err) {
        console.error("Upload failed:", err);
      } finally {
        setUploading(false);
        // Reset input
        e.target.value = "";
      }
    },
    [value, onChange, maxFiles, bucket]
  );

  const removeImage = (index: number) => {
    const updated = value.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      {/* Preview grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {value.map((url, index) => (
            <div
              key={url}
              className="relative aspect-square rounded-xl overflow-hidden border border-border group"
            >
              <Image
                src={url}
                alt={`Upload ${index + 1}`}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 h-6 w-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      {value.length < maxFiles && (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border/60 rounded-xl cursor-pointer hover:border-primary/40 hover:bg-accent/50 transition-colors">
          {uploading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              Uploading...
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
              <ImagePlus className="h-6 w-6" />
              <span className="text-sm font-medium">Add photos</span>
              <span className="text-xs">
                {value.length}/{maxFiles} · JPG, PNG, WebP · Max 5MB
              </span>
            </div>
          )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      )}
    </div>
  );
}
