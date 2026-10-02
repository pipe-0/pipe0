# @pipe0/tanstack-ai

[pipe0](https://www.pipe0.com) tools for [TanStack AI](https://tanstack.com/ai): find people and enrich them with work emails, phone numbers, profiles, and firmographics from dozens of data providers.

Each enrichment runs a pipe0 **waterfall**: providers are tried in order until one finds the value, so your agent gets broad coverage from one call and one API key.

| Tool | What it does |
| --- | --- |
| `find_people` | Search for people by job title, employer, seniority, job function, company size, and location. |
| `enrich_person` | Find a person's work email, mobile number, and profile from a LinkedIn URL, an email, or name + company domain. |
| `enrich_company` | Get firmographics for a company domain: description, industry, headcount, revenue, founding year. |

## Install

```bash
npm install @pipe0/tanstack-ai @tanstack/ai zod
```

Get an API key at [app.pipe0.com](https://app.pipe0.com) and set it as `PIPE0_API_KEY`.

## Usage

```ts
import { chat, toServerSentEventsResponse } from "@tanstack/ai";
import { openaiText } from "@tanstack/ai-openai";
import { pipe0Tools } from "@pipe0/tanstack-ai";

export async function POST(request: Request) {
  const { messages } = await request.json();

  const stream = chat({
    adapter: openaiText("gpt-5-mini"),
    messages,
    tools: pipe0Tools(),
  });

  return toServerSentEventsResponse(stream);
}
```

The tools are server tools: they run in your `chat()` call on the server, and TanStack AI feeds each result back to the model.

To use only some tools, create them one by one:

```ts
import { enrichCompany, enrichPerson } from "@pipe0/tanstack-ai";

const tools = [enrichPerson(), enrichCompany()];
```

## Options

Every tool (and `pipe0Tools`) accepts the same options:

```ts
pipe0Tools({
  apiKey: "...",           // defaults to process.env.PIPE0_API_KEY
  environment: "sandbox",  // "production" (default) or "sandbox": free placeholder data for development
  needsApproval: true,     // pause the run for user approval before each call
});
```

You can also pass a configured `client` from [`@pipe0/client`](https://www.npmjs.com/package/@pipe0/client).

## Approve calls before they run

Every call spends credits in production. In agents where users trigger the calls, set `needsApproval`:

```ts
const stream = chat({
  adapter: openaiText("gpt-5-mini"),
  messages,
  tools: [findPeople(), enrichPerson({ needsApproval: true })],
});
```

The run pauses before `enrich_person` executes and resumes once the client sends the user's approval. See [Tool Approval Flow](https://tanstack.com/ai/latest/docs/tools/tool-approval).

## Credits

Tool calls run in `production` by default and spend pipe0 credits: roughly 0.1 credits per `find_people` result and from 0.5 credits per value found by `enrich_person`. Use `environment: "sandbox"` while building. See [pricing](https://www.pipe0.com/pricing).

## Security and personal data

Run the tools on your server and keep `PIPE0_API_KEY` out of client bundles. Anyone with the key can spend your credits.

`find_people` and `enrich_person` return personal contact data. Make sure your use complies with the privacy and marketing rules that apply to you (for example GDPR or CAN-SPAM), and only show results to users allowed to see them.

## License

MIT
