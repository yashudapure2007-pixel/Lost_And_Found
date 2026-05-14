import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Check if user has completed onboarding
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Import prisma dynamically to check profile
        const { prisma } = await import("@/lib/prisma");
        const profile = await prisma.user.findUnique({
          where: { authId: user.id },
        });

        if (!profile || !profile.onboardingComplete) {
          // New user — redirect to onboarding
          const forwardedHost = request.headers.get("x-forwarded-host");
          const isLocalEnv = process.env.NODE_ENV === "development";

          if (isLocalEnv) {
            return NextResponse.redirect(`${origin}/onboarding`);
          } else if (forwardedHost) {
            return NextResponse.redirect(
              `https://${forwardedHost}/onboarding`
            );
          } else {
            return NextResponse.redirect(`${origin}/onboarding`);
          }
        }
      }

      // Existing user — redirect to dashboard or requested page
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // Something went wrong — redirect to error page
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
