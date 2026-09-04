"use client";

import { cn } from "@/lib/utils";
import { useCopyButton } from "fumadocs-ui/utils/use-copy-button";
import { Check, Link as LinkIcon, Mail } from "lucide-react";

const iconButton =
  "grid size-8 shrink-0 place-items-center rounded-full text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-foreground";

function XIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zM17.083 19.77h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.554V9h3.565v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
  );
}

/* Monochrome brand marks (Simple Icons paths) so the row reads like the
   share icons rather than a logo strip. */
function OpenAIIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
    </svg>
  );
}

function ClaudeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.5409Zm-.3712 10.2232 2.2914-5.9456 2.2914 5.9456Z" />
    </svg>
  );
}

function PerplexityIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.3977 7.0896h-2.3106V.0676l-7.5094 6.3542V.1577h-1.1554v6.1966L4.4904 0v7.0896H1.6023v10.3976h2.8882V24l6.932-6.3591v6.2005h1.1554v-6.0469l6.9318 6.1807v-6.4879h2.8882V7.0896zm-3.4657-4.531v4.531h-5.355l5.355-4.531zm-13.2862.0676 4.8691 4.4634H5.6458V2.6262zM2.7576 16.332V8.245h7.8476l-6.1149 6.1147v1.9723H2.7576zm2.8882 5.0404v-3.8852h.0001v-2.6488l5.7763-5.7764v7.0111l-5.7764 5.2993zm12.7086.0248-5.7766-5.1509V9.0618l5.7766 5.7766v6.5588zm2.8882-5.0652h-1.733v-1.9723L13.3948 8.245h7.8478v8.087z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
    </svg>
  );
}

/**
 * "Summarize" row — hands the article URL to the reader's assistant of
 * choice with a one-line prompt. Every target accepts the prompt as a query
 * parameter, so these are plain links; the assistant fetches the page.
 */
export function SummarizeActions({
  url,
  className,
}: {
  url: string;
  className?: string;
}) {
  const prompt = `Summarize this article: ${url}`;
  const targets = [
    {
      name: "ChatGPT",
      href: `https://chatgpt.com/?${new URLSearchParams({ hints: "search", q: prompt })}`,
      icon: <OpenAIIcon />,
    },
    {
      name: "Claude",
      href: `https://claude.ai/new?${new URLSearchParams({ q: prompt })}`,
      icon: <ClaudeIcon />,
    },
    {
      name: "Perplexity",
      href: `https://www.perplexity.ai/search?${new URLSearchParams({ q: prompt })}`,
      icon: <PerplexityIcon />,
    },
    {
      name: "Google AI Mode",
      href: `https://www.google.com/search?${new URLSearchParams({ udm: "50", q: prompt })}`,
      icon: <GoogleIcon />,
    },
  ];

  return (
    <div className={cn("flex items-center", className)}>
      <span className="mr-1 text-[13px] text-fd-muted-foreground">
        Summarize
      </span>
      {targets.map((target) => (
        <a
          key={target.name}
          href={target.href}
          target="_blank"
          rel="noreferrer noopener"
          title={`Summarize with ${target.name}`}
          aria-label={`Summarize with ${target.name}`}
          className={iconButton}
        >
          {target.icon}
        </a>
      ))}
    </div>
  );
}

/** Copy the canonical article URL — check flips in briefly on success. */
export function CopyLinkButton({ url }: { url: string }) {
  const [isChecked, onCopy] = useCopyButton(() => {
    void navigator.clipboard.writeText(url);
  });

  return (
    <button
      type="button"
      title="Copy link"
      aria-label="Copy link"
      className={cn(iconButton, "cursor-pointer")}
      onClick={onCopy}
    >
      {isChecked ? (
        <Check className="size-3.5 text-fd-primary" />
      ) : (
        <LinkIcon className="size-3.5" />
      )}
    </button>
  );
}

/** Share icon row/column — X, LinkedIn, email, copy link. */
export function ShareActions({
  title,
  url,
  className,
}: {
  title: string;
  url: string;
  className?: string;
}) {
  const text = encodeURIComponent(title);
  const href = encodeURIComponent(url);

  return (
    <div className={cn("flex items-center", className)}>
      <a
        href={`https://twitter.com/intent/tweet?text=${text}&url=${href}`}
        target="_blank"
        rel="noreferrer"
        title="Share on X"
        aria-label="Share on X"
        className={iconButton}
      >
        <XIcon />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${href}`}
        target="_blank"
        rel="noreferrer"
        title="Share on LinkedIn"
        aria-label="Share on LinkedIn"
        className={iconButton}
      >
        <LinkedInIcon />
      </a>
      <a
        href={`mailto:?subject=${text}&body=${href}`}
        title="Share by email"
        aria-label="Share by email"
        className={iconButton}
      >
        <Mail className="size-3.5" />
      </a>
      <CopyLinkButton url={url} />
    </div>
  );
}
