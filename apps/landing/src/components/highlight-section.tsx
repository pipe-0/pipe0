import { Asterisk } from "lucide-react";
import { PropsWithChildren } from "react";

export function HighlightSection({ children }: PropsWithChildren) {
  return (
    <span className="inline-block text-transparent font-sans font-semibold bg-clip-text bg-gradient-to-r from-sky-700 via-blue-600 to-sky-700">
      {children}
    </span>
  );
}

export function BoltSection({ children }: PropsWithChildren) {
  return (
    <span className="inline-block font-semibold bg-clip-text text-foreground font-sans">
      {children}
    </span>
  );
}

export function AsteriskSection({ children }: PropsWithChildren) {
  return (
    <span className="inline-block">
      <Asterisk className="inline text-destructive" />
      <Asterisk className="inline text-destructive" />
      {children}
      <Asterisk className="inline text-destructive" />
      <Asterisk className="inline text-destructive" />
    </span>
  );
}
