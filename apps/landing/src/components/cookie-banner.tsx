"use client";

import { buttonSkin } from "@/components/grid";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSyncExternalStore } from "react";

const KEY = "pipe0-cookie-choice";

/**
 * Cookie consent card, bottom left (full width on phones). Visual only for
 * now: either button records the choice in this browser and hides the card;
 * nothing is wired to analytics yet.
 */
/* The stored choice as an external store, so the card renders hidden on the
   server and appears on the client only when no choice has been made. */
const listeners = new Set<() => void>();
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
// Fallback for browsers where storage throws, so the card still closes.
let memoryChoice: string | null = null;
function readChoice(): string | null {
  try {
    return localStorage.getItem(KEY) ?? memoryChoice;
  } catch {
    return memoryChoice;
  }
}

export function CookieBanner() {
  const open = useSyncExternalStore(
    subscribe,
    () => readChoice() === null,
    () => false,
  );

  const choose = (choice: "rejected" | "accepted") => {
    memoryChoice = choice;
    try {
      localStorage.setItem(KEY, choice);
    } catch {}
    for (const cb of listeners) cb();
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="landing fixed inset-x-3 bottom-3 z-[60] rounded-[16px] border border-[var(--rule)] bg-background p-5 shadow-[0_12px_40px_-12px_rgba(14,17,23,0.22),0_2px_6px_rgba(14,17,23,0.06)] sm:inset-x-auto sm:bottom-5 sm:left-5 sm:w-[380px]"
    >
      <p className="text-[15px] leading-snug text-foreground">
        We use cookies for analytics and ads, only if you accept.{" "}
        <Link
          href="/resources/legal/privacy-policy/20261008"
          className="text-muted-foreground underline decoration-[var(--rule-strong)] underline-offset-[3px] hover:text-foreground"
        >
          Cookie policy
        </Link>
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => choose("rejected")}
          className={cn(
            "inline-flex h-11 items-center justify-center rounded-[8px] border text-[15px] font-medium",
            buttonSkin.secondary,
          )}
        >
          Reject all
        </button>
        <button
          type="button"
          onClick={() => choose("accepted")}
          className={cn(
            "inline-flex h-11 items-center justify-center rounded-[8px] border text-[15px] font-medium",
            buttonSkin.primary,
          )}
        >
          Accept all
        </button>
      </div>
    </div>
  );
}
