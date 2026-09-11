# Build your own data-provider benchmark harness

This is a prompt template. Paste it into a coding agent (Claude Code, Cursor, Codex, or similar) and it will build a local CLI that benchmarks data enrichment providers the way we do it at [pipe0](https://pipe0.com): identical deterministic input slices, every raw response kept on disk, and a report that measures **coverage**, **accuracy** (via cross-provider agreement), **latency**, **dataset uniqueness**, and **cost**, then recommends a waterfall order.

The companion blog post explains the reasoning: [How to Choose the Right Data Enrichment Vendor](https://pipe0.com/blog/how-to-choose-the-right-b2b-data-provider).

## How to use this template

1. Fill in every `[TODO: …]` block in section 0. Delete the ones that do not apply.
2. Leave the rest of the prompt as it is. The structure below is the part that took us months to get right. Change it once you have a run in hand, not before.
3. Give the agent a fresh, empty directory and the prompt. Expect one long session. Have API keys ready but do not paste them into the prompt.
4. The first useful result is the capability matrix and a `--dry-run`. The first paid result is a 10-row smoke run per path. Do not run 1,000 rows until a 10-row run reads correctly.

The prompt assumes two things about you: you have one or more datasets you can export as CSV, and you hold API licences for one or more providers you want to compare.

---

# PROMPT — copy from here

You are building a local, command-line benchmark harness for data enrichment providers. Read this whole document before writing any code. The design decisions are deliberate and most of them exist because the obvious alternative produced wrong numbers.

## 0. My situation

### 0.1 Stack

`[TODO: Confirm or replace. Default: TypeScript on Node 22+, SQLite through better-sqlite3 with drizzle-orm for the schema, commander for the CLI, zod for env validation, papaparse for CSV, node:test for tests, chalk for terminal colour. Package manager: pnpm.]`

If you keep the default, do not add a test framework, an HTTP library, or a charting library. `fetch` is built in, `node:test` is built in, and the HTML report must be a single self-contained file with inline SVG.

### 0.2 Capabilities I want to measure

A **capability** is one question you can ask a provider: a typed input in, one typed value out. Paths and providers both reference capabilities and never each other.

`[TODO: Edit this list. Keep the id style. Each entry needs: id, the input fields, the kind of value it returns, and a human label. Delete what you do not need.]`

| id | input | value kind | label |
|---|---|---|---|
| `nameAndDomainToWorkEmail` | `firstName`, `lastName`, `fullName`, `companyDomain` | `email` | name + company domain → work email |
| `linkedinToWorkEmail` | `linkedinUrl` | `email` | LinkedIn URL → work email |
| `linkedinToPersonalEmail` | `linkedinUrl` | `email` | LinkedIn URL → personal email |
| `linkedinToPhone` | `linkedinUrl` | `phone` | LinkedIn URL → phone |
| `emailToPhone` | `workEmail` | `phone` | work email → phone |
| `emailToLinkedin` | `email` | `linkedin` | email → LinkedIn profile |

Work email and personal email are **separate capabilities**, not a flag. Providers price them apart, take different parameters, and can be strong at one and absent at the other. "Which address class did I ask for" has to be part of the question, not something you check in the answer. Apply the same rule to any pair in your own list that a vendor sells as two products.

Value kinds drive normalization and comparison. Start with `email`, `phone`, `linkedin`. `[TODO: Add value kinds if a capability above returns something else, e.g. company_domain or job_title. Each needs a normalizer (section 3.6).]`

### 0.3 Providers

`[TODO: List each provider you hold a licence for. For each: a short lowercase id (letters, digits, hyphens), which capabilities from 0.2 it supports, the env var name for its API key, its documented rate limit (requests per second and per minute) and a safe concurrency, whether it is synchronous or submit-then-poll, and a link to its API docs. If a vendor sells two distinct products for the same capability (a standard and a premium lookup), register them as two providers with two ids. The unit of comparison is the thing you buy.]`

Example shape, replace it:

```
provider-a   caps: linkedinToWorkEmail, emailToLinkedin   key: PROVIDER_A_API_KEY   limit: 5/s 300/min c=6   sync    docs: https://…
provider-b   caps: linkedinToPhone, linkedinToWorkEmail   key: PROVIDER_B_API_KEY   limit: 1/s 60/min  c=2    async   docs: https://…
```

Rules for adapters:

- Write each adapter from the provider's documentation. Declare **only** the capabilities it actually has. Omission is the declaration.
- If your production system already calls this provider, mirror the exact request production makes, quirks included. The number that matters for ordering a waterfall is what production actually gets.
- Never gate on a vendor's own quality signal (confidence score, validation status). Keep it in `raw` so a gated rate can be recomputed later. Filtering on it would measure the gate, not the vendor, against competitors that never had the chance to be filtered.

### 0.4 Datasets

`[TODO: Describe each CSV you can export. Columns available, approximate row count, and where the rows came from. Say explicitly whether any benchmarked provider was involved in producing the rows.]`

The fairness rule is absolute: **never source benchmark rows from a provider that is being benchmarked**. Every such row is already in that provider's database, so it scores near 100% by construction. If you need a population with LinkedIn URLs and real names, pull it from a source you are not benchmarking, or from your own CRM.

Two populations are better than one. If a ranking holds across two independently sourced populations it is a finding. If it flips, the sampling was doing the work. Example split:

- `[TODO: population A, e.g. "crm-contacts": zero vendor involvement, carries email, derived name, derived domain]`
- `[TODO: population B, e.g. "profiles": stratified pull from a non-benchmarked source, carries LinkedIn URL, real name, real company domain]`

### 0.5 Prices

`[TODO: For every (provider, capability) pair, the price of one successful lookup in a single unit of account (USD is simplest; use your own credit unit if you resell). Say where each number came from: contract, list price, or your own estimate. Say whether the provider bills on success only or on every call. Leave a pair unpriced if you genuinely do not know; do not guess.]`

Every price carries a **source** tag: `contract`, `list`, `estimate`, or `unpriced`. The report prints the source next to every cost figure so an estimate is never mistaken for a fact.

### 0.6 Optional: ground truth

`[TODO: If any dataset column is a trusted answer for a capability, or a coarse version of one (e.g. the person's real employer domain, which a work email must land on), name the column and the capability. Delete this block if you have none.]`

Agreement between providers is a proxy for accuracy. A trusted column turns it into a measurement for that one capability. If you declare one, the report adds a precision column beside coverage for that path.

## 1. What you are building

A CLI named `bench` with one kind of benchmark: **every selected provider attempts every record on an identical input slice**. Nothing is skipped once someone wins. That is what makes overlap and agreement measurable. A "single-provider benchmark" is just `--providers <one>`.

Each run writes: an aggregate JSON document, one raw JSON file per provider with every payload, a self-contained HTML report, and rows in a local SQLite database that doubles as the cache and the permanent record. An index page lists every run ever.

The report answers one question: **which providers belong in the waterfall, in what order, at what price**. Everything else exists to make that answer trustworthy.

## 2. Principles that must survive every refactor

1. **Identical questions.** Slices are resolved once, before any provider runs. Every provider is asked byte-identical inputs.
2. **Determinism.** Same dataset fingerprint, same `--sample`, same `--offset`, same `--order` means the same rows. Row ids never change on re-seed.
3. **Keep every raw payload**, including misses and cached rows. A miss with its payload is what separates "the vendor said no" from "the vendor broke".
4. **Status taxonomy over a single error bucket.** A low match rate must be readable as a coverage finding or as an outage. Never both.
5. **Only the runner mints `unsupported`.** A provider physically cannot report a missing capability. That keeps a sparse matrix out of the error counts.
6. **Secrets never reach disk.** Redaction lives in the HTTP client, not in adapters. An adapter cannot forget.
7. **Agreement is consistency, not accuracy.** Say so in every place agreement is printed. Two vendors can agree on the same wrong answer.
8. **No composite score.** Coverage, cost and latency are measured. Agreement is a proxy. Blending them launders a guess into a number. Verdicts answer "is it on the cost-optimal path", and cautions ride alongside.
9. **Preflight refuses before spending.** Naming a provider that cannot do a path is exit code 2 and zero calls.
10. **Adding a path, provider, dataset or filter is one module plus one registry line.** No edits to the CLI, runner or metrics.

## 3. Domain model

Put these in `src/core/`.

### 3.1 Capabilities (`core/capabilities.ts`)

- `CapabilityInputs`: an interface keyed by capability id, each value the input object type from 0.2. Inputs are typed per capability, never per path and never per provider.
- `ProviderCapability = keyof CapabilityInputs`.
- `ValueKind`: the union from 0.2.
- `CAPABILITY_VALUE_KIND`: a lookup table (not a switch) from capability to value kind, `as const satisfies Record<ProviderCapability, ValueKind>`. Adding a capability is one line here and the compiler finds every other place.
- `CAPABILITY_LABELS`: human labels, same shape.
- `CAPABILITIES`: the keys as an array.

### 3.2 Outcome statuses (`core/status.ts`)

Exactly these, as a `const` array:

| status | meaning |
|---|---|
| `success` | provider returned a usable value |
| `no_result` | provider answered and has no data (404, empty array, null field) |
| `unsupported` | provider has no handler for this capability. Not an error, never billed, minted only by the runner |
| `rate_limited` | 429 that survived the retry budget |
| `timeout` | per-request timeout exceeded |
| `transient_error` | 5xx or socket reset that survived the retry budget |
| `provider_error` | an unmodelled 4xx, or a 2xx whose body could not be parsed or whose value could not be normalized |
| `invalid_input` | the row could not produce a valid input. No API call was made |
| `auth_error` | 401, 402 or 403. Key missing, wrong, out of credits, or lacking entitlement |

Helpers: `isMatch` (success only), `isAnswered` (success or no_result), `isFailure` (the five failure statuses), `isCacheable` (equals `isAnswered`; failures are never cached because a cached 429 makes an outage look permanent and a cached auth_error survives fixing the key).

### 3.3 Provider results and descriptors (`core/types.ts`)

`ProviderResult` is a discriminated union a handler may return. It deliberately has **no `unsupported` member**:

```ts
type ProviderResult =
  | { status: "success"; value: string; raw: unknown; httpStatus?: number }
  | { status: "no_result"; raw: unknown; httpStatus?: number }
  | { status: "invalid_input"; message: string }
  | { status: "rate_limited" | "timeout" | "transient_error" | "provider_error" | "auth_error";
      message: string; httpStatus?: number; raw?: unknown };
```

`HandlerContext` gives an adapter exactly three things: `http` (the shared client, section 4.1), `apiKey`, and `sleep(ms)`. Adapters never call `fetch` or `setTimeout` directly. `sleep` exists for submit-then-poll vendors: time parked between polls is that vendor's real latency and a bare sleep would leave it uncounted.

`CapabilityHandler<C>` is `(input: CapabilityInputs[C], ctx) => Promise<ProviderResult>`. `CapabilityHandlers` is `{ [C in ProviderCapability]?: CapabilityHandler<C> }`. The optionality **is** the capability matrix.

`ProviderDescriptor`: `id`, `label`, `apiKeyEnv`, `limits: { perSecond, perMinute, concurrency }`, optional `limitOverrides` per capability, optional `retry` (partial policy override, e.g. a longer timeout for a slow vendor), optional `notes` per capability (free text surfaced in preflight, e.g. entitlement requirements or known slowness), and `capabilities: CapabilityHandlers`.

`RetryPolicy`: `maxAttempts`, `baseDelayMs`, `maxDelayMs`, `maxElapsedMs`, `timeoutMs`. Default 4 attempts, 500ms base, 20s max delay, 90s max elapsed, 30s per-attempt timeout. A vendor that is *slow* must never be reported as a vendor that is *down*, so a slow vendor overrides `timeoutMs` and lowers `maxAttempts` in its descriptor. If a vendor bills server-side on a request the client aborted, a retry would bill twice. Cap attempts at 2 for such vendors.

### 3.4 Datasets (`core/types.ts`, `datasets/`)

Every dataset table spreads a shared `datasetColumns()`: autoincrement `id`, unique `naturalKey`, `sliceHash` (first 16 hex chars of sha256 of the natural key), `sourceFile`, `seededAt`. `id` is the default slice order and must be stable across idempotent re-seeds. `sliceHash` is the unbiased alternative order.

`DatasetDescriptor<T>`: `id`, `label`, `description`, `table`, `defaultCsv`, `headerAliases` (applied after header slug-normalization so `LinkedIn URL`, `linkedin_url` and `linkedinUrl` all land on one column), `parseRow(raw) → { ok: true, row } | { ok: false, reason }` (pure, unit-tested, the seam where CSV weirdness is handled), `naturalKey(row)` (stable identity used to dedupe on re-seed), optional `seedStats(rows)` (extra counters printed after seeding, e.g. how many rows each path can run against).

Build one `people` dataset first with: `firstName`, `lastName`, `email`, `emailType` (`work | personal | unknown`, derived from a free-mail domain list and never trusted against the evidence: a row labelled work whose address is a consumer domain is personal), `companyDomain` (explicit column wins, else derived from a work email, reduced to the registrable domain), `linkedinProfileUrl` (canonicalized), `source` (enum of your populations from 0.4), `stratum` (free-text sampling cell like `product manager|Germany`, so metrics can split by segment). Index `emailType`, `source`, `sliceHash`.

`[TODO: Add dataset tables for any non-person entity you benchmark, e.g. companies. Same base columns.]`

### 3.5 Paths (`core/types.ts`, `paths/`)

A **path** is a benchmark: one dataset, one capability, an eligibility rule, and a row-to-input mapper. Its id is also the CLI subcommand.

`PathDescriptor<T, C>`: `id`, `label`, `description`, `dataset` (by object, not id string, so a broken reference is a compile error), `capability`, `defaultSample`, `eligible(table) → SQL | undefined` (applied **before** `LIMIT/OFFSET` so `--sample 200` means 200 usable rows), `toInput(row) → { ok: true, input } | { ok: false, reason }` (last-mile guard for what SQL cannot express; a failure becomes one `invalid_input` outcome per provider with zero calls), `inputKey(input) → string` (the deterministic, normalized cross-provider join key), optional `filters`, optional `caveats` (free text printed in preflight and recorded in the manifest).

`PathFilter<T>`: `description`, `choices`, `default`, `apply(table, value) → SQL | undefined`. Return `undefined` for a catch-all value like `both` or `any`. The CLI generates a `--<name>` flag from each declared filter, validates against `choices`, and records the value in force, defaults included, in the manifest. A slice narrowed by a default is otherwise indistinguishable from an unnarrowed one after the fact.

Create shared filters for the people dataset: `source` (one value per population plus `any`, default `any`) and `emailType` (`work | personal | both`). Give `emailType` a `work` default on paths where a provider refuses free-mail before calling, so `both` does not measure your seed's work/personal split instead of vendor coverage.

Create one path per capability in 0.2. `[TODO: Add or remove paths to match your capability list.]`

### 3.6 Value normalizers (`lib/values.ts`)

`ValueNormalizer`: `normalize(raw) → string` (canonical form; empty string means unusable), `compareKey(normalized) → string` (what equality is judged on), optional `coarseKey` and `coarseLabel` (a coarser key for a secondary agreement rate).

`NORMALIZERS: Record<ValueKind, ValueNormalizer>`, and `normalizerFor(capability)` that indexes through `CAPABILITY_VALUE_KIND`. Every place that would otherwise branch on "is this an email or a phone" indexes this table instead.

- `email`: trim, unwrap `<…>`, lowercase, reject anything without exactly one `@` and a dotted domain. `compareKey` is identity. **Deliberately no dot or plus folding**: `j.smith@` versus `john.smith@` is exactly the disagreement you want to surface. `coarseKey` is the domain, labelled `domain`, so "wrong company" separates from "wrong local part".
- `phone`: strip non-digits, drop a leading `00`, reject fewer than 7 digits, return `+digits`. `compareKey` is the last 9 digits, because vendors disagree constantly about country codes and trunk prefixes and those are the same phone.
- `linkedin`: canonicalize to `https://www.linkedin.com/in/<slug-lowercased>`. Accept bare slugs, scheme-less input, country subdomains, and strip query strings and trailing slashes. Use the **same function** when seeding, so keys line up on both sides.

### 3.7 Outcomes (`core/types.ts`)

`EnrichmentOutcome` is one row: one provider, one question, one input. Fields: `runId`, `datasetId`, `pathId`, `capability`, `providerId`, `sourceRowId`, `inputKey`, `status`, `value` (normalized, null if none), `rawValue` (exactly what the provider returned), `message`, `httpStatus`, `attempts`, `latencyMs`, `waitMs`, `cached`, `requestSummary` (redacted request line), `raw` (JSON-stringified provider payload, truncated at 16,000 chars), `startedAt`, `finishedAt`.

`toOutcome(seed, result)`: normalizes the value. If a `success` value fails normalization, the status becomes `provider_error` with the raw payload kept. Downgrading to `no_result` would hide it; keeping `success` with a null value would silently break agreement.

`syntheticOutcome(seed, status, message)`: for rows that never reached a vendor (`invalid_input`, `unsupported`, breaker-skipped). Zero attempts, zero latency, no raw.

### 3.8 Registry (`registry.ts`)

Three arrays: `datasets`, `providers`, `paths`. Indexes by id that throw on duplicates. `requirePath`, `requireProvider`, `requireDataset` throw with an "Available: …" suggestion. `supports(provider, capability)`, `providersFor(capability)`, `capabilitiesOf(provider)`, and `capabilityMatrix()`, which is pure, run-free, and powers `bench matrix`, preflight, and a test that pins the expected support table. The directory name `waterfall` is reserved and no provider may use it as an id.

## 4. Runtime

Put these in `src/runtime/`.

### 4.1 HTTP client (`runtime/http.ts`)

The **only** place that calls `fetch`. `createHttpClient({ limiter, policy, secrets, clock?, random?, fetchImpl? })` returns `{ request(req), redact(text) }`.

- `request` acquires the rate limiter before every attempt and accumulates wait time separately from latency. Latency is wall time including retries, **excluding** time parked in the limiter. Otherwise a vendor's p95 just restates its rate limit.
- Retry on 429, 408 and 5xx except 501 and 505, using full-jitter exponential backoff (a uniform draw over the whole window). Correlated retries from every worker hitting the same 429 are what produce the second wave of 429s. Honour `Retry-After` in both delta-seconds and HTTP-date form.
- On a 429, call `limiter.pauseFor(delay)` so **every** worker for that provider pauses, not just the one that saw it.
- Per-attempt timeout via `AbortController`. Stop when `maxElapsedMs` is exceeded.
- Body text truncated at 32,000 bytes, then JSON-parsed. `body` is the parsed JSON or null; `text` is the redacted string, kept for adapters that need to sniff error codes.
- If no response was obtained at all, throw `HttpFailure(kind: "timeout" | "network", message, attempts, latencyMs, waitMs, summary)`.
- `redact` replaces every configured secret of length 6 or more with `<redacted>` in URLs, bodies and error messages. Some vendors put the key in the URL path.

`trackRequests(base)` wraps a client for one row: it returns `{ http, stats, sleep }` where `stats` accumulates `attempts`, `latencyMs`, `waitMs`, `summary` across every request that row makes, and `sleep` adds parked time to `latencyMs`. Scoped per row so concurrent rows never share timings.

### 4.2 Rate limiter (`runtime/rate-limiter.ts`)

Sliding window enforcing `perSecond` and `perMinute` as two independent rolling windows. A token bucket would let a full minute's budget burn in the first second. `acquire()` resolves when it is the caller's turn and returns how long it waited. `pauseFor(ms)` sets a global hold. Inject a `Clock` (`now`, `sleep`) so tests drive a fake clock.

### 4.3 Retry helpers (`runtime/retry.ts`)

`nextDelayMs(policy, attempt, retryAfterMs, random)`, `parseRetryAfter(header, now)`, `isRetryableStatus(status)`.

### 4.4 Classification (`runtime/classify.ts`)

`classifyHttp(response) → ProviderResult | null`: null for 2xx. 401, 402, 403 → `auth_error` (402 is out of credits and behaves like an auth failure: identical for every remaining row). 429 → `rate_limited`. 5xx or 408 → `transient_error`. Other 4xx → `provider_error`. Adapters apply vendor-specific "this 4xx actually means no_result" rules **before** calling this.

`classifyThrown(error) → ProviderResult`: `HttpFailure` becomes `timeout` or `transient_error`; anything else `provider_error`. Whatever an adapter throws becomes a typed result rather than crashing the run.

### 4.5 Circuit breaker (`runtime/breaker.ts`)

Per provider per run. After N consecutive (default 3) `auth_error` or `rate_limited` outcomes, the provider's remaining rows short-circuit as synthetic outcomes with the tripped status and a reason. Other providers keep running. A non-fatal status resets the counter.

### 4.6 Concurrency (`runtime/concurrency.ts`)

`mapWithConcurrency(items, n, fn)`: bounded pool preserving result order. Small enough not to warrant a dependency. `fn` must never reject; the runner converts thrown errors to outcomes.

## 5. Data: seeding and slicing

### 5.1 Seeding (`seed/`)

`bench seed --csv <file> [--dataset <id>] [--replace]`. One generic loop for every dataset: read CSV with header aliasing, `parseRow` each row, count rejections by reason, dedupe on natural key inside the file, insert with `onConflictDoNothing` on the natural key, record the file's sha256, path, row count and time in a `dataset_seeds` table. Re-seeding the same CSV inserts nothing and leaves ids untouched. `--replace` deletes the table and resets the sequence, loudly, because every prior `--offset` stops meaning the same thing.

Print after seeding: read, inserted, duplicates, rejected by reason, total rows, and the dataset's `seedStats`.

### 5.2 Building seed populations (`build/`)

`[TODO: Describe how each population is built. Delete what does not apply.]`

If one population comes from an export of addresses (CRM, sign-ups, mailing list), keep two shapes: work addresses (not consumer webmail, not disposable, with a name derivable from a `first.last` local part), and consumer addresses shaped like a person. Drop the opaque remainder. Filter on local-part **shape**, never on predicted vendor coverage, so the filter stays neutral. Emit rows in a stable order so re-seeding an updated export is purely additive.

If one population comes from a non-benchmarked people source, pull a **stratified grid** (for example 10 job families × 12 countries), record the cell in `stratum`, and interleave cells so an early stop still leaves a balanced grid. A single broad query returns a homogeneous slice and whichever vendor covers that segment best wins on sampling alone. Sanitize display names (credentials, emoji, taglines, truncated surnames). Reduce company URLs to the registrable domain (`news.example.com` → `example.com`), otherwise every vendor misses on a domain nobody uses for email.

State the honest limitation in the README: rows from any people source are people that source knows about, so absolute rates are optimistic. Relative comparison stays fair.

### 5.3 Slicing (`runner/run-benchmark.ts`, `fetchSlice`)

Eligibility, declared filters, `ORDER BY id` or `ORDER BY slice_hash`, then `LIMIT sample OFFSET offset`, all in one SQL query. Map every row through `toInput` once, before any provider runs. Return the items plus `eligibleRows` and `totalRows` for the manifest. `--sample N` under-fills silently if fewer rows are eligible; preflight says so and the manifest records `underFilled: true`. Recommend `--order hash` in the README for clustered exports: real data arrives grouped by company or import batch, and `--offset 0` by id can measure one company's email pattern and read as a vendor finding.

## 6. Runner (`runner/`)

### 6.1 Preflight plan (`runner/plan.ts`)

`planRun(path, { providerIds? })` runs before a single row is read and makes zero network calls. It returns `{ path, providers: PlannedProvider[], excluded: ExcludedProvider[], origin, blocking: string[] }`.

Selection precedence: `--providers` > `BENCH_PROVIDERS_<PATH>` env var > `BENCH_PROVIDERS` env var > a built-in per-path default table in `env.ts` > every provider that supports the path. `origin` records which one applied (`cli | env | default | all-supporting`) and is printed in preflight and stored in the manifest so a narrowed run never looks like a vendor outage later.

A bad provider name is treated by where it came from:

- an **unknown** id always blocks, wherever it came from. A typo that silently drops a vendor leaves you believing you benchmarked one more than you did;
- a **known but unsupported** id blocks only from `--providers`. Naming a provider on the command line is a claim about that run. An env default is standing config that outlives any one path.

Every registered provider not in the plan is recorded as excluded with a reason: `unsupported` (permanent fact about the matrix; wins over the next two), `missing_api_key`, or `not_selected` (a reversible choice, with the env var that would change it). Each planned provider carries its resolved limits (descriptor, per-capability override, then env override) and its capability note.

`estimateDurationMs(plan, rows, liveCalls)`: the wall-clock floor implied by the tightest per-minute limit, scaled by the share of calls that will not be served from cache. Preflight prints it, so a 40-minute run is a choice rather than a surprise.

### 6.2 Run loop (`runner/run-benchmark.ts`)

1. Mint a run id: `YYYYMMDDTHHMMSSZ-<4 hex>`. Sorts chronologically, never overwrites.
2. Insert a `runs` row (path, dataset, capability, provider ids in order, sample, offset, order, dataset sha256, started at, manifest path).
3. Fetch the slice. Open the outcome writer.
4. If `--include-unsupported`, emit a synthetic `unsupported` outcome per input for every excluded-as-unsupported provider, so the provider × input rectangle is complete.
5. Run **providers concurrently**, each with its own rate limiter, HTTP client (secrets = its own key), retry policy (default, then descriptor override, then CLI override), circuit breaker, and cache purge watermark resolved once. One vendor's tight limit never throttles the others.
6. Within a provider, run rows through `mapWithConcurrency` at the provider's concurrency. Per row: invalid input → synthetic `invalid_input`; breaker open → synthetic with the tripped status; else consult the cache; on a miss, wrap the client with `trackRequests`, invoke the handler, catch and classify anything thrown; build the outcome with the row's stats; `breaker.observe(status)`; emit; report progress.
7. On a cache hit, replay the timings of the call that produced the answer (`attempts`, `latencyMs`) and set `waitMs` to 0. Stamp `requestSummary` as `(cached YYYY-MM-DD)`.
8. Close the writer. Compute summary, waterfall, agreement, optimizer, verdicts. Write the aggregate JSON, the HTML report, rebuild the index, mark the run finished.

`invokeCapability(provider, capability, input, ctx)` is the one place the capability↔input type link is erased with a cast. Guard it at runtime with an "unreachable, preflight should have excluded it" error.

## 7. Cache (`cache.ts`)

The cache is a **query over the `outcomes` table**. No second store, so it cannot drift from what was measured.

- On by default. `--no-cache` or `BENCH_CACHE=0` disables it. Re-running is the normal workflow and paying vendor price every time makes that prohibitive.
- Key: provider, capability, input key. Path is deliberately not part of the key: a capability answer is a capability answer.
- Serve only `success` and `no_result`. A known miss is worth as much as a known hit.
- Serve only rows with `cached = 0`, i.e. from real API calls, so a replayed number is always exactly one hop from a measurement and `finishedAt` keeps meaning "when we last actually asked".
- Serve only rows newer than the provider's purge watermark.
- **No expiry.**
- `purgeCache(provider, capability?)` inserts a watermark row into `cache_purges`. It deletes nothing: the outcomes table is also the permanent record and `bench report` must still see every past run. Report how many distinct input keys it invalidated.
- `countCacheHits(provider, capability, inputKeys)` so preflight quotes live calls rather than provider × rows.
- `backfillCachedLatency()`: repair cached rows written with `latency_ms = 0` by copying timings from the live call they were served from, matched on provider, capability, path and input, causal (`source.finishedAt <= target.startedAt`), newest first. Rows with no source stay blank; filling them would invent a call that never happened. Offer `--dry-run` and print the plan per path and provider.

Document the trade-off plainly: a cached re-run produces the same numbers as a fresh one. `cachedShare` prints in yellow whenever it is above zero, every row is stamped `cached`, and the manifest records it. The case the cache cannot see is a vendor changing what a parameter *does*: purge that provider's capability before re-measuring a vendor that has fixed something.

## 8. Metrics (`metrics/`)

All pure functions over `EnrichmentOutcome[]`. Cover each with a hermetic test.

### 8.1 Latency sample rule (`metrics/latency.ts`)

`latencySample(outcome) → number | null`: `latencyMs > 0 ? latencyMs : null`. Shared by summary and optimizer so they can never disagree about p50. A zero means "no measurement", never "instant": `unsupported`, `invalid_input`, breaker-skipped rows, and pre-replay cached rows carry none. A real round trip never returns under a millisecond, so no genuine measurement is lost. Cached rows **do** contribute: latency is a property of the vendor, not of the run that reads the answer back.

### 8.2 Summary (`metrics/summary.ts`)

Per provider: counts per status, `attempted` (rows minus unsupported), `answered` (success + no_result), `matches`, `matchRate` (matches / attempted; includes failures because an unreachable API is a real cost), `matchRateAnswered` (matches / answered; isolates coverage from availability), `failureRate`, `cachedShare`, `latency { p50, p95, max, samples, replayed }`, `totalWaitMs`. The two match rates diverge exactly when a vendor is having a bad day. Quote `samples` and `replayed` beside every percentile.

### 8.3 Waterfall and uniqueness (`metrics/waterfall.ts`)

Build `attemptedBy: inputKey → Set<provider>` (excludes unsupported) and `matchedBy: inputKey → Set<provider>` (success only). Report: `total` inputs, `waterfallMatches` (inputs anyone matched), `waterfallMatchRate` (union coverage), and per provider: `matches`, `matchRate`, `exclusiveMatches` (nobody else found it: the **dataset uniqueness** metric), `exclusiveMatchRate`, `exclusiveShareOfMatches`, `avgOverlap` (mean over this provider's matches of the fraction of *other attempting* providers that also matched; low overlap plus decent coverage is what makes a good second stage). Sort by matches.

Also `maxCoverageSoonest`: greedy by marginal coverage, ties broken on provider id for reproducibility. Label it clearly as **not** the recommendation. It ignores price.

### 8.4 Agreement (`metrics/agreement.ts`)

`computeAgreement(outcomes, valueKind)`. Group successful, normalizable values by input key, keeping the latest per provider. Count `unnormalizable` and report it, never hide it. An input with fewer than two answers carries zero agreement information and must not inflate any denominator.

For each contested input (2+ answers): pairwise comparisons on `compareKey`, accumulated per provider and per sorted pair; unanimous if all compare keys are equal, else push a `Conflict { inputKey, sourceRowId, values (normalized per provider), rawValues }`. If the normalizer has a `coarseKey`, count coarse unanimity too.

Report: `matchedInputs`, `contestedInputs`, `unanimousInputs`, `conflictedInputs`, `agreementRate` (unanimous / contested), `perProvider`, `perPair`, optional `coarse { label, agreementRate, unanimousInputs }`, `conflicts` sorted by input key.

Pairwise rather than all-or-nothing: with three providers, "two of three agree" is a real and common state that a unanimity-only metric throws away.

### 8.5 Optional ground truth precision

`[TODO: Delete if 0.6 is empty.]` If the path's dataset declares a trusted column for this capability, compute per provider: precision = correct / matches, where correct means `compareKey(value)` equals `compareKey(truth)`, or `coarseKey(value)` equals the truth when the truth is coarse (e.g. an employer domain). Alias-normalize before scoring where you know aliases exist. Report it beside coverage and use it in verdict cautions in place of agreement for that path.

## 9. Economics (`economics/`)

### 9.1 Costs (`economics/costs.ts`)

`priceOf(capability, providerId) → { credits: number | null, source: "contract" | "list" | "estimate" | "unpriced", billing: "on_success" | "per_call", provenance: string }`. `provenance` is a human string saying where the number came from, including the arithmetic if it was derived. `creditsToUsd(credits)` through one constant. `[TODO: Fill the table from 0.5. If you use a credit unit, define the constant.]` Add a test that fails if a `contract` or `list` price in code disagrees with a checked-in price file, so the cost model cannot go silently stale.

### 9.2 Optimizer (`economics/optimizer.ts`)

The key insight, and state it in a doc comment: when misses are free (`on_success` billing), **coverage of a provider set is order-independent** (a union is a union) and **only cost and latency depend on order** (a row caught early is a row the next vendor never bills for and never waits on). So the subset picks coverage and the ordering picks what you pay.

`providerFacts(outcomes, capability)`: per provider, `matched: Set<inputKey>`, `attempted: Set<inputKey>`, `credits`, `priceSource`, `billing`, `meanLatencyMs` (over `latencySample`, cached rows included), `failureRate`.

`evaluateSequence(order, allInputs)`: walk the order. At each position `calls` = inputs still unresolved; `newMatches` = this provider's matches not already covered; `credits` = price × (`billing === "on_success"` ? `newMatches` : `calls`); `expectedLatencyMs += (calls / N) × meanLatencyMs`. Track `hasUnpricedMember`. Return `{ order, steps, matches, coverage, totalCredits, usd, usdPer1000, usdPerMatch, expectedLatencyMs, hasUnpricedMember }`.

`optimize(outcomes, capability)`: enumerate **every ordered subset** (Σ C(n,k)·k!, which is 64 at n=4, 1,956 at n=6). Refuse above 7 providers with a message telling the user to narrow with `--providers`. Greedy-by-coverage and greedy-by-cost disagree and both can miss the optimum; write a test with a fixture where the cost-optimal order is not the greedy one. Keep the cheapest sequence at each match count (ties: lower expected latency, then fewer providers). Build the **Pareto frontier**: ascending coverage, dropping any point that costs at least as much as a higher-coverage one. `recommended` = cheapest sequence at maximum coverage.

`withMarginals(frontier)`: marginal USD per extra match between consecutive points, and mark the **knee**: the point after which the marginal cost jumps hardest, only if the jump is at least 2×. That is usually where to stop buying coverage.

`breakEvenCredits(providers, providerId, allInputs)`: the price at which a provider off the optimal path would join it. Cheapest max-coverage sequence without it, versus with it priced at zero; the difference divided by the rows it would bill for. Null if it adds no coverage at all. Directly usable when negotiating with a vendor.

### 9.3 Verdicts (`economics/verdicts.ts`)

Per provider, derived from the enumeration, never asserted:

| kind | meaning |
|---|---|
| `core` | on the cost-optimal path to maximum coverage |
| `marginal` | off the path, but reaches rows nobody else does, at a price |
| `dominated` | another priced provider is a superset on coverage and no worse on cost and latency |
| `adds-nothing` | zero exclusive matches; including it can never raise maximum coverage |
| `unpriced` | no price, so it cannot be cost-ranked |

Each verdict carries: `position` in the recommended order or null, `matches`, `matchRate`, `exclusiveMatches`, `credits`, `usdPerHit`, `billedAtPosition`, `breakEvenCredits` (only for excluded providers), a one-line `headline`, and `cautions`.

Cautions, each with `kind` (`agreement | reliability | latency | pricing`) and `severity` (`warn | note`):

- agreement below 50% on contested comparisons. **Warn** if the provider is proposed for position 1, because position-1 answers are accepted without a second opinion. Note otherwise.
- failure rate above 10%: its match rate is a floor, not a coverage measurement.
- p95 above the per-attempt timeout: retries are stacking (for a polling vendor, say polls instead).
- price source is `estimate`: cost figures inherit it.

Overall cautions: the recommended sequence contains an unpriced member (cost is a floor); overall agreement below 50% (coverage overstates usable data; treat conflicts as a verification queue); fewer than 100 inputs (cost per 1,000 carries real sampling error).

Sort verdicts: included first in run order, then by coverage.

## 10. Output and persistence

### 10.1 Directory layout (`output/run-dir.ts`)

Organised by the question you are asking, not by the run that produced it:

```
runs/
  index.html                          every run ever
  waterfall/<path>/<runId>.json       "how did the vendors compare on this path?"  (aggregate)
  waterfall/<path>/<runId>.html       the same run, rendered
  <provider>/<path>/<runId>.json      "what exactly did this vendor return?"        (raw rows)
```

Provider-first for raw output means every answer a vendor ever gave on a path sits in one directory in run order.

### 10.2 Raw files (`output/outcome-writer.ts`)

One JSON array per provider per run, **streamed** row by row as they complete, with `raw` re-parsed into a real object so `jq` reaches into the payload. A killed run leaves a file without its closing `]`: an obvious, trivially repairable signal rather than silent loss. Cached rows are written exactly like live ones with `cached: true` as the only difference. Every row is also inserted into the `outcomes` table.

### 10.3 Manifest and aggregate (`output/manifest.ts`)

`RunManifest`: `runId`, `recomputed?`, `command` (argv with secrets redacted), `gitCommit`, `startedAt`, `finishedAt`, `durationMs`, `path { id, label, capability, valueKind, caveats }`, `dataset { id, csvPath, csvSha256, totalRows, eligibleRows, notes }`, `slice { offset, sample, order, filters (every declared filter and the value in force), resolvedRows, underFilled }`, `providerSelection { origin, envVar? }`, `providers[] { id, included, excludedReason?, detail?, limits?, note? }`, `cache { enabled, hits }`, `counts` per provider per status, `totals { inputs, apiCalls, invalidInputs, cachedRows }`, `outputs` (paths to aggregate, html, index, and `raw_<provider>` files).

The aggregate document is the manifest plus `summary`, `waterfall`, `agreement`, and `economics` (optimizer plus verdicts) in one file. One file answers "what happened in this run". `csvSha256` is the load-bearing field: two runs are only comparable if the underlying data was byte-identical.

### 10.4 Database (`db/`)

Tables: one per dataset, plus `runs`, `outcomes` (indexed on run, on path + run, and on provider + capability + input key + id, which covers the cache lookup), `cache_purges`, `dataset_seeds`. WAL mode, foreign keys on. No migrations: the database is regenerable from CSV in seconds, so `db:push` is the only setup step. Fail with that instruction, not a raw SQLite error, when a table is missing.

## 11. Reporting

### 11.1 Terminal (`ui/reporter.ts`)

Preflight header, before anything runs:

```
bench · <path id>
  capability  <id> (<label>)
  dataset     <id> — <eligible> eligible row(s)   [source=any emailType=work]
  slice       <n> row(s)  (asked for <sample> — only <eligible> eligible)
  providers   <origin label>
    ✔ provider-a     5/s 300/min c=6   12/50 cached
      ⚠ <capability note, if any>
    – provider-b     unsupported — implements only linkedinToPhone
    · provider-c     not_selected — not in this path's default set (override with BENCH_PROVIDERS_<PATH>)
  estimate    <live> live call(s) · <cached> of <total> from cache, ≥<duration> at the tightest rate limit
  note        <path caveat>
```

Then either a single redrawing progress bar with per-provider percentages (compact, TTY only) or one line per row (`--verbose`: provider, row id, wait ms, fetch ms, coloured status). Never both.

On finish, in this order: **Results** table (provider, matches, rate, answered, no_result, fail, p50, p95; a failure breakdown line only when there are failures; a yellow cached-share line only when above zero, naming how many latency samples were replayed), **Recommended waterfall** (the chain, coverage, $/1k, $/match, latency/row, orderings evaluated, per-step adds and calls and credits, the knee if it is shorter than the recommendation, every warn-level caution), **Waterfall** (union coverage, per-provider matches, rate, exclusive, exclusive %, overlap, then "max coverage soonest (ignores price)"), **Agreement** (contested, unanimous, conflicted, coarse agreement, unnormalizable count, per-pair table, first 20 conflicts, and always the line "Agreement is consistency, not accuracy — treat conflicts as a verification queue."), then the run id and every output path including each raw file.

Preflight failures print `✖ <message>` per blocking reason and exit 2.

### 11.2 HTML run report (`report/render-run.ts`, `report/html.ts`, `report/charts.ts`, `report/theme.ts`)

One standalone file: inline CSS, inline SVG, one tiny inline script for a light/dark toggle, `noindex`. Nothing fetched, so it works offline and cannot leak a request when opened. Escape every interpolated string; vendor payloads and display names are untrusted.

Section order, which deliberately departs from the terminal:

1. **Header**: path label, run id, capability, start time, duration.
2. **Headline tiles** on one eyeline: union coverage (n of N), unanimous agreement (n of contested; dash if nothing was contested; warn styling below 50%), cost per 1,000 rows with cost per match, expected latency per row in waterfall order. Below 50% agreement, a warning note under the tiles. A 60% match rate at 33% agreement is a different purchasing decision from 60% at 90%, and the terminal prints agreement last.
3. **Cautions**: the overall cautions except the agreement one, which the tiles already state.
4. **Recommended waterfall**: the chain as chips with provider colour dots, one sentence explaining why order changes price without changing coverage, warn-level cautions for position 1, a cumulative-coverage step chart (each segment is what that provider adds on top of everyone before it), and a table (position, provider, called on, adds, cumulative, credits, cost).
5. **Cost of coverage**: only if the frontier has 2+ points. A cost-versus-coverage curve with the knee labelled, a note naming where to stop, and a table (coverage, matches, sequence, $/1,000, marginal $/match with a `knee` chip).
6. **Provider verdicts**: table (provider, verdict chip + headline + cautions, coverage, exclusive, price with per-hit USD and source, break-even). One sentence on why there is no single score.
7. **Results**: per-provider coverage bars (the leader carries its own hue, the rest stay recessive), then a table (provider, matches, rate, when answered, exclusive, failures with a status breakdown, p50, p95, cached). Explain rate versus when-answered. If any latency samples were replayed, say how many and why they still describe the vendor.
8. **Agreement**: tiles (contested, unanimous, conflicted, agree-on-coarse-key), a pairwise agreement matrix (sequential single-hue encoding, because this is magnitude, not identity; a native `<title>` tooltip per cell), and the **conflict queue**: first 50 conflicts, each vendor's answer with a colour dot, and for emails the **domain styled apart from the local part**, so "they disagree about the company" and "they disagree about the local part" separate at a glance. Only the first means somebody has the wrong person. End with the consistency-not-accuracy note.
9. **Provenance**: dataset, eligible rows, slice, filters, under-filled chip, fingerprint, git commit, cache state, path caveats, a providers table (included / excluded reason, detail, limits), a prices table (credits, source chip, provenance string), links to each raw file, and a footer: "Contains customer data — keep it local."

Colour follows the vendor, never its rank: assign series colours by registry position so a provider keeps its hue across every chart of every run. Use a small categorical palette validated for contrast in both themes; do not cycle it, fold extra providers into a neutral. Every chart is followed by a real table so the data is reachable without reading the picture.

A recomputed report (section 12, `bench report --html`) shows unknown fields as unknown, never as zero. "0 eligible rows" reads as a bug, not as missing provenance.

### 11.3 Index (`report/render-index.ts`)

Built by reading every `runs/waterfall/**/*.json`. Newest first, grouped by path. Per run: time (linked to the HTML), n, coverage, unanimous with contested count, $/1,000, recommended order with colour dots, per-provider match rates as chips. If runs under one path span more than one dataset fingerprint, warn and mark the rows whose fingerprint differs from the newest with a `≠ data` chip. Coverage and cost only compare within a path and across runs sharing a fingerprint. A half-written aggregate from a killed run must not take the index down.

## 12. CLI (`cli.ts`, `commands/`)

```
bench run <path> [-s, --sample <n>] [-o, --offset <n>] [--order id|hash] [-p, --providers <ids>]
                 [--<filter> <value> …] [--no-cache] [--dry-run] [-v, --verbose]
                 [--max-consecutive-failures <n>] [--include-unsupported]
bench seed --csv <file> [--dataset <id>] [--replace]
bench build <population> …                 [TODO: one subcommand per population in 5.2, or delete]
bench cache stats | purge -p <id> [-c <capability>] | backfill-latency [--dry-run] | providers
bench report <path> [-r, --run <ids>] [-a, --all] [--strict] [--html]
bench refresh
bench matrix | paths | datasets
```

- `run` subcommands are generated by iterating the path registry, one option per declared filter. There is no switch to extend.
- `--dry-run` prints the plan and the first 10 inputs and calls nothing.
- `report` recomputes every metric from SQLite for the most recent run, named runs, or all runs of a path merged. Warn when merged runs span different fingerprints; refuse under `--strict`. `--html` writes a recomputed aggregate and report marked `recomputed`, re-renders stored reports, and rebuilds the index. Writing only the HTML would produce a report that exists on disk but never appears in the index.
- `refresh` rewrites every stored aggregate and report in place from SQLite, recomputing metric blocks while keeping each original manifest. Reach for it after anything that changes stored outcomes or metric code. Report and skip truncated files.
- `matrix`, `paths`, `datasets` are read-only, need no keys, make no calls. `paths` prints each path's effective default provider set and the env var that pins it.

Errors print `Error: <message>` and exit 1. Preflight refusals exit 2.

## 13. Configuration (`env.ts`)

One zod schema holding every default, parsed once at startup from `.env` (use `process.loadEnvFile`; no dotenv dependency). Fail with an aggregated, readable report naming every bad variable and the file to fix. Every provider API key is required so the process refuses to start rather than failing 50 rows deep.

Variables:

- `<PROVIDER>_API_KEY` for each provider in 0.3. `[TODO: Any extra per-provider config, e.g. an account id in the URL path.]`
- `BENCH_PROVIDERS_<PATH>` (path id upper-snake-cased) and `BENCH_PROVIDERS` fallback: comma-separated ids. An empty value means unset. Retires a vendor from routine runs without deleting its adapter.
- `BENCH_<PROVIDER>_LIMIT=<requests>/<seconds>`: overrides descriptor limits, for sharing a key with a running production system. Hyphenated ids normalize to underscores. Validate the shape.
- `BENCH_CACHE`: any of `0|false|off|no` disables.
- `BENCH_FREE_DOMAIN_LIST`: which consumer-domain list classifies seed rows.

Ship a `.env.example` with every variable and a one-line comment each. Never commit `.env`, `*.db`, `runs/`, or `data/*.csv` except `data/*.example.csv`. Add a `.gitignore` saying why.

Provider lists are plain strings with a per-path default. No enum in the schema: the registry already rejects an unknown id and names the known ones, so a typo blocks the run either way, and only once.

## 14. Tests

All hermetic: in-memory SQLite, JSON fixtures, fake clock, stubbed `fetch`, no network, no API keys. One test asserts the suite is hermetic. Cover at minimum:

- normalizers for each value kind, including the deliberate non-folding of email local parts and phone last-9-digit comparison
- dataset `parseRow`, header aliases, natural key, email-type derivation against the evidence
- `fetchSlice` eligibility, determinism, filter application, and under-fill
- registry: duplicate ids throw, `waterfall` is reserved, and the capability matrix matches a pinned table
- `planRun`: unknown id blocks; unsupported blocks only from CLI; missing key excluded or blocked by origin; exclusion reasons and precedence
- rate limiter windows and `pauseFor`; retry delay, `Retry-After` parsing, retryable statuses; circuit breaker
- `classifyHttp`, `classifyThrown`, `toOutcome` (unnormalizable success → provider_error), `syntheticOutcome`
- each provider adapter against recorded response fixtures: a hit, a miss in every shape the vendor uses, an auth error, and for async vendors the poll loop under a stubbed sleep bounded by poll count as well as clock
- `summarize`, `computeWaterfall`, `computeAgreement` (pairwise, unanimity, coarse, unnormalizable, single-answer inputs excluded)
- `latencySample`, and that cached rows contribute latency
- `evaluateSequence` under both billing modes; `optimize` with a fixture where the exhaustive optimum beats both greedy orders; Pareto frontier and knee; `breakEvenCredits`
- verdict classification and cautions, including position-1 severity
- cache: read, purge watermark, hit counting, backfill plan and apply
- outcome writer streaming and closing brackets; run-dir layout; manifest command redaction
- report rendering: escaping, self-containment (no external URLs in the output), section presence, degenerate inputs (no matches, one provider, no contested inputs), recomputed manifests

## 15. README

Write it for someone who has never seen the code. Sections: what it is and the one kind of benchmark; setup; the provider × path matrix (generated by `bench matrix`, pasted in); per-provider notes on anything learned from the live API that the docs did not say; seed data and the fairness rule with the honest limitation; running a benchmark, narrowing the slice, choosing providers and the precedence; preflight and the circuit breaker; output layout with `jq` examples; cache semantics and the trade-off; the report and why it leads with coverage and agreement together; which providers belong in the waterfall and why there is no single score; costs and provenance; known caveats; how to add a path, dataset, population, provider, capability and filter; tests.

Wherever a design choice exists because the obvious alternative produced wrong numbers, say what went wrong. That is the part a future reader needs.

## 16. Order of work

1. Domain model, registry, normalizers, dataset, paths. `bench matrix` and `bench paths` work with no keys.
2. Database, seeding, slicing. `bench seed` and `bench run <path> --dry-run` work.
3. Runtime: HTTP client, limiter, retry, breaker, classification. Tests with a fake clock and stubbed fetch.
4. One provider adapter, end to end, with fixtures. Then the rest.
5. Runner, outcome writer, manifest, cache. A 5-row live run per path against one provider.
6. Metrics and economics with fixture tests.
7. Terminal reporter, HTML report, index, `report` and `refresh`.
8. README, `.env.example`, `.gitignore`.

Definition of done: `bench run <every path> --sample 10` completes against every provider, every raw file opens in `jq`, the HTML report renders every section, `bench report <path> --html` reproduces the same numbers from SQLite with no API calls, and the test suite passes offline.

# END OF PROMPT

---

## Notes for the person publishing this

- The blog post's four dimensions map onto the report like this: **coverage** = match rate and union coverage; **accuracy** = agreement and the conflict queue (plus precision if you have ground truth); **speed** = p50/p95 with the replay rule; **cost** = the optimizer, the Pareto frontier and break-even prices. **Dataset uniqueness** is the exclusive-matches column.
- Sample sizes: 1,000 rows is a good target. In our experience nothing changes after the first 100 or so, and a 10-row smoke run is enough to prove an adapter works. Neither is a ranking.
- The first thing every real run teaches you is that a vendor's docs are wrong about one of: what a miss looks like, what a miss costs, or how fast it is. Record what you find in the README's per-provider notes. That file becomes the most valuable artifact in the repo.
