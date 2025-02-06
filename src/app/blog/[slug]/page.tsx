import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { ChevronRight } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Generate metadata for each blog post
export async function generateMetadata(
  props: {
    params: Promise<{ slug: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.excerpt, // Use excerpt or first 160 characters of content
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: post.authors.map((a) => a.name), // Replace with actual author or default
      images: [
        {
          url: post.image || "media/blog/0-default-blog-image.jpg", // Replace with actual image or default
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.image || "/default-blog-image.jpg"], // Replace with actual image or default
    },
  };
}

export default async function BlogPost(
  props: {
    params: Promise<{ slug: string }>;
  }
) {
  const params = await props.params;
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
        </div>

        <div className="prose prose-lg max-w-none">{post.content}</div>
      </div>
    </article>
  );
}
