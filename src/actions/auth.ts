"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { z } from "zod";
import { revalidatePath } from "next/cache";

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
    include: { badges: true },
  });

  if (profile && profile.email === "devakadu2007@gmail.com" && profile.role !== "SUPER_ADMIN") {
    // Auto-upgrade the main admin
    const upgraded = await prisma.user.update({
      where: { id: profile.id },
      data: { role: "SUPER_ADMIN" },
      include: { badges: true },
    });
    return upgraded;
  }

  return profile;
}

export async function updateUserProfile(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  const phone = formData.get("phone") as string;
  const hostel = formData.get("hostel") as string;
  const department = formData.get("department") as string;

  await prisma.user.update({
    where: { id: user.id },
    data: {
      phone: phone || null,
      hostel: hostel || null,
      department: department || null,
    },
  });

  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function deleteAccount() {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };
  if (user.role === "SUPER_ADMIN") return { error: "Super Admin cannot be deleted." };

  // Get all items reported by the user
  const userItems = await prisma.item.findMany({
    where: { userId: user.id },
    select: { id: true },
  });
  const itemIds = userItems.map((i) => i.id);

  if (itemIds.length > 0) {
    // Delete matches related to these items
    await prisma.match.deleteMany({
      where: {
        OR: [{ lostItemId: { in: itemIds } }, { foundItemId: { in: itemIds } }],
      },
    });

    // Delete conversations related to these items
    await prisma.conversation.deleteMany({
      where: { itemId: { in: itemIds } },
    });

    // Delete claims on these items
    await prisma.claim.deleteMany({
      where: { itemId: { in: itemIds } },
    });
  }

  // Delete all items reported by the user
  await prisma.item.deleteMany({
    where: { userId: user.id },
  });

  // Hard delete all claims made by the user
  await prisma.claim.deleteMany({
    where: { claimantId: user.id },
  });

  // Hard delete all messages sent by the user
  await prisma.message.deleteMany({
    where: { senderId: user.id },
  });

  // Delete conversations where the user is a participant
  await prisma.conversation.deleteMany({
    where: {
      OR: [{ participant1Id: user.id }, { participant2Id: user.id }],
    },
  });

  // Hard delete all notifications for the user
  await prisma.notification.deleteMany({
    where: { userId: user.id },
  });

  // Finally, scramble the user profile to anonymize it but keep audit logs intact
  await prisma.user.update({
    where: { id: user.id },
    data: {
      authId: `deleted_${user.id}_${Date.now()}`,
      email: `deleted_${user.id}@lostandfound.local`,
      name: "Deleted User",
      phone: null,
      hostel: null,
      department: null,
      avatarUrl: null,
      status: "DELETED",
    },
  });

  return { success: true };
}
