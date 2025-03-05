"use client";
import mermaid from "mermaid";
import { useEffect, useRef, useState } from "react";

interface MermaidProps {
  chart: string;
}

export const Mermaid = ({ chart }: MermaidProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>("");

  useEffect(() => {
    // Generate a unique ID for this render
    const id = `mermaid-${Math.random().toString(36).substring(2)}`;

    async function renderMermaid() {
      try {
        // Initialize with each render
        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
        });

        // Render to get the SVG
        const { svg } = await mermaid.render(id, chart);

        // Set the SVG content to state - this avoids direct DOM manipulation
        setSvgContent(svg);
      } catch (err) {
        console.error("Mermaid rendering error:", err);
        setSvgContent(
          `<pre>Error rendering diagram: ${
            err instanceof Error ? err.message : String(err)
          }</pre>`
        );
      }
    }

    renderMermaid();
  }, [chart]);

  return (
    <div ref={containerRef} dangerouslySetInnerHTML={{ __html: svgContent }} />
  );
};
