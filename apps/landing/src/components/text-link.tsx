import { cn } from "@/lib/utils";
import Link from "next/link";
import { ComponentProps } from "react";

export function TextLink({
  href,
  children,
  className,
  ...rest
}: ComponentProps<typeof Link>) {
  return (
    <Link
      href={href}
      className={cn("text-primary hover:underline", className)}
      {...rest}
    >
      {children}
    </Link>
  );
}
