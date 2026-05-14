"use client";

import { useActionState, useState } from "react";
import { createClaim } from "@/actions/claims";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/image-upload";
import { Loader2, Send } from "lucide-react";

interface ClaimFormProps {
  itemId: string;
  itemTitle: string;
}

export function ClaimForm({ itemId, itemTitle }: ClaimFormProps) {
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const [state, formAction, isPending] = useActionState(
    async (_prevState: unknown, formData: FormData) => {
      formData.set("itemId", itemId);
      formData.set("imageUrls", JSON.stringify(imageUrls));
      const result = await createClaim(formData);
      return result;
    },
    null
  );

  const errors = state?.error as Record<string, string[]> | undefined;

  return (
    <Card className="border-border/50 shadow-lg shadow-primary/5">
      <CardContent className="p-6 sm:p-8">
        <div className="mb-6 p-4 rounded-lg bg-primary/5 border border-primary/10">
          <p className="text-sm font-medium">
            Claiming: <span className="text-primary">{itemTitle}</span>
          </p>
        </div>

        {errors?.general && (
          <div className="mb-6 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
            {errors.general[0]}
          </div>
        )}

        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="proofText">
              Proof of ownership <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="proofText"
              name="proofText"
              placeholder="Describe specific details that only the owner would know — unique marks, contents, serial numbers, when/where you lost it, etc."
              rows={5}
              required
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Minimum 20 characters. Be as specific as possible.
            </p>
            {errors?.proofText && (
              <p className="text-xs text-destructive">{errors.proofText[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Supporting photos (optional)</Label>
            <ImageUpload
              value={imageUrls}
              onChange={setImageUrls}
              maxFiles={3}
              bucket="claim-images"
            />
            <p className="text-xs text-muted-foreground">
              Photos of matching items, receipts, or any proof
            </p>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-11 text-base font-medium shadow-md shadow-primary/25"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting claim...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Submit Claim
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
