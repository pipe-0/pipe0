/** What survives a loader: a fumadocs page without its functions. */
export type PlainPage<T extends { data: object }> = {
  url: string;
  slugs: string[];
  path: string;
  data: {
    [K in keyof T["data"] as T["data"][K] extends (...args: never[]) => unknown
      ? never
      : K extends "info"
        ? never
        : K]: T["data"][K];
  };
};
