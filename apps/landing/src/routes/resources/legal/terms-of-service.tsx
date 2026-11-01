import { createFileRoute, redirect } from "@tanstack/react-router";

/** Stable alias for the current terms of service — see the privacy-policy twin. */
export const Route = createFileRoute("/resources/legal/terms-of-service")({
  beforeLoad: async () => {
    const { latestLegalUrl } = await import("@/lib/legal");
    throw redirect({ href: latestLegalUrl("terms-of-service"), statusCode: 307 });
  },
});
