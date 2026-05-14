import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getCurrentUser } from "@/actions/auth";
import { getUserConversations } from "@/actions/messages";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";

export default async function MessagesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.status === "SUSPENDED") redirect("/suspended");

  const conversations = await getUserConversations();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-2xl font-bold tracking-tight mb-6">Messages</h1>

          {conversations.length > 0 ? (
            <div className="space-y-3">
              {conversations.map((conv) => {
                const otherUser =
                  conv.participant1.id === user.id
                    ? conv.participant2
                    : conv.participant1;
                const lastMsg = conv.messages[0];
                const isUnread =
                  lastMsg && !lastMsg.isRead && lastMsg.senderId !== user.id;

                return (
                  <Link key={conv.id} href={`/messages/${conv.id}`}>
                    <Card
                      className={`hover:shadow-md hover:shadow-primary/5 transition-all duration-200 hover:-translate-y-0.5 ${
                        isUnread ? "border-primary/30 bg-primary/5" : "border-border/50"
                      }`}
                    >
                      <CardContent className="p-4 flex items-center gap-4">
                        <Avatar className="h-11 w-11">
                          <AvatarImage
                            src={otherUser.avatarUrl || undefined}
                            alt={otherUser.name}
                          />
                          <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                            {otherUser.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p
                              className={`text-sm truncate ${
                                isUnread ? "font-bold" : "font-medium"
                              }`}
                            >
                              {otherUser.name}
                            </p>
                            {lastMsg && (
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {new Date(lastMsg.createdAt).toLocaleDateString(
                                  "en-IN",
                                  { month: "short", day: "numeric" }
                                )}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1.5 py-0 shrink-0"
                            >
                              {conv.item.type}
                            </Badge>
                            <p className="text-xs text-muted-foreground truncate">
                              {conv.item.title}
                            </p>
                          </div>
                          {lastMsg && (
                            <p
                              className={`text-xs mt-1 truncate ${
                                isUnread
                                  ? "text-foreground font-medium"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {lastMsg.senderId === user.id ? "You: " : ""}
                              {lastMsg.content}
                            </p>
                          )}
                        </div>

                        {isUnread && (
                          <div className="h-2.5 w-2.5 rounded-full bg-primary shrink-0" />
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold">No messages yet</h3>
              <p className="text-muted-foreground mt-1">
                When you message a finder or someone claims your item, conversations will appear here.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
