import { Mermaid } from "@/components/mermaid-diagram";
import type { MDXComponents } from "mdx/types";
import Link from "next/link";

export const mdxComponents: MDXComponents = {
  h1: ({ children, id }) => (
    <a className="block" href={`#${id}`}>
      <h1
        id={id}
        className="group cursor-pointer text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mt-8 mb-4 relative"
      >
        <span className="absolute -left-6 hidden font-normal text-zinc-400 lg:group-hover:inline">
          #
        </span>
        {children}
      </h1>
    </a>
  ),
  h2: ({ children, id }) => (
    <a className="block" href={`#${id}`}>
      <h2
        id={id}
        className="group cursor-pointer text-3xl font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-4 relative"
      >
        <span className="absolute -left-6 hidden font-normal text-zinc-400 lg:group-hover:inline">
          #
        </span>
        {children}
      </h2>
    </a>
  ),
  h3: ({ children, id }) => (
    <a className="block" href={`#${id}`}>
      <h3
        id={id}
        className="group cursor-pointer text-2xl font-medium text-gray-700 dark:text-gray-300 mt-6 mb-3 relative"
      >
        <span className="absolute -left-6 hidden font-normal text-zinc-400 lg:group-hover:inline-block">
          #
        </span>
        {children}
      </h3>
    </a>
  ),
  h4: ({ children, id }) => (
    <a className="block" href={`#${id}`}>
      <h4
        id={id}
        className="group cursor-pointer text-xl font-medium text-gray-600 dark:text-gray-400 mt-4 mb-2 relative"
      >
        <span className="absolute -left-6 hidden font-normal text-zinc-400 lg:group-hover:inline">
          #
        </span>
        {children}
      </h4>
    </a>
  ),
  p: ({ children }) => (
    <p className="text-base leading-7 text-gray-600 dark:text-gray-400 mb-4">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-outside pl-6 mb-4 text-gray-600 dark:text-gray-400">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-outside pl-6 mb-4 text-gray-600 dark:text-gray-400">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="mb-2 text-base leading-7">{children}</li>
  ),
  a: ({ href, children }) => (
    <Link
      href={href as string}
      className="text-brand dark:text-brand font-semibold hover:underline"
    >
      {children}
    </Link>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 py-2 mb-4 italic text-gray-700 dark:text-gray-300">
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code className="bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5 text-sm font-mono text-gray-800 dark:text-gray-200">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="bg-gray-100 dark:bg-gray-800 rounded p-4 mb-4 overflow-x-auto">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto mb-4">
      <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
        {children}
      </table>
    </div>
  ),
  th: ({ children }) => (
    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
      {children}
    </td>
  ),
  Mermaid: Mermaid,
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...mdxComponents,
    ...components,
  };
}
