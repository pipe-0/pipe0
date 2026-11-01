import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { useCopyButton } from "fumadocs-ui/utils/use-copy-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const cache = new Map<string, string>();

export function LLMCopyButton({
  /**
   * A URL to fetch the raw Markdown/MDX content of page
   */
  markdownUrl,
}: {
  markdownUrl: string;
}) {
  const [isLoading, setLoading] = useState(false);
  const [checked, onClick] = useCopyButton(async () => {
    const cached = cache.get(markdownUrl);
    if (cached) return navigator.clipboard.writeText(cached);

    setLoading(true);

    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/plain": fetch(markdownUrl).then(async (res) => {
            const content = await res.text();
            cache.set(markdownUrl, content);

            return content;
          }),
        }),
      ]);
    } finally {
      setLoading(false);
    }
  });

  return (
    <Button
      type="button"
      variant="link"
      size="sm"
      disabled={isLoading}
      className="mt-1 h-7 shrink-0 gap-1.5 px-0 has-[>svg]:px-0 [&_svg]:size-3.5"
      onClick={onClick}
    >
      {checked ? <Check /> : <Copy />}
      Copy Markdown
    </Button>
  );
}
