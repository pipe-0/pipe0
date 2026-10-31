import { getLatestLegalUrl } from "@/lib/legal.functions";
import { createFileRoute, redirect } from "@tanstack/react-router";

/** Stable alias for the current terms of service — see the privacy-policy twin. */
export const Route = createFileRoute(
  "/_marketing/resources/legal/terms-of-service",
)({
  beforeLoad: async () => {
    const href = await getLatestLegalUrl({ data: "terms-of-service" });
    throw redirect({ href, statusCode: 307 });
  },
});
