import { RootProvider } from "@/components/root-provider";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_marketing")({
  component: MarketingLayout,
});

function MarketingLayout() {
  return (
    <RootProvider>
      <Outlet />
    </RootProvider>
  );
}
