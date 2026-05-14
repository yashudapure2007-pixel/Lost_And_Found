"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/image-upload";
import { CONTACT_PREFERENCES } from "@/lib/constants";
import { Loader2, Send } from "lucide-react";

interface Category {
  id: string;
  name: string;
  icon: string | null;
}

interface ReportFormProps {
  type: "LOST" | "FOUND";
  categories: Category[];
  action: (formData: FormData) => Promise<{ error?: Record<string, string[]> } | undefined>;
}

export function ReportForm({ type, categories, action }: ReportFormProps) {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [contactPref, setContactPref] = useState("in_app");

  const handleCategoryChange = (val: string | null) => {
    if (val) setCategoryId(val);
  };
  const handleContactPrefChange = (val: string | null) => {
    if (val) setContactPref(val);
  };

  const [state, formAction, isPending] = useActionState(
    async (_prevState: unknown, formData: FormData) => {
      formData.set("imageUrls", JSON.stringify(imageUrls));
      formData.set("categoryId", categoryId);
      formData.set("contactPreference", contactPref);
      const result = await action(formData);
      return result;
    },
    null
  );

  const errors = state?.error as Record<string, string[]> | undefined;
  const isLost = type === "LOST";

  return (
    <Card className="border-border/50 shadow-lg shadow-primary/5">
      <CardContent className="p-6 sm:p-8">
        <form action={formAction} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              placeholder={
                isLost
                  ? 'e.g., "Blue wallet with college ID"'
                  : 'e.g., "Found a set of keys near library"'
              }
              required
              className="h-11"
            />
            {errors?.title && (
              <p className="text-xs text-destructive">{errors.title[0]}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>
              Category <span className="text-destructive">*</span>
            </Label>
            <Select value={categoryId} onValueChange={handleCategoryChange}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors?.categoryId && (
              <p className="text-xs text-destructive">{errors.categoryId[0]}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder={
                isLost
                  ? "Describe the item in detail — color, brand, distinguishing marks, contents, etc."
                  : "Describe what you found — color, condition, any identifying features, etc."
              }
              rows={4}
              required
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">Minimum 20 characters</p>
            {errors?.description && (
              <p className="text-xs text-destructive">{errors.description[0]}</p>
            )}
          </div>

          {/* Photos */}
          <div className="space-y-2">
            <Label>Photos</Label>
            <ImageUpload
              value={imageUrls}
              onChange={setImageUrls}
              maxFiles={3}
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateOccurred">
                Date {isLost ? "lost" : "found"}{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="dateOccurred"
                name="dateOccurred"
                type="date"
                max={new Date().toISOString().split("T")[0]}
                required
                className="h-11"
              />
              {errors?.dateOccurred && (
                <p className="text-xs text-destructive">
                  {errors.dateOccurred[0]}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeOccurred">
                Approximate time{" "}
                <span className="text-muted-foreground text-xs">(optional)</span>
              </Label>
              <Input
                id="timeOccurred"
                name="timeOccurred"
                type="time"
                className="h-11"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="locationText">
              Location <span className="text-destructive">*</span>
            </Label>
            <Input
              id="locationText"
              name="locationText"
              placeholder={
                isLost
                  ? "e.g., Near the library entrance, 2nd floor corridor"
                  : "e.g., Found on a bench near the cafeteria"
              }
              required
              className="h-11"
            />
            {errors?.locationText && (
              <p className="text-xs text-destructive">
                {errors.locationText[0]}
              </p>
            )}
          </div>

          {/* Holding location (found items only) */}
          {!isLost && (
            <div className="space-y-2">
              <Label htmlFor="holdingLocation">
                Where is the item now?{" "}
                <span className="text-muted-foreground text-xs">(optional)</span>
              </Label>
              <Input
                id="holdingLocation"
                name="holdingLocation"
                placeholder='e.g., "With me" or "Dropped at security office"'
                className="h-11"
              />
            </div>
          )}

          {/* Contact preference */}
          <div className="space-y-2">
            <Label>Contact preference</Label>
            <Select value={contactPref} onValueChange={handleContactPrefChange}>
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CONTACT_PREFERENCES.map((pref) => (
                  <SelectItem key={pref.value} value={pref.value}>
                    {pref.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-11 text-base font-medium shadow-md shadow-primary/25"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Submit Report
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
