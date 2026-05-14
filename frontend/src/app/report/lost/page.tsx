import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ReportForm } from "@/components/report-form";
import { createLostItem, getCategories } from "@/actions/items";
import { getCurrentUser } from "@/actions/auth";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

export default async function ReportLostPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const categories = await getCategories();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-10">
          {/* Header */}
          <div className="text-center mb-8">
            <Badge
              variant="secondary"
              className="mb-4 px-3 py-1 text-xs font-medium"
            >
              <AlertTriangle className="mr-1.5 h-3 w-3" />
              Lost Item Report
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Report a lost item
            </h1>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">
              Fill in the details below. We&apos;ll automatically check for
              matches and notify you if someone found your item.
            </p>
          </div>

          <ReportForm
            type="LOST"
            categories={categories}
            action={createLostItem}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
