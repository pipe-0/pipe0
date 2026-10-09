import { baseOptions, linkItems } from "@/lib/layout.shared";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { RootProvider } from "@/components/root-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RootProvider>
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
