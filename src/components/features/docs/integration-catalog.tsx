"use client";

import { PipeEntry } from "@/app/resources/pipe-catalog/get-pipes";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getLastPipeVersionEntry } from "@/lib/utils";
import { Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function IntegrationCatalog({
  pipeEntries,
  allTags,
}: {
  pipeEntries: PipeEntry[];
  allTags: Record<string, number>;
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPipes = pipeEntries.filter((pipe) => {
    // Last available version of the pipe
    const lastChildEntry = getLastPipeVersionEntry(pipe);
    const matchesSearch =
      pipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lastChildEntry?.frontMatter.pipe
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (lastChildEntry?.frontMatter.tags || []).includes(
        searchQuery.toLowerCase()
      );

    return matchesSearch;
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
      <div
        className="not-prose"
        style={{ display: "flex", flexWrap: "wrap", gap: ".5rem" }}
      >
        {Object.entries(allTags).map(([tag, count]) => (
          <Badge
            key={tag}
            variant="secondary"
            onClick={() => setSearchQuery(tag.toLowerCase())}
            className="cursor-pointer"
          >
            {tag} ({count})
          </Badge>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
        {filteredPipes.map((pipe) => {
          const lastChildEntry = getLastPipeVersionEntry(pipe);
          if (!lastChildEntry) return null;
          return (
            <Card key={pipe.route} className="bg-secondary">
              <CardHeader>
                <CardTitle>
                  {lastChildEntry.frontMatter.root || pipe.name}
                </CardTitle>
                <CardDescription>
                  {lastChildEntry.frontMatter.description}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                {pipe.children.map((version) => (
                  <Link href={version.route} key={version.name}>
                    <Badge>{version.name}</Badge>
                  </Link>
                ))}
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {filteredPipes.length === 0 && (
        <div className="flex h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No integrations found. Try adjusting your search or filter.
          </p>
        </div>
      )}
    </div>
  );
}
