"use client";
import { createContext, use, useMemo, useState, type ReactNode } from "react";
import { Chat, useChat, type UseChatHelpers } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { ChatUIMessage } from "./search";

type AskAiContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  chat: UseChatHelpers<ChatUIMessage>;
};

const AskAiContext = createContext<AskAiContextValue | null>(null);

/**
 * App-wide owner of the Ask AI chat state. Mount this once in the root layout
 * (which never unmounts across navigations) so the single `Chat` instance — and
 * therefore its messages and open/closed state — persists when the user moves
 * between the marketing pages and the docs. The per-page `AskAiButton`/`AISearch`
 * instances just subscribe to this shared state via `useAskAiContext`.
 *
 * `children` is passed straight through, so streaming chat updates re-render only
 * the context consumers (the panel), not the whole app subtree.
 */
export function AskAiProvider({ children }: { children: ReactNode }) {
  // Lazy initializer runs once for the lifetime of the provider, giving a single
  // stable Chat instance that outlives page navigations.
  const [chatInstance] = useState<Chat<ChatUIMessage>>(
    () =>
      new Chat<ChatUIMessage>({
        id: "ask-ai",
        transport: new DefaultChatTransport({ api: "/api/chat" }),
      }),
  );

  const chat = useChat<ChatUIMessage>({ chat: chatInstance });
  const [open, setOpen] = useState(false);

  return (
    <AskAiContext value={useMemo(() => ({ chat, open, setOpen }), [chat, open])}>
      {children}
    </AskAiContext>
  );
}

export function useAskAiContext() {
  const ctx = use(AskAiContext);
  if (!ctx) {
    throw new Error("useAskAiContext must be used within <AskAiProvider>");
  }
  return ctx;
}
