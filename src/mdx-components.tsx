import type { MDXComponents } from "mdx/types";

export const mdxComponents: MDXComponents = {
  h1: ({ children }) => <h1 className="text-3xl pb-6 pt-2">{children}</h1>,
  h2: ({ children }) => <h2 className="text-2xl pb-4 pt-2">{children}</h2>,
  h3: ({ children }) => <h3 className="text-lg pb-4 pt-2 ">{children}</h3>,
  p: ({ children }) => <p className="text-md pb-4 pt-1">{children}</p>,
  ul: ({ children }) => <ul className="text-lg pb-4 pt-2">{children}</ul>,
  ol: ({ children }) => <ol className="text-lg pb-4">{children}</ol>,
  li: ({ children }) => <li className="text-lg pb-4">{children}</li>,
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...mdxComponents,
    ...components,
  };
}
