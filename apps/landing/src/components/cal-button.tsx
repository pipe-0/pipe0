"use client";

import { Button } from "@/components/ui/button";
import { type VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/button";

import { getCalApi } from "@calcom/embed-react";
import { PropsWithChildren, useEffect } from "react";

type CalButtonProps = PropsWithChildren<{
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
  className?: string;
}>;

export default function CalButton({
  children,
  variant,
  size,
  className,
}: CalButtonProps) {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "pipe0-introduction" });
      cal("ui", { hideEventTypeDetails: false, layout: "month_view" });
    })();
  }, []);
  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      data-cal-namespace="pipe0-introduction"
      data-cal-link="florian-martens/pipe0-introduction"
      data-cal-config='{"layout":"month_view"}'
    >
      {children}
    </Button>
  );
}
