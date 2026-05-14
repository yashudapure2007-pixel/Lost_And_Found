import { Navbar } from "@/components/navbar";
import { getCurrentUser } from "@/actions/auth";
import { getConversationMessages } from "@/actions/messages";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { ChatInput } from "./chat-input";

interface PageProps {
  params: Promise<{ conversationId: string }>;
}

export default async function ConversationPage({ params }: PageProps) {
  const { conversationId } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const data = await getConversationMessages(conversationId);
  if (!data) notFound();

  const { conversation, messages, currentUserId } = data;
  const otherUser =
    conversation.participant1.id === currentUserId
      ? conversation.participant2
      : conversation.participant1;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col">
        {/* Chat header */}
        <div className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-16 z-40">
          <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
            <Link
              href="/messages"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <Avatar className="h-9 w-9">
              <AvatarImage
                src={otherUser.avatarUrl || undefined}
                alt={otherUser.name}
              />
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                {otherUser.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{otherUser.name}</p>
              <div className="flex items-center gap-1.5">
                <Badge
                  variant="outline"
                  className="text-[10px] px-1.5 py-0"
                >
                  {conversation.item.type}
                </Badge>
                <span className="text-xs text-muted-foreground truncate">
                  {conversation.item.title}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-6 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-10">
                <p className="text-sm text-muted-foreground">
                  Start the conversation — say hello!
                </p>
              </div>
            )}

            {messages.map((msg) => {
              const isMe = msg.senderId === currentUserId;
              return (
                <div
                  key={msg.id}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex items-end gap-2 max-w-[75%] ${isMe ? "flex-row-reverse" : ""}`}>
                    {!isMe && (
                      <Avatar className="h-7 w-7 shrink-0">
                        <AvatarImage
                          src={msg.sender.avatarUrl || undefined}
                          alt={msg.sender.name}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-semibold">
                          {msg.sender.name[0]}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        isMe
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-muted rounded-bl-md"
                      }`}
                    >
                      {msg.content}
                      <div
                        className={`text-[10px] mt-1 ${
                          isMe
                            ? "text-primary-foreground/60"
                            : "text-muted-foreground"
                        }`}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Input */}
        <ChatInput conversationId={conversationId} />
      </main>
    </div>
  );
}
