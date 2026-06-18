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

export const maxDuration = 30;

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

// Build the flexsearch index once per server instance, lazily.
let index: Document<IndexedDocument> | undefined;
function getIndex() {
  if (index) return index;

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

  for (const page of source.getPages()) {
    const data = page.data as {
      title?: string;
      description?: string;
      content?: string;
    };

    built.add({
      url: page.url,
      title: data.title ?? "",
      description: data.description ?? "",
      content: data.content ?? "",
    });
  }

  index = built;
  return index;
}

// Cap searches per request. GLM 5.2 otherwise tends to loop on `search` (often
// re-querying for 0 results) and burn the step budget without ever answering.
// After the limit, the tool returns a "stop and answer" instruction instead of
// more results — the model reads that and writes its reply (forcing toolChoice
// off mid-run instead just makes it stop with no text).
const MAX_SEARCHES = 3;

function createSearchTool() {
  let searches = 0;
  return tool({
    description: "Search the pipe0 docs content and return raw JSON results.",
    inputSchema: z.object({
      query: z.string(),
      limit: z.number().int().min(1).max(100).default(10),
    }),
    async execute({ query, limit }) {
      searches++;
      if (searches > MAX_SEARCHES) {
        return {
          note: "SEARCH LIMIT REACHED. Do not call search again. Write your complete final answer now using the results already gathered.",
        };
      }
      // `suggest: true` relaxes flexsearch's default "all query terms must
      // match" so a multi-word question returns its best partial matches
      // instead of 0 results — the main cause of the model's search loops.
      return getIndex().searchAsync(query, {
        limit,
        suggest: true,
        merge: true,
        enrich: true,
      });
    },
  });
}

export type SearchTool = ReturnType<typeof createSearchTool>;

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
    model: gateway("zai/glm-5.2"),
    system: systemPrompt,
    tools: { search: createSearchTool() },
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
