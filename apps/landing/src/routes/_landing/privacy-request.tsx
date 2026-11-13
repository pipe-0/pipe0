import { createFileRoute, Link } from "@tanstack/react-router";
import { Band, SectionHead } from "@/components/grid";
import { PageHero } from "@/components/landing-shell";
import { PrivacyRequestForm } from "@/components/privacy-request-form";
import { seo } from "@/lib/seo";

const steps = [
  "We look for searches and enrichments that retrieved your details.",
  "We tell you which customers retrieved them and which data sources they came from, where we can identify them.",
  "We pass your objection or deletion request on to those customers and point you to the opt-out of each data source. Only a data source can remove you from its own database.",
];

const link =
  "font-medium text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary";

export const Route = createFileRoute("/_landing/privacy-request")({
  head: () => ({
    ...seo({
      title: "Privacy request",
      description:
        "If a pipe0 customer looked up your details, use this form to opt out, to find out who retrieved them and where they came from, or to ask for deletion.",
      path: "/privacy-request",
    }),
  }),
  component: PrivacyRequestPage,
});

function PrivacyRequestPage() {
  return (
    <>
      <PageHero
        title="Opt out or ask about your data."
        lede="If a pipe0 customer looked up your details, use this form to object, to find out who retrieved them and where they came from, or to ask for deletion. You do not need an account."
        actions={false}
      />

      <Band>
        <div className="relative px-6 py-10 sm:px-10 sm:py-12 lg:px-12">
          <PrivacyRequestForm />
        </div>
      </Band>

      <Band>
        <SectionHead title="What happens next" />
        <div className="border-t border-[var(--rule)] px-6 py-10 sm:px-10 sm:py-12 lg:px-12">
          <div className="max-w-2xl space-y-4 text-[16px] leading-relaxed text-muted-foreground">
            <ol className="list-decimal space-y-3 pl-5">
              {steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <p>
              pipe0 keeps no contact database of its own. Section 6A of the{" "}
              <Link className={link} to="/resources/legal/privacy-policy">
                privacy policy
              </Link>{" "}
              explains where the data comes from and who is responsible for it.
            </p>
          </div>
        </div>
      </Band>
    </>
  );
}
