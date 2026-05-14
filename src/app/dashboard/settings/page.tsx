import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getCurrentUser } from "@/actions/auth";
import { redirect } from "next/navigation";
import { SettingsForm } from "./settings-form";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.status === "SUSPENDED") {
    redirect("/suspended");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-muted/30 w-full min-w-0">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 w-full min-w-0 break-words">
          <div className="mb-8 min-w-0">
            <h1 className="text-3xl font-bold tracking-tight text-foreground truncate break-words whitespace-normal">
              Settings
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your account settings and preferences.
            </p>
          </div>

          <SettingsForm user={user} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
