import { Button } from "@/components/ui/button";
import { type VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/button";

import { getCalApi } from "@calcom/embed-react";
import { PropsWithChildren } from "react";

type CalButtonProps = PropsWithChildren<{
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
  className?: string;
}>;

const namespace = "pipe0-introduction";
const calLink = "florian-martens/pipe0-introduction";
const config = { layout: "month_view" as const };

/**
 * Cal.com's embed script (and the cookie its CDN sets) loads on intent —
 * pointer, touch or focus on the button — not with the page. The modal is
 * opened from code, so a click that lands before the script finishes still
 * opens it once it is ready.
 */
let calApi: ReturnType<typeof getCalApi> | undefined;
function loadCal() {
  calApi ??= getCalApi({ namespace }).then((cal) => {
    cal("ui", { hideEventTypeDetails: false, layout: "month_view" });
    return cal;
  });
  return calApi;
}

export default function CalButton({
  children,
  variant,
  size,
  className,
}: CalButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onPointerEnter={loadCal}
      onTouchStart={loadCal}
      onFocus={loadCal}
      onClick={async () => {
        const cal = await loadCal();
        cal("modal", { calLink, config });
      }}
    >
      {children}
    </Button>
  );
}
