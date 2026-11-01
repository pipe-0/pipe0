import type browserCollections from "collections/browser";

/** A collection's frontmatter, as its schema outputs it. */
export type Frontmatter<C extends keyof typeof browserCollections> = Awaited<
  ReturnType<(typeof browserCollections)[C]["raw"][string]>
>["frontmatter"];

export type ContentPage<T> = {
  url: string;
  slug: string;
  /** The file, which keys the collection's client loader. */
  path: string;
  data: T;
};

/**
 * Pages from a frontmatter glob. Posts sit at `./(0028)/<slug>/index.mdx` and
 * reviews at `./<slug>/index.mdx`, so the folder is the slug.
 */
export function contentPages<T>(
  baseUrl: string,
  files: Record<string, T>,
): ContentPage<T>[] {
  return Object.entries(files).map(([file, data]) => {
    const path = file.slice("./".length);
    const slug = path.split("/").at(-2)!;
    return { url: `${baseUrl}/${slug}`, slug, path, data };
  });
}
