import { blog } from "@/lib/source";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Latest posts from the Pipe0 blog",
};

export default function BlogIndex() {
  const posts = [...blog.getPages()].sort(
    (a, b) =>
      new Date(b.data.date ?? 0).getTime() -
      new Date(a.data.date ?? 0).getTime(),
  );

  return (
    <main className="mx-auto w-full max-w-300 px-6 py-16 md:py-20">
      <div className="mb-12">
        <h1 className="text-3xl font-semibold tracking-tight">Blog</h1>
        <p className="mt-2 text-fd-muted-foreground">
          Updates, guides, and thoughts from the Pipe0 team.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.url}
            href={post.url}
            className="group flex flex-col rounded-xl border bg-fd-card p-5 transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
          >
            <p className="font-medium leading-snug">{post.data.title}</p>
            {post.data.description && (
              <p className="mt-1.5 text-sm text-fd-muted-foreground line-clamp-2">
                {post.data.description}
              </p>
            )}
            <p className="mt-auto pt-4 text-xs text-fd-muted-foreground">
              {post.data.date
                ? new Date(post.data.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : null}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
