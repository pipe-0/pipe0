import { CodeBlock } from "@/components/ui/code-block";

interface CodeExampleCardProps {
  className?: string;
}

export default function CodeExampleCard({}: CodeExampleCardProps) {
  return (
    <div className="w-full max-w-5xl mx-auto px-3 lg:px-8 py-0 lg:py-12 overflow-auto">
      <CodeBlock
        language="typescript"
        filename="DummyComponent.jsx"
        highlightLines={[9, 13, 14, 18]}
        code={`
// Enrich data with 10 lines of code
const pipe0 = new Pipe0({ url: "htttps://your-sever.com" });

// Combine enrichments (pipes 🚰) into custom pipelines
const response = await pipe0.request.create({
    pipes: [
      {
        // Find work email for "John Doe" using a waterfall enrichment
        name: "PeopleBusinessEmailWaterfallV1"
      },
      {
        // Find the business description for "Google LLC" on Google Maps
        name: "CompanyDescriptionGoogleMapsV1"
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
    </div>
  );
}
