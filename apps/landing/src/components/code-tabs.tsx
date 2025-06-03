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

  return (
    <div className={cn("relative pt-3", className)}>
      <Tabs
        defaultValue={defaultValue || items[0]}
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="rounded-t-md">
          <div className="flex items-center justify-between">
            <TabsList className="bg-transparent h-10 border-0">
              {items.map((item) => (
                <TabsTrigger
                  key={item}
                  value={item}
                  className={cn(
                    "data-[state=active]:bg-transparent data-[state=active]:shadow-none relative px-4 text-sm",
                    "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:translate-y-[1px] after:bg-transparent data-[state=active]:after:bg-transparent data-[state=active]:border dark:data-[state=active]:bg-accent dark:data-[state=active]:text-primary-foreground data-[state=active]:bg-accent"
                  )}
                >
                  {item}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <div className="bg-accent px-4 py-5 border rounded-md">
            {React.Children.map(children, (child, index) => (
              <TabsContent
                key={items[index]}
                value={items[index]}
                className="p-0 m-0"
              >
                <div className="font-mono text-sm">{child}</div>
              </TabsContent>
            ))}
          </div>
        </div>
      </Tabs>
    </div>
  );
}
