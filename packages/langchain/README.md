# @pipe0/langchain

[pipe0](https://www.pipe0.com) tools for [LangChain.js](https://js.langchain.com): find people and enrich them with work emails, phone numbers, profiles, and firmographics from dozens of data providers.

Each enrichment runs a pipe0 **waterfall**: providers are tried in order until one finds the value, so your agent gets broad coverage from one call and one API key.

| Tool | What it does |
| --- | --- |
| `find_people` | Search for people by job title, employer, seniority, job function, company size, and location. |
| `enrich_person` | Find a person's work email, mobile number, and profile from a LinkedIn URL, an email, or name + company domain. |
| `enrich_company` | Get firmographics for a company domain: description, industry, headcount, revenue, founding year. |

## Install

```bash
npm install @pipe0/langchain @langchain/core
```

Get an API key at [app.pipe0.com](https://app.pipe0.com) and set it as `PIPE0_API_KEY`.

## Usage

```ts
import { createAgent } from "langchain";
import { pipe0Tools } from "@pipe0/langchain";

const agent = createAgent({
  model: "openai:gpt-5-mini",
  tools: pipe0Tools(),
});

const result = await agent.invoke({
  messages: [{ role: "user", content: "Find the CTO of Linear and get their work email." }],
});
```

To use only some tools, create them one by one:

```ts
import { enrichCompany, enrichPerson } from "@pipe0/langchain";

const tools = [enrichPerson(), enrichCompany()];
```

Every tool returns a JSON string, so it works with any LangChain agent or model that supports tool calling.

## Options

Every tool (and `pipe0Tools`) accepts the same options:

```ts
pipe0Tools({
  apiKey: "...",           // defaults to process.env.PIPE0_API_KEY
  environment: "sandbox",  // "production" (default) or "sandbox": free placeholder data for development
});
```

You can also pass a configured `client` from [`@pipe0/client`](https://www.npmjs.com/package/@pipe0/client).

## Approve calls before they run

Every call spends credits in production. In agents where users trigger the calls, pause before a tool runs with LangChain's human-in-the-loop middleware:

```ts
import { createAgent, humanInTheLoopMiddleware } from "langchain";
import { MemorySaver } from "@langchain/langgraph";
import { pipe0Tools } from "@pipe0/langchain";

const agent = createAgent({
  model: "openai:gpt-5-mini",
  tools: pipe0Tools(),
  middleware: [humanInTheLoopMiddleware({ interruptOn: { enrich_person: true } })],
  checkpointer: new MemorySaver(),
});
```

The agent stops before `enrich_person` runs and returns an interrupt for you to approve or reject. See [Human-in-the-loop](https://docs.langchain.com/oss/javascript/langchain/human-in-the-loop).

## Credits

Tool calls run in `production` by default and spend pipe0 credits: roughly 0.1 credits per `find_people` result and from 0.5 credits per value found by `enrich_person`. Use `environment: "sandbox"` while building. See [pricing](https://www.pipe0.com/pricing).

## Security and personal data

Run the tools on your server and keep `PIPE0_API_KEY` out of client bundles. Anyone with the key can spend your credits.

`find_people` and `enrich_person` return personal contact data. Make sure your use complies with the privacy and marketing rules that apply to you (for example GDPR or CAN-SPAM), and only show results to users allowed to see them.

## License

MIT
