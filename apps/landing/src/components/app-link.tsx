// components/AppLink.jsx
import { appLinks } from "@/lib/links";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { PropsWithChildren } from "react";

export default function AppLink({
  linkType,
  children,
}: PropsWithChildren<{ linkType: keyof typeof appLinks }>) {
  const link = appLinks[linkType];
  if (!link) throw new Error(`No entry for link "${linkType}" found`);

  const value = appLinks[linkType]();
  const isExternal = value.startsWith("http");
  return (
    <Link
      href={appLinks[linkType]()}
      className={cn("underline text-primary", {
        "inline-flex gap-1": isExternal,
      })}
    >
      {children}
      {isExternal && <ArrowUpRight className="size-4" />}
    </Link>
  );
}
