import { getBlogPosts, getTags } from "@/app/blog/get-posts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { appInfo } from "@/lib/const";
import { themeMdxComponents } from "@/mdx-components";
import Image from "next/image";
import Link from "next/link";

const H1 = themeMdxComponents.h1;

export const metadata = {
  title: `${appInfo.productName} Blog`,
};

export default async function Page() {
  const blogPosts = await getBlogPosts();

  const tags = await getTags();
  const allTags = {} as Record<string, number>;

  for (const tag of tags) {
    allTags[tag] ??= 0;
    allTags[tag] += 1;
  }
  return (
    <div
      data-pagefind-ignore="all"
      className="mb-12 min-h-screen"
      style={{ maxWidth: "var(--nextra-content-width)" }}
    >
      <div className="my-8 max-w-screen-sm">
        <H1 className="font-lg font-semibold ">
          Read about the things we discover while building pipe0 🌈
        </H1>
      </div>

      <Separator className="my-6" />

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {blogPosts.map((post) => {
          const searchParam = new URLSearchParams({
            title: String(post.title),
          });

          return (
            <Link key={post.route} href={post.route}>
              <Card className="bg-secondary hover:bg-secondary/80 h-full">
                <CardHeader className="h-28">
                  <CardTitle>{post.frontMatter.title}</CardTitle>
                  <CardDescription>{post.frontMatter.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Image
                    src={`/og?${searchParam.toString()}`}
                    alt="Post preview"
                    width="1200"
                    height="630"
                  />
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
