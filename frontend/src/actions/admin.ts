"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "./auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// Middleware isn't perfect for DB checks, so we double-check here
export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    redirect("/");
  }
  return user;
}

export async function getAdminStats() {
  await requireAdmin();

  const [totalUsers, totalItems, activeItems, returnedItems, totalClaims] = await Promise.all([
    prisma.user.count(),
    prisma.item.count(),
    prisma.item.count({ where: { status: "ACTIVE" } }),
    prisma.item.count({ where: { status: "RETURNED" } }),
    prisma.claim.count(),
  ]);

  const resolutionRate = totalItems > 0 ? Math.round((returnedItems / totalItems) * 100) : 0;

  return {
    totalUsers,
    totalItems,
    activeItems,
    returnedItems,
    totalClaims,
    resolutionRate,
  };
}

export async function getAdminItems(page = 1, query = "") {
  await requireAdmin();
  const perPage = 20;

  const where = query
    ? {
        OR: [
          { title: { contains: query, mode: "insensitive" as const } },
          { user: { email: { contains: query, mode: "insensitive" as const } } },
        ],
      }
    : {};

  const items = await prisma.item.findMany({
    where,
    include: {
      user: { select: { name: true, email: true } },
      category: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * perPage,
    take: perPage,
  });

  const total = await prisma.item.count({ where });

  return { items, total, totalPages: Math.ceil(total / perPage) };
}

export async function adminDeleteItem(itemId: string) {
  const admin = await requireAdmin();

  await prisma.item.update({
    where: { id: itemId },
    data: { deletedAt: new Date(), status: "CANCELLED" },
  });

  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: "ADMIN_DELETE_ITEM",
      entityType: "Item",
      entityId: itemId,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/items");
  return { success: true };
}

export async function getAdminUsers() {
  await requireAdmin();
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { items: true, claims: true },
      },
    },
  });
  return users;
}

export async function toggleAdminRole(userId: string, makeAdmin: boolean) {
  const admin = await requireAdmin();
  if (admin.role !== "SUPER_ADMIN") {
    return { error: "Only Super Admin can manage roles." };
  }

  const userToUpdate = await prisma.user.findUnique({ where: { id: userId } });
  if (!userToUpdate || userToUpdate.email === "devakadu2007@gmail.com") {
    return { error: "Cannot modify this user's role." };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role: makeAdmin ? "ADMIN" : "STUDENT" },
  });

  revalidatePath("/admin/users");
  return { success: true };
}

export async function toggleUserSuspension(userId: string, suspend: boolean) {
  const admin = await requireAdmin();
  
  const userToUpdate = await prisma.user.findUnique({ where: { id: userId } });
  if (!userToUpdate || userToUpdate.email === "devakadu2007@gmail.com") {
    return { error: "Cannot modify this user's status." };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { status: suspend ? "SUSPENDED" : "ACTIVE" },
  });

  revalidatePath("/admin/users");
  return { success: true };
}

export async function getUserAuditLogs(userId: string) {
  await requireAdmin();
  return prisma.auditLog.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}
