import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { Banner } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import { PropsWithChildren } from "react";
import "nextra-theme-docs/style.css";
import { LogoRaw } from "@/components/logo";

export const metadata = {};

const banner = (
  <Banner storageKey="some-key">Pipe0 is close to launch 🎉</Banner>
);
const navbar = <Navbar logo={<LogoRaw />} />;
const footer = <Footer>MIT {new Date().getFullYear()} © Nextra.</Footer>;

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <Layout
      banner={banner}
      navbar={navbar}
      pageMap={await getPageMap("/resources")}
      docsRepositoryBase="https://github.com/shuding/nextra/tree/main/docs"
      footer={footer}
      // ... Your additional layout options
    >
      {children}
    </Layout>
  );
}
