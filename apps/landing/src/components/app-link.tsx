import { Link } from "@tanstack/react-router";
// components/AppLink.jsx
import { docsLinkPaths, DocsLinkKey } from "@pipe0/doc-links";
import { docLink } from "@/lib/doc-link";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import { PropsWithChildren } from "react";

export default function AppLink({
  linkType,
  children,
}: PropsWithChildren<{ linkType: DocsLinkKey }>) {
  const value = docsLinkPaths[linkType];
  if (!value) throw new Error(`No entry for link "${linkType}" found`);

  const isExternal = value.startsWith("http");
  return (
    <Link
      {...docLink(linkType)}
      className={cn("underline text-fd-foreground", {
        "inline-flex gap-1": isExternal,
      })}
    >
      {children}
      {isExternal && <ArrowUpRight className="size-4" />}
    </Link>
  );
}
