import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ReportForm } from "@/components/report-form";
import { createFoundItem, getCategories } from "@/actions/items";
import { getCurrentUser } from "@/actions/auth";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

export default async function ReportFoundPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.status === "SUSPENDED") redirect("/suspended");

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
              <CheckCircle2 className="mr-1.5 h-3 w-3" />
              Found Item Report
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Report a found item
            </h1>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">
              Describe the item you found. We&apos;ll check if anyone has
              reported it as lost and connect you with the owner.
            </p>
          </div>

          <ReportForm
            type="FOUND"
            categories={categories}
            action={createFoundItem}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
