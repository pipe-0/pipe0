import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";

/** Behind a sheet, so the highlighter loads when someone opens one. */
export default function JsonExample({ value }: { value: unknown }) {
  return (
    <SyntaxHighlighter language="json" style={vscDarkPlus}>
      {JSON.stringify(value, null, 2)}
    </SyntaxHighlighter>
  );
}
