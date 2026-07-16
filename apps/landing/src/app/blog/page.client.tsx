"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";

/** Serialized card data — computed server-side, rendered client-side. */
export type FeedPost = {
  url: string;
  title: string;
  excerpt?: string;
  /** Generated cover as a data URI. */
  cover: string;
  authorName: string;
  initials: string;
  /** "Founder, pipe0 · Apr 8, 2025" */
  authorMeta?: string;
};

const BATCH = 8;

/** The card grid — a batch at a time, with a Load-more button below. */
export function PostFeed({ posts }: { posts: FeedPost[] }) {
  const [visible, setVisible] = useState(BATCH);

  return (
    <>
      <div className="mt-10 grid grid-cols-1 gap-x-14 gap-y-12 sm:grid-cols-2">
        {posts.slice(0, visible).map((post) => (
          <PostCard key={post.url} post={post} />
        ))}
      </div>
      {visible < posts.length && (
        <div className="mt-12 flex justify-center">
          <button
            type="button"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "cursor-pointer",
            )}
            onClick={() => setVisible((v) => v + BATCH)}
          >
            Load more
          </button>
        </div>
      )}
    </>
  );
}

function PostCard({ post }: { post: FeedPost }) {
  return (
    <Link href={post.url} className="group flex flex-col">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={post.cover}
        alt=""
        className="aspect-[2/1] w-full rounded-lg object-cover ring-1 ring-fd-foreground/10 transition-opacity group-hover:opacity-90"
      />
      <h3 className="font-blog mt-4 text-[20px] font-bold leading-[1.25] tracking-[-0.005em] text-fd-foreground text-pretty transition-colors group-hover:text-fd-primary">
        {post.title}
      </h3>
      {post.excerpt && (
        <p className="mt-1.5 line-clamp-2 text-sm leading-normal text-fd-muted-foreground">
          {post.excerpt}
        </p>
      )}
      <PostByline post={post} className="mt-3.5" />
    </Link>
  );
}

/** Two-line author block — name over role, the date tucked after the role. */
export function PostByline({
  post,
  className,
}: {
  post: FeedPost;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-fd-muted text-[10px] font-semibold text-fd-muted-foreground">
        {post.initials}
      </span>
      <div className="flex min-w-0 flex-col">
        <span className="text-[13px] leading-snug font-medium text-fd-foreground">
          {post.authorName}
        </span>
        {post.authorMeta && (
          <span className="truncate text-xs leading-snug text-fd-muted-foreground">
            {post.authorMeta}
          </span>
        )}
      </div>
    </div>
  );
}
