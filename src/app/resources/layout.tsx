import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { Banner } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import { PropsWithChildren } from "react";
import "nextra-theme-docs/style.css";
import { LogoRaw } from "@/components/logo";
import { appInfo } from "@/lib/const";

export const metadata = {};

const banner = (
  <Banner storageKey="some-key">Pipe0 is close to launch 🎉</Banner>
);
const navbar = <Navbar logo={<LogoRaw />} />;
const footer = (
  <Footer>
    {new Date().getFullYear()} © {appInfo.productName}
  </Footer>
);

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <Layout
      banner={banner}
      navbar={navbar}
      pageMap={await getPageMap("/resources")}
      docsRepositoryBase="https://github.com/shuding/nextra/tree/main/docs"
      footer={footer}
      editLink={null}
      feedback={{ content: null }}
    >
      {children}
    </Layout>
  );
}
