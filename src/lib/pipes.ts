import { compileMdxContent } from "@/lib/mdx";
import { mdxComponents } from "@/mdx-components";
import fs from "fs/promises";
import matter from "gray-matter";
import "highlight.js/styles/github-dark.css";
import { JSONSchema7 } from "json-schema";
import path from "path";
import type React from "react"; // Import React

const pipesCatalog = path.join(process.cwd(), "content/pipes");

type FieldDescription = {
  name: string;
  description: string;
  required: boolean;
  type: "string" | "number" | "boolean" | "json";
  schema: null | JSONSchema7;
};

export type IntegrationPage = {
  slug: string;
  name: string;
  label: string;
  description: string;
  content: React.ReactNode;
  toolCategory: "CRM" | "Payment" | "Marketing" | "Support";
  target: "people" | "companies";
  vendor: string;
  dataLabel: string;
  priority: number;
  isPublished: boolean;
  date: string;
  inputFields: FieldDescription[];
  outputFields: FieldDescription[];
};

export async function getPipePagesAndMetadata() {
  const toolCategories = new Set<string>();
  const vendors = new Set<string>();
  const dataLabels = new Set<string>();

  const integrationPages = await getPipePages();

  // Group pages by category
  integrationPages.forEach((page) => {
    toolCategories.add(page.toolCategory);
    dataLabels.add(page.dataLabel);
    vendors.add(page.vendor);
  });

  return {
    toolCategories: Array.from(toolCategories),
    vendors: Array.from(vendors),
    dataLabels: Array.from(dataLabels),
    pages: integrationPages,
  };
}

export async function getPipePages(): Promise<
  Omit<IntegrationPage, "content">[]
> {
  const files = await fs.readdir(pipesCatalog);

  const integrations = await Promise.all(
    files
      .filter((file) => path.extname(file) === ".mdx")
      .map(async (file) => {
        const source = await fs.readFile(path.join(pipesCatalog, file), "utf8");
        const { data } = matter(source);

        return {
          slug: path.basename(file, ".mdx"),
          name: data.name, // name of the integration is shared with other repos
          label: data.label, // human readable name
          description: data.description,
          toolCategory: data.toolCategory,
          target: data.target,
          vendor: data.vendor,
          dataLabel: data.dataName,
          priority: data.priority,
          date: data.datte,
          isPublished: data.isPublished,
          outputFields: data.outputFields,
          inputFields: data.inputFields,
        };
      })
  );

  return integrations.sort((a, b) => b.priority - a.priority);
}

export async function getPipePageBySlug(
  slug: string
): Promise<IntegrationPage | null> {
  try {
    const filePath = path.join(pipesCatalog, `${slug}.mdx`);
    const source = await fs.readFile(filePath, "utf8");

    const { content, data } = matter(source);
    const mdxContent = await compileMdxContent(content, mdxComponents);

    return {
      slug,
      name: data.name,
      label: data.label,
      description: data.description,
      toolCategory: data.toolCategory,
      target: data.target,
      vendor: data.vendor,
      dataLabel: data.dataName,
      content: mdxContent,
      priority: data.priority,
      date: data.date,
      isPublished: data.isPublished,
      outputFields: data.outputFields,
      inputFields: data.inputFields,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}
