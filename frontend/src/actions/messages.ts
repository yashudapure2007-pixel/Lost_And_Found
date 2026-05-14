"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function getAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  return prisma.user.findUnique({ where: { authId: user.id } });
}

export async function getOrCreateConversation(itemId: string) {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login");

  const item = await prisma.item.findUnique({
    where: { id: itemId },
    select: { id: true, userId: true },
  });

  if (!item) return null;
  if (item.userId === user.id) return null; // Can't message yourself

  // Check existing conversation
  const existing = await prisma.conversation.findUnique({
    where: { itemId },
  });

  if (existing) return existing;

  // Create new conversation
  const conversation = await prisma.conversation.create({
    data: {
      itemId,
      participant1Id: item.userId,
      participant2Id: user.id,
    },
  });

  return conversation;
}

export async function sendMessage(formData: FormData) {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login");

  const conversationId = formData.get("conversationId") as string;
  const content = formData.get("content") as string;

  if (!conversationId || !content?.trim()) {
    return { error: "Message cannot be empty" };
  }

  // Verify user is a participant
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: { item: { select: { title: true } } },
  });

  if (!conversation) return { error: "Conversation not found" };
  if (
    conversation.participant1Id !== user.id &&
    conversation.participant2Id !== user.id
  ) {
    return { error: "Not authorized" };
  }

  const message = await prisma.message.create({
    data: {
      conversationId,
      senderId: user.id,
      content: content.trim(),
    },
  });

  // Notify the other participant
  const otherUserId =
    conversation.participant1Id === user.id
      ? conversation.participant2Id
      : conversation.participant1Id;

  await prisma.notification.create({
    data: {
      userId: otherUserId,
      type: "NEW_MESSAGE",
      title: "New message",
      body: `New message about "${conversation.item.title}"`,
      referenceType: "Conversation",
      referenceId: conversationId,
    },
  });

  revalidatePath(`/messages/${conversationId}`);
  return { success: true, message };
}

export async function getUserConversations() {
  const user = await getAuthenticatedUser();
  if (!user) return [];

  return prisma.conversation.findMany({
    where: {
      OR: [
        { participant1Id: user.id },
        { participant2Id: user.id },
      ],
    },
    include: {
      item: { select: { title: true, type: true } },
      participant1: { select: { id: true, name: true, avatarUrl: true } },
      participant2: { select: { id: true, name: true, avatarUrl: true } },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { content: true, createdAt: true, senderId: true, isRead: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getConversationMessages(conversationId: string) {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      item: { select: { id: true, title: true, type: true } },
      participant1: { select: { id: true, name: true, avatarUrl: true } },
      participant2: { select: { id: true, name: true, avatarUrl: true } },
    },
  });

  if (!conversation) return null;
  if (
    conversation.participant1Id !== user.id &&
    conversation.participant2Id !== user.id
  ) {
    return null;
  }

  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
    include: {
      sender: { select: { id: true, name: true, avatarUrl: true } },
    },
  });

  // Mark unread messages as read
  await prisma.message.updateMany({
    where: {
      conversationId,
      senderId: { not: user.id },
      isRead: false,
    },
    data: { isRead: true, readAt: new Date() },
  });

  return {
    conversation,
    messages,
    currentUserId: user.id,
  };
}
