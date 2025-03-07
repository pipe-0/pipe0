import { PropsWithChildren } from "react";

export function HighlightSection({ children }: PropsWithChildren) {
  return (
    <span className="inline-block text-transparent font-sans font-bold bg-clip-text bg-gradient-to-r from-green-400 via-blue-400 to-slate-400">
      {children}
    </span>
  );
}
