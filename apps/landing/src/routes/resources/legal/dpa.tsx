import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * Stable alias for the current DPA. This is the URL that goes into customer
 * contracts and security questionnaires, so it has to outlive any single
 * version: the DPA incorporates itself into the Terms by reference, and a
 * buyer citing a dated URL would be citing superseded terms.
 *
 * Temporary (307) for the same reason as the privacy policy alias: the target
 * moves with every new version and a 308 would be cached past that. Fragments
 * survive the hop, so `/resources/legal/dpa#9-sub-processors` lands on the
 * sub-processor section of whichever version is current.
 */
export const Route = createFileRoute("/resources/legal/dpa")({
  beforeLoad: async () => {
    const { latestLegalUrl } = await import("@/lib/legal");
    throw redirect({ href: latestLegalUrl("dpa"), statusCode: 307 });
  },
});
