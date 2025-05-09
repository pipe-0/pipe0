import { CodeBlock } from "@/components/ui/code-block";

interface CodeExampleCardProps {
  className?: string;
}

export default function CodeExampleCard({}: CodeExampleCardProps) {
  return (
    <div className="w-full max-w-5xl mx-auto px-3 lg:px-8 py-0 lg:py-12 overflow-auto">
      <CodeBlock
        language="typescript"
        code={`
// Find a work email and company description
const response = await pipe0.request.create({
    pipes: [
      {
        name: "people:workemail:waterfall@1"
      },
      {
        name: "company:description@1"
      }
    ],
    input: [
      { // this is the data you have
        id: 1,
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
