import { authorUrl, type Author } from "@/lib/authors";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { AuthorAvatar } from "./author-avatar";
import { PreferredSourceButton } from "./preferred-source-button";

/**
 * "Written by" — who wrote the post and why they're worth listening to,
 * closing the article. Same muted panel as the TL;DR so it reads as an
 * aside rather than more body copy.
 */
export function AuthorCard({ author }: { author: Author }) {
  return (
    <aside
      aria-label="About the author"
      className="mx-auto mt-16 max-w-[680px] rounded-2xl bg-fd-muted px-6 py-6 sm:px-8 sm:py-7"
    >
      <p className="text-[13px] font-medium text-fd-muted-foreground">
        Written by
      </p>

      <div className="mt-4 flex items-center gap-3.5">
        <AuthorAvatar name={author.key} className="size-12" />
        <div className="min-w-0">
          <Link
            href={authorUrl(author)}
            rel="author"
            className="font-blog text-[18px] font-semibold leading-tight text-fd-foreground transition-colors hover:text-fd-primary"
          >
            {author.name}
          </Link>
          <p className="text-[13px] text-fd-muted-foreground">
            {author.jobTitle}, pipe0
          </p>
        </div>
      </div>

      <p className="mt-4 text-[14.5px] leading-relaxed text-fd-foreground text-pretty">
        {author.bio}
      </p>

      <ul className="mt-4 space-y-1.5 border-t border-fd-border pt-4">
        {author.credentials.map((credential) => (
          <li
            key={credential}
            className="flex gap-2 text-[13.5px] leading-snug text-fd-foreground"
          >
            <Check className="mt-0.5 size-3.5 shrink-0 text-fd-primary" />
            {credential}
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-fd-border pt-5">
        <PreferredSourceButton />
        <Link
          href={authorUrl(author)}
          className="inline-flex items-center gap-1.5 text-[13px] text-fd-muted-foreground transition-colors hover:text-fd-foreground"
        >
          More from {author.name.split(" ")[0]}
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </aside>
  );
}
