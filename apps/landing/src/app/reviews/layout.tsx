import { baseOptions, linkItems } from "@/lib/layout.shared";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { RootProvider } from "@/components/root-provider";
import { hankenPreloaded } from "@/lib/fonts/hanken";
import { monoPreloaded } from "@/lib/fonts/mono";

export default function Layout({ children }: { children: React.ReactNode }) {
  // Same shell as the blog: always light, Fumadocs home layout.
  return (
    <RootProvider>
      <HomeLayout
        {...baseOptions()}
        links={linkItems}
        themeSwitch={{ enabled: false }}
        className={`${hankenPreloaded.variable} ${monoPreloaded.variable}`}
      >
        {children}
      </HomeLayout>
    </RootProvider>
  );
}
