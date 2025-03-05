import { PropsWithChildren, ReactNode } from "react";

export function SidebarLayout({
  children,
  sidebar,
}: PropsWithChildren<{ sidebar: ReactNode }>) {
  return (
    <div className="flex gap-8 max-w-screen-xl mx-auto px-10">
      <div className="flex-1">{children}</div>
      <div className="hidden text-sm lg:block w-[350px]">
        <div className="sticky top-12 -mt-10 pt-0">
          <div className="py-6 lg:py-8">{sidebar}</div>
        </div>
      </div>
    </div>
  );
}
