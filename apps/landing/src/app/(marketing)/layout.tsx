import { RootProvider } from "fumadocs-ui/provider/next";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RootProvider theme={{ forcedTheme: "light" }}>
      {children}
    </RootProvider>
  );
}
