import { PropsWithChildren } from "react";
import { Toaster } from "sonner";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="[&_article]:max-w-[100%] [&_article]:mx-auto">
      {children}
      <Toaster />
    </div>
  );
}
