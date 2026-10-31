import { CatalogPageLayout } from "@/components/features/docs/docs-layout";
import { SearchId } from "@pipe0/base";
import { PropsWithChildren } from "react";

export function SearchPage({
  children,
}: PropsWithChildren<{ searchId: SearchId }>) {
  return <CatalogPageLayout>{children}</CatalogPageLayout>;
}
