import { LogoRaw } from "@/components/logo";
import { appInfo } from "@/lib/const";
import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { getPageMap } from "nextra/page-map";
import { PropsWithChildren } from "react";

export const metadata = {};

// const banner = (
//   <Banner storageKey="some-key">Pipe0 is close to launch 🎉</Banner>
// );
const navbar = <Navbar logo={<LogoRaw />} />;
const footer = (
  <Footer>
    {new Date().getFullYear()} © {appInfo.productName}
  </Footer>
);

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <Layout
      navbar={navbar}
      pageMap={await getPageMap("/resources")}
      docsRepositoryBase="https://github.com/pipe-0/pipe0/"
      footer={footer}
      editLink={null}
      feedback={{ content: null }}
      sidebar={{ defaultMenuCollapseLevel: 1 }}
      nextThemes={{ defaultTheme: "light" }}
    >
      {children}
    </Layout>
  );
}
