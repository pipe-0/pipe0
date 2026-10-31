import { Link as RouterLink, useRouter } from "@tanstack/react-router";
import { forwardRef, type ComponentPropsWithoutRef } from "react";

type SiteLinkProps = Omit<ComponentPropsWithoutRef<"a">, "href"> & {
  href?: string;
  prefetch?: boolean;
};

/**
 * Link for hrefs known only at runtime: catalog paths, MDX links, config data.
 * Static internal links use the router's typed <Link to> directly.
 *
 * The router's `to` takes a path only, so search and hash go separately, and
 * a same-page anchor stays a native link because the router drops its hash.
 */
export const SiteLink = forwardRef<HTMLAnchorElement, SiteLinkProps>(function SiteLink(
  { href = "", prefetch = true, ...props },
  ref,
) {
  const router = useRouter();

  if (!href.startsWith("/")) return <a ref={ref} href={href} {...props} />;

  const [pathAndSearch = "", hash] = href.split("#", 2);
  const [path = "", search] = pathAndSearch.split("?", 2);

  return (
    <RouterLink
      ref={ref}
      to={path as never}
      search={(search ? router.options.parseSearch(`?${search}`) : undefined) as never}
      hash={hash}
      preload={prefetch ? "intent" : false}
      {...props}
    />
  );
});
