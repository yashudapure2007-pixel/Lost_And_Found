import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getCurrentUser } from "@/actions/auth";
import { getNotifications, markAllRead } from "@/actions/notifications";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Bell,
  CheckCircle2,
  MessageSquare,
  Shield,
  Sparkles,
} from "lucide-react";

const typeIcons: Record<string, React.ReactNode> = {
  MATCH_FOUND: <Sparkles className="h-4 w-4 text-amber-500" />,
  NEW_CLAIM: <Shield className="h-4 w-4 text-blue-500" />,
  NEW_MESSAGE: <MessageSquare className="h-4 w-4 text-emerald-500" />,
  CLAIM_APPROVED: <CheckCircle2 className="h-4 w-4 text-green-500" />,
  CLAIM_REJECTED: <Shield className="h-4 w-4 text-red-500" />,
};

export default async function NotificationsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  // Mark all as read on page load
  await markAllRead();

  const notifications = await getNotifications();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-2xl font-bold tracking-tight mb-6">
            Notifications
          </h1>

          {notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map((notif) => (
                <Card
                  key={notif.id}
                  className={`border-border/50 ${
                    !notif.isRead ? "bg-primary/5 border-primary/20" : ""
                  }`}
                >
                  <CardContent className="p-4 flex items-start gap-3">
                    <div className="mt-0.5">
                      {typeIcons[notif.type] || (
                        <Bell className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{notif.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {notif.body}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-2">
                        {new Date(notif.createdAt).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {!notif.isRead && (
                      <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-2" />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold">No notifications</h3>
              <p className="text-muted-foreground mt-1">
                You&apos;ll be notified when items match, claims are made, or
                you receive messages.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
