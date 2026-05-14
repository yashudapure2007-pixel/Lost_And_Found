"use client";

import { useState, useTransition } from "react";
import { updateItemStatus } from "@/actions/items";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MapPin, Calendar, MoreVertical, CheckCircle, XCircle, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ItemImage {
  id: string;
  imageUrl: string;
}

interface Item {
  id: string;
  title: string;
  type: string;
  status: string;
  dateOccurred: Date;
  locationText: string;
  images: ItemImage[];
  category: { name: string; icon: string | null };
}

interface ReportsClientProps {
  items: Item[];
}

const statusColors: Record<string, string> = {
  ACTIVE: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  MATCHED: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  CLAIMED: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  RETURNED: "bg-violet-500/10 text-violet-600 border-violet-500/20",
  EXPIRED: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  CANCELLED: "bg-red-500/10 text-red-500 border-red-500/20",
};

export function ReportsClient({ items }: ReportsClientProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticItems, setOptimisticItems] = useState(items);

  const handleStatusChange = (itemId: string, newStatus: "ACTIVE" | "RETURNED" | "CANCELLED") => {
    startTransition(async () => {
      // Optimistic update
      setOptimisticItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, status: newStatus } : item
        )
      );

      // Server update
      const result = await updateItemStatus(itemId, newStatus);
      if (result.error) {
        // Revert on error
        setOptimisticItems(items);
        console.error(result.error);
      }
    });
  };

  if (optimisticItems.length === 0) {
    return (
      <div className="text-center py-20 border-2 border-dashed border-border/50 rounded-2xl">
        <h3 className="text-lg font-semibold">No reports yet</h3>
        <p className="text-muted-foreground mt-1">
          You haven&apos;t reported any lost or found items.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {optimisticItems.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <div className="flex flex-col sm:flex-row">
            <div className="sm:w-48 h-48 sm:h-auto shrink-0 bg-muted relative">
              {item.images.length > 0 ? (
                <Image
                  src={item.images[0].imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  No image
                </div>
              )}
            </div>
            <CardContent className="flex-1 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={item.type === "LOST" ? "destructive" : "default"}>
                        {item.type}
                      </Badge>
                      <Badge variant="outline" className={statusColors[item.status] || ""}>
                        {item.status}
                      </Badge>
                    </div>
                    <Link href={`/items/${item.id}`} className="block group">
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors flex items-center gap-1.5">
                        {item.title}
                        <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h3>
                    </Link>
                  </div>
                  
                  {/* Actions Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      disabled={isPending}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {item.status !== "ACTIVE" && (
                        <DropdownMenuItem onClick={() => handleStatusChange(item.id, "ACTIVE")}>
                          Reopen Report
                        </DropdownMenuItem>
                      )}
                      {item.status === "ACTIVE" && (
                        <>
                          <DropdownMenuItem onClick={() => handleStatusChange(item.id, "RETURNED")}>
                            <CheckCircle className="mr-2 h-4 w-4 text-emerald-500" />
                            Mark as Returned/Found
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleStatusChange(item.id, "CANCELLED")}
                            className="text-destructive focus:text-destructive"
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Cancel Report
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span>{item.category.icon}</span>
                    <span>{item.category.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{item.locationText}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(item.dateOccurred).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  );
}
