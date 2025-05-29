import { SignupCta } from "@/app/signup-cta";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { HighlightSection } from "@/components/highlight-section";
import { PricingCard } from "@/components/pricing-card";
import { Check } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header page="pricing" />

      {/* Content */}
      <main className="max-w-7xl mx-auto pt-32 pb-20 px-6 lg:px-0">
        <div className="mb-16 space-y-4">
          <h1 className="text-5xl font-serif tracking-tight">
            Simple, transparent <HighlightSection>pricing</HighlightSection>
          </h1>
          <SignupCta />
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl">
          <PricingCard />
          {/* Test Mode */}
          <div className="dark:bg-gray-900 border dark:border-gray-800 rounded-xl p-8 flex flex-col h-full">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Test Mode</h2>
              <p className="text-gray-400">Perfect to get started</p>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline">
                <span className="text-4xl font-bold">Free</span>
              </div>
              <p className="text-gray-400 mt-2">Use mock data</p>
            </div>

            <div className="space-y-4 mb-8 flex-grow">
              <div className="flex items-start">
                <Check className="h-5 w-5 text-brand mr-3 mt-0.5" />
                <span>Access all mock providers</span>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-brand mr-3 mt-0.5" />
                <span>Custom enrichment pipelines</span>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-brand mr-3 mt-0.5" />
                <span>Mock AI integration</span>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-brand mr-3 mt-0.5" />
                <span>Standard support</span>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="border-b  pb-6">
              <h3 className="text-xl font-medium mb-3">
                What is included in the base price?
              </h3>
              <p className="text-gray-400">
                The base price includes access to our platform, API keys,
                dashboard, and basic support. Usage of pipes is billed
                separately based on your consumption.
              </p>
            </div>

            <div className="border-b  pb-6">
              <h3 className="text-xl font-medium mb-3">
                How does usage-based billing work?
              </h3>
              <p className="text-gray-400">
                You&apos;re only charged for when you successfully execute a
                pipe. Each pipe has a different price that you can find in the
                pipe catalog.
              </p>
            </div>

            <div className="border-b  pb-6">
              <h3 className="text-xl font-medium mb-3">
                How do I get started?
              </h3>
              <p className="text-gray-400">
                Create an account to try our platform. Once you&apos;re ready to
                purchase credits navigate to the billing section in the
                dashboard.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
