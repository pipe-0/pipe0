import { latestLegalVersion } from "@/lib/legal-versions";
import { notFound, redirect } from "next/navigation";

/** Stable alias for the current terms of service — see the privacy-policy twin. */
export default function LatestTermsOfServicePage() {
  const page = latestLegalVersion("terms-of-service");
  if (!page) notFound();
  redirect(page.url);
}
