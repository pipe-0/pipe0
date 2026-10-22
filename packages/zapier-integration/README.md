# pipe0 for Zapier

The pipe0 integration for [Zapier](https://zapier.com/apps). Once published it is listed in the Zapier app directory, and Zapier also exposes it as an MCP server at `zapier.com/mcp/pipe0`.

Zapier has no way to list a remote MCP server directly, so this is a native Zapier integration on the pipe0 REST API. It is separate from the hosted pipe0 MCP server, which only accepts OAuth.

## What it does

| Kind | Key | Pipe |
|---|---|---|
| Search | Find Work Email | `person:workemail:waterfall@1` |
| Search | Find Company | `company:overview@3` |
| Action | Verify Email Address | `email:validate:zerobounce@1` |
| Action | Run Pipe | any pipe ID, with key/value input and optional config JSON |

Every step calls `POST https://api.pipe0.com/v1/pipes/run/sync` in production and bills the connected organization.

## Authentication

API key. Users create one in pipe0 under **API and MCP** > **API keys**. The key is sent as `Authorization: Bearer <key>` and never in the URL. The connection test calls `GET /v1/credit-balance`.

## Develop

```bash
cd packages/zapier-integration
npm install
npm test            # offline unit tests, no API key needed
npx zapier validate
```

## Push to Zapier

The integration is registered in the Zapier developer platform as app `248351` (pipe0).

```bash
npx zapier login    # once; opens the browser
npx zapier link     # once; choose "pipe0" — writes .zapierapprc
npx zapier push     # uploads version 1.0.0
```

## Publish

Zapier's [publishing requirements](https://docs.zapier.com/integrations/publish/integration-publishing-requirements) need, before you submit:

1. A live Zap for each search and action, turned on, with at least one successful run. Don't delete them.
2. A non-expiring pipe0 test account on `integration-testing@zapier.com`, with credits, that Zapier support may reset the password of.
3. A team member with a `@pipe0.com` email (Florian).

Then submit from **Manage > Publishing** in the developer platform.
