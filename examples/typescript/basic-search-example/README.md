# Pipe0 Search API Demo

A React + TypeScript example that runs a pipe0 search with TanStack Query for lead generation and prospecting.

## Prerequisites

- Node.js 18+

## What this demo shows

One people search on Crustdata's dataset (`people:profiles:crustdata@3`), filtered by current employer.
The app sends the request to `POST /v1/search/run/sync` through the sandbox proxy and renders the results.

## Usage

1. Start the development server:

   ```bash
   pnpm run dev
   ```

2. Open the app and click **Search**.
3. Use **Show Request Code** to inspect the request payload.

## Request payload

```json
{
  "search": {
    "search_id": "people:profiles:crustdata@3",
    "config": {
      "limit": 5,
      "filters": {
        "current_employer_domains": {
          "include": ["microsoft.com"]
        }
      }
    }
  }
}
```

Search ids are versioned (`@1`, `@2`, `@3`). Always use the newest version that is not
marked deprecated in the [search catalog](https://pipe0.com/docs/search-catalog).

## Learn more

- [Search overview](https://pipe0.com/docs/search)
- [Search catalog](https://pipe0.com/docs/search-catalog)
- [TanStack Query](https://tanstack.com/query)

## License

MIT
