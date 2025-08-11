declare module "react-syntax-highlighter" {
  import * as React from "react";

  export interface SyntaxHighlighterProps {
    language?: string;
    style?: any;
    customStyle?: React.CSSProperties;
    [key: string]: any; // keep it open for other props
  }

  export const Prism: React.FC<SyntaxHighlighterProps>;
  export const Light: React.FC<SyntaxHighlighterProps>;
  const DefaultSyntaxHighlighter: React.FC<SyntaxHighlighterProps>;
  export default DefaultSyntaxHighlighter;
}

declare module "react-syntax-highlighter/dist/esm/styles/prism/*" {
  const style: any;
  export default style;
}
