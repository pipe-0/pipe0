import AppLink from "@/components/app-link";
import { BlogBanner } from "@/components/blog-banner";
import { CodeTabs } from "@/components/code-tabs";
import { SandboxPreview } from "@/components/features/docs/sandbox-preview";
import type { MDXComponents } from "mdx/types";
import { useMDXComponents as getDocsThemeComponents } from "nextra-theme-docs";

const docsThemeComponents = getDocsThemeComponents();

export const mdxComponents: MDXComponents = {};

export const themeMdxComponents = {
  AppLink: AppLink,
  CodeTabs: CodeTabs,
  BlogBanner: BlogBanner,
  SandboxPreview: SandboxPreview,
  ...mdxComponents,
  ...docsThemeComponents,
} satisfies MDXComponents;

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...themeMdxComponents,
    ...components,
  };
}
