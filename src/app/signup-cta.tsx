import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { appInfo } from "@/lib/const";
import { ArrowRight, Banknote, CreditCard } from "lucide-react";

export function SignupCta() {
  return (
    <div className="space-y-1">
      <a rel="nofollow" href={appInfo.links.signupUrl} className="inline-block">
        <HoverBorderGradient className="bg-accent">
          <div className="flex items-center gap-2 font-semibold">
            Sign up now, it&apos;s free <ArrowRight className="size-6" />
          </div>
        </HoverBorderGradient>
      </a>
      <ul className="text-sm pl-4 pt-2 text-muted-foreground flex gap-4">
        <li className="flex gap-2 items-center">
          <CreditCard className="size-4" /> No card required
        </li>
        <li className="flex gap-2 items-center">
          <Banknote className="size-4" />
          Start with 20 free credits
        </li>
      </ul>
    </div>
  );
}
