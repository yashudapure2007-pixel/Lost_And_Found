import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getCurrentUser } from "@/actions/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ClipboardList } from "lucide-react";
import { ReportsClient } from "./reports-client";
import { Badge } from "@/components/ui/badge";

export default async function UserReportsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const items = await prisma.item.findMany({
    where: { userId: user.id, deletedAt: null },
    include: {
      category: { select: { name: true, icon: true } },
      images: { take: 1, orderBy: { order: "asc" }, select: { id: true, imageUrl: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>

          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
              <ClipboardList className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                My Reports
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your lost and found items
              </p>
            </div>
          </div>

          <ReportsClient items={items} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
