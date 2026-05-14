import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getCurrentUser } from "@/actions/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  ClipboardList,
  Search,
  MessageSquare,
  Plus,
  ArrowRight,
} from "lucide-react";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (!user.onboardingComplete) {
    redirect("/onboarding");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Welcome back, {user.name.split(" ")[0]}! 👋
              </h1>
              <p className="text-muted-foreground mt-1">
                Here&apos;s an overview of your activity.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/report/lost"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" })
                )}
              >
                <Plus className="mr-2 h-4 w-4" />
                Report Lost
              </Link>
              <Link
                href="/report/found"
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "shadow-sm shadow-primary/25"
                )}
              >
                <Plus className="mr-2 h-4 w-4" />
                Report Found
              </Link>
            </div>
          </div>

          {/* Quick action cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="group hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-0.5">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                    <ClipboardList className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">My Reports</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  View and manage all your lost and found reports.
                </p>
                <Link
                  href="/dashboard/reports"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "text-primary hover:text-primary"
                  )}
                >
                  View reports
                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-0.5">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                    <Search className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">Browse Items</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Search through all lost and found items on campus.
                </p>
                <Link
                  href="/items"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "text-primary hover:text-primary"
                  )}
                >
                  Browse now
                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-0.5">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">Messages</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Chat with finders or claimants about items.
                </p>
                <Link
                  href="/messages"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "text-primary hover:text-primary"
                  )}
                >
                  Open messages
                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Placeholder for future content */}
          <div className="mt-12 text-center py-16 border-2 border-dashed border-border/50 rounded-2xl">
            <p className="text-muted-foreground">
              Activity feed and stats will appear here as you use the platform.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
