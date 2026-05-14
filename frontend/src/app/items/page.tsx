import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ItemCard } from "@/components/item-card";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Search, Package } from "lucide-react";

interface PageProps {
  searchParams: Promise<{
    type?: string;
    q?: string;
    category?: string;
    page?: string;
  }>;
}

export default async function ItemsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const type = params.type?.toUpperCase();
  const query = params.q || "";
  const categoryFilter = params.category || "";
  const page = parseInt(params.page || "1");
  const perPage = 20;

  // Build where clause
  const where: Record<string, unknown> = {
    deletedAt: null,
  };

  if (type === "LOST" || type === "FOUND") {
    where.type = type;
  }

  if (categoryFilter) {
    where.categoryId = categoryFilter;
  }

  if (query) {
    where.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
      { locationText: { contains: query, mode: "insensitive" } },
    ];
  }

  const [items, total, categories] = await Promise.all([
    prisma.item.findMany({
      where,
      include: {
        category: true,
        images: { take: 1, orderBy: { order: "asc" } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.item.count({ where }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Browse Items
              </h1>
              <p className="text-muted-foreground mt-1">
                {total} {total === 1 ? "item" : "items"} found
              </p>
            </div>
          </div>

          {/* Filters bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            {/* Search */}
            <form className="relative flex-1" action="/items" method="GET">
              {type && <input type="hidden" name="type" value={type} />}
              {categoryFilter && (
                <input type="hidden" name="category" value={categoryFilter} />
              )}
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                name="q"
                defaultValue={query}
                placeholder="Search items..."
                className="pl-10 h-10"
              />
            </form>

            {/* Type tabs */}
            <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
              <Link
                href={`/items?${new URLSearchParams({
                  ...(query && { q: query }),
                  ...(categoryFilter && { category: categoryFilter }),
                }).toString()}`}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                  !type
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                All
              </Link>
              <Link
                href={`/items?type=lost&${new URLSearchParams({
                  ...(query && { q: query }),
                  ...(categoryFilter && { category: categoryFilter }),
                }).toString()}`}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                  type === "LOST"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Lost
              </Link>
              <Link
                href={`/items?type=found&${new URLSearchParams({
                  ...(query && { q: query }),
                  ...(categoryFilter && { category: categoryFilter }),
                }).toString()}`}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                  type === "FOUND"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Found
              </Link>
            </div>
          </div>

          {/* Category chips */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Link
              href={`/items?${new URLSearchParams({
                ...(type && { type: type.toLowerCase() }),
                ...(query && { q: query }),
              }).toString()}`}
            >
              <Badge
                variant={!categoryFilter ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/80 transition-colors"
              >
                All categories
              </Badge>
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/items?category=${cat.id}&${new URLSearchParams({
                  ...(type && { type: type.toLowerCase() }),
                  ...(query && { q: query }),
                }).toString()}`}
              >
                <Badge
                  variant={categoryFilter === cat.id ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/80 transition-colors"
                >
                  {cat.icon} {cat.name}
                </Badge>
              </Link>
            ))}
          </div>

          {/* Items grid */}
          {items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Package className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold">No items found</h3>
              <p className="text-muted-foreground mt-1 max-w-sm mx-auto">
                {query
                  ? `No results for "${query}". Try a different search.`
                  : "No items have been reported yet. Be the first!"}
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <Link
                  href="/report/lost"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" })
                  )}
                >
                  Report Lost
                </Link>
                <Link
                  href="/report/found"
                  className={cn(buttonVariants({ size: "sm" }))}
                >
                  Report Found
                </Link>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <Link
                    key={pageNum}
                    href={`/items?page=${pageNum}&${new URLSearchParams({
                      ...(type && { type: type.toLowerCase() }),
                      ...(query && { q: query }),
                      ...(categoryFilter && { category: categoryFilter }),
                    }).toString()}`}
                    className={cn(
                      "h-9 w-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors",
                      pageNum === page
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent text-muted-foreground"
                    )}
                  >
                    {pageNum}
                  </Link>
                )
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
