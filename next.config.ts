import createMDX from "@next/mdx";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import nextra from "nextra";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  // Optionally, add any other Next.js config below
};

// const withMDX = createMDX({
//   options: {
//     remarkPlugins: [remarkGfm],
//     rehypePlugins: [[rehypeHighlight, { detect: true }]],
//   },
// });

const withNextra = nextra({
  // ... Other Nextra config options
});

// Merge MDX config with Next.js config
export default withNextra(nextConfig);
