import { UiExampleCard } from "@/components/features/docs/ui-example-card";
import { ClientOnly } from "@tanstack/react-router";
import { type ReactNode, Suspense } from "react";

function FormSkeleton() {
  return (
    <div className="flex flex-col h-full">
      <div className="h-12 border-b bg-muted/30 animate-pulse" />
      <div className="flex-1 p-4 space-y-3">
        <div className="h-4 w-1/3 rounded bg-muted animate-pulse" />
        <div className="h-9 rounded bg-muted animate-pulse" />
        <div className="h-4 w-1/4 rounded bg-muted animate-pulse" />
        <div className="h-24 rounded bg-muted animate-pulse" />
      </div>
      <div className="border-t p-3">
        <div className="h-9 rounded bg-muted animate-pulse" />
      </div>
    </div>
  );
}

/**
 * The live form a catalog page offers. Its children are lazy: the form reads
 * browser state, and it is the one part of the page that needs the catalog.
 */
export function FormPreview({
  code,
  docsHref,
  children,
}: {
  code: string;
  docsHref: string;
  children: ReactNode;
}) {
  return (
    <UiExampleCard
      docsHref={docsHref}
      code={code}
      preview={
        <ClientOnly fallback={<FormSkeleton />}>
          <Suspense fallback={<FormSkeleton />}>{children}</Suspense>
        </ClientOnly>
      }
    />
  );
}

export function toComponentName(id: string) {
  return id
    .replace(/@.*$/, "")
    .split(/[:_-]/)
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}
