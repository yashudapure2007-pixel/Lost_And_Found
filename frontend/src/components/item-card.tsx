import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, ImageOff } from "lucide-react";

interface ItemCardProps {
  item: {
    id: string;
    type: "LOST" | "FOUND";
    title: string;
    description: string;
    locationText: string;
    dateOccurred: Date;
    status: string;
    category: {
      name: string;
      icon: string | null;
    };
    images: {
      imageUrl: string;
    }[];
  };
}

const statusColors: Record<string, string> = {
  ACTIVE: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  MATCHED: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  CLAIMED: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  RETURNED: "bg-violet-500/10 text-violet-600 border-violet-500/20",
  EXPIRED: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  CANCELLED: "bg-red-500/10 text-red-500 border-red-500/20",
};

export function ItemCard({ item }: ItemCardProps) {
  const thumbnail = item.images[0]?.imageUrl;

  return (
    <Link href={`/items/${item.id}`}>
      <Card className="group overflow-hidden border-border/50 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-0.5">
        {/* Image */}
        <div className="relative aspect-[4/3] bg-muted overflow-hidden">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={item.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <ImageOff className="h-8 w-8" />
            </div>
          )}
          {/* Type badge */}
          <div className="absolute top-3 left-3">
            <Badge
              variant={item.type === "LOST" ? "destructive" : "default"}
              className="text-xs font-semibold shadow-sm"
            >
              {item.type}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Category */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">
              {item.category.icon} {item.category.name}
            </span>
            <Badge
              variant="outline"
              className={`text-[10px] px-1.5 py-0 ${statusColors[item.status] || ""}`}
            >
              {item.status}
            </Badge>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
            {item.title}
          </h3>

          {/* Meta */}
          <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span className="truncate max-w-[120px]">
                {item.locationText}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>
                {new Date(item.dateOccurred).toLocaleDateString("en-IN", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
