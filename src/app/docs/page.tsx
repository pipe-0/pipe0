import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Documentation | Getting Started",
  description:
    "Get started with Pipe0 | A unified API for people and company data enrichment",
};

export default function DocsPage() {
  redirect("docs/quick-start");
}
