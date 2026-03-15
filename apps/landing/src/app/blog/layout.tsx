import { baseOptions, linkItems } from "@/lib/layout.shared";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { RootProvider } from "fumadocs-ui/provider/next";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RootProvider>
      <HomeLayout {...baseOptions()} links={linkItems}>
        {children}
      </HomeLayout>
    </RootProvider>
  );
}
