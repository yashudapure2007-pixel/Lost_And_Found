"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const claimSchema = z.object({
  proofText: z
    .string()
    .min(20, "Please provide detailed proof of ownership (min 20 chars)")
    .max(2000),
});

async function getAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  return prisma.user.findUnique({ where: { authId: user.id } });
}

export async function createClaim(formData: FormData) {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login");

  const itemId = formData.get("itemId") as string;
  if (!itemId) return { error: { general: ["Item ID is required"] } };

  // Verify item exists and is claimable
  const item = await prisma.item.findUnique({ where: { id: itemId } });
  if (!item || item.type !== "FOUND" || item.status !== "ACTIVE") {
    return { error: { general: ["This item cannot be claimed"] } };
  }

  // Can't claim own item
  if (item.userId === user.id) {
    return { error: { general: ["You cannot claim your own item"] } };
  }

  // Check for existing pending claim
  const existing = await prisma.claim.findFirst({
    where: { itemId, claimantId: user.id, status: "PENDING" },
  });
  if (existing) {
    return { error: { general: ["You already have a pending claim for this item"] } };
  }

  const parsed = claimSchema.safeParse({
    proofText: formData.get("proofText"),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const imageUrlsRaw = formData.get("imageUrls") as string;
  const imageUrls: string[] = imageUrlsRaw ? JSON.parse(imageUrlsRaw) : [];

  const claim = await prisma.claim.create({
    data: {
      itemId,
      claimantId: user.id,
      proofText: parsed.data.proofText,
      images: {
        create: imageUrls.map((url) => ({
          imageUrl: url,
        })),
      },
    },
  });

  // Notify the finder
  await prisma.notification.create({
    data: {
      userId: item.userId,
      type: "NEW_CLAIM",
      title: "New claim on your found item",
      body: `Someone claims "${item.title}" belongs to them`,
      referenceType: "Claim",
      referenceId: claim.id,
    },
  });

  // Update item status
  await prisma.item.update({
    where: { id: itemId },
    data: { status: "CLAIMED" },
  });

  // Auto-create a conversation with the proof as the first message
  let conversation = await prisma.conversation.findUnique({
    where: { itemId },
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        itemId,
        participant1Id: item.userId,  // finder
        participant2Id: user.id,      // claimer
      },
    });
  }

  // Send the claim proof as the first message
  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: user.id,
      content: `📋 **Claim submitted**\n\n${parsed.data.proofText}${imageUrls.length > 0 ? `\n\n📎 ${imageUrls.length} photo(s) attached as proof` : ""}`,
    },
  });

  // Create audit log
  await prisma.auditLog.create({
    data: {
      userId: user.id,
      action: "CREATE_CLAIM",
      entityType: "Claim",
      entityId: claim.id,
      newValue: { itemId, status: "PENDING" },
    },
  });

  revalidatePath(`/items/${itemId}`);
  revalidatePath(`/messages/${conversation.id}`);
  redirect(`/messages/${conversation.id}`);
}
