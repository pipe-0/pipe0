import { latestLegalVersion } from "@/lib/legal-versions";
import { notFound, redirect } from "next/navigation";

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
export default function LatestPrivacyPolicyPage() {
  const page = latestLegalVersion("privacy-policy");
  if (!page) notFound();
  redirect(page.url);
}
