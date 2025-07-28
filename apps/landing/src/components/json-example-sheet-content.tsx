import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import SyntaxHighlighter from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export function JsonExampleSheetContent({
  jsonExample,
}: {
  jsonExample: unknown;
}) {
  return (
    <div>
      <SheetHeader className="mb-0">
        <SheetTitle>Json Example</SheetTitle>
      </SheetHeader>
      <div className="grow overflow-auto">
        <SyntaxHighlighter language="json" style={vscDarkPlus}>
          {JSON.stringify(jsonExample, null, 2)}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
