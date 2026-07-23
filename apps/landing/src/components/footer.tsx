import { LogoRaw } from "@/components/logo";
import { appInfo } from "@/lib/const";
import { Linkedin } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

type FooterLink = {
  label: string;
  href: string;
  nofollow?: boolean;
};

type FooterGroup = {
  heading: string;
  links: FooterLink[];
};

/* Columns hold stacked groups (Ferndesk pattern): tall lists sit at the
   edges, short groups stack in the middle so column heights stay level. */
const footerColumns: FooterGroup[][] = [
  [
    {
      heading: "Developers",
      links: [
        { label: "Documentation", href: "/docs" },
        { label: "API reference", href: "/docs/api" },
        { label: "Pipe Catalog", href: "/docs/pipe-catalog" },
        { label: "Search Catalog", href: "/docs/search-catalog" },
        { label: "MCP server", href: "/docs/sdks/mcp" },
        { label: "TypeScript SDK", href: "/docs/sdks/typescript-client" },
      ],
    },
  ],
  [
    {
      heading: "Product",
      links: [
        { label: "Pipe0 Sheets", href: "/docs/sheets" },
        { label: "Pricing", href: "/pricing" },
        { label: "Sign up", href: appInfo.links.signupUrl, nofollow: true },
        { label: "Login", href: appInfo.links.loginUrl, nofollow: true },
      ],
    },
    {
      heading: "Company",
      links: [
        { label: "Blog", href: "/blog" },
        { label: "About", href: "/resources/legal/imprint" },
        { label: "Contact", href: `mailto:${appInfo.emails.support}` },
      ],
    },
  ],
  [
    {
      heading: "Compare",
      links: [
        { label: "pipe0 vs Clay", href: "/compare/pipe0-vs-clay" },
        { label: "pipe0 vs Apollo", href: "/compare/pipe0-vs-apollo" },
        { label: "pipe0 vs ZoomInfo", href: "/compare/pipe0-vs-zoominfo" },
        { label: "Clay alternatives", href: "/blog/clay-alternatives" },
        { label: "ZoomInfo alternatives", href: "/blog/zoominfo-alternatives" },
        { label: "Does Clay have an API?", href: "/blog/clay-api" },
        {
          label: "Best MCP servers for GTM",
          href: "/blog/best-mcp-servers-gtm",
        },
        {
          label: "Enrichment for Claude Code",
          href: "/blog/data-enrichment-claude-code",
        },
      ],
    },
    {
      heading: "Legal",
      links: [
        { label: "Privacy", href: "/resources/legal/privacy-policy/20250404" },
        { label: "Terms", href: "/resources/legal/terms-of-service/20250404" },
      ],
    },
  ],
];

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="currentColor"
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="currentColor"
    >
      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
    </svg>
  );
}

const socialLinks = [
  {
    label: "GitHub",
    href: appInfo.links.github,
    icon: <GitHubIcon className="size-3.5" />,
  },
  {
    label: "Discord",
    href: appInfo.links.discord,
    icon: <DiscordIcon className="size-3.5" />,
  },
  {
    label: "LinkedIn",
    href: appInfo.links.linkedin,
    icon: <Linkedin className="size-3.5" />,
  },
];

function FooterAnchor({
  link,
  children,
}: {
  link: FooterLink;
  children: ReactNode;
}) {
  const isExternal =
    link.href.startsWith("http") || link.href.startsWith("mailto:");
  const className =
    "text-sm text-muted-foreground transition-colors hover:text-foreground";
  if (isExternal) {
    return (
      <a
        href={link.href}
        rel={link.nofollow ? "nofollow noreferrer" : "noreferrer"}
        className={className}
      >
        {children}
      </a>
    );
  }
  return (
    <Link
      href={link.href}
      rel={link.nofollow ? "nofollow" : undefined}
      className={className}
    >
      {children}
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="landing mt-16 px-5 sm:px-10">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 border-b border-border pb-12 md:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
          {/* Brand */}
          <div className="col-span-2 flex flex-col gap-4 md:col-span-1">
            <Link href="/" className="inline-flex">
              <LogoRaw />
            </Link>
            <p className="max-w-[240px] text-sm leading-relaxed text-muted-foreground">
              Data enrichment by API, spreadsheet, or agent.
            </p>
            <ul className="mt-1 space-y-2.5">
              {socialLinks.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {social.icon}
                    {social.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${appInfo.emails.support}`}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {appInfo.emails.support}
                </a>
              </li>
            </ul>
          </div>

          {/* Link columns, each a stack of groups */}
          {footerColumns.map((groups) => (
            <div key={groups[0].heading} className="flex flex-col gap-10">
              {groups.map((group) => (
                <div key={group.heading}>
                  <h4 className="mb-4 text-[13px] font-semibold text-foreground">
                    {group.heading}
                  </h4>
                  <ul className="space-y-2.5">
                    {group.links.map((link) => (
                      <li key={link.label}>
                        <FooterAnchor link={link}>{link.label}</FooterAnchor>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 py-7 text-[13px] text-muted-foreground sm:flex-row sm:justify-between">
          <span>
            © {new Date().getFullYear()} {appInfo.productName}. All rights
            reserved.
          </span>
          <span>Built quietly.</span>
        </div>
      </div>
    </footer>
  );
}
