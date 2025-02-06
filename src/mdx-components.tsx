import type { MDXComponents } from "mdx/types";
import Link from "next/link";

export const mdxComponents: MDXComponents = {
  h1: ({ children }) => (
    <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mt-8 mb-4">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-4">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-2xl font-medium text-gray-700 dark:text-gray-300 mt-6 mb-3">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-xl font-medium text-gray-600 dark:text-gray-400 mt-4 mb-2">
      {children}
    </h4>
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
      className="text-blue-600 dark:text-blue-400 hover:underline"
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
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...mdxComponents,
    ...components,
  };
}
