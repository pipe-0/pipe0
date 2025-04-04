import { LogoRaw } from "@/components/logo";
import { appInfo } from "@/lib/const";
import { Footer, Layout, Navbar } from "nextra-theme-docs";
import "nextra-theme-docs/style.css";
import { Banner, Search } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import { PropsWithChildren } from "react";

export const metadata = {};

const navbar = <Navbar logo={<LogoRaw />} />;

const search = (
  <Search
    placeholder="Search blog"
    // ... Your additional navbar options
  />
);

export default async function RootLayout({ children }: PropsWithChildren) {
  const banner = (
    <Banner storageKey="4.0-release">🎉 Our new blog is live!</Banner>
  );
  return (
    <Layout
      banner={banner}
      pageMap={await getPageMap("/blog")}
      navbar={navbar}
      search={search}
      sidebar={{ defaultOpen: false, toggleButton: false }}
    >
      <div className="max-w-screen-xl mx-auto">{children}</div>
      <Footer>
        {new Date().getFullYear()} © {appInfo.productName} |&nbsp;
        <a href="/feed.xml" style={{ float: "right" }}>
          RSS
        </a>
      </Footer>
    </Layout>
  );
}
