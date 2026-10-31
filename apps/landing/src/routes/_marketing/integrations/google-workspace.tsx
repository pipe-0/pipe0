import { seo } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { Band, ButtonLink, Cell, Cells, SectionHead } from "@/components/grid";
import { LandingShell, PageHero } from "@/components/landing-shell";
import { jsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";
import { appInfo } from "@/lib/const";
import { getCatalogDocPaths } from "@/lib/marketing.functions";
import { Link } from "@tanstack/react-router";
import { SiteLink } from "@/components/link";

const link =
  "font-medium text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary";

type Operation = { id: string; label: string; body: string };

/**
 * Each product is its own provider and OAuth connection. Logos are the
 * provider icons from the catalog.
 */
const products: {
  name: string;
  logo: string;
  summary: string;
  operations: Operation[];
}[] = [
  {
    name: "Google Sheets",
    logo: "https://imagedelivery.net/3B3AWuP94-S3Ro5eEac6JA/aebcd41d-4e42-4f44-926f-b1e5bfefa300/icon",
    summary:
      "Read rows from a spreadsheet and write results back to it. You name the spreadsheet by its URL.",
    operations: [
      {
        id: "rows:googlesheets@1",
        label: "Import a tab",
        body: "Bring a tab's rows into a pipe0 sheet, with columns from its header row.",
      },
      {
        id: "row:append:googlesheets@1",
        label: "Add rows",
        body: "Append each record as a new row, mapped to the tab's columns.",
      },
      {
        id: "rows:update:googlesheets@1",
        label: "Update rows",
        body: "Update every row that matches a condition, or add one when none does.",
      },
      {
        id: "row:findfirst:googlesheets@1",
        label: "Find a row",
        body: "Look up the first matching row, keyed by column name.",
      },
      {
        id: "rows:find:googlesheets@1",
        label: "Find rows",
        body: "Return every matching row and the total match count.",
      },
    ],
  },
  {
    name: "Gmail",
    logo: "https://imagedelivery.net/3B3AWuP94-S3Ro5eEac6JA/8da8ab6b-7f7e-4c42-6abf-212ea537db00/icon",
    summary: "Send or draft the emails your workflow writes, from your own address.",
    operations: [
      {
        id: "email:send:gmail@1",
        label: "Send email",
        body: "Send one email per record from your Gmail address.",
      },
      {
        id: "email:draft:gmail@1",
        label: "Create a draft",
        body: "Put a draft in your Gmail for you to review. Nothing is sent.",
      },
    ],
  },
  {
    name: "Google Calendar",
    logo: "https://imagedelivery.net/3B3AWuP94-S3Ro5eEac6JA/9cfc8918-2046-47dd-52f9-353ce76fd800/icon",
    summary: "Turn meetings into rows, and book events from them.",
    operations: [
      {
        id: "events:googlecalendar@1",
        label: "List events",
        body: "One row per event, with attendees, times, and the meeting link.",
      },
      {
        id: "event:create:googlecalendar@1",
        label: "Create events",
        body: "Create an event per record, with attendees and an optional Google Meet link.",
      },
    ],
  },
];

const scopePrefix = "https://www.googleapis.com/auth/";

/** Mirrors the scopes in core's OAuth provider registry. */
const scopes = [
  {
    product: "Google Sheets",
    scope: "spreadsheets",
    purpose:
      "Read and write the spreadsheets you give pipe0 by URL. pipe0 does not list or browse your Drive.",
  },
  {
    product: "Gmail",
    scope: "gmail.send",
    purpose: "Send the emails your pipes compose, from your address.",
  },
  {
    product: "Gmail",
    scope: "gmail.drafts.create",
    purpose:
      "Create drafts for you to review. Neither Gmail scope lets pipe0 read your mail.",
  },
  {
    product: "Google Calendar",
    scope: "calendar.readonly",
    purpose: "Read events from the calendars you pick, for the events search.",
  },
  {
    product: "Google Calendar",
    scope: "calendar.events.owned",
    purpose:
      "Create events on calendars you own. Optional: decline it and the events search still works.",
  },
  {
    product: "All three",
    scope: "userinfo.email, userinfo.profile",
    purpose: "Show which Google account a connection belongs to.",
  },
];

export const Route = createFileRoute("/_marketing/integrations/google-workspace")({
  loader: () =>
    getCatalogDocPaths({
      data: products.flatMap((p) => p.operations.map((op) => op.id)),
    }),
  head: () => ({
    ...seo({
  title: "pipe0 for Google Workspace",
  description:
    "Connect Google Sheets, Gmail, and Google Calendar to pipe0: read and write spreadsheets, send and draft email, list and create calendar events. What each permission is for and how Google data is handled.",
  path: "/integrations/google-workspace",
}),
    scripts: [jsonLd(breadcrumbJsonLd([
          { name: "Home", url: "/" },
          {
            name: "Google Workspace integration",
            url: "/integrations/google-workspace",
          },
        ]))],
  }),
  component: GoogleWorkspaceIntegration,
});

function GoogleWorkspaceIntegration() {
  const docPaths = Route.useLoaderData();
  return (
    <LandingShell page="product">

      {/* ===== Hero ===== */}
      <PageHero
        title="pipe0 for Google Workspace."
        lede="Use Google Sheets, Gmail, and Google Calendar as steps in your sheets, agent runs, and API calls."
        actions={
          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <ButtonLink href={appInfo.links.signupUrl}>Start free</ButtonLink>
              <Link to="/docs/connections" className={`text-[15px] ${link}`}>
                How connections work
              </Link>
            </div>
            <p className="max-w-[480px] text-[13.5px] text-muted-foreground">
              You connect each product with your Google account from the pipe0
              dashboard. pipe0 opens only the spreadsheets you name and never
              reads your inbox.
            </p>
          </div>
        }
      />

      {/* ===== What it does ===== */}
      <Band>
        <SectionHead title="What it does." />
        <Cells className="border-t border-[var(--rule)] lg:grid-cols-3">
          {products.map((p) => (
            <Cell key={p.name} className="px-6 py-10 sm:px-10 lg:px-12">
              <div className="flex items-center gap-3">
                <img src={p.logo} alt="" className="size-6 object-contain" />
                <h3 className="text-[17px] font-medium tracking-[-0.015em] text-foreground">
                  {p.name}
                </h3>
              </div>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                {p.summary}
              </p>
              <ul className="mt-8 divide-y divide-[var(--rule)] border-t border-[var(--rule)]">
                {p.operations.map((op) => {
                  const href = docPaths[op.id];
                  return (
                    <li key={op.id} className="py-4">
                      {href ? (
                        <SiteLink
                          href={href}
                          className="text-[15px] font-medium text-foreground underline decoration-[var(--rule-strong)] underline-offset-4 hover:decoration-foreground"
                        >
                          {op.label}
                        </SiteLink>
                      ) : (
                        <span className="text-[15px] font-medium text-foreground">
                          {op.label}
                        </span>
                      )}
                      <p className="mt-1 text-[14.5px] leading-relaxed text-muted-foreground">
                        {op.body}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </Cell>
          ))}
        </Cells>
      </Band>

      {/* ===== Permissions ===== */}
      <Band>
        <SectionHead
          title="Permissions."
          lede="Each product is its own connection and asks only for what its pipes use."
        />
        <div className="border-t border-[var(--rule)]">
          {scopes.map((s) => (
            <div
              key={s.scope}
              className="grid gap-1.5 border-b border-[var(--rule)] px-6 py-5 last:border-b-0 sm:px-10 lg:grid-cols-12 lg:gap-12 lg:px-12"
            >
              <p className="text-[14.5px] text-muted-foreground lg:col-span-3">
                {s.product}
              </p>
              <p
                title={s.scope
                  .split(", ")
                  .map((name) => scopePrefix + name)
                  .join(", ")}
                className="font-mono text-[13.5px] leading-[1.7] text-foreground lg:col-span-4"
              >
                {s.scope}
              </p>
              <p className="text-[15px] leading-relaxed text-muted-foreground lg:col-span-5">
                {s.purpose}
              </p>
            </div>
          ))}
        </div>
      </Band>

      {/* ===== Limited Use + security ===== */}
      <Band>
        <Cells className="sm:grid-cols-2">
          <Cell className="px-6 py-10 sm:px-10 lg:px-12">
            <h2 className="text-[17px] font-medium tracking-[-0.015em] text-foreground">
              Limited Use
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
              pipe0&apos;s use and transfer of information received from Google
              APIs adheres to the{" "}
              <a
                className={link}
                href="https://developers.google.com/terms/api-services-user-data-policy"
              >
                Google API Services User Data Policy
              </a>
              , including the Limited Use requirements. Google user data is
              used only to provide the features you invoke. It is never used
              for advertising, never transferred except to provide those
              features or to comply with law, and never used to train
              generalized AI models. When you run an AI pipe on it, it is
              processed transiently by the AI providers listed in the privacy
              policy.
            </p>
          </Cell>
          <Cell className="px-6 py-10 sm:px-10 lg:px-12">
            <h2 className="text-[17px] font-medium tracking-[-0.015em] text-foreground">
              Security &amp; data
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
              pipe0 stores each connection&apos;s OAuth tokens encrypted at
              rest (AES-256-GCM) and talks to Google only over TLS. Per
              connection, it keeps the Google account&apos;s ID, email, name,
              and profile picture, and the scopes you granted. Rows a run reads
              go where you send them, a pipe0 sheet or an API response, and
              follow the retention in the{" "}
              <Link className={link} to="/resources/legal/privacy-policy">
                privacy policy
              </Link>
              . Deleting the connection, or removing pipe0 in your{" "}
              <a className={link} href="https://myaccount.google.com/permissions">
                Google account
              </a>
              , deletes the tokens.
            </p>
          </Cell>
        </Cells>
        <div className="border-t border-[var(--rule)] px-6 py-6 text-[14.5px] text-muted-foreground sm:px-10 lg:px-12">
          Questions? Visit the{" "}
          <Link className={link} to="/support">
            support page
          </Link>{" "}
          or email{" "}
          <a className={link} href={`mailto:${appInfo.emails.support}`}>
            {appInfo.emails.support}
          </a>
          . We respond within two business days.
        </div>
        <p className="border-t border-[var(--rule)] px-6 py-5 text-[12px] leading-relaxed text-muted-foreground sm:px-10 lg:px-12">
          Google Workspace, Google Sheets, Gmail, and Google Calendar are
          trademarks of Google LLC. pipe0 is not created by, affiliated with,
          or endorsed by Google LLC.
        </p>
      </Band>
    </LandingShell>
  );
}
