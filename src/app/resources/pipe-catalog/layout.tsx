import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="[&_article]:max-w-[1100px] [&_article]:mx-auto">
      {children}
    </div>
  );
}
