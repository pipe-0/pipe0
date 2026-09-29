import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "2-digit",
  timeZone: "UTC",
});

type CatalogDeprecationAlertProps = {
  kind: "pipe" | "search";
  deprecatedOn: string;
  /** The final current successor, resolved through any deprecated hops. */
  successor: { id: string; docPath: string } | null;
};

/**
 * Mirrors the markdown notice in the catalog sources, so a reader of the HTML
 * page (human or agent) gets the same instruction: do not use this id, use
 * the successor.
 */
export function CatalogDeprecationAlert({
  kind,
  deprecatedOn,
  successor,
}: CatalogDeprecationAlertProps) {
  return (
    <Alert variant="destructive">
      <AlertTitle className="line-clamp-none">
        Deprecated since {dateFormatter.format(new Date(deprecatedOn))}. Do not
        use this {kind} in new work.
      </AlertTitle>
      <AlertDescription>
        {successor ? (
          <p>
            Use{" "}
            <Link href={successor.docPath} className="font-mono underline">
              {successor.id}
            </Link>{" "}
            instead. This {kind} keeps running only for sheets and integrations
            that already use it and can be removed without notice.
          </p>
        ) : (
          <p>
            This {kind} has no current replacement. It keeps running only for
            sheets and integrations that already use it and can be removed
            without notice.
          </p>
        )}
      </AlertDescription>
    </Alert>
  );
}
