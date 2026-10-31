import { createFileRoute } from "@tanstack/react-router";
import { LandingFaq } from "@/components/landing/landing-faq";
import { Band, SectionHead } from "@/components/grid";
import { LandingShell, PageHero } from "@/components/landing-shell";
import { faqJsonLd, jsonLd } from "@/components/seo/json-ld";
import { seo } from "@/lib/seo";
import { LemlistEncoder } from "@/components/lemlist-encoder";

const title = "Lemlist API Key Encoder — Free Online Tool";
const description =
  "Free tool to base64-encode your Lemlist API key for HTTP Basic auth. Runs entirely in your browser — nothing is stored or sent.";

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

export const Route = createFileRoute("/tools/lemlist-api-key-encoder")({
  head: () => ({
    ...seo({
      title,
      description,
      path: "/tools/lemlist-api-key-encoder",
      image: null,
      siteName: false,
    }),
    scripts: [jsonLd(faqJsonLd(faqs))],
  }),
  component: LemlistApiKeyEncoderPage,
});

function LemlistApiKeyEncoderPage() {
  return (
    <LandingShell page="product">
      <PageHero
        title="Lemlist API Key Encoder."
        lede="Paste your Lemlist API key to get the base64-encoded value for HTTP Basic authentication. Encoded right in your browser — nothing leaves your device."
        actions={false}
      />

      {/* ===== Tool ===== */}
      <Band>
        <div className="px-6 py-10 sm:px-10 sm:py-12 lg:px-12">
          <LemlistEncoder />
        </div>
      </Band>

      {/* ===== Explainer ===== */}
      <Band>
        <SectionHead title="How Lemlist API authentication works" />
        <div className="border-t border-[var(--rule)] px-6 py-10 sm:px-10 sm:py-12 lg:px-12">
          <div className="max-w-2xl space-y-4 text-[16px] leading-relaxed text-muted-foreground">
            <p>
              The Lemlist API uses HTTP Basic authentication. Basic auth encodes
              a <code className="font-mono text-foreground">username:password</code>{" "}
              pair in base64, but Lemlist expects the{" "}
              <strong className="font-medium text-foreground">
                username to always be empty
              </strong>{" "}
              and your API key to take the place of the password.
            </p>
            <p>
              That means the string you encode is{" "}
              <code className="font-mono text-foreground">:YourApiKey</code> — with
              the leading colon kept. After base64-encoding it, you send the
              result in the request header:
            </p>
            <pre className="overflow-x-auto border border-[var(--rule)] bg-[var(--well)] p-4 font-mono text-sm text-foreground">
              Authorization: Basic &lt;base64-encoded-value&gt;
            </pre>
            <p>
              This tool does that encoding for you, locally in your browser. For
              the full details, see the{" "}
              <a
                className="font-medium text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
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
      </Band>

      <Band>
        <SectionHead title="Frequently asked questions." />
        <LandingFaq items={faqs} />
      </Band>
    </LandingShell>
  );
}
