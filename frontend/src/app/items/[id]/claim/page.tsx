import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getCurrentUser } from "@/actions/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { ClaimForm } from "./claim-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ClaimPage({ params }: PageProps) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const item = await prisma.item.findUnique({
    where: { id, deletedAt: null },
    select: { id: true, title: true, type: true, status: true, userId: true },
  });

  if (!item || item.type !== "FOUND" || item.status !== "ACTIVE") {
    notFound();
  }

  if (item.userId === user.id) {
    redirect(`/items/${id}`);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-10">
          <Link
            href={`/items/${id}`}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to item
          </Link>

          <div className="text-center mb-8">
            <Badge
              variant="secondary"
              className="mb-4 px-3 py-1 text-xs font-medium"
            >
              <ShieldCheck className="mr-1.5 h-3 w-3" />
              Claim Ownership
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Claim this item
            </h1>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">
              Provide proof that this item belongs to you. The finder and admins
              will review your claim.
            </p>
          </div>

          <ClaimForm itemId={item.id} itemTitle={item.title} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
