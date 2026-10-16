# pipe0 for ChatGPT and Codex

Connect ChatGPT and Codex to [pipe0](https://pipe0.com): search for people and companies, enrich them with work emails, phone numbers, and LinkedIn data, and operate pipe0 Sheets, schedules, and reports from your agent.

The plugin is a thin wrapper around the hosted pipe0 MCP server. The server exposes the whole product as tools and carries its own operating instructions, guides, and playbooks, so the agent learns how pipe0 works the moment it connects.

## Install

Search for **pipe0** in the Plugins directory in ChatGPT or Codex and install it. A browser window opens; sign in to pipe0 and approve access.

## Authentication

Sign-in is OAuth 2.1 with PKCE and dynamic client registration. The client registers itself with pipe0 on first connect and opens the browser for you to sign in and approve access. There is no API key, client ID, or client secret to configure, and the plugin stores no credentials.

## Network endpoints and credentials

The plugin connects only to `api.pipe0.com`:

| Endpoint | Purpose |
|---|---|
| `https://api.pipe0.com/v1/mcp` | Hosted MCP server (streamable HTTP) |
| `https://api.pipe0.com/.well-known/oauth-protected-resource` | OAuth resource metadata discovery |
| `https://api.pipe0.com/.well-known/oauth-authorization-server` | OAuth server metadata discovery |
| `https://api.pipe0.com/auth/mcp/authorize`, `/token`, `/register` | OAuth 2.1 authorization, token exchange, dynamic client registration |

Credentials: a pipe0 account. The access token is sent as `Authorization: Bearer` on `/v1/mcp` and is scoped to the organization the signed-in user belongs to.

Tool calls run on the signed-in user's pipe0 account. Destructive or large runs ask for confirmation first.

## What is inside

```
.codex-plugin/plugin.json   Plugin manifest and directory listing
.mcp.json                   Hosted pipe0 MCP server
assets/logo.png             Directory logo
assets/logo.svg             Vector logo
assets/composer-icon.png    Composer icon
```

## What the agent can do

- **Discover** pipes, searches, effects, and playbooks, and read their exact schemas.
- **Run** one-shot searches and enrichments, or **build sheets** with columns, filters, and schedules.
- **Validate** every payload before anything is billed.
- **Verify** outcomes by reading real cell statuses after a run.
- **Report** with versioned report documents next to your sheets.

Read more at [Work with AI agents](https://pipe0.com/docs/sheets/ai-agents).

## Development

The plugin lives in `packages/openai-plugin` of the [pipe0 monorepo](https://github.com/pipe-0/pipe0). It is not an npm package; run the scripts from this folder:

```bash
node scripts/validate.mjs   # structural checks on the manifest, MCP config, and assets
node scripts/package.mjs    # build dist/pipe0-<version>.zip for the Plugins dashboard
```

See [PUBLISHING.md](PUBLISHING.md) for how releases reach the Plugins directory.

## License

MIT. Use of the hosted MCP server is governed by pipe0's [terms of service](https://www.pipe0.com/resources/legal/terms-of-service).
