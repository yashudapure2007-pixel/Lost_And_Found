"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function GlobalRealtime({ userId }: { userId: string }) {
  const router = useRouter();

  useEffect(() => {
    if (!userId) return;

    const supabase = createClient();

    // Subscribe to new notifications for the current user
    const channel = supabase
      .channel(`global_notifications_${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          // payload.new contains the new notification record
          const newNotif = payload.new as { title: string; body: string; type: string };
          
          // Show a toast notification
          toast(newNotif.title, {
            description: newNotif.body,
            icon: newNotif.type === "NEW_MESSAGE" ? "💬" : "🔔",
          });

          // Refresh the Next.js router to update unread counts and data in server components
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, router]);

  return null; // This component doesn't render anything visible
}
