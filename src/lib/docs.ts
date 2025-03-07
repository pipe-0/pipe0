import { compileMdxContent } from "@/lib/mdx";
import { mdxComponents } from "@/mdx-components";
import fs from "node:fs/promises";
import matter from "gray-matter";
import "highlight.js/styles/github-dark.css";
import path from "node:path";
import type React from "react";

const orderedDocsCategories = [
  "Getting Started",
  "Concepts",
  "API Reference",
  "Tools",
  "Guides",
  "Use Cases",
  "Examples",
] as const;

export type DocCategory = (typeof orderedDocsCategories)[number];

const docsDirectory = path.join(process.cwd(), "content/docs");

export type DocsPage = {
  slug: string;
  title: string;
  category: DocCategory;
  description: string;
  icon: string;
  content: React.ReactNode;
  priority: number;
  isPublished: boolean;
  date: string;
};

export async function getDocPages(): Promise<Omit<DocsPage, "content">[]> {
  const files = await fs.readdir(docsDirectory);

  const docPages = await Promise.all(
    files
      .filter((file) => path.extname(file) === ".mdx")
      .map(async (file) => {
        const source = await fs.readFile(
          path.join(docsDirectory, file),
          "utf8"
        );
        const { data } = matter(source);

        return {
          slug: path.basename(file, ".mdx"),
          title: data.title,
          description: data.description,
          category: data.category,
          icon: data.icon,
          priority: data.priority,
          date: data.date,
          isPublished: data.isPublished,
        };
      })
  );

  return docPages.sort((a, b) => {
    if (a.priority) return b.priority - a.priority;
    return a.title - b.title;
  });
}

export async function getDocCategories() {
  const categories = new Set<DocCategory>();
  const docPages = await getDocPages();

  // Group pages by category
  docPages.forEach((page) => {
    categories.add(page.category);
  });

  const orderedCategories = Array.from(categories).sort(
    (a, b) =>
      orderedDocsCategories.indexOf(a) - orderedDocsCategories.indexOf(b)
  );

  return orderedCategories.map((name) => ({
    name,
    items: docPages.filter((page) => page.category === name),
  }));
}

export async function getDocPageBySlug(slug: string): Promise<DocsPage | null> {
  try {
    const filePath = path.join(docsDirectory, `${slug}.mdx`);
    const source = await fs.readFile(filePath, "utf8");

    const { content, data } = matter(source);
    const mdxContent = await compileMdxContent(content, mdxComponents);

    return {
      slug,
      title: data.title,
      category: data.category,
      content: mdxContent,
      description: data.description,
      icon: data.icon,
      priority: data.priority,
      date: data.date,
      isPublished: data.isPublished,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}
