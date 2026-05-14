import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { OnboardingForm } from "./onboarding-form";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Pre-fill from Google profile
  const defaultName =
    user.user_metadata?.full_name || user.user_metadata?.name || "";
  const avatarUrl = user.user_metadata?.avatar_url || "";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
            ✨ Almost there!
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Complete your profile
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Just a few details so others can reach you
          </p>
        </div>

        <OnboardingForm defaultName={defaultName} avatarUrl={avatarUrl} />
      </div>
    </div>
  );
}
