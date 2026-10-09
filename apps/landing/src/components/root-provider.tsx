"use client";

import type { ComponentProps } from "react";
import { RootProvider as FumadocsRootProvider } from "fumadocs-ui/provider/next";
import { themeScriptProps } from "@/lib/theme-script";

/**
 * fumadocs' RootProvider with the site-wide settings applied.
 *
 * This has to be a client module: `themeScriptProps` picks the script type by
 * checking for `window`, which only works where it is evaluated. Imported
 * from a server layout, it is always the server value, and the browser gets a
 * live <script> that React warns about.
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
