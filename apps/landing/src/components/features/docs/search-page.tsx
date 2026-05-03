import { CatalogPageLayout } from "@/components/features/docs/docs-layout";
import { SearchId } from "@pipe0/base";
import { PropsWithChildren } from "react";

export async function SearchPage({
  children,
}: PropsWithChildren<{ searchId: SearchId }>) {
  return <CatalogPageLayout>{children}</CatalogPageLayout>;
}
