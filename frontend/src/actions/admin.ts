"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "./auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// Middleware isn't perfect for DB checks, so we double-check here
export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
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
