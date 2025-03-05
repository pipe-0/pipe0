import type React from "react";

import { DocsSidebar } from "@/components/features/docs/docs-sidebar";
import { DocsHeader } from "@/components/features/docs/docs-header";
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

export default function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider className="max-w-none">
      <div className="w-full">
        <div
          className="flex min-h-screen"
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          style={{ "--sidebar": "transparent" }}
        >
          <Sidebar className="bg-black">
            <DocsSidebar />
          </Sidebar>
          <SidebarInset>
            <div>
              <DocsHeader />
              <main className="relative py-6">{children}</main>
            </div>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
