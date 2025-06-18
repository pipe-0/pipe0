"use client";

import { Button } from "@/components/ui/button";

import { getCalApi } from "@calcom/embed-react";
import { PropsWithChildren, useEffect } from "react";

export default function CalButton({ children }: PropsWithChildren) {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "pipe0-introduction" });
      cal("ui", { hideEventTypeDetails: false, layout: "month_view" });
    })();
  }, []);
  return (
    <Button
      data-cal-namespace="pipe0-introduction"
      data-cal-link="florian-martens/pipe0-introduction"
      data-cal-config='{"layout":"month_view"}'
    >
      {children}
    </Button>
  );
}
