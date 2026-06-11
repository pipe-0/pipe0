import { RootProvider } from "fumadocs-ui/provider/next";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Follow the user's system theme — the redesign carries full dark-mode
  // tokens, so the marketing pages no longer force light.
  return <RootProvider>{children}</RootProvider>;
}
