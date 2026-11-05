import { Link, useRouter } from "@tanstack/react-router";
import type { ComponentProps } from "react";

/**
 * The link Fumadocs renders in MDX. Its TanStack adapter passes the whole href
 * to `to`, which breaks `#anchor` and `path#anchor` links. Fumadocs 16.17 ships
 * this same fix, so delete this file with that upgrade.
 */
export function MdxLink({
  href = "",
  prefetch = true,
  ...props
}: ComponentProps<"a"> & { prefetch?: boolean }) {
  const router = useRouter();

  if (!href.startsWith("/")) return <a href={href} {...props} />;

  const [pathAndSearch = "", hash] = href.split("#", 2);
  const [path = "", search] = pathAndSearch.split("?", 2);

  return (
    <Link
      to={path}
      search={
        (search ? router.options.parseSearch(`?${search}`) : undefined) as never
      }
      hash={hash}
      preload={prefetch ? "intent" : false}
      {...props}
    />
  );
}
