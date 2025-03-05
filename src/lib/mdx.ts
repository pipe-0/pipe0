import { MDXComponents } from "mdx/types";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { visit } from "unist-util-visit";

// Custom remark plugin to transform Mermaid code blocks
function remarkMermaid() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (tree: any) => {
    visit(tree, "code", (node) => {
      if (node.lang === "mermaid") {
        node.type = "mdxJsxFlowElement";
        node.name = "Mermaid";
        node.attributes = [
          {
            type: "mdxJsxAttribute",
            name: "chart",
            value: node.value,
          },
          {
            type: "mdxJsxAttribute",
            name: "key",
            value: node.value, // Use the chart content as the key
          },
        ];
        delete node.lang;
        delete node.value;
      }
    });
  };
}

export async function compileMdxContent(
  content: string,
  mdxComponents: MDXComponents
) {
  const result = await compileMDX({
    source: content,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [
          remarkGfm, // Handles tables, strikethrough, etc.
          remarkMath, // For math equations
          remarkMermaid,
        ],
        rehypePlugins: [
          rehypeSlug,
          [rehypeHighlight, { detect: true }], // Code highlighting
          rehypeKatex, // Math rendering
        ],
      },
    },
    components: mdxComponents,
  });
  return result.content;
}
