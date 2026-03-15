import { SignupCta } from "@/app/signup-cta";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { PricingCard } from "@/components/pricing-card";
import { Button } from "@/components/ui/button";
import { appInfo } from "@/lib/const";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header page="pricing" />

      {/* Content */}
      <main className="container mx-auto pt-12 md:pt-12 pb-20 px-4 md:px-6 lg:px-0">
        <div className="mb-4 space-y-4 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl">
            Simple, <span className="font-serif italic">transparent</span>{" "}
            pricing
          </h1>
        </div>

        <div className="mb-20">
          <p className="text-md md:text-xl mb-3 text-muted-foreground">
            Select credit volume
          </p>

          <PricingCard />
        </div>

        {/* FAQ Section */}
        <div>
          <h2 className="text-xl md:text-2xl tracking-tight mb-8">
            Frequently asked{" "}
            <span className="font-serif italic">questions</span>
          </h2>

          <div className="space-y-6">
            <div className="border-b pb-6">
              <h3 className="text-base font-medium mb-2">
                What is included in the price?
              </h3>
              <p className="text-sm text-muted-foreground">
                The credit price includes access to our platform, API keys,
                dashboard, and basic support. Usage of pipes and searches
                consumes credits.
              </p>
            </div>

            <div className="border-b pb-6">
              <h3 className="text-base font-medium mb-2">
                How does usage-based billing work?
              </h3>
              <p className="text-sm text-muted-foreground">
                You&apos;re only charged for when you successfully execute a
                pipe or search. Each operation has a different credit price that
                you can find in the pipe or search catalog.
              </p>
            </div>

            <div className="border-b pb-6">
              <h3 className="text-base font-medium mb-2">
                How do I get started?
              </h3>
              <p className="text-sm text-muted-foreground">
                Create an account to try pipe0. Once you&apos;re ready to
                purchase credits, navigate to the billing section in the
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
