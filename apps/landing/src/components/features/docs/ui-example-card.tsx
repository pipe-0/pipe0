"use client";

import { DynamicCodeBlock } from "@/components/features/docs/dynamic-code-block";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Code2, ExternalLink, Eye, ZoomIn, ZoomOut } from "lucide-react";
import Link from "next/link";
import { ReactNode, useState } from "react";

const ZOOM_LEVELS = [0.75, 0.85, 1];
const CONTAINER_HEIGHT = "h-[620px]";

type TabValue = "preview" | "code";

export function UiExampleCard({
  preview,
  code,
  docsHref,
}: {
  preview: ReactNode;
  code: string;
  docsHref: string;
}) {
  const [tab, setTab] = useState<TabValue>("preview");
  const [zoomIndex, setZoomIndex] = useState(ZOOM_LEVELS.length - 1);
  const zoom = ZOOM_LEVELS[zoomIndex];

  return (
    <Tabs
      value={tab}
      onValueChange={(v) => setTab(v as TabValue)}
      className="rounded-lg border bg-card overflow-hidden gap-0"
    >
      <div className="flex items-center justify-between gap-3 border-b px-3 py-2">
        <TabsList className="h-8 bg-muted/60 p-0.5">
          <TabsTrigger
            value="preview"
            className="gap-1.5 h-7 px-3 text-xs font-medium"
          >
            <Eye className="size-3.5" />
            Preview
          </TabsTrigger>
          <TabsTrigger
            value="code"
            className="gap-1.5 h-7 px-3 text-xs font-medium"
          >
            <Code2 className="size-3.5" />
            Code
          </TabsTrigger>
        </TabsList>

        <div className="flex items-center gap-0.5">
          {tab === "preview" && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                onClick={() => setZoomIndex((i) => Math.max(0, i - 1))}
                disabled={zoomIndex === 0}
                aria-label="Zoom out"
              >
                <ZoomOut className="size-3.5" />
              </Button>
              <span className="text-xs text-muted-foreground tabular-nums w-10 text-center">
                {Math.round(zoom * 100)}%
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                onClick={() =>
                  setZoomIndex((i) => Math.min(ZOOM_LEVELS.length - 1, i + 1))
                }
                disabled={zoomIndex === ZOOM_LEVELS.length - 1}
                aria-label="Zoom in"
              >
                <ZoomIn className="size-3.5" />
              </Button>
              <div className="w-px h-4 bg-border mx-1" />
            </>
          )}
          <Button variant="ghost" size="sm" asChild className="h-7 gap-1.5">
            <Link href={docsHref}>
              <span className="text-xs">Docs</span>
              <ExternalLink className="size-3" />
            </Link>
          </Button>
        </div>
      </div>

      <TabsContent
        value="preview"
        className={cn(
          CONTAINER_HEIGHT,
          "m-0 bg-muted/40 dark:bg-muted/20 flex items-center justify-center p-6 overflow-hidden",
        )}
      >
        <div
          className="bg-card rounded-lg border shadow-sm w-full max-w-md h-full overflow-hidden transition-transform duration-200 ease-out"
          style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
        >
          {preview}
        </div>
      </TabsContent>

      <TabsContent
        value="code"
        className={cn(CONTAINER_HEIGHT, "m-0 overflow-auto")}
      >
        <DynamicCodeBlock
          code={code}
          lang="tsx"
          className="h-full rounded-none border-0 m-0"
        />
      </TabsContent>
    </Tabs>
  );
}
