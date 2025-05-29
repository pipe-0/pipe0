import { PropsWithChildren } from "react";

export function HighlightSection({ children }: PropsWithChildren) {
  return (
    <span className="inline-block text-transparent font-sans font-semibold bg-clip-text bg-gradient-to-r from-stone-600 via-blue-600 to-sky-800">
      {children}
    </span>
  );
}
