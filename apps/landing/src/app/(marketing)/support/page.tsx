import { ScrollReveal } from "@/app/scroll-reveal";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Section } from "@/components/marketing";
import { appInfo } from "@/lib/const";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Support",
  description:
    "Get help with pipe0: email support with a two-business-day response commitment, community Discord, GitHub discussions, and documentation.",
  path: "/support",
});

const channels = [
  {
    title: "Email support",
    body: "The fastest way to reach the team for account, billing, integration, or data questions. No account required. We respond within two business days.",
    linkLabel: appInfo.emails.support,
    href: `mailto:${appInfo.emails.support}`,
  },
  {
    title: "Documentation",
    body: "Guides for sheets, pipes, searches, connections, and the API — including setup guides for every integration.",
    linkLabel: "pipe0.com/docs",
    href: "/docs",
  },
  {
    title: "Community Discord",
    body: "Ask questions, share workflows, and talk to the team and other users.",
    linkLabel: "Join the Discord",
    href: appInfo.links.discord,
  },
  {
    title: "Feature requests",
    body: "Missing a pipe, search, or integration? Request it on GitHub discussions.",
    linkLabel: "Open a discussion",
    href: appInfo.links.requestPipe,
  },
];

export default function Support() {
  return (
    <div className="landing min-h-screen bg-background">
      <Header page="product" />
      <ScrollReveal />

      <Section className="mt-20">
        <h1 className="mb-4 text-center text-[clamp(30px,3.6vw,44px)] font-semibold tracking-[-0.02em] text-foreground">
          How can we <span className="hl">help</span>?
        </h1>
        <p className="mx-auto mb-14 max-w-xl text-center text-[15px] leading-relaxed text-muted-foreground">
          Whatever you&apos;re running into — setup, billing, integrations, or
          data questions — these channels reach us. Email is answered within
          two business days.
        </p>
        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
          {channels.map((c) => (
            <div key={c.title} className="rounded-xl border border-border p-6">
              <h2 className="mb-2 text-base font-semibold text-foreground">{c.title}</h2>
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
              <a
                className="text-sm font-medium text-foreground underline underline-offset-4"
                href={c.href}
              >
                {c.linkLabel}
              </a>
            </div>
          ))}
        </div>
      </Section>

      <div className="mt-24" />
      <Footer />
    </div>
  );
}
