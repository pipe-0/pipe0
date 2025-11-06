import { EnrichmentAnimatedList } from "@/app/enrichment-animated-list";
import { EnrichmentCardMarquee } from "@/app/enrichment-card-marquee";
import CalButton from "@/components/cal-button";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";
import { appInfo } from "@/lib/const";
import { appLinks } from "@/lib/links";
import { providerCatalog } from "@pipe0/ops";
import { ArrowRight, Search, Sparkle } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

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
        className=" text-gray-400"
        fill="none"
        stroke="currentColor"
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
        className="text-gray-400"
        fill="none"
        stroke="currentColor"
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
        className="text-gray-400"
        fill="none"
        stroke="currentColor"
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
        className="text-gray-400"
        fill="none"
        stroke="currentColor"
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
        className="text-gray-400"
        fill="none"
        stroke="currentColor"
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
        className="text-gray-400"
        fill="none"
        stroke="currentColor"
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
    <div className="min-h-screen" data-theme="light">
      <ThemeSwitcher />
      <div>
        {/* Header */}
        <Header page="product" />
        {/* Hero Section */}
        <section className="pt-12 md:pt-24 lg:pt-8 pb-4 px-4 md:px-6 lg:px-0 relative">
          <div className="container lg:grid-cols-2 gap-12 items-center mx-auto relative">
            <div className="space-y-4 md:space-y-6 max-w-3xl">
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl md:text-4xl font-serif tracking-tight text-muted-foreground">
                  <span className="text-foreground font-sans font-medium">
                    Data enrichment
                  </span>{" "}
                  for the next generation of GTM teams & tools
                </h1>
                <p className="text-base md:text-lg text-muted-foreground">
                  AI native, multi-provider, API support, 6-12x more
                  cost-effective.
                </p>
              </div>
              <div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Link href={appLinks.docs()}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto bg-transparent"
                    >
                      Read docs
                    </Button>
                  </Link>
                  <Link href={`${appInfo.links.signupUrl}`} rel="nofollow">
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full sm:w-auto"
                    >
                      Start for free
                    </Button>
                  </Link>
                </div>
              </div>
              {/* <SignupCta /> */}
            </div>
          </div>
        </section>

        {/* <LandingPageMarquee /> */}

        {/* Code Example Section */}
        <section className="container mx-auto gap-2 pt-6 grid grid-cols-1 lg:grid-cols-6 px-4 md:px-6 lg:px-0">
          <div className="flex flex-col overflow-hidden lg:col-span-4 bg-accent border">
            <div className="p-1">
              <div className="bg-background rounded-md border p-6">
                <CodeBlock
                  language="typescript"
                  code={`// Find work email and company description
const response = await piper.pipes({
    pipes: [
      {
        pipe_id: "people:workemail:waterfall@1"
      },
      {
        pipe_id: "company:description@1"
      }
    ],
    input: [
      {
        id: 1,
        name: "John Doe",
        company_name: "Pipe0"
      }
    ],
  });`}
                />
              </div>
            </div>

            <div className="p-4 max-w-lg grow flex flex-col justify-end gap-2 pt-12">
              <h2 className="text-2xl md:text-2xl text-muted-foreground font-serif">
                The next generation of CRMs & ATSs is built on{" "}
                <span className="text-foreground">
                  instant access to world-class enrichment & prospecting.
                </span>
              </h2>
              <p className="text-sm md:text-base text-muted-foreground">
                Add clay-like data enrichment with{" "}
                <span className="text-foreground">
                  50+ providers, actions & conditions
                </span>{" "}
                to your application.{" "}
                <span className="text-foreground">Fast</span>.
              </p>
            </div>
          </div>

          <div className="relative flex flex-col items-stretch py-4 overflow-hidden lg:col-span-2 bg-background border">
            <div className="grow p-4 max-w-md top-0 left-0">
              <h2 className="text-2xl md:text-2xl text-muted-foreground font-serif pb-2">
                Sheets: Discover a Clay alternative{" "}
                <span className="text-foreground">from the future</span>.
              </h2>
              <p className="text-sm md:text-base text-muted-foreground pb-4 md:pb-8">
                Up to 2M records per table, point-in-time recovery,
                multi-player, API support, and sandbox mode–
                <span className="text-foreground">
                  we're building the most powerful data table in the world.
                </span>
              </p>
              <div>
                <div>
                  <Link href={`${appInfo.links.signupUrl}`} rel="nofollow">
                    <Button size="sm" className="w-full sm:w-auto">
                      Sign up for free
                    </Button>
                  </Link>
                </div>
                <small className="text-muted-foreground">
                  No credit card required
                </small>
              </div>
            </div>
            <div className="h-[320px] lg:h-[220px] relative">
              <img
                className="absolute block w-[600px] lg:w-[600px] max-w-none opacity-70 bottom-0 left-1/2 -translate-x-1/2 from-background bg-linear-to-b"
                src="/media/website/sheets-preview.svg"
                alt="Sheets preview"
              />
            </div>
            <div className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t"></div>
          </div>
        </section>
      </div>

      <section className="container mx-auto pt-8 md:pt-12 px-4 md:px-6 lg:px-0">
        <div>
          <div className="text-muted-foreground text-sm md:text-md pb-4">
            Trusted by
          </div>
          <div className="flex flex-wrap gap-4 md:gap-8 [&_img]:block [&_img]:w-[100px] md:[&_img]:w-[150px] grayscale max-w-[650px] items-center">
            <img
              src="/media/website/logos/pie-light.svg"
              className="max-w-15"
              alt="Pie logo"
            />
            <img
              src="/media/website/logos/lightfield.svg"
              alt="Lightfield logo"
            />
            <img
              src="/media/website/logos/augusta-light.svg"
              alt="Augusta logo"
            />
            <img
              className="max-w-18 -translate-y-0.5"
              src="/media/website/logos/aries-light.svg"
              alt="Aries logo"
            />
          </div>
        </div>
      </section>

      <section className="pt-12 md:pt-18 mb-8 md:mb-12 px-4 md:px-6 lg:px-0">
        <div className="container lg:grid-cols-2 gap-12 items-center mx-auto relative">
          <div className="space-y-4 md:space-y-6 max-w-3xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif tracking-tight text-muted-foreground">
              Save thousands of hours and access{" "}
              <span className="text-foreground">
                the world's most powerful data model for data enrichment
              </span>
              .
            </h1>
          </div>
        </div>

        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 pt-8 md:pt-12 gap-4">
          <div className="md:col-span-2 lg:col-span-8 border p-4 bg-accent">
            <div className="flex flex-col md:flex-row items-start justify-between pb-3 gap-3">
              <div>
                <h3 className="text-xl md:text-2xl text-muted-foreground font-serif">
                  Find{" "}
                  <span className="text-foreground">
                    who you are looking for
                  </span>
                </h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  Search for people and companies using multiple providers.
                </p>
              </div>
              <Link href={appLinks.searchCatalog()}>
                <Button
                  variant="default"
                  size="sm"
                  className="w-full md:w-auto"
                >
                  Explore Searches <Search className="ml-2" />
                </Button>
              </Link>
            </div>
            <EnrichmentCardMarquee />
          </div>

          <div className="md:col-span-2 lg:col-span-4 border p-4 relative min-h-[300px] md:min-h-[400px]">
            <h3 className="text-xl md:text-2xl text-muted-foreground font-serif">
              Integrate. Fast.
            </h3>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[90%] md:max-w-[80%] flex gap-2 md:gap-3 overflow-hidden justify-center">
              {integrations.map((i, index) => {
                return (
                  <div key={index}>
                    <div className="h-[60px] w-[60px] md:h-[80px] md:w-[80px] lg:h-[100px] lg:w-[100px] border rounded-sm relative grid place-items-center [&_svg]:size-12 md:[&_svg]:size-16 lg:[&_svg]:size-20">
                      {i.icon}
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="absolute right-0 bottom-0 p-4 max-w-full md:max-w-[75%] text-sm md:text-base text-muted-foreground text-right">
              Integrate with CRM, ATS, survey, and sequencing tools{" "}
              <span className="text-foreground">without writing code.</span>
            </p>
          </div>

          <div className="md:col-span-2 lg:col-span-7 min-h-[200px] p-4 relative">
            <h3 className="text-xl md:text-2xl text-muted-foreground font-serif pb-4">
              And action 🎬
            </h3>

            <div className="bottom-0 w-full flex flex-col md:flex-row justify-start gap-4 items-start md:items-end">
              <p className="text-muted-foreground text-sm max-w-full md:max-w-40">
                Send emails, Slack, or Discord messages. Perform actions with
                the tools your users love.
              </p>

              <div className="flex gap-2 items-center flex-wrap">
                <img
                  src={
                    providerCatalog["slack"]["logoUrl"] || "/placeholder.svg"
                  }
                  className="block size-5"
                  alt="Slack logo"
                />
                <img
                  src={
                    providerCatalog["gmail"]["logoUrl"] || "/placeholder.svg"
                  }
                  className="block size-8"
                  alt="Gmail logo"
                />
                <img
                  src={
                    providerCatalog["gemini"]["logoUrl"] || "/placeholder.svg"
                  }
                  className="block size-8"
                  alt="Gemini logo"
                />
                <img
                  src={
                    providerCatalog["openai"]["logoUrl"] || "/placeholder.svg"
                  }
                  className="block size-8"
                  alt="OpenAI logo"
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-2 lg:col-span-5 lg:row-span-2 border p-4 bg-accent relative min-h-[400px]">
            <div className="pb-4">
              <h3 className="text-xl md:text-2xl text-muted-foreground font-serif">
                Enrich{" "}
                <span className="text-foreground">company and people data</span>
              </h3>
              <p className="text-muted-foreground text-sm pb-4">
                Compose hundreds of enrichments to get the data you want.
              </p>
              <Link href={appLinks.pipeCatalog()}>
                <Button size="sm" className="w-full sm:w-auto">
                  Explore enrichments <Sparkle className="ml-2" />
                </Button>
              </Link>
            </div>
            <EnrichmentAnimatedList />
            <div className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t"></div>
          </div>

          <div className="md:col-span-2 lg:col-span-7 lg:row-span-1 min-h-[200px] lg:max-h-[200px] lg:self-end p-4 border rounded-sm flex flex-col justify-between relative">
            <h3 className="text-xl md:text-2xl text-muted-foreground font-serif">
              Get started for free.{" "}
              <span className="text-foreground">
                Your first 20 credits are on us.
              </span>
            </h3>
            <div className="mt-4 md:mt-0 md:absolute md:right-0 md:bottom-0 md:p-4">
              <Link href={appInfo.links.signupUrl}>
                <Button className="w-full sm:w-auto">
                  Sign up free <ArrowRight className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 md:px-6 lg:px-0 py-16 md:py-24 lg:py-32 relative overflow-hidden border-t">
        <div className="absolute inset-0 bg-accent dark:bg-gradient-to-b from-blue-600/20 via-purple-600/20 to-black" />
        <div className="container relative mx-auto">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif mb-6 md:mb-8">
              Get a personalized tour of {appInfo.productName}
            </h2>

            <CalButton>
              Book now <ArrowRight className="ml-2" />
            </CalButton>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
