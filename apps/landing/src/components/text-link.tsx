import { cn } from "@/lib/utils";
import { createLink } from "@tanstack/react-router";
import { forwardRef, type ComponentPropsWithoutRef } from "react";

const TextAnchor = forwardRef<HTMLAnchorElement, ComponentPropsWithoutRef<"a">>(
  function TextAnchor({ className, ...props }, ref) {
    return (
      <a
        ref={ref}
        className={cn("text-primary hover:underline", className)}
        {...props}
      />
    );
  },
);

export const TextLink = createLink(TextAnchor);
