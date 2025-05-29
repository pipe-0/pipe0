"use client";

import React, { useState } from "react";
// import { Check, Copy } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface CodeTabsProps {
  items: string[];
  children: React.ReactNode[];
  defaultValue?: string;
  className?: string;
}

export function CodeTabs({
  items,
  children,
  defaultValue,
  className,
}: CodeTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue || items[0]);
  //   const [copied, setCopied] = useState(false);

  // Extract text content from React nodes
  //   const getTextContent = (node: React.ReactNode): string => {
  //     if (typeof node === "string") return node;
  //     if (typeof node === "number") return String(node);
  //     if (!node) return "";

  //     if (React.isValidElement(node)) {
  //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //       const children = React.Children.toArray((node.props as any).children);
  //       return children.map(getTextContent).join("");
  //     }

  //     if (Array.isArray(node)) {
  //       return node.map(getTextContent).join("");
  //     }

  //     return "";
  //   };

  //   const handleCopy = () => {
  //     // Find the active tab index
  //     const activeIndex = items.findIndex((item) => item === activeTab);
  //     if (activeIndex === -1) return;

  //     // Get the content of the active tab
  //     const activeContent = React.Children.toArray(children)[activeIndex];
  //     const textToCopy = getTextContent(activeContent);

  //     navigator.clipboard.writeText(textToCopy).then(() => {
  //       setCopied(true);
  //       setTimeout(() => setCopied(false), 2000);
  //     });
  //   };

  return (
    <div className={cn("relative pt-3", className)}>
      <Tabs
        defaultValue={defaultValue || items[0]}
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="bg-black rounded-t-md">
          <div className="flex items-center justify-between border-b border-gray-800">
            <TabsList className="bg-transparent h-10 border-0">
              {items.map((item) => (
                <TabsTrigger
                  key={item}
                  value={item}
                  className={cn(
                    "data-[state=active]:bg-transparent data-[state=active]:shadow-none relative px-4 text-sm text-gray-400 data-[state=active]:text-white",
                    "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:translate-y-[1px] after:bg-transparent data-[state=active]:after:bg-brand"
                  )}
                >
                  {item}
                </TabsTrigger>
              ))}
            </TabsList>
            {/* <button
              onClick={handleCopy}
              className="mr-3 p-1 text-gray-400 hover:text-white transition-colors"
              aria-label="Copy code"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button> */}
          </div>
          {React.Children.map(children, (child, index) => (
            <TabsContent
              key={items[index]}
              value={items[index]}
              className="p-0 m-0"
            >
              <div className="py-5 text-white font-mono text-sm">{child}</div>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}
