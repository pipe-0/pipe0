import { NextRequest, NextResponse } from "next/server";
import { isMarkdownPreferred, rewritePath } from "fumadocs-core/negotiation";

const { rewrite: rewriteDocs } = rewritePath(
  "/docs{/*path}",
  "/llms.mdx/docs{/*path}",
);
const { rewrite: rewriteBlog } = rewritePath(
  "/blog/:slug",
  "/llms.mdx/blog/:slug",
);

export default function proxy(request: NextRequest) {
  if (isMarkdownPreferred(request)) {
    const pathname = request.nextUrl.pathname;
    const result = rewriteDocs(pathname) || rewriteBlog(pathname);

    if (result) {
      return NextResponse.rewrite(new URL(result, request.nextUrl));
    }
  }

  return NextResponse.next();
}
//test
