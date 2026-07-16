import { baseOptions, linkItems } from "@/lib/layout.shared";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { RootProvider } from "fumadocs-ui/provider/next";

export default function Layout({ children }: { children: React.ReactNode }) {
  // The blog, like the marketing pages, is always rendered in light mode —
  // `forcedTheme` pins next-themes to light regardless of the visitor's
  // system/stored preference, so the `.dark` class is never set here.
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
