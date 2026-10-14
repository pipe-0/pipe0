import {
  convertToModelMessages,
  createGateway,
  stepCountIs,
  streamText,
  tool,
  type UIMessage,
} from "ai";
import { readFileSync } from "node:fs";
import { z } from "zod";
import { Document, type DocumentData } from "flexsearch";
import { source } from "@/lib/source";
import { getLLMText } from "@/lib/get-llm-text";

// A turn is a few tool rounds plus the answer; 30s cut long answers off
// mid-stream when the provider was slow.
export const maxDuration = 60;

const gateway = createGateway({
  apiKey: process.env.AI_GATEWAY_API_KEY,
});

interface IndexedDocument extends DocumentData {
  url: string;
  title: string;
  description: string;
  content: string;
}

// The full pipe0 assistant instructions live in a co-located markdown file so they
// stay easy to edit. `new URL(..., import.meta.url)` is the bundler-traceable pattern,
// so the file ships with the serverless function in production.
const systemPrompt = readFileSync(
  new URL("./ask-ai-instructions.md", import.meta.url),
  "utf8",
);

// Build the flexsearch index once per server instance, lazily. Each page is
// indexed on its full text (the same text /llms-full.txt serves), not just its
// title and description, so a question can match what a page actually says.
let index: Promise<Document<IndexedDocument>> | undefined;
function getIndex() {
  index ??= buildIndex();
  return index;
}

async function buildIndex() {
  const built = new Document<IndexedDocument>({
    // Recall-friendly config. `forward` tokenization indexes word prefixes so
    // partial/inflected terms still match (e.g. "email" matches "emails"),
    // which keeps natural-language queries from missing the index entirely.
    tokenize: "forward",
    document: {
      id: "url",
      index: ["title", "description", "content"],
      store: true,
    },
  });

  const pages = source.getPages();
  const texts = await Promise.all(pages.map(getLLMText));
  pages.forEach((page, i) => {
    built.add({
      url: page.url,
      title: page.data.title ?? "",
      description: page.data.description ?? "",
      content: texts[i] ?? "",
    });
  });

  return built;
}

// Search returns excerpts, not whole pages: ten full catalog pages would fill
// the context on every call. The model opens a page with `read_page` when the
// excerpt is not enough.
const EXCERPT_CHARS = 1200;
const PAGE_CHARS = 16000;

function excerpt(content: string, query: string) {
  const haystack = content.toLowerCase();
  const hits = query
    .toLowerCase()
    .split(/[^a-z0-9:@_-]+/)
    .filter((term) => term.length >= 3)
    .map((term) => haystack.indexOf(term))
    .filter((at) => at >= 0);
  const at = hits.length > 0 ? Math.max(0, Math.min(...hits) - 200) : 0;
  const text = content.slice(at, at + EXCERPT_CHARS).trim();
  return `${at > 0 ? "…" : ""}${text}${at + EXCERPT_CHARS < content.length ? "…" : ""}`;
}

// Cap tool calls per request. Open models otherwise tend to loop on `search`
// (often re-querying for 0 results) and burn the step budget without ever
// answering. After the limit, the tool returns a "stop and answer" instruction
// instead of more results — the model reads that and writes its reply (forcing
// toolChoice off mid-run instead just makes it stop with no text).
const MAX_TOOL_CALLS = 5;
const limitReached = {
  note: "TOOL LIMIT REACHED. Do not call search or read_page again. Write your complete final answer now using the results already gathered.",
};

function createTools() {
  let calls = 0;

  const search = tool({
    description:
      "Full-text search over the pipe0 docs and the pipe/search catalog. Returns the best-matching pages with an excerpt of each.",
    inputSchema: z.object({
      query: z.string(),
      limit: z.number().int().min(1).max(10).default(6),
    }),
    async execute({ query, limit }) {
      if (++calls > MAX_TOOL_CALLS) return limitReached;
      // `suggest: true` relaxes flexsearch's default "all query terms must
      // match" so a multi-word question returns its best partial matches
      // instead of 0 results — the main cause of the model's search loops.
      const results = await (await getIndex()).searchAsync(query, {
        limit,
        suggest: true,
        merge: true,
        enrich: true,
      });
      return results.map(({ doc }) => ({
        url: doc?.url,
        title: doc?.title,
        description: doc?.description,
        excerpt: excerpt(doc?.content ?? "", query),
      }));
    },
  });

  const read_page = tool({
    description:
      "Read the full text of one pipe0 docs or catalog page by its `url` from a search result. Use it when an excerpt is cut off before the detail you need (field names, request bodies, setup steps, prices).",
    inputSchema: z.object({ url: z.string() }),
    async execute({ url }) {
      if (++calls > MAX_TOOL_CALLS) return limitReached;
      const path = url.replace(/^https?:\/\/[^/]+/, "").split("#")[0];
      const doc = (await getIndex()).get(path);
      if (!doc) return { error: `No page at ${path}. Use a url from a search result.` };
      const content = doc.content as string;
      return {
        url: path,
        content:
          content.length > PAGE_CHARS
            ? `${content.slice(0, PAGE_CHARS)}\n\n[Page truncated]`
            : content,
      };
    },
  });

  return { search, read_page };
}

export type SearchTool = ReturnType<typeof createTools>["search"];

// Simple in-memory IP rate limiter (20 requests / minute / IP).
const rateLimitWindowMs = 60 * 1000;
const rateLimitMaxRequests = 20;
const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const [clientIp] = forwardedFor.split(",");
    if (clientIp) return clientIp.trim();
  }
  return (
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

function checkRateLimit(
  req: Request,
): { success: true } | { success: false; retryAfter: number } {
  const now = Date.now();
  const ip = getClientIp(req);
  const bucket = rateLimitBuckets.get(ip);

  if (!bucket || bucket.resetAt <= now) {
    rateLimitBuckets.set(ip, { count: 1, resetAt: now + rateLimitWindowMs });
    for (const [key, value] of rateLimitBuckets) {
      if (value.resetAt <= now) rateLimitBuckets.delete(key);
    }
    return { success: true };
  }

  if (bucket.count >= rateLimitMaxRequests) {
    return {
      success: false,
      retryAfter: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  bucket.count++;
  return { success: true };
}

export async function POST(req: Request) {
  const rateLimit = checkRateLimit(req);
  if (!rateLimit.success) {
    return new Response("Too many requests", {
      status: 429,
      headers: { "Retry-After": String(rateLimit.retryAfter) },
    });
  }

  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    // GLM 5.3 through its fast endpoint: the standard `zai/glm-5.3` endpoint
    // stalled past 90s on most questions when tested (2026-10-13), the fast
    // one answers in ~5-15s. The gateway falls back to GLM 5.2 if it errors.
    model: gateway("zai/glm-5.3-fast"),
    providerOptions: { gateway: { models: ["zai/glm-5.2"] } },
    system: systemPrompt,
    tools: createTools(),
    toolChoice: "auto",
    // Headroom for a few search rounds plus the final answer. The "never end on a
    // tool call" rule in the system prompt is what makes the model stop searching
    // and write a response; forcing toolChoice mid-run instead makes it stop with
    // no text, so we rely on the prompt and just give it room here.
    stopWhen: stepCountIs(8),
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse({
    // Default behaviour hides the cause behind "An error occurred." Surface a
    // useful, end-user-safe message instead (and log the full error server-side).
    onError(error) {
      console.error("[/api/chat] stream error:", error);
      const message = error instanceof Error ? error.message : String(error);
      if (/rate.?limit|429|free tier/i.test(message)) {
        return "The AI assistant is temporarily rate-limited. Please try again in a moment.";
      }
      return "Sorry — the AI assistant hit an error answering that. Please try again.";
    },
  });
}
