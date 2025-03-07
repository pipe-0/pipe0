import LandingPageTable from "@/app/data-model-table";
import EmailForm from "@/app/email-form";
import CodeBlock from "@/components/code-block";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { HighlightSection } from "@/components/highlight-section";
import { SoonBadge } from "@/components/soon-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { constants } from "@/lib/const";
import { ArrowDown, ArrowRight, Computer, Linkedin, Mail } from "lucide-react";
import { ReactNode } from "react";

type Integration = {
  name: string;
  text: ReactNode;
  icon: ReactNode;
  category: ReactNode;
};

const integrations: Integration[] = [
  {
    name: "Google Maps",
    text: "Business names, addresses, and descriptions.",
    icon: (
      <svg
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6 text-gray-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <title>Google Maps</title>
        <path d="M19.527 4.799c1.212 2.608.937 5.678-.405 8.173-1.101 2.047-2.744 3.74-4.098 5.614-.619.858-1.244 1.75-1.669 2.727-.141.325-.263.658-.383.992-.121.333-.224.673-.34 1.008-.109.314-.236.684-.627.687h-.007c-.466-.001-.579-.53-.695-.887-.284-.874-.581-1.713-1.019-2.525-.51-.944-1.145-1.817-1.79-2.671L19.527 4.799zM8.545 7.705l-3.959 4.707c.724 1.54 1.821 2.863 2.871 4.18.247.31.494.622.737.936l4.984-5.925-.029.01c-1.741.601-3.691-.291-4.392-1.987a3.377 3.377 0 0 1-.209-.716c-.063-.437-.077-.761-.004-1.198l.001-.007zM5.492 3.149l-.003.004c-1.947 2.466-2.281 5.88-1.117 8.77l4.785-5.689-.058-.05-3.607-3.035zM14.661.436l-3.838 4.563a.295.295 0 0 1 .027-.01c1.6-.551 3.403.15 4.22 1.626.176.319.323.683.377 1.045.068.446.085.773.012 1.22l-.003.016 3.836-4.561A8.382 8.382 0 0 0 14.67.439l-.009-.003zM9.466 5.868L14.162.285l-.047-.012A8.31 8.31 0 0 0 11.986 0a8.439 8.439 0 0 0-6.169 2.766l-.016.018 3.665 3.084z" />
      </svg>
    ),
    category: "Location",
  },
  {
    name: "Salesforce",
    text: "Lead information stored in your Salesforce cloud.",
    icon: (
      <svg
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6 text-gray-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <title>Salesforce</title>
        <path d="M10.006 5.415a4.195 4.195 0 013.045-1.306c1.56 0 2.954.9 3.69 2.205.63-.3 1.35-.45 2.1-.45 2.85 0 5.159 2.34 5.159 5.22s-2.31 5.22-5.176 5.22c-.345 0-.69-.044-1.02-.104a3.75 3.75 0 01-3.3 1.95c-.6 0-1.155-.15-1.65-.375A4.314 4.314 0 018.88 20.4a4.302 4.302 0 01-4.05-2.82c-.27.062-.54.076-.825.076-2.204 0-4.005-1.8-4.005-4.05 0-1.5.811-2.805 2.01-3.51-.255-.57-.39-1.2-.39-1.846 0-2.58 2.1-4.65 4.65-4.65 1.53 0 2.85.705 3.72 1.8" />
      </svg>
    ),
    category: "CRM",
  },
  {
    name: "Hubspot",
    text: "Lead information stored in your Hubspot cloud.",
    icon: (
      <svg
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6 text-gray-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <title>HubSpot</title>
        <path d="M18.164 7.93V5.084a2.198 2.198 0 001.267-1.978v-.067A2.2 2.2 0 0017.238.845h-.067a2.2 2.2 0 00-2.193 2.193v.067a2.196 2.196 0 001.252 1.973l.013.006v2.852a6.22 6.22 0 00-2.969 1.31l.012-.01-7.828-6.095A2.497 2.497 0 104.3 4.656l-.012.006 7.697 5.991a6.176 6.176 0 00-1.038 3.446c0 1.343.425 2.588 1.147 3.607l-.013-.02-2.342 2.343a1.968 1.968 0 00-.58-.095h-.002a2.033 2.033 0 102.033 2.033 1.978 1.978 0 00-.1-.595l.005.014 2.317-2.317a6.247 6.247 0 104.782-11.134l-.036-.005zm-.964 9.378a3.206 3.206 0 113.215-3.207v.002a3.206 3.206 0 01-3.207 3.207z" />
      </svg>
    ),
    category: "CRM",
  },
  {
    name: "Github",
    text: "GitHub usernames and activity.",
    icon: (
      <svg
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6 text-gray-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <title>GitHub</title>
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
    category: "DevTooling",
  },
  {
    name: "Gitlab",
    text: "Gitlab usernames and contributions.",
    icon: (
      <svg
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6 text-gray-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <title>GitLab</title>
        <path d="m23.6004 9.5927-.0337-.0862L20.3.9814a.851.851 0 0 0-.3362-.405.8748.8748 0 0 0-.9997.0539.8748.8748 0 0 0-.29.4399l-2.2055 6.748H7.5375l-2.2057-6.748a.8573.8573 0 0 0-.29-.4412.8748.8748 0 0 0-.9997-.0537.8585.8585 0 0 0-.3362.4049L.4332 9.5015l-.0325.0862a6.0657 6.0657 0 0 0 2.0119 7.0105l.0113.0087.03.0213 4.976 3.7264 2.462 1.8633 1.4995 1.1321a1.0085 1.0085 0 0 0 1.2197 0l1.4995-1.1321 2.4619-1.8633 5.006-3.7489.0125-.01a6.0682 6.0682 0 0 0 2.0094-7.003z" />
      </svg>
    ),
    category: "DevTooling",
  },
  {
    name: "Typeform",
    text: "Information provided via surveys.",
    icon: (
      <svg
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6 text-gray-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <title>Typeform</title>
        <path d="M15.502 13.035c-.5 0-.756-.411-.756-.917 0-.505.252-.894.756-.894.513 0 .756.407.756.894-.004.515-.261.917-.756.917Zm-4.888-1.81c.292 0 .414.17.414.317 0 .357-.365.514-1.126.536 0-.442.253-.854.712-.854Zm-3.241 1.81c-.473 0-.67-.384-.67-.917 0-.527.202-.894.67-.894.477 0 .702.38.702.894 0 .537-.234.917-.702.917Zm-3.997-2.334h-.738l1.224 2.808c-.234.519-.36.648-.522.648-.171 0-.333-.138-.45-.259l-.324.43c.22.232.522.366.832.366.387 0 .685-.224.856-.626l1.413-3.371h-.725l-.738 2.012-.828-2.008Zm19.553.523c.36 0 .432.246.432.823v1.516H24v-1.914c0-.689-.473-.988-.91-.988-.386 0-.742.241-.94.688a.901.901 0 0 0-.891-.688c-.365 0-.73.232-.927.666v-.626h-.64v2.857h.64v-1.22c0-.617.324-1.114.765-1.114.36 0 .427.246.427.823v1.516h.64l-.005-1.225c0-.617.329-1.114.77-1.114Zm-5.1-.523h-.324v2.857h.639v-1.095c0-.693.306-1.163.76-1.163.118 0 .217.005.325.05l.099-.676c-.081-.009-.153-.018-.225-.018-.45 0-.774.309-.964.707V10.7h-.31Zm-2.327-.045c-.846 0-1.418.644-1.418 1.458 0 .845.58 1.475 1.418 1.475.85 0 1.431-.648 1.431-1.475-.004-.818-.594-1.458-1.431-1.458Zm-4.852 2.38c-.333 0-.581-.17-.685-.515.847-.036 1.675-.242 1.675-.988 0-.43-.423-.872-1.03-.872-.82 0-1.374.666-1.374 1.457 0 .828.545 1.476 1.36 1.476.567 0 .927-.228 1.21-.559l-.31-.42c-.329.335-.531.42-.846.42Zm-3.151-2.38c-.324 0-.648.188-.774.483v-.438h-.64v3.98h.64v-1.422c.135.205.445.34.72.34.85 0 1.3-.631 1.3-1.48-.004-.841-.445-1.463-1.246-1.463Zm-4.483-1.1H0v.622h1.18v3.38h.67v-3.38h1.166v-.622Zm9.502 1.145h-.383v.572h.383v2.285h.639v-2.285h.621v-.572h-.621v-.447c0-.286.117-.385.382-.385.1 0 .19.027.311.068l.144-.537c-.117-.067-.351-.094-.504-.094-.612 0-.972.367-.972 1.002v.393Z" />
      </svg>
    ),
    category: "Survey",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="pt-24 lg:pt-32 pb-20 px-6 lg:px-0">
        <div className="container lg:grid-cols-2 gap-12 items-center mx-auto ">
          <div className="space-y-8 max-w-screen-lg">
            <h1 className="text-5xl font-serif tracking-tight">
              Universal{" "}
              <HighlightSection>
                lead and company enrichment API
              </HighlightSection>{" "}
              for the next generation of sales tools. Powered by AI.
            </h1>
            <p className="text-lg text-gray-400">
              Combine <b>50+ data providers</b> into custom enrichment pipelines
              for your application. Find <b>business emails</b>,{" "}
              <b>company info</b>, and much more. Connect enrichments with AI
              agents. Seamlessly add Clay-like functionality to your application
              with full control over cost, usage, and data quality.
            </p>

            <EmailForm />
          </div>
        </div>
      </section>

      {/* Code Example Section */}
      <section>
        <div className="relative aspect-square lg:aspect-auto lg:h-[800px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-400 via-blue-400 to-slate-400 overflow-hidden" />
          <div className="absolute inset-0 p-8">
            <div className="bg-black/80 h-full w-full rounded-lg border border-white/10 grid grid-cols-[1fr_min-content] overflow-scroll">
              <div className="space-y-4 p-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm">
                    Compose enrichment pipeline...
                  </span>
                </div>
                <div className="p-4 rounded-lg">
                  <code className="text-sm text-green-400"></code>
                  <pre>
                    <CodeBlock
                      codeString={`
// Perform complex enrichments with 10 LOC

const pipe0 = new Pipe0({ url: "htttps://your-sever.com" });

// Combine 50+ enrichments into custom enrichment pipelines
const response = await pipe0.request.create({
    pipes: [
      {
        name: "PeopleBusinessEmailWaterfallV1"
      },
      {
        name: "CompanyInfoPipe0V1"
      }
    ],
    input: [
      {
        name: "John Doe",
        companyName: "Google LLC"
      }
    ],
  }).send();
                      `}
                    />
                  </pre>
                </div>
              </div>
              <div className="lg:min-w-80 relative">
                {/* Grid Background Pattern */}

                {/* Pipeline Flow */}
                <div className="invisible lg:visible relative z-10 p-6 bg-blue-900 h-full flex items-center justify-center">
                  <div
                    className="absolute inset-0 opacity-[7%]"
                    style={{
                      backgroundImage: `
                    linear-gradient(to right, white 1px, transparent 1px),
                    linear-gradient(to bottom, white 1px, transparent 1px)
                  `,
                      backgroundSize: "60px 60px",
                    }}
                  />
                  <div className="relative space-y-3 bg-blue-900 bg-radial px-2 py-12">
                    <div className="bg-white/10 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Mail className="w-4 h-4" />
                        Find business email
                      </div>
                      <p className="text-xs text-white/70 mt-2">
                        Use waterfall enrichment with up to 8 providers.
                      </p>
                    </div>

                    <ArrowDown className="w-4 h-4 mx-auto text-white/40" />

                    <div className="bg-white/10 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Linkedin className="w-4 h-4" />
                        Find LinkedIn Profile
                      </div>
                      <p className="text-xs text-white/70 mt-2">
                        Enrich with last X posts
                      </p>
                    </div>

                    <ArrowDown className="w-4 h-4 mx-auto text-white/40" />

                    <div className="bg-white/10 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Computer className="w-4 h-4" />
                        Analyse last LinkedIn posts with AI model
                      </div>
                      <p className="text-xs text-white/70 mt-2">
                        Set boolean to custom field if user posted about pipe0
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data model section */}
      <section className="px-6 lg:px-0 pt-32 pb-20">
        <div className="container lg:grid-cols-2 gap-12 items-center mx-auto ">
          <div className="space-y-8 max-w-screen-lg pb-12">
            <h1 className="text-5xl font-serif tracking-tight">
              A data model designed for{" "}
              <HighlightSection>
                striking server and UI interactions.
              </HighlightSection>
            </h1>
            <p className="text-lg text-gray-400">
              An intuitive API to enrich <b>one</b> or{" "}
              <b>thousands of records</b> with speed and precision. Power
              everything from server-side enrichments to complex UI
              interactions.{" "}
              <b>Access a unified API with 50+ enrichment providers </b>
              <b>or extend with your enrichment server if you need more.</b>
            </p>
          </div>
          <div>
            <LandingPageTable />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mb-12 mx-auto text-center">
          <div className="space-y-8 pb-12 max-w-screen-lg mx-auto">
            <h1 className="text-5xl font-serif tracking-tight">
              Are you a tool maker?
              <HighlightSection>
                We power data enrichment for various systems.
              </HighlightSection>
            </h1>
          </div>
        </div>

        <div className="container mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="bg-white/5 border-white/10 p-6">
            <h3 className="text-xl font-semibold mb-4">
              Customer Relationship System
            </h3>
            <p className="text-gray-400">
              Effective data enrichment is a requirement for CRMs. New
              enrichment tools have shifted the perception of what&apos;s
              possible. Create customizable features based on cutting-edge
              enrichment flows and striking UIs.
            </p>
          </Card>
          <Card className="bg-white/5 border-white/10 p-6">
            <h3 className="text-xl font-semibold mb-4">Sales Copilot</h3>
            <p className="text-gray-400">
              Finding up-to-date information on leads before and during sales
              calls is critical for sales copilots. Real-time intelligence
              requires context. We power various use cases for sales copilots.
            </p>
          </Card>
          <Card className="bg-white/5 border-white/10 p-6">
            <h3 className="text-xl font-semibold mb-4">
              Applicant Tracking System
            </h3>
            <p className="text-gray-400">
              Add candidate enrichment functionalities to your applicant
              tracking system. Provide information on social media accounts and
              activity for insight into candidate quality and fit.
            </p>
          </Card>
          <Card className="bg-white/5 border-white/10 p-6">
            <h3 className="text-xl font-semibold mb-4">
              Customer Outreach System
            </h3>
            <p className="text-gray-400">
              The next generation of outreach tools needs to be
              hyper-personalized. AI systems and humans alike require deeply
              enriched data for successful campaigns.
            </p>
          </Card>
          <Card className="bg-white/5 border-white/10 p-6">
            <h3 className="text-xl font-semibold mb-4">
              Automating Sales Development Representatives
            </h3>
            <p className="text-gray-400">
              Is your tool automating activities performed by human SDRs, such
              as building lead lists, doing outreach, scheduling follow-ups, and
              demos? Benefit from custom lead enrichment for all these use
              cases.
            </p>
          </Card>
          <Card className="bg-white/5 border-white/10 p-6">
            <h3 className="text-xl font-semibold mb-4">Marketing Audiences</h3>
            <p className="text-gray-400">
              Is your marketing pushing the boundaries of what&apos;s
              technologically possible? Deduplicate emails effectively and link
              them to social media platforms and marketing audiences with
              precision.
            </p>
          </Card>
          <div className="flex justify-end pt-4 col-span-full">
            <Button variant="ghost">
              Explore all case studies <SoonBadge /> <ArrowRight />
            </Button>
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto border-x px-6 lg:px-0">
          <div className="space-y-8 max-w-screen-lg pb-12">
            <h1 className="text-5xl font-serif tracking-tight">
              Seamless
              <br />
              <HighlightSection>Integrations</HighlightSection>
            </h1>
            <p className="text-lg text-gray-400">
              Access <b>50+ data providers</b>. Aggregate providers into
              pipelines or waterfall enrichments. Achieve higher data quality
              with a single subscription. Use external providers without
              additional charge from us or bring your API key.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 border-y">
            {integrations.map((integration) => (
              <div
                key={integration.name}
                className="bg-black/50 backdrop-blur-sm border border-white/20 p-8 hover:border-white/20 transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                      {integration.icon}
                    </div>
                    <h3 className="text-xl font-semibold">
                      {integration.name}
                    </h3>
                  </div>
                </div>
                <p className="text-gray-400 mb-4">{integration.text}</p>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="bg-white/30">
                    {integration.category}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end pt-4">
            <Button variant="ghost">
              Explore all integrations <SoonBadge /> <ArrowRight />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 lg:px-0 py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/20 via-purple-600/20 to-black" />
        <div className="container relative mx-auto">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-serif mb-8">
              Get in touch with {constants.productName}
            </h2>
            <EmailForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
