import { seo, SITE_DESCRIPTION } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_marketing/resources/api-reference")({
  head: () =>
    seo({
      description: SITE_DESCRIPTION,
      path: null,
      image: "/resources/opengraph-image-5fam9d",
      inherited: true,
    }),
  component: ApiReference,
});

function ApiReference() {
  return (
    <div className="api-docs-container">
      <iframe
        src="/api-docs.html"
        width="100%"
        height="100vh"
        style={{ height: "90vh", border: "none" }}
      />
    </div>
  );
}
