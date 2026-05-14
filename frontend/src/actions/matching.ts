"use server";

import { prisma } from "@/lib/prisma";

/**
 * Auto-match engine: when a new item is reported, find potential matches.
 * Matching is based on: same category + overlapping keywords in title/description + proximity in date.
 * Score = category match (40) + keyword overlap (40) + date proximity (20)
 */
export async function findMatches(itemId: string) {
  const item = await prisma.item.findUnique({
    where: { id: itemId },
    include: { category: true },
  });

  if (!item) return [];

  // Get opposite-type items in same category that are still active
  const oppositeType = item.type === "LOST" ? "FOUND" : "LOST";
  const candidates = await prisma.item.findMany({
    where: {
      type: oppositeType,
      categoryId: item.categoryId,
      status: "ACTIVE",
      deletedAt: null,
      userId: { not: item.userId }, // Don't match own items
    },
    include: { category: true, user: true },
  });

  const matches: { candidateId: string; score: number }[] = [];

  for (const candidate of candidates) {
    let score = 0;

    // Category match: +40
    score += 40;

    // Keyword overlap: +0-40
    const itemWords = extractKeywords(item.title + " " + item.description);
    const candWords = extractKeywords(
      candidate.title + " " + candidate.description
    );
    const overlap = itemWords.filter((w) => candWords.includes(w)).length;
    const maxWords = Math.max(itemWords.length, candWords.length, 1);
    score += Math.round((overlap / maxWords) * 40);

    // Date proximity: +0-20 (within 7 days = full score, decays after)
    const daysDiff = Math.abs(
      (item.dateOccurred.getTime() - candidate.dateOccurred.getTime()) /
        (1000 * 60 * 60 * 24)
    );
    if (daysDiff <= 1) score += 20;
    else if (daysDiff <= 3) score += 15;
    else if (daysDiff <= 7) score += 10;
    else if (daysDiff <= 14) score += 5;

    // Location keyword overlap bonus: +0-10
    const locWords1 = extractKeywords(item.locationText);
    const locWords2 = extractKeywords(candidate.locationText);
    const locOverlap = locWords1.filter((w) => locWords2.includes(w)).length;
    if (locOverlap > 0) score += Math.min(locOverlap * 5, 10);

    // Only store if score is meaningful (>= 50)
    if (score >= 50) {
      matches.push({ candidateId: candidate.id, score });
    }
  }

  // Sort by score descending
  matches.sort((a, b) => b.score - a.score);

  // Store top 10 matches in DB
  const topMatches = matches.slice(0, 10);

  for (const match of topMatches) {
    const lostItemId = item.type === "LOST" ? item.id : match.candidateId;
    const foundItemId = item.type === "FOUND" ? item.id : match.candidateId;

    await prisma.match.upsert({
      where: {
        lostItemId_foundItemId: { lostItemId, foundItemId },
      },
      update: { score: match.score },
      create: {
        lostItemId,
        foundItemId,
        score: match.score,
      },
    });

    // Create notifications for both parties
    const otherItem =
      item.type === "LOST"
        ? await prisma.item.findUnique({
            where: { id: match.candidateId },
            select: { userId: true, title: true },
          })
        : await prisma.item.findUnique({
            where: { id: match.candidateId },
            select: { userId: true, title: true },
          });

    if (otherItem) {
      // Notify the item reporter
      await prisma.notification.create({
        data: {
          userId: item.userId,
          type: "MATCH_FOUND",
          title: "Potential match found!",
          body: `Your ${item.type.toLowerCase()} item "${item.title}" may match "${otherItem.title}"`,
          referenceType: "Match",
          referenceId: `${lostItemId}:${foundItemId}`,
        },
      });

      // Notify the other user
      await prisma.notification.create({
        data: {
          userId: otherItem.userId,
          type: "MATCH_FOUND",
          title: "Potential match found!",
          body: `A ${item.type.toLowerCase()} item "${item.title}" may match your report "${otherItem.title}"`,
          referenceType: "Match",
          referenceId: `${lostItemId}:${foundItemId}`,
        },
      });
    }
  }

  return topMatches;
}

function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    "the", "a", "an", "is", "was", "it", "in", "on", "at", "to",
    "for", "of", "with", "and", "or", "my", "i", "me", "this", "that",
    "have", "has", "had", "been", "lost", "found", "near", "around",
    "please", "help", "looking", "left", "color", "colour",
  ]);

  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));
}
