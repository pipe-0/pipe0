import AppLink from "@/components/app-link";
import { BlogBanner } from "@/components/blog-banner";
import { CodeTabs } from "@/components/code-tabs";
import type { MDXComponents } from "mdx/types";
import { useMDXComponents as getDocsThemeComponents } from "nextra-theme-docs";

const docsThemeComponents = getDocsThemeComponents();

export const mdxComponents: MDXComponents = {};

export const themeMdxComponents = {
  AppLink: AppLink,
  CodeTabs: CodeTabs,
  BlogBanner: BlogBanner,
  ...mdxComponents,
  ...docsThemeComponents,
} satisfies MDXComponents;

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...themeMdxComponents,
    ...components,
  };
}
