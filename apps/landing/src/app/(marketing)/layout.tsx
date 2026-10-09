import { RootProvider } from "@/components/root-provider";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Marketing pages (landing, pricing, resources) are always rendered in
  return (
    <RootProvider>
      {children}
    </RootProvider>
  );
}
