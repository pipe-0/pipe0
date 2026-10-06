import { baseOptions, linkItems } from "@/lib/layout.shared";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { RootProvider } from "@/components/root-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  // Same shell as the blog: always light, Fumadocs home layout.
  return (
    <RootProvider theme={{ forcedTheme: "light" }}>
      <HomeLayout
        {...baseOptions()}
        links={linkItems}
        themeSwitch={{ enabled: false }}
      >
        {children}
      </HomeLayout>
    </RootProvider>
  );
}
