import type { Program } from "estree";
import type { Code, Nodes, Root } from "mdast";
import type { MdxJsxAttribute, MdxJsxFlowElement } from "mdast-util-mdx-jsx";
import type { MdxjsEsm } from "mdast-util-mdxjs-esm";
import { visit } from "unist-util-visit";
import {
  requestExampleCode,
  searchEnrichCode,
  type RequestCode,
  type RequestKind,
} from "./request-examples";

type EstreeNode = { type: string; [key: string]: any };

/** Reads the literal payloads MDX files declare with `export const`. */
function literal(node: EstreeNode): unknown {
  switch (node.type) {
    case "ObjectExpression":
      return Object.fromEntries(
        node.properties.map((p: EstreeNode) => [
          p.key.name ?? p.key.value,
          literal(p.value),
        ]),
      );
    case "ArrayExpression":
      return node.elements.map(literal);
    case "Literal":
      return node.value;
    case "TemplateLiteral":
      if (node.expressions.length === 0) return node.quasis[0].value.cooked;
  }
  throw new Error(`Request examples need literal payloads, found ${node.type}`);
}

function exportedPayloads(tree: Root) {
  const payloads = new Map<string, unknown>();
  visit(tree, "mdxjsEsm", (node: MdxjsEsm) => {
    for (const statement of node.data?.estree?.body ?? []) {
      if (statement.type !== "ExportNamedDeclaration") continue;
      if (statement.declaration?.type !== "VariableDeclaration") continue;
      for (const { id, init } of statement.declaration.declarations) {
        if (id.type === "Identifier" && init) {
          payloads.set(id.name, literal(init as unknown as EstreeNode));
        }
      }
    }
  });
  return payloads;
}

/** A JSX attribute holding a JSON-safe value. */
function expressionAttribute(name: string, value: unknown): MdxJsxAttribute {
  const estree = (v: unknown): EstreeNode =>
    Array.isArray(v)
      ? { type: "ArrayExpression", elements: v.map(estree) }
      : { type: "Literal", value: v, raw: JSON.stringify(v) };
  const program: Program = {
    type: "Program",
    sourceType: "module",
    body: [{ type: "ExpressionStatement", expression: estree(value) as never }],
  };
  return {
    type: "mdxJsxAttribute",
    name,
    value: {
      type: "mdxJsxAttributeValueExpression",
      value: JSON.stringify(value),
      data: { estree: program },
    },
  };
}

const TABS = [
  { label: "pipe0 SDK", key: "sdk", lang: "typescript" },
  { label: "Python", key: "python", lang: "python" },
  { label: "cURL", key: "curl", lang: "bash" },
] as const;

function tabs(
  code: RequestCode,
  defaultTab: string | undefined,
): MdxJsxFlowElement {
  const defaultIndex = TABS.findIndex((tab) => tab.key === defaultTab);
  return {
    type: "mdxJsxFlowElement",
    name: "Tabs",
    attributes: [
      expressionAttribute(
        "items",
        TABS.map((tab) => tab.label),
      ),
      ...(defaultIndex > 0
        ? [expressionAttribute("defaultIndex", defaultIndex)]
        : []),
    ],
    children: TABS.map((tab) => ({
      type: "mdxJsxFlowElement",
      name: "Tab",
      attributes: [
        { type: "mdxJsxAttribute", name: "value", value: tab.label },
      ],
      children: [
        { type: "code", lang: tab.lang, value: code[tab.key] } satisfies Code,
      ],
    })),
  };
}

/**
 * Expands <RequestExample> and <SearchEnrichExample> into tabs of code fences,
 * so the snippets are highlighted at compile time with every other fence and
 * no highlighter reaches the browser.
 *
 * @example
 * export const payload = { pipes: [...], input: [...] };
 * <RequestExample kind="pipes" payload={payload} defaultTab="curl" />
 */
export function remarkRequestExample() {
  return (tree: Root) => {
    const payloads = exportedPayloads(tree);
    const attr = (node: MdxJsxFlowElement, name: string) =>
      node.attributes.find(
        (a) => a.type === "mdxJsxAttribute" && a.name === name,
      )?.value;
    const payload = (node: MdxJsxFlowElement, name: string) => {
      const ref = attr(node, name);
      const id = typeof ref === "object" ? ref?.value.trim() : undefined;
      if (!id || !payloads.has(id)) {
        throw new Error(
          `<${node.name}> ${name} must name an exported constant`,
        );
      }
      return payloads.get(id);
    };

    visit(
      tree,
      "mdxJsxFlowElement",
      (node: MdxJsxFlowElement, index, parent) => {
        if (index === undefined || !parent) return;
        if (node.name === "RequestExample") {
          const kind = (attr(node, "kind") ?? "pipes") as RequestKind;
          const defaultTab = attr(node, "defaultTab") as string | undefined;
          parent.children[index] = tabs(
            requestExampleCode(kind, payload(node, "payload")),
            defaultTab,
          ) as Nodes as never;
        } else if (node.name === "SearchEnrichExample") {
          parent.children[index] = tabs(
            searchEnrichCode(
              payload(node, "search"),
              payload(node, "enrich") as { pipes: unknown },
            ),
            undefined,
          ) as Nodes as never;
        }
      },
    );
  };
}
