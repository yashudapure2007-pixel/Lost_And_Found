"use server";

import { prisma } from "@/lib/prisma";
import { BADGES } from "@/lib/constants";

export async function checkAndAwardBadges(userId: string) {
  // Get all user's items that are RETURNED
  const returnedItemsCount = await prisma.item.count({
    where: { userId, status: "RETURNED" },
  });

  // Get user's existing badges
  const existingBadges = await prisma.userBadge.findMany({
    where: { userId },
    select: { badgeType: true },
  });
  
  const existingBadgeTypes = new Set(existingBadges.map(b => b.badgeType));
  const newBadgesToAward: string[] = [];

  // Check FIRST_FINDER
  if (returnedItemsCount >= 1 && !existingBadgeTypes.has(BADGES.FIRST_FINDER.type)) {
    newBadgesToAward.push(BADGES.FIRST_FINDER.type);
  }

  // Check GOOD_SAMARITAN
  if (returnedItemsCount >= 5 && !existingBadgeTypes.has(BADGES.GOOD_SAMARITAN.type)) {
    newBadgesToAward.push(BADGES.GOOD_SAMARITAN.type);
  }

  // Check CAMPUS_HERO
  if (returnedItemsCount >= 10 && !existingBadgeTypes.has(BADGES.CAMPUS_HERO.type)) {
    newBadgesToAward.push(BADGES.CAMPUS_HERO.type);
  }

  // Award new badges
  if (newBadgesToAward.length > 0) {
    await prisma.userBadge.createMany({
      data: newBadgesToAward.map(badgeType => ({
        userId,
        badgeType,
      })),
    });

    // Notify user about their new badges
    for (const badgeType of newBadgesToAward) {
      const badgeInfo = Object.values(BADGES).find(b => b.type === badgeType);
      if (badgeInfo) {
        await prisma.notification.create({
          data: {
            userId,
            type: "BADGE_EARNED",
            title: "New Badge Unlocked!",
            body: `You earned the ${badgeInfo.icon} ${badgeInfo.name} badge: ${badgeInfo.description}`,
            referenceType: "Badge",
            referenceId: badgeType,
          },
        });
      }
    }
  }

  return newBadgesToAward;
}
