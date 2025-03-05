"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

interface SidebarMenuLinkProps {
  href: string;
  children: ReactNode;
}

export function SidebarMenuLink({ href, children }: SidebarMenuLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <SidebarMenuButton asChild isActive={isActive}>
      <Link href={href}>
        <ChevronRight className="h-4 w-4" />
        {/* {icon} */}
        <span>{children}</span>
      </Link>
    </SidebarMenuButton>
  );
}
