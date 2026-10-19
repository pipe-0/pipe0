"use client";
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useEffectEvent,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type AskAiContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  /** True once the chat panel's code has been asked for. */
  panelWanted: boolean;
  /** Start loading the chat panel, e.g. when the pointer nears the trigger. */
  wantPanel: () => void;
};

const AskAiContext = createContext<AskAiContextValue | null>(null);

/**
 * App-wide owner of the Ask AI open state. Mount this once in the root layout
 * (which never unmounts across navigations) so the panel stays open or closed
 * when the user moves between the marketing pages and the docs.
 *
 * It deliberately holds no chat code: the chat (AI SDK, zod, markdown) is a
 * large bundle most visitors never open, so the panel is loaded on intent —
 * hover, focus or touch on the trigger, a click, or the ⌘/ hotkey — and the
 * conversation itself lives in a module-level `Chat` instance there, which
 * persists across navigations the same way this provider does.
 */
export function AskAiProvider({ children }: { children: ReactNode }) {
  const [open, setOpenState] = useState(false);
  const [panelWanted, setPanelWanted] = useState(false);

  const wantPanel = useCallback(() => setPanelWanted(true), []);
  const setOpen = useCallback((next: boolean) => {
    if (next) setPanelWanted(true);
    setOpenState(next);
  }, []);

  const onKeyDown = useEffectEvent((e: KeyboardEvent) => {
    if (e.key === "/" && (e.metaKey || e.ctrlKey) && !open) {
      setOpen(true);
      e.preventDefault();
    }
  });

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <AskAiContext
      value={useMemo(
        () => ({ open, setOpen, panelWanted, wantPanel }),
        [open, setOpen, panelWanted, wantPanel],
      )}
    >
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
