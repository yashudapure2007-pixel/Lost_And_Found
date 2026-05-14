"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { z } from "zod";

const onboardingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
  hostel: z.string().optional(),
  department: z.string().optional(),
});

export async function completeOnboarding(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const parsed = onboardingSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    hostel: formData.get("hostel"),
    department: formData.get("department"),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  // Upsert user profile
  await prisma.user.upsert({
    where: { authId: user.id },
    update: {
      name: parsed.data.name,
      phone: parsed.data.phone || null,
      hostel: parsed.data.hostel || null,
      department: parsed.data.department || null,
      onboardingComplete: true,
    },
    create: {
      authId: user.id,
      email: user.email!,
      name: parsed.data.name,
      phone: parsed.data.phone || null,
      hostel: parsed.data.hostel || null,
      department: parsed.data.department || null,
      avatarUrl: user.user_metadata?.avatar_url || null,
      onboardingComplete: true,
    },
  });

  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const profile = await prisma.user.findUnique({
    where: { authId: user.id },
  });

  return profile;
}
