import { getBlogPosts, getTags } from "@/app/blog/get-posts";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { appInfo } from "@/lib/const";
import { themeMdxComponents } from "@/mdx-components";
import Link from "next/link";

const H1 = themeMdxComponents.h1;
const P = themeMdxComponents.p;

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
      className="mx-auto mb-12 min-h-screen"
      style={{ maxWidth: "var(--nextra-content-width)" }}
    >
      <div className="mb-8">
        <H1 className="text-2xl font-lg font-semibold ">{metadata.title}</H1>
        <P>Latest news from {appInfo.productName}</P>
      </div>
      <Separator className="mb-6" />

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => {
          return (
            <Link key={post.route} href={post.route}>
              <Card className="bg-secondary">
                <CardHeader>
                  <CardTitle>{post.frontMatter.title}</CardTitle>
                  <CardDescription>{post.frontMatter.excerpt}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
