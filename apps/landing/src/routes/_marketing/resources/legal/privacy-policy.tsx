import { getLatestLegalUrl } from "@/lib/legal.functions";
import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * Stable alias for the current privacy policy. Dated versions never move, so
 * anything citing a specific one keeps resolving; this URL is the one to hand
 * to third parties (the Slack Marketplace listing, DPAs) that would otherwise
 * go stale the day a new version ships.
 *
 * Deliberately a TEMPORARY (307) redirect, not `permanentRedirect`: the target
 * changes with every new version, and a 308 would be cached by browsers and
 * CDNs long after that. Fragments survive the hop, so
 * `/resources/legal/privacy-policy#6-data-sharing-and-processors` lands on the
 * sub-processor table of whichever version is current.
 */
export const Route = createFileRoute(
  "/_marketing/resources/legal/privacy-policy",
)({
  beforeLoad: async () => {
    const href = await getLatestLegalUrl({ data: "privacy-policy" });
    throw redirect({ href, statusCode: 307 });
  },
});
