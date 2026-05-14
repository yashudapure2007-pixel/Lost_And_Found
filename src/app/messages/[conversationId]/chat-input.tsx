"use client";

import { sendMessage } from "@/actions/messages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2 } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

interface ChatInputProps {
  conversationId: string;
}

export function ChatInput({ conversationId }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isPending) return;

    const formData = new FormData();
    formData.set("conversationId", conversationId);
    formData.set("content", message);

    startTransition(async () => {
      await sendMessage(formData);
      setMessage("");
      router.refresh();
      inputRef.current?.focus();
    });
  };

  return (
    <div className="border-t border-border/40 bg-background/80 backdrop-blur-sm sticky bottom-0">
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3"
      >
        <Input
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="h-10 flex-1"
          disabled={isPending}
        />
        <Button
          type="submit"
          size="icon"
          disabled={!message.trim() || isPending}
          className="h-10 w-10 shrink-0 shadow-sm shadow-primary/25"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
}
