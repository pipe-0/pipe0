// app/api/docs/[slug]/route.ts

import { getDocPages } from "@/lib/docs";
import { NextResponse } from "next/server";

// GET handler for the dynamic route
export async function GET(
  _request: Request,
  context: { params: { slug: string } }
) {
  const { slug } = context.params;
  const docsPages = await getDocPages();
  const page = docsPages.find((p) => p.slug === slug);

  if (!page) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json(page, { status: 200 });
}
