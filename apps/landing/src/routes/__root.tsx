import { Toaster } from "@/components/ui/toaster";
import { AskAiProvider } from "@/components/ai/ask-ai-provider";
import {
  jsonLd,
  organizationJsonLd,
  webSiteJsonLd,
} from "@/components/seo/json-ld";
import { preloadSchibsted } from "@/lib/fonts";
import { DEFAULT_TITLE, SITE_DESCRIPTION } from "@/lib/seo";
import { getSiteFrame } from "@/lib/site.functions";
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import "@/styles/globals.css";
import "@/styles/fonts.css";

export const Route = createRootRoute({
  loader: () => getSiteFrame(),
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { title: DEFAULT_TITLE },
      { name: "description", content: SITE_DESCRIPTION },
      {
        // interactive-widget makes the software keyboard shrink the layout
        // viewport instead of floating over it, so a fixed panel such as the
        // Ask AI chat keeps its input above the keyboard. Chrome for Android
        // honours this; Safari ignores it, which is why the chat panel also
        // tracks window.visualViewport (see components/ai/search).
        name: "viewport",
        content:
          "width=device-width, initial-scale=1, interactive-widget=resizes-content",
      },
    ],
    links: [
      preloadSchibsted,
      {
        rel: "icon",
        href: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
      { rel: "icon", href: "/icon.png", sizes: "192x192", type: "image/png" },
      {
        rel: "apple-touch-icon",
        href: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    scripts: [jsonLd(organizationJsonLd()), jsonLd(webSiteJsonLd())],
  }),
  notFoundComponent: NotFound,
  component: RootDocument,
});

function RootDocument() {
  return (
    <html lang="en" className="" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="antialiased">
        <AskAiProvider>
          <Outlet />
        </AskAiProvider>
        <Toaster />
        <Scripts />
      </body>
    </html>
  );
}

function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center text-sm">
      <h1 className="border-r border-[var(--rule)] pr-5 text-2xl font-medium">
        404
      </h1>
      <p className="pl-5">This page could not be found.</p>
    </main>
  );
}
