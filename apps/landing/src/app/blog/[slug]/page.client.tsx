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
