"use client";

import { completeOnboarding } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight, Loader2 } from "lucide-react";
import { useActionState } from "react";

interface OnboardingFormProps {
  defaultName: string;
  avatarUrl: string;
}

export function OnboardingForm({ defaultName, avatarUrl }: OnboardingFormProps) {
  const [state, formAction, isPending] = useActionState(
    async (_prevState: unknown, formData: FormData) => {
      const result = await completeOnboarding(formData);
      return result;
    },
    null
  );

  const errors = state?.error as Record<string, string[]> | undefined;

  return (
    <Card className="border-border/50 shadow-2xl shadow-primary/5">
      <CardContent className="p-8">
        {/* Avatar preview */}
        <div className="flex justify-center mb-6">
          <Avatar className="h-20 w-20 ring-4 ring-primary/10">
            <AvatarImage src={avatarUrl} alt={defaultName} />
            <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
              {defaultName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2) || "?"}
            </AvatarFallback>
          </Avatar>
        </div>

        <form action={formAction} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Display Name *</Label>
            <Input
              id="name"
              name="name"
              defaultValue={defaultName}
              placeholder="Your name"
              required
              className="h-11"
            />
            {errors?.name && (
              <p className="text-xs text-destructive">{errors.name[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+91 98765 43210"
              className="h-11"
            />
            <p className="text-xs text-muted-foreground">
              Optional — helps with item return coordination
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hostel">Hostel</Label>
              <Input
                id="hostel"
                name="hostel"
                placeholder="e.g., Hostel A"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                name="department"
                placeholder="e.g., CS"
                className="h-11"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-11 text-base font-medium mt-2 shadow-md shadow-primary/25"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting up...
              </>
            ) : (
              <>
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
