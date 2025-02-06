import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getAllPosts } from "@/lib/blog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export type Post = {
  image: string;
  title: string;
  category: string[];
  date: string;
  slug: string;
};

async function getPosts() {
  return await getAllPosts();
}

export default async function BlogPage() {
  const posts = await getPosts();
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-16 text-center">
        <h1 className="text-6xl font-serif mb-4">Blog</h1>
        <p className="text-xl text-muted-foreground">
          Our best content on growing your business, from strategy to
          implementation.
        </p>
      </div>
      <div className="relative">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Card key={post.slug} className="border-none shadow-none">
              <CardContent className="p-0">
                <Link href={`/blog/${post.slug}`}>
                  <div className="relative aspect-[4/3] mb-4 overflow-hidden rounded-lg">
                    <img
                      src={
                        post.image ||
                        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-yeEFLHZLSrKtXTvIUfaan4TbNuO5q8.png"
                      }
                      alt={post.title}
                      className="object-cover w-full h-full transition-transform hover:scale-105"
                    />
                  </div>
                  <Badge variant="secondary" className="mb-2">
                    {post.category}
                  </Badge>
                  <h2 className="text-2xl font-semibold leading-tight mb-2 hover:text-primary">
                    {post.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {new Date(post.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="absolute -left-12 top-1/2 -translate-y-1/2 hidden lg:block">
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </div>
        <div className="absolute -right-12 top-1/2 -translate-y-1/2 hidden lg:block">
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}
