import { baseOptions, linkItems } from "@/lib/layout.shared";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { HomeLayout } from "fumadocs-ui/layouts/home";

export const Route = createFileRoute("/_marketing/resources/legal")({
  component: LegalLayout,
});

function LegalLayout() {
  return (
    <HomeLayout {...baseOptions()} links={linkItems}>
      <Outlet />
    </HomeLayout>
  );
}
