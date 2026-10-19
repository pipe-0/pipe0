import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata, Viewport } from "next";
import {
  Geist,
  Geist_Mono,
  Hanken_Grotesk,
  Instrument_Serif,
  Schibsted_Grotesk,
} from "next/font/google";
import { getBaseUrl } from "@/lib/utils";
import { AskAiProvider } from "@/components/ai/ask-ai-provider";
import {
  JsonLd,
  organizationJsonLd,
  webSiteJsonLd,
} from "@/components/seo/json-ld";
import "./globals.css";

// Only Schibsted is preloaded here: it is what every marketing page paints
// first, and each preload competes with it for the first paint. The other
// families are declared on every page but fetched only where text uses them;
// layouts that paint them above the fold preload them (lib/fonts/).
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  preload: false,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  preload: false,
});

// Blog sans.
const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  preload: false,
});

// Marketing pages — display and body. A grotesk drawn for a news publisher:
// editorial rather than dev-tool, with figures that hold up at 120px.
const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    template: "%s | pipe0",
    default: "pipe0 | Turn any GTM play into a production system with AI",
  },
  description:
    "With pipe0, technical and non-technical users build revenue systems at any scale. Morning briefings, always-on plays, signal engines, CRM enrichment, lead routing, and the infrastructure underneath. Replace tools like Clay, n8n, Hightouch, and Polytomic.",
  openGraph: {
    siteName: "pipe0",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

/**
 * Next's default is `width=device-width, initial-scale=1`; this restates it and
 * adds one thing.
 *
 * `interactive-widget=resizes-content` makes the software keyboard shrink the
 * *layout* viewport rather than float over it, so a `position: fixed` panel —
 * the Ask AI chat — keeps its input above the keyboard instead of behind it.
 * Chrome for Android honours this; Safari ignores it, which is why the chat
 * panel also tracks `window.visualViewport` directly (see components/ai/search).
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  interactiveWidget: "resizes-content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} ${hankenGrotesk.variable} ${schibstedGrotesk.variable} antialiased`}
      >
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={webSiteJsonLd()} />
        <AskAiProvider>{children}</AskAiProvider>
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
}
