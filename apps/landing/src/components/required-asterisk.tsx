import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Asterisk } from "lucide-react";
import { PropsWithChildren } from "react";

export function RequiredAsterisk({ children }: PropsWithChildren) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button size="icon" variant="ghost" className="size-5 text-primary">
          <Asterisk />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{children}</TooltipContent>
    </Tooltip>
  );
}
