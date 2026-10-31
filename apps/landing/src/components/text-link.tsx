import { cn } from "@/lib/utils";
import { SiteLink } from "@/components/link";
import { ComponentProps } from "react";

export function TextLink({
  href,
  children,
  className,
  ...rest
}: ComponentProps<typeof SiteLink>) {
  return (
    <SiteLink
      href={href}
      className={cn("text-primary hover:underline", className)}
      {...rest}
    >
      {children}
    </SiteLink>
  );
}
