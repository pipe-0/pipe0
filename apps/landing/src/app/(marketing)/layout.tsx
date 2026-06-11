import { RootProvider } from "fumadocs-ui/provider/next";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Marketing pages (landing, pricing, resources) are always rendered in
  // light mode — `forcedTheme` pins next-themes to light regardless of the
  // visitor's system/stored preference, so the `.dark` class is never set
  // on this subtree.
  return (
    <RootProvider theme={{ forcedTheme: "light" }}>{children}</RootProvider>
  );
}
