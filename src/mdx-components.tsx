import type { MDXComponents } from "mdx/types";
import { useMDXComponents as getDocsThemeComponents } from "nextra-theme-docs";

const docsThemeComponents = getDocsThemeComponents();

export const mdxComponents: MDXComponents = {};

export const themeMdxComponents = {
  ...mdxComponents,
  ...docsThemeComponents,
} satisfies MDXComponents;

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...themeMdxComponents,
    ...components,
  };
}
