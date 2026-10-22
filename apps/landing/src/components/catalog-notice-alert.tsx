import type { CatalogNotice } from "@pipe0/base";
import { Alert, AlertDescription } from "@/components/ui/alert";

/**
 * The entry-level callout a pipe or search declares in its catalog `notice`
 * (a cheaper sibling, a long run time, a use restriction). The dashboard shows
 * the same text above the configure form.
 */
export function CatalogNoticeAlert({
  notice,
}: {
  notice: CatalogNotice | undefined;
}) {
  if (!notice) return null;
  return (
    <Alert variant={notice.variant === "warning" ? "warning" : "info"}>
      <AlertDescription>{notice.text}</AlertDescription>
    </Alert>
  );
}
