import { ScrollReveal } from "@/app/scroll-reveal";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Section } from "@/components/marketing";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";
import { appInfo } from "@/lib/const";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "pipe0 for Slack",
  description:
    "Connect pipe0 to Slack: post enrichment results and pipeline alerts into channels, list channel members with verified emails, send direct messages, and work with the @pipe0 agent.",
  path: "/integrations/slack",
});

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
    <div className="landing min-h-screen bg-background">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Slack integration", url: "/integrations/slack" },
        ])}
      />
      <Header page="product" />
      <ScrollReveal />

      {/* ===== Hero ===== */}
      <section className="mx-auto max-w-384 px-3 sm:px-6">
        <div className="hero-panel border relative overflow-hidden rounded-[18px]">
          <div className="card-sky absolute inset-0" aria-hidden />
          <div className="relative z-10 px-5 pb-16 pt-14 text-center sm:px-10 sm:pb-24 sm:pt-20">
            <h1 className="mx-auto max-w-2xl text-[clamp(34px,4.5vw,52px)] font-semibold leading-[1.08] tracking-[-0.025em] text-white">
              pipe0 for Slack.
            </h1>
            <p className="mx-auto mt-5 max-w-[600px] text-[17px] leading-relaxed text-white/75 sm:text-[18px]">
              Post enrichment results into channels, turn channel members into
              enrichable sheets, and ask @pipe0 for anything, right where your
              team works.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
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
              <a
                href="/docs/sdks/slack-agent"
                className="text-sm text-white/75 underline underline-offset-4 hover:text-white"
              >
                Read the docs
              </a>
            </div>
            <p className="mx-auto mt-6 max-w-[480px] text-[13px] text-white/50">
              Installing requires a free pipe0 account. The app posts what you
              configure — it does not read channel messages.
            </p>
          </div>
        </div>
      </section>

      {/* ===== What it does ===== */}
      <Section className="mt-24">
        <h2 className="mb-10 text-center text-[clamp(24px,2.6vw,32px)] font-semibold tracking-[-0.02em] text-foreground">
          What it does.
        </h2>
        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border border-border p-6">
              <h3 className="mb-2 text-base font-semibold text-foreground">{f.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ===== How it works ===== */}
      <Section className="mt-24">
        <h2 className="mb-10 text-center text-[clamp(24px,2.6vw,32px)] font-semibold tracking-[-0.02em] text-foreground">
          How it works.
        </h2>
        <div className="mx-auto max-w-3xl">
          {steps.map((s, i) => (
            <div key={s.title} className="flex gap-5 border-b border-border py-6 last:border-b-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-sm font-semibold text-foreground">
                {i + 1}
              </div>
              <div>
                <h3 className="mb-1 text-base font-semibold text-foreground">{s.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
        {/* Screenshot required by the Marketplace listing guidelines (1600×1000,
            app inside Slack). Place at public/media/website/slack-in-thread.png
            and uncomment.
        <img src="/media/website/slack-in-thread.png" alt="@pipe0 answering in a Slack thread" className="mx-auto mt-10 max-w-3xl rounded-xl border border-border" />
        */}
        <p className="mx-auto mt-8 max-w-3xl text-center text-sm text-muted-foreground">
          Full setup and usage details live in the{" "}
          <a className="underline underline-offset-4" href="/docs/sdks/slack-agent">
            Slack agent guide
          </a>
          .
        </p>
      </Section>

      {/* ===== AI disclosure + security ===== */}
      <Section className="mt-24">
        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-border p-6">
            <h3 className="mb-2 text-base font-semibold text-foreground">AI disclosure</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              pipe0 uses large language models (from providers such as Anthropic,
              OpenAI, and Google) to draft message content and to power the
              @pipe0 agent. Content you send to the agent is processed
              transiently to fulfill your request and is never used to train
              models. AI-generated content can be inaccurate — review automated
              messages before relying on them.
            </p>
          </div>
          <div className="rounded-xl border border-border p-6">
            <h3 className="mb-2 text-base font-semibold text-foreground">Security &amp; data</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              pipe0 stores your workspace&apos;s access token encrypted at rest
              (AES-256-GCM) and talks to Slack exclusively over TLS. Per
              connection, pipe0 keeps the workspace name and ID, the app&apos;s
              bot user ID, and the granted permissions. Deleting the connection
              (or removing the app from Slack) deletes the token. See the{" "}
              <a
                className="underline underline-offset-4"
                href="/resources/legal/privacy-policy/20260724"
              >
                privacy policy
              </a>{" "}
              and{" "}
              <a
                className="underline underline-offset-4"
                href="/resources/legal/terms-of-service/20250404"
              >
                terms of service
              </a>
              .
            </p>
          </div>
        </div>
        <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-muted-foreground">
          Questions? Visit the <a className="underline underline-offset-4" href="/support">support page</a>{" "}
          or email{" "}
          <a className="underline underline-offset-4" href={`mailto:${appInfo.emails.support}`}>
            {appInfo.emails.support}
          </a>{" "}
          — we respond within two business days.
        </p>
      </Section>

      {/* Trademark attribution — required where Slack's marks appear. */}
      <p className="mx-auto mt-20 max-w-3xl px-6 pb-6 text-center text-[11px] leading-relaxed text-muted-foreground/70">
        Slack is a registered trademark and service mark of Slack Technologies,
        LLC, a Salesforce company. pipe0 is not created by, affiliated with, or
        endorsed by Slack Technologies, LLC.
      </p>

      <Footer />
    </div>
  );
}
