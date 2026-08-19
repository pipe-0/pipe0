"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef } from "react";

/**
 * Link props that trade viewport prefetching for hover/focus intent.
 *
 * A catalog index renders one Link per entry — 132 pipes, 42 searches — and the
 * default viewport prefetch fires an RSC fetch for every row that scrolls into
 * view. Each of those is a separate object in Vercel's durable cache, so one
 * visit pulls megabytes nobody reads. Prefetching on intent keeps navigation
 * feeling instant on the row someone is actually heading for.
 */
export function useIntentPrefetch(href: string) {
  const router = useRouter();
  const prefetched = useRef(false);

  const onIntent = useCallback(() => {
    if (prefetched.current) return;
    prefetched.current = true;
    router.prefetch(href);
  }, [router, href]);

  return {
    prefetch: false as const,
    onMouseEnter: onIntent,
    onFocus: onIntent,
  };
}
