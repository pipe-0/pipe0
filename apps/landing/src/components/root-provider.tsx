import type { ComponentProps } from "react";
import { RootProvider as FumadocsRootProvider } from "fumadocs-ui/provider/tanstack";
import { Image } from "@/components/image";
import { MdxLink } from "@/components/mdx-link";

/**
 * fumadocs' RootProvider with the site-wide settings applied.
 *
 * Search runs on a static index built with the site (/api/search, see that
 * route) and is queried in the browser, so typing never calls a function.
 *
 * The site has one light theme, so there is no theme provider.
 */
export function RootProvider({
  search,
  ...props
}: ComponentProps<typeof FumadocsRootProvider>) {
  return (
    <FumadocsRootProvider
      {...props}
      // MDX images are plain URLs here (`useImport: false` in source.config).
      components={{ Image: Image as never, Link: MdxLink }}
      theme={{ enabled: false }}
      search={{ ...search, options: { type: "static", ...search?.options } }}
    />
  );
}
