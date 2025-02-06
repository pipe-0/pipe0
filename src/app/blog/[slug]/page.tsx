import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getPostBySlug, getAllPosts } from "@/lib/blog";
import { Button } from "@/components/ui/button";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPost({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return null;
  }

  return (
    <article className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/blog">Blog</Link>
          <ChevronRight className="h-4 w-4" />
          <span>{post.category}</span>
        </nav>

        <h1 className="text-5xl font-serif leading-tight mb-4">{post.title}</h1>

        <div className="flex items-center gap-4 mb-8">
          <div className="text-sm text-muted-foreground">
            {new Date(post.date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Share on Twitter
            </Button>
            <Button variant="outline" size="sm">
              Share on LinkedIn
            </Button>
          </div>
        </div>

        <div className="prose prose-lg max-w-none">{post.content}</div>
      </div>
    </article>
  );
}
