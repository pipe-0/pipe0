import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import type React from "react"; // Import React
import { mdxComponents } from "@/mdx-components";

const postsDirectory = path.join(process.cwd(), "content/blog");

export type Post = {
  slug: string;
  title: string;
  date: string;
  category: string;
  image?: string;
  content: React.ReactNode;
};

export async function getAllPosts(): Promise<Omit<Post, "content">[]> {
  const files = await fs.readdir(postsDirectory);

  const posts = await Promise.all(
    files
      .filter((file) => path.extname(file) === ".mdx")
      .map(async (file) => {
        const source = await fs.readFile(
          path.join(postsDirectory, file),
          "utf8"
        );
        const { data } = matter(source);

        return {
          slug: path.basename(file, ".mdx"),
          title: data.title,
          date: data.date,
          category: data.category,
          image: data.image,
        };
      })
  );

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const filePath = path.join(postsDirectory, `${slug}.mdx`);
    const source = await fs.readFile(filePath, "utf8");

    const { content, data } = matter(source);
    const { content: mdxContent } = await compileMDX({
      source: content,
      options: {
        parseFrontmatter: true,
      },
      components: mdxComponents,
    });

    return {
      slug,
      title: data.title,
      date: data.date,
      category: data.category,
      image: data.image,
      content: mdxContent,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}
