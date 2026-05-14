"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { findMatches } from "./matching";
import { checkAndAwardBadges } from "./badges";

const itemSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(120),
  description: z.string().min(20, "Description must be at least 20 characters").max(2000),
  categoryId: z.string().min(1, "Please select a category"),
  dateOccurred: z.string().min(1, "Please provide a date"),
  timeOccurred: z.string().optional(),
  locationText: z.string().min(3, "Please describe the location"),
  holdingLocation: z.string().optional(),
  contactPreference: z.string().default("in_app"),
});

async function getAuthenticatedUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const profile = await prisma.user.findUnique({
    where: { authId: user.id },
  });
  return profile;
}

export async function createLostItem(formData: FormData) {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login");

  const parsed = itemSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    categoryId: formData.get("categoryId"),
    dateOccurred: formData.get("dateOccurred"),
    timeOccurred: formData.get("timeOccurred"),
    locationText: formData.get("locationText"),
    contactPreference: formData.get("contactPreference") || "in_app",
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  // Get image URLs from hidden form field
  const imageUrlsRaw = formData.get("imageUrls") as string;
  const imageUrls: string[] = imageUrlsRaw ? JSON.parse(imageUrlsRaw) : [];

  const item = await prisma.item.create({
    data: {
      userId: user.id,
      type: "LOST",
      title: parsed.data.title,
      description: parsed.data.description,
      categoryId: parsed.data.categoryId,
      dateOccurred: new Date(parsed.data.dateOccurred),
      timeOccurred: parsed.data.timeOccurred || null,
      locationText: parsed.data.locationText,
      contactPreference: parsed.data.contactPreference,
      images: {
        create: imageUrls.map((url, index) => ({
          imageUrl: url,
          order: index,
        })),
      },
    },
  });

  // Create audit log
  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: "CREATE_LOST_ITEM",
      entityType: "Item",
      entityId: item.id,
      newValue: { title: item.title, type: "LOST" },
    },
  });

  // Run auto-matching (don't await — runs in background)
  findMatches(item.id).catch(console.error);

  revalidatePath("/items");
  revalidatePath("/dashboard");
  redirect(`/items/${item.id}`);
}

export async function createFoundItem(formData: FormData) {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login");

  const parsed = itemSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    categoryId: formData.get("categoryId"),
    dateOccurred: formData.get("dateOccurred"),
    timeOccurred: formData.get("timeOccurred"),
    locationText: formData.get("locationText"),
    holdingLocation: formData.get("holdingLocation"),
    contactPreference: formData.get("contactPreference") || "in_app",
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const imageUrlsRaw = formData.get("imageUrls") as string;
  const imageUrls: string[] = imageUrlsRaw ? JSON.parse(imageUrlsRaw) : [];

  const item = await prisma.item.create({
    data: {
      userId: user.id,
      type: "FOUND",
      title: parsed.data.title,
      description: parsed.data.description,
      categoryId: parsed.data.categoryId,
      dateOccurred: new Date(parsed.data.dateOccurred),
      timeOccurred: parsed.data.timeOccurred || null,
      locationText: parsed.data.locationText,
      holdingLocation: parsed.data.holdingLocation || null,
      contactPreference: parsed.data.contactPreference,
      images: {
        create: imageUrls.map((url, index) => ({
          imageUrl: url,
          order: index,
        })),
      },
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: "CREATE_FOUND_ITEM",
      entityType: "Item",
      entityId: item.id,
      newValue: { title: item.title, type: "FOUND" },
    },
  });

  // Run auto-matching
  findMatches(item.id).catch(console.error);

  revalidatePath("/items");
  revalidatePath("/dashboard");
  redirect(`/items/${item.id}`);
}

export async function getCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function updateItemStatus(itemId: string, status: "ACTIVE" | "RETURNED" | "CANCELLED") {
  const user = await getAuthenticatedUser();
  if (!user) return { error: "Unauthorized" };

  const item = await prisma.item.findUnique({
    where: { id: itemId },
    select: { userId: true },
  });

  if (!item || item.userId !== user.id) {
    return { error: "Not found or unauthorized" };
  }

  await prisma.item.update({
    where: { id: itemId },
    data: { status },
  });

  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: "UPDATE_STATUS",
      entityType: "Item",
      entityId: itemId,
      newValue: { status },
    },
  });

  if (status === "RETURNED") {
    await checkAndAwardBadges(user.id);
  }

  revalidatePath("/dashboard/reports");
  revalidatePath(`/items/${itemId}`);
  return { success: true };
}
