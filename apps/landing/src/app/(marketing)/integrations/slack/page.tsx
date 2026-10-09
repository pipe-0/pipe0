import { Band, Cell, Cells, SectionHead } from "@/components/grid";
import { LandingShell } from "@/components/landing-shell";
import Link from "next/link";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";
import { appInfo } from "@/lib/const";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "pipe0 for Slack",
  description:
    "Connect pipe0 to Slack: post enrichment results and pipeline alerts into channels, list channel members with verified emails, send direct messages, and work with the @pipe0 agent.",
  path: "/integrations/slack",
});

const link =
  "font-medium text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary";

const installUrl = `${appInfo.links.appUrl}/connect/slack`;

const features = [
  {
    title: "Post into channels",
    body: "Send what your sheets and workflows produce into any channel. Public channels need no invite.",
  },
  {
    title: "List channel members",
    body: "Turn a channel into a sheet: one row per member with name, title, and email, ready to enrich.",
  },
  {
    title: "Send direct messages",
    body: "DM workspace members from a workflow, sent as the pipe0 app.",
  },
  {
    title: "Work with @pipe0",
    body: "Mention the agent or DM it. It answers in the thread, on your account and credits.",
  },
];

const steps = [
  {
    title: "Add pipe0 to your workspace",
    body: "Click “Add to Slack”, sign in to pipe0 (free account), and approve the app. The connection is shared with your organization.",
  },
  {
    title: "Invite the app to private channels",
    body: "Public channels work right away; private channels after /invite @pipe0.",
  },
  {
    title: "Use it",
    body: "Post from workflows, run the channel-member search, or mention @pipe0 and ask.",
  },
];

export default function SlackIntegration() {
  return (
    <LandingShell page="product">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Slack integration", url: "/integrations/slack" },
        ])}
      />

      {/* ===== Hero ===== */}
      <Band>
        <div className="flex flex-col items-center px-6 pb-12 pt-12 text-center sm:px-10 sm:pb-14 sm:pt-16 lg:px-12">
          <h1 className="text-balance text-[clamp(26px,2.8vw,40px)] font-medium leading-[1.04] tracking-[-0.045em] text-foreground">
            pipe0 for Slack.
          </h1>
          <p className="mx-auto mt-6 max-w-[680px] text-balance text-[17px] leading-[1.55] text-muted-foreground sm:text-[19px]">
            Post enrichment results into channels, turn channel members into
            enrichable sheets, and ask @pipe0 for anything, right where your
            team works.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {/* Slack's official button asset, unmodified, served from Slack's CDN. */}
            <a href={installUrl}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Add to Slack"
                height="40"
                width="139"
                src="https://platform.slack-edge.com/img/add_to_slack.png"
                srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
              />
            </a>
            <Link href="/docs/sdks/integrations/slack-agent"
              className="text-[15px] font-medium text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
            >
              Read the docs
            </Link>
          </div>
          <p className="mx-auto mt-6 max-w-[480px] text-[13.5px] text-muted-foreground">
            Installing requires a free pipe0 account. The app posts what you
            configure — it does not read channel messages.
          </p>
        </div>
      </Band>

      {/* ===== What it does ===== */}
      <Band>
        <SectionHead title="What it does." />
        <Cells className="border-t border-[var(--rule)] sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Cell key={f.title} className="px-6 py-10 sm:px-8">
              <h3 className="text-[17px] font-medium tracking-[-0.015em] text-foreground">
                {f.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                {f.body}
              </p>
            </Cell>
          ))}
        </Cells>
      </Band>

      {/* ===== How it works ===== */}
      <Band>
        <SectionHead
          title="How it works."
          lede={
            <>
              Full setup and usage details live in the{" "}
              <Link className={link} href="/docs/sdks/integrations/slack-agent">
                Slack agent guide
              </Link>
              .
            </>
          }
        />
        <Cells className="border-t border-[var(--rule)] sm:grid-cols-3">
          {steps.map((step, i) => (
            <Cell key={step.title} className="px-6 py-10 sm:px-8 lg:px-12">
              <p className="text-[13.5px] text-muted-foreground">Step {i + 1}</p>
              <h3 className="mt-2 text-[17px] font-medium tracking-[-0.015em] text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                {step.body}
              </p>
            </Cell>
          ))}
        </Cells>
        {/* Screenshot required by the Marketplace listing guidelines (1600×1000,
            app inside Slack). Place at public/media/website/slack-in-thread.png
            and add it here as a cell-wide figure. */}
      </Band>

      {/* ===== AI disclosure + security ===== */}
      <Band>
        <Cells className="sm:grid-cols-2">
          <Cell className="px-6 py-10 sm:px-10 lg:px-12">
            <h2 className="text-[17px] font-medium tracking-[-0.015em] text-foreground">
              AI disclosure
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
              pipe0 uses large language models (from providers such as
              Anthropic, OpenAI, and Google) to draft message content and to
              power the @pipe0 agent. Content you send to the agent is processed
              transiently to fulfill your request and is never used to train
              models. AI-generated content can be inaccurate — review automated
              messages before relying on them.
            </p>
          </Cell>
          <Cell className="px-6 py-10 sm:px-10 lg:px-12">
            <h2 className="text-[17px] font-medium tracking-[-0.015em] text-foreground">
              Security &amp; data
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
              pipe0 stores your workspace&apos;s access token encrypted at rest
              (AES-256-GCM) and talks to Slack exclusively over TLS. Per
              connection, pipe0 keeps the workspace name and ID, the app&apos;s
              bot user ID, and the granted permissions. Deleting the connection
              (or removing the app from Slack) deletes the token. See the{" "}
              <Link className={link} href="/resources/legal/privacy-policy">
                privacy policy
              </Link>{" "}
              and{" "}
              <Link className={link} href="/resources/legal/terms-of-service">
                terms of service
              </Link>
              .
            </p>
          </Cell>
        </Cells>
        <div className="border-t border-[var(--rule)] px-6 py-6 text-[14.5px] text-muted-foreground sm:px-10 lg:px-12">
          Questions? Visit the{" "}
          <Link className={link} href="/support">
            support page
          </Link>{" "}
          or email{" "}
          <a className={link} href={`mailto:${appInfo.emails.support}`}>
            {appInfo.emails.support}
          </a>{" "}
          — we respond within two business days.
        </div>
        {/* Trademark attribution — required where Slack's marks appear. */}
        <p className="border-t border-[var(--rule)] px-6 py-5 text-[12px] leading-relaxed text-muted-foreground sm:px-10 lg:px-12">
          Slack is a registered trademark and service mark of Slack
          Technologies, LLC, a Salesforce company. pipe0 is not created by,
          affiliated with, or endorsed by Slack Technologies, LLC.
        </p>
      </Band>
    </LandingShell>
  );
}
