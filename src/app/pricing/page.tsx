import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { HighlightSection } from "@/components/highlight-section";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <Header />

      {/* Content */}
      <main className="max-w-7xl mx-auto pt-32 pb-20 px-6 lg:px-0">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-serif tracking-tight">
            Simple, transparent <HighlightSection>pricing</HighlightSection>
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Test Mode */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 flex flex-col h-full">
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

            <Link
              href="/"
              className="flex items-center justify-center bg-gradient-to-r from-brand to-green-500 text-black font-medium rounded-full px-6 py-3 hover:opacity-90 transition"
            >
              Request Access <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {/*  */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 flex flex-col h-full">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Professional 4k</h2>
              <p className="text-gray-400">
                Perfect for GTM Teams & samll apps
              </p>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline">
                <span className="text-4xl font-bold">$149</span>
                <span className="text-gray-400 ml-2">/month</span>
              </div>
              <p className="text-gray-400 mt-2">4.000 Credits</p>
            </div>

            <div className="space-y-4 mb-8 flex-grow">
              <div className="flex items-start">
                <Check className="h-5 w-5 text-brand mr-3 mt-0.5" />
                <span>Access all data providers</span>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-brand mr-3 mt-0.5" />
                <span>Custom enrichment pipelines</span>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-brand mr-3 mt-0.5" />
                <span>AI integration</span>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-brand mr-3 mt-0.5" />
                <span>Full control over cost and usage</span>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-brand mr-3 mt-0.5" />
                <span>Standard support</span>
              </div>
            </div>

            <Link
              href="/"
              className="flex items-center justify-center bg-gradient-to-r from-brand to-green-500 text-black font-medium rounded-full px-6 py-3 hover:opacity-90 transition"
            >
              Request Access <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {/* Starter */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 flex flex-col h-full">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Professional 12k</h2>
              <p className="text-gray-400">
                Perfect for mid-sized apps or larger organizations
              </p>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline">
                <span className="text-4xl font-bold">$349</span>
                <span className="text-gray-400 ml-2">/month</span>
              </div>
              <p className="text-gray-400 mt-2">12.000 Credits</p>
            </div>

            <div className="space-y-4 mb-8 flex-grow">
              <div className="flex items-start">
                <Check className="h-5 w-5 text-brand mr-3 mt-0.5" />
                <span>Access to all data providers</span>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-brand mr-3 mt-0.5" />
                <span>Custom enrichment pipelines</span>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-brand mr-3 mt-0.5" />
                <span>AI integration</span>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-brand mr-3 mt-0.5" />
                <span>Full control over cost and usage</span>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-brand mr-3 mt-0.5" />
                <span>Standard support</span>
              </div>
            </div>

            <Link
              href="/"
              className="flex items-center justify-center bg-gradient-to-r from-brand to-green-500 text-black font-medium rounded-full px-6 py-3 hover:opacity-90 transition"
            >
              Request Access <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {/* Enterprise Tier */}
          <div className="bg-gradient-to-b from-gray-900 to-blue-900/30 border border-blue-800/50 rounded-xl p-8 flex flex-col h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-blue-600 text-xs font-bold px-3 py-1 rounded-bl-lg">
              CUSTOM
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Enterprise</h2>
              <p className="text-gray-400">
                For organizations with advanced needs
              </p>
            </div>

            <div className="mb-8">
              <div className="text-2xl font-bold">Custom Pricing</div>
              <p className="text-gray-400 mt-2">
                Tailored to your specific requirements
              </p>
            </div>

            <div className="space-y-4 mb-8 flex-grow">
              <div className="flex items-start">
                <Check className="h-5 w-5 text-blue-400 mr-3 mt-0.5" />
                <span>Everything in Standard</span>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-blue-400 mr-3 mt-0.5" />
                <span>Dedicated account manager</span>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-blue-400 mr-3 mt-0.5" />
                <span>Custom SLAs and support</span>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-blue-400 mr-3 mt-0.5" />
                <span>Volume discounts</span>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-blue-400 mr-3 mt-0.5" />
                <span>Advanced security features</span>
              </div>
            </div>

            <Link
              href="/"
              className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-full px-6 py-3 hover:opacity-90 transition"
            >
              Request Access <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="border-b border-gray-800 pb-6">
              <h3 className="text-xl font-medium mb-3">
                What is included in the base price?
              </h3>
              <p className="text-gray-400">
                The base price includes access to our platform, API keys,
                dashboard, and basic support. Usage of pipes is billed
                separately based on your consumption.
              </p>
            </div>

            <div className="border-b border-gray-800 pb-6">
              <h3 className="text-xl font-medium mb-3">
                How does usage-based billing work?
              </h3>
              <p className="text-gray-400">
                You&apos;re only charged for the pipes you use. Each pipe has a
                different price point based on complexity and data sources
                involved. Usage is calculated at the end of each billing cycle.
              </p>
            </div>

            <div className="border-b border-gray-800 pb-6">
              <h3 className="text-xl font-medium mb-3">
                Can I set usage limits?
              </h3>
              <p className="text-gray-400">
                Yes, you can set monthly usage limits to control costs and
                prevent unexpected charges. You&apos;ll receive notifications as
                you approach your limits.
              </p>
            </div>

            <div className="border-b border-gray-800 pb-6">
              <h3 className="text-xl font-medium mb-3">
                How do I get started?
              </h3>
              <p className="text-gray-400">
                Click the &quot;Request Access&quot; button on the plan that
                fits your needs. Our team will reach out to help you get set up
                and answer any questions.
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
