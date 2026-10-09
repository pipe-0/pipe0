import { Band, Cell, Cells } from "@/components/grid";
import { LandingShell } from "@/components/landing-shell";
import { appInfo } from "@/lib/const";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Support",
  description:
    "Get help with pipe0: email support with a two-business-day response commitment, community Discord, GitHub Discussions, and documentation.",
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
    body: "Missing a pipe, search, or integration? Request it on GitHub Discussions.",
    linkLabel: "Open a discussion",
    href: appInfo.links.requestPipe,
  },
];

export default function Support() {
  return (
    <LandingShell page="product">
      <Band>
        <div className="flex flex-col items-center px-6 pb-12 pt-12 text-center sm:px-10 sm:pb-14 sm:pt-16 lg:px-12">
          <h1 className="text-balance text-[clamp(26px,2.8vw,40px)] font-medium leading-[1.04] tracking-[-0.045em] text-foreground">
            How can we help?
          </h1>
          <p className="mx-auto mt-6 max-w-[620px] text-balance text-[17px] leading-[1.55] text-muted-foreground">
            Whatever you&apos;re running into — setup, billing, integrations, or
            data questions — these channels reach us. Email is answered within
            two business days.
          </p>
        </div>
        <Cells className="border-t border-[var(--rule)] sm:grid-cols-2">
          {channels.map((c) => (
            <Cell key={c.title} className="flex flex-col px-6 py-10 sm:px-10 lg:px-12">
              <h2 className="text-[17px] font-medium tracking-[-0.015em] text-foreground">
                {c.title}
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                {c.body}
              </p>
              <a
                className="mt-5 text-[15px] font-medium text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
                href={c.href}
              >
                {c.linkLabel}
              </a>
            </Cell>
          ))}
        </Cells>
      </Band>
    </LandingShell>
  );
}
