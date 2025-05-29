import { cn } from "@/lib/utils";
import { Link2 } from "lucide-react";
import Link from "next/link";

export function QuickLinks({
  links,
}: {
  links: { href: string; label: string }[];
}) {
  return (
    <div className="space-y-2">
      <p className="font-medium">Quick Links</p>
      <ul className="m-0 list-none p-0">
        {links.map((link) => {
          return (
            <li key={link.href} className="mt-0 pt-2">
              <Link
                href={link.href}
                className={cn("text-md font-semibold text-brand ")}
              >
                {link.label}
                <Link2 size={14} className="inline-block ml-2" />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
