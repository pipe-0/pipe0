import AppLink from "@/components/app-link";
import { BlogBanner } from "@/components/blog-banner";
import { SandboxPreview } from "@/components/features/docs/sandbox-preview";
import type { MDXComponents } from "mdx/types";

import defaultMdxComponents from "fumadocs-ui/mdx";
import * as FilesComponents from "fumadocs-ui/components/files";
import * as TabsComponents from "fumadocs-ui/components/tabs";
import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import * as icons from "lucide-react";
import { YoutubeEmbed } from "@/components/features/mdx/youtube-embed";
import { APIPage } from "@/components/api-page";

declare module "mdx/types.js" {
  // Augment the MDX types to make it understand React.
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    type Element = React.JSX.Element;
    type ElementClass = React.JSX.ElementClass;
    type ElementType = React.JSX.ElementType;
    type IntrinsicElements = React.JSX.IntrinsicElements;
  }
}

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}

export const mdxComponents: MDXComponents = {};

export const themeMdxComponents = {
  AppLink: AppLink,
  BlogBanner: BlogBanner,
  SandboxPreview: SandboxPreview,
  YoutubeEmbed,
  ...(icons as unknown as MDXComponents),
  ...defaultMdxComponents,
  ...TabsComponents,
  ...FilesComponents,
  Accordion,
  Accordions,
  APIPage,
  ...mdxComponents,
} satisfies MDXComponents;

export function getMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...themeMdxComponents,
    ...components,
  };
}
