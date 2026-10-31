import type { ComponentProps } from "react";
import { RootProvider as FumadocsRootProvider } from "fumadocs-ui/provider/tanstack";
import { Image } from "@/components/image";
import { SiteLink } from "@/components/link";
import { themeScriptProps } from "@/lib/theme-script";

/**
 * fumadocs' RootProvider with the site-wide settings applied.
 *
 * Search runs on a static index built with the site (/api/search, see that
 * route) and is queried in the browser, so typing never calls a function.
 *
 * One theme for the whole site: light is forced everywhere (docs, blog,
 * marketing), and the layouts hide the theme switch.
 */
export function RootProvider({
  theme,
  search,
  ...props
}: ComponentProps<typeof FumadocsRootProvider>) {
  return (
    <FumadocsRootProvider
      {...props}
      components={{ Image, Link: SiteLink }}
      theme={{
        ...theme,
        forcedTheme: "light",
        defaultTheme: "light",
        enableSystem: false,
        scriptProps: themeScriptProps,
      }}
      search={{ ...search, options: { type: "static", ...search?.options } }}
    />
  );
}
