// components/AppLink.jsx
import { appLinks } from "@/lib/links";
import Link from "next/link";
import { PropsWithChildren } from "react";

export default function AppLink({
  linkType,
  children,
}: PropsWithChildren<{ linkType: keyof typeof appLinks }>) {
  const link = appLinks[linkType];
  if (!link) throw new Error(`No entry for link "${linkType}" found`);
  return (
    <Link href={appLinks[linkType]()} className="underline text-brand">
      {children}
    </Link>
  );
}
