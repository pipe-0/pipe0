"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VendorLogo } from "@/components/vendor-logo";
import { PipePage } from "@/lib/pipes";
import { Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function IntegrationCatalog({
  pagesAndMeta,
}: {
  pagesAndMeta: {
    toolCategories: string[];
    vendors: string[];
    dataLabels: string[];
    pages: Omit<PipePage, "content">[];
  };
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredIntegrations = pagesAndMeta.pages.filter((page) => {
    const matchesSearch =
      page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.dataLabel.includes(searchQuery.toLowerCase()) ||
      page.toolCategory.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategory === "all" || page.toolCategory === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search integrations..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs
        defaultValue="all"
        value={activeCategory}
        onValueChange={setActiveCategory}
      >
        <TabsList className="mb-4 flex h-auto flex-wrap justify-start gap-2">
          {pagesAndMeta.toolCategories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeCategory} className="mt-0">
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
            {filteredIntegrations.map((integration) => (
              <Card key={integration.name}>
                <CardHeader>
                  <div className="flex gap-2 items-center pb-2">
                    <VendorLogo vendor={integration.vendor} />
                    <div>
                      <CardDescription>{integration.vendor}</CardDescription>
                      <CardTitle>{integration.label}</CardTitle>
                    </div>
                  </div>
                  <CardDescription>{integration.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{integration.target}</Badge>
                    <Badge variant="secondary">
                      {integration.toolCategory}
                    </Badge>
                    <Badge variant="secondary">{integration.dataLabel}</Badge>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild>
                    <Link href={`/docs/pipe-catalog/${integration.slug}`}>
                      View Details
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredIntegrations.length === 0 && (
            <div className="flex h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
              <p className="text-sm text-muted-foreground">
                No integrations found. Try adjusting your search or filter.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
