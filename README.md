# pipe0: turn any GTM play into a production system with AI

[![pipe0 intro](https://imagedelivery.net/3B3AWuP94-S3Ro5eEac6JA/b63a90b7-6969-45f2-237b-1d9d45673b00/ytthumbnail)](https://youtu.be/k9g7Tpcawu0 "pipe0 intro")

Click the image to watch an intro video.

AI made engineers 10x faster. GTM teams are still waiting.

Coding agents sped up engineers, but GTM doesn't run on code. It runs on
research, lists, and automations. Today's GTM tools come with a tradeoff:
they're either built for humans and hard for agents to use, or built for
agents and leave the building to you.

[pipe0](https://pipe0.com) is native to both. Ask a data question or describe
a play, and the agent builds a system you can see, change, and trust.

## How it works

pipe0 is built from a small set of primitives:

- **Searches** find companies and people using filters.
- **Pipes** enrich records. Each pipe has fixed inputs and outputs. Pipes find
  emails, phone numbers, and LinkedIn profiles, but they also decide, branch,
  run AI, and write to other systems. See the
  [pipe catalog](https://pipe0.com/docs/pipe-catalog).
- **Sheets** are Clay-like tables in the cloud that hold up to 2M records,
  with schedules, signals, webhooks, and reports.

The same primitives work two ways:

- **Stateless:** one API call, data back. Ask for the same data and you get
  the same answer, unless the underlying data changed.
- **Stateful:** write the data to a sheet, and it becomes a table with
  schedules and always-on automations. Nothing is rebuilt.

One engine, three surfaces: everything in a sheet is also available through
the REST API and the [MCP server](https://pipe0.com/mcp).

## Why not build it yourself

It's easy to underestimate what a production data and automation platform
takes. With pipe0 you never deal with:

⚡️ Running enrichments in parallel with speed and accuracy  
🛑 Different provider rate limits  
🧼 Sanitizing and healing input  
🖥️ Monitoring 50+ third-party data providers  
🌊 Building and ordering waterfalls (misses are free; you pay the provider that answers)  
💵 Managing credit balances across providers  
🏗️ Running enrichment, scraping, and AI infrastructure at low cost  
💾 Caching

## Use cases

🌅 Morning briefings and research for your team  
🔁 Always-on plays and signal engines  
🧙🏻 CRM enrichment, cleanup, and lead routing  
🤖 A data source for your own agents and sales tools  
🧬 Enriching large datasets
