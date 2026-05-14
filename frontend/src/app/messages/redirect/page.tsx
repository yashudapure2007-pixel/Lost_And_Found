import { getOrCreateConversation } from "@/actions/messages";
import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{ item?: string }>;
}

export default async function MessagesRedirect({ searchParams }: PageProps) {
  const params = await searchParams;
  const itemId = params.item;

  if (itemId) {
    const conversation = await getOrCreateConversation(itemId);
    if (conversation) {
      redirect(`/messages/${conversation.id}`);
    }
  }

  // Fallback — load messages page (this component is replaced by the page.tsx below)
  redirect("/messages");
}
