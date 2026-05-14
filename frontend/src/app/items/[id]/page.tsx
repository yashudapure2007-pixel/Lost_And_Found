import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/actions/auth";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  MapPin,
  Calendar,
  Clock,
  Tag,
  MessageSquare,
  Flag,
  User,
  ImageOff,
  ArrowLeft,
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

const statusColors: Record<string, string> = {
  ACTIVE: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  MATCHED: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  CLAIMED: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  RETURNED: "bg-violet-500/10 text-violet-600 border-violet-500/20",
  EXPIRED: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  CANCELLED: "bg-red-500/10 text-red-500 border-red-500/20",
};

export default async function ItemDetailPage({ params }: PageProps) {
  const { id } = await params;

  const item = await prisma.item.findUnique({
    where: { id, deletedAt: null },
    include: {
      category: true,
      images: { orderBy: { order: "asc" } },
      user: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
          createdAt: true,
        },
      },
    },
  });

  if (!item) notFound();

  const currentUser = await getCurrentUser();
  const isOwner = currentUser?.id === item.userId;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
          {/* Back link */}
          <Link
            href="/items"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to items
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Images - Left side */}
            <div className="lg:col-span-3">
              {item.images.length > 0 ? (
                <div className="space-y-3">
                  {/* Main image */}
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
                    <Image
                      src={item.images[0].imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  {/* Thumbnails */}
                  {item.images.length > 1 && (
                    <div className="grid grid-cols-3 gap-3">
                      {item.images.slice(1).map((img) => (
                        <div
                          key={img.id}
                          className="relative aspect-square rounded-xl overflow-hidden bg-muted"
                        >
                          <Image
                            src={img.imageUrl}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-[4/3] rounded-2xl bg-muted flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <ImageOff className="h-12 w-12 mx-auto mb-2" />
                    <p className="text-sm">No photos uploaded</p>
                  </div>
                </div>
              )}
            </div>

            {/* Details - Right side */}
            <div className="lg:col-span-2 space-y-6">
              {/* Type + Status */}
              <div className="flex items-center gap-2">
                <Badge
                  variant={item.type === "LOST" ? "destructive" : "default"}
                >
                  {item.type}
                </Badge>
                <Badge
                  variant="outline"
                  className={statusColors[item.status] || ""}
                >
                  {item.status}
                </Badge>
              </div>

              {/* Title */}
              <h1 className="text-2xl font-bold tracking-tight">
                {item.title}
              </h1>

              {/* Meta info */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {item.category.icon} {item.category.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{item.locationText}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {new Date(item.dateOccurred).toLocaleDateString("en-IN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                {item.timeOccurred && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{item.timeOccurred}</span>
                  </div>
                )}
                {item.holdingLocation && (
                  <div className="flex items-center gap-2 text-sm">
                    <Flag className="h-4 w-4 text-muted-foreground" />
                    <span>Holding: {item.holdingLocation}</span>
                  </div>
                )}
              </div>

              <Separator />

              {/* Description */}
              <div>
                <h2 className="font-semibold mb-2">Description</h2>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {item.description}
                </p>
              </div>

              <Separator />

              {/* Reporter */}
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={item.user.avatarUrl || undefined}
                    alt={item.user.name}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                    {item.user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{item.user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Reported{" "}
                    {new Date(item.createdAt).toLocaleDateString("en-IN", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              {currentUser && !isOwner && item.status === "ACTIVE" && (
                <div className="flex flex-col gap-3 pt-2">
                  {item.type === "FOUND" && (
                    <Link
                      href={`/items/${item.id}/claim`}
                      className={cn(
                        buttonVariants({ size: "lg" }),
                        "w-full h-11 shadow-md shadow-primary/25"
                      )}
                    >
                      This is mine — Claim
                    </Link>
                  )}
                  <Link
                    href={`/messages/redirect?item=${item.id}`}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "lg" }),
                      "w-full h-11"
                    )}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Message {item.type === "LOST" ? "owner" : "finder"}
                  </Link>
                </div>
              )}

              {isOwner && (
                <Card className="border-amber-500/20 bg-amber-500/5">
                  <CardContent className="p-4 text-sm text-amber-700">
                    <p className="font-medium">This is your report</p>
                    <p className="text-amber-600 mt-1">
                      You can edit or cancel it from your dashboard.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
