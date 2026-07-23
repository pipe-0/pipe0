import type { Metadata } from "next";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Section } from "@/components/marketing";
import { JsonLd, faqJsonLd } from "@/components/seo/json-ld";
import { LemlistEncoder } from "./encoder";

const title = "Lemlist API Key Encoder — Free Online Tool";
const description =
  "Free tool to base64-encode your Lemlist API key for HTTP Basic auth. Runs entirely in your browser — nothing is stored or sent.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "lemlist api key encoder",
    "lemlist api key",
    "lemlist authentication",
    "lemlist base64",
    "lemlist basic auth",
    "encode lemlist api key",
  ],
  alternates: {
    canonical: "/tools/lemlist-api-key-encoder",
  },
  openGraph: {
    type: "website",
    title,
    description,
    url: "/tools/lemlist-api-key-encoder",
  },
};

const faqs = [
  {
    q: "Is my API key sent anywhere?",
    a: "No. The encoding runs entirely in your browser using JavaScript. Your API key is never sent to a server, logged, or stored.",
  },
  {
    q: "Why is there a leading colon before the key?",
    a: "Lemlist uses HTTP Basic authentication with an empty username. In Basic auth the encoded value is “username:password”, so with an empty username it becomes “:YourApiKey” — the colon must stay.",
  },
  {
    q: "How do I use the encoded value?",
    a: "Send it in the Authorization header as “Authorization: Basic <encoded-value>” on your requests to the Lemlist API.",
  },
];

export default function LemlistApiKeyEncoderPage() {
  return (
    <div className="landing min-h-screen bg-background">
      <JsonLd data={faqJsonLd(faqs)} />
      <Header page="product" />

      {/* ===== Hero ===== */}
      <Section className="pt-16 text-center sm:pt-24">
        <h1 className="mx-auto max-w-2xl text-[clamp(34px,4.5vw,52px)] font-semibold leading-[1.08] tracking-[-0.025em] text-foreground">
          Lemlist API Key <span className="hl">Encoder</span>.
        </h1>
        <p className="mx-auto mt-5 max-w-[560px] text-[17px] leading-relaxed text-muted-foreground sm:text-[18px]">
          Paste your Lemlist API key to get the base64-encoded value for HTTP
          Basic authentication. Encoded right in your browser — nothing leaves
          your device.
        </p>
      </Section>

      {/* ===== Tool ===== */}
      <Section className="mt-12">
        <LemlistEncoder />
      </Section>

      {/* ===== Explainer ===== */}
      <Section className="mt-24">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-4 text-[clamp(22px,2.4vw,30px)] font-semibold tracking-[-0.02em] text-foreground">
            How Lemlist API authentication works
          </h2>
          <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
            <p>
              The Lemlist API uses HTTP Basic authentication. Basic auth encodes
              a <code className="font-mono text-foreground">username:password</code>{" "}
              pair in base64, but Lemlist expects the{" "}
              <strong className="text-foreground">username to always be empty</strong>{" "}
              and your API key to take the place of the password.
            </p>
            <p>
              That means the string you encode is{" "}
              <code className="font-mono text-foreground">:YourApiKey</code> — with
              the leading colon kept. After base64-encoding it, you send the
              result in the request header:
            </p>
            <pre className="overflow-x-auto rounded-md border border-input bg-muted/40 p-4 font-mono text-sm text-foreground">
              Authorization: Basic &lt;base64-encoded-value&gt;
            </pre>
            <p>
              This tool does that encoding for you, locally in your browser. For
              the full details, see the{" "}
              <a
                className="text-primary underline-offset-4 hover:underline"
                href="https://developer.lemlist.com/api-reference/getting-started/authentication"
                target="_blank"
                rel="noopener noreferrer"
              >
                Lemlist authentication docs
              </a>
              .
            </p>
          </div>
        </div>
      </Section>

      {/* ===== FAQ ===== */}
      <Section className="mt-20">
        <h2 className="mb-8 text-center text-[clamp(24px,2.6vw,32px)] font-semibold tracking-[-0.02em] text-foreground">
          Frequently asked <span className="hl">questions</span>.
        </h2>
        <div className="mx-auto max-w-2xl">
          {faqs.map((faq) => (
            <div key={faq.q} className="border-b border-border py-6">
              <h3 className="mb-2 text-base font-semibold text-foreground">
                {faq.q}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <div className="mt-24" />
      <Footer />
    </div>
  );
}
