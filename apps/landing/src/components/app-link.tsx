// components/AppLink.jsx
import { docsLinkPaths, DocsLinkKey } from "@pipe0/docs-links";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
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
      href={value}
      className={cn("underline text-primary", {
        "inline-flex gap-1": isExternal,
      })}
    >
      {children}
      {isExternal && <ArrowUpRight className="size-4" />}
    </Link>
  );
}
