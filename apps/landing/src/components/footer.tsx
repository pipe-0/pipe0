import { LogoRaw } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { appInfo } from "@/lib/const";
import { Linkedin } from "lucide-react";
import Link from "next/link";

const footerColumns: { heading: string; links: { label: string; href: string; nofollow?: boolean }[] }[] =
  [
    {
      heading: "Company",
      links: [
        { label: "Blog", href: "/blog" },
        { label: "About", href: "/resources/legal/imprint" },
      ],
    },
    {
      heading: "Resources",
      links: [
        { label: "Documentation", href: "/docs" },
        { label: "Pricing", href: "/pricing" },
        { label: "Pipe Catalog", href: "/docs/pipe-catalog" },
        { label: "Sign up", href: appInfo.links.signupUrl, nofollow: true },
        { label: "Login", href: appInfo.links.loginUrl, nofollow: true },
      ],
    },
    {
      heading: "Legal",
      links: [
        { label: "Privacy", href: "/resources/legal/privacy-policy/20250404" },
        { label: "Terms", href: "/resources/legal/terms-of-service/20250404" },
      ],
    },
  ];

export function Footer() {
  return (
    <footer className="landing mt-16 px-5 sm:px-10">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid grid-cols-2 gap-8 border-b border-border pb-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div className="col-span-2 flex flex-col gap-4 md:col-span-1">
            <Link href="/" className="inline-flex">
              <LogoRaw />
            </Link>
            <a
              href={`mailto:${appInfo.emails.support}`}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {appInfo.emails.support}
            </a>
            <div className="flex items-center gap-2">
              <Button
                asChild
                variant="secondary"
                size="icon"
                className="h-8 w-8 border px-0"
              >
                <Link
                  href={appInfo.links.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <title>GitHub</title>
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                  <span className="sr-only">GitHub</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                size="icon"
                className="h-8 w-8 border px-0"
              >
                <Link
                  href={appInfo.links.discord}
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <title>Discord</title>
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                  </svg>
                  <span className="sr-only">Discord</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                size="icon"
                className="h-8 w-8 border px-0"
              >
                <Link
                  href={appInfo.links.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Linkedin />
                  <span className="sr-only">LinkedIn</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* Link columns */}
          {footerColumns.map((col) => (
            <div key={col.heading}>
              <h4 className="mb-4 text-[13px] font-semibold text-foreground">
                {col.heading}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      rel={link.nofollow ? "nofollow" : undefined}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
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
