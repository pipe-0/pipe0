"use client";

import type { PipeEntry } from "@/app/resources/pipe-catalog/get-pipes";
import { AvatarGroup } from "@/components/features/docs/avatar-group";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { appInfo } from "@/lib/const";
import { copyToClipboard, getLastPipeVersionEntry } from "@/lib/utils";
import {
  type PipeId,
  pipeMetaCatalog,
  providerCatalog,
} from "@pipe0/client-sdk";
import { ArrowRight, Copy, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

// Featured pipes - you can customize this list with your featured pipe IDs
const FEATURED_PIPE_IDS = [
  "PeopleGetMobileNumberWaterfall@1",
  "PeopleGetWorkEmailWaterfall@1",
  "WebsiteGetTechnologyStackBuiltWith@1",
  "CompanyGetProfileBuiltWith@1",
];

export function IntegrationCatalog({
  pipeEntries,
  allTags,
}: {
  pipeEntries: PipeEntry[];
  allTags: Record<string, number>;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

  // Group categories based on tags
  const categories = useMemo(() => {
    const categories = new Set<string>();
    categories.add("All");

    Object.keys(allTags).forEach((t) => categories.add(t));

    return Array.from(categories);
  }, [allTags]);

  // Filter pipes based on search and category
  const filteredPipes = useMemo(() => {
    return pipeEntries.filter((pipe) => {
      const lastChildEntry = getLastPipeVersionEntry(pipe);
      const pipeMetaEntry =
        pipeMetaCatalog[lastChildEntry?.frontMatter.pipe as PipeId];

      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        pipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lastChildEntry?.frontMatter.pipe
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (pipeMetaEntry.tags || []).some((tag) => {
          return tag.toLowerCase().includes(searchQuery.toLowerCase());
        });

      // Category filter
      const matchesCategory =
        selectedCategory === "All" ||
        ((pipeMetaEntry.tags as string[]) || []).includes(selectedCategory);

      return matchesSearch && matchesCategory && lastChildEntry;
    });
  }, [pipeEntries, searchQuery, selectedCategory]);

  // Get featured pipes
  const featuredPipes = useMemo(() => {
    return filteredPipes
      .filter((pipe) => {
        const lastChildEntry = getLastPipeVersionEntry(pipe);
        return FEATURED_PIPE_IDS.includes(
          lastChildEntry?.frontMatter.pipe as string
        );
      })
      .slice(0, 6);
  }, [filteredPipes]);

  // Pagination
  const totalPages = Math.ceil(filteredPipes.length / itemsPerPage);
  const paginatedPipes = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPipes.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPipes, currentPage]);

  // Integration card component
  const IntegrationCard = ({ pipe }: { pipe: PipeEntry }) => {
    const lastChildEntry = getLastPipeVersionEntry(pipe);
    const pipeCatalogEntry =
      pipeMetaCatalog[lastChildEntry?.frontMatter.pipe as PipeId];

    if (!lastChildEntry || !pipeCatalogEntry) return null;

    const isNew = (pipeCatalogEntry.tags as string[]).includes("new");

    return (
      <Link href={lastChildEntry.route}>
        <Card className="h-full border-input hover:border-primary/50 transition-colors">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="flex">
                  <AvatarGroup
                    providerCatalog={providerCatalog}
                    providers={pipeCatalogEntry.providers}
                  />
                </div>
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    {pipeCatalogEntry.label}
                    {isNew && (
                      <Badge
                        variant="default"
                        className="text-xs bg-black text-white"
                      >
                        New
                      </Badge>
                    )}
                  </CardTitle>
                </div>
              </div>
              <div className="flex flex-row-reverse"></div>
            </div>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>{pipeCatalogEntry.description}</p>
          </CardContent>
          <CardFooter className="pt-2">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              {lastChildEntry.frontMatter.pipe}{" "}
              <Button
                size="icon"
                className="size-4"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  copyToClipboard(lastChildEntry.frontMatter.pipe);
                }}
              >
                <Copy className="size-3" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </Link>
    );
  };

  return (
    <div className="space-y-8 mx-auto pt-12">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Pipe Catalog</h1>
        <p className="text-lg text-muted-foreground">
          Pipe automate data enrichment via various providers. The Pipe Catalog
          lists all available pipes for your apps.
        </p>
        <p className="text-muted-foreground">
          Not sure where to start?{" "}
          <Link
            href="/guides/integrations"
            className="font-medium underline-offset-4 hover:underline inline-flex items-center"
          >
            Read our integrations guide <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </p>
      </div>

      {/* Main content with sidebar */}
      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
        {/* Sidebar */}
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search integrations..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Category</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={selectedCategory === category}
                    onCheckedChange={() => setSelectedCategory(category)}
                  />
                  <label
                    htmlFor={`category-${category}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {category}
                    {category === "All" && (
                      <span className="ml-1 text-muted-foreground">
                        ({pipeEntries.length})
                      </span>
                    )}
                    {category !== "All" && allTags[category] && (
                      <span className="ml-1 text-muted-foreground">
                        ({allTags[category]})
                      </span>
                    )}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <Link href={appInfo.links.requestPipe}>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/request-integration">Request a pipe</Link>
              </Button>
            </Link>
          </div>
        </div>

        {/* Main content */}
        <div className="space-y-10">
          {/* Featured section */}
          {featuredPipes.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Featured</h2>
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {featuredPipes.map((pipe) => (
                  <IntegrationCard key={pipe.route} pipe={pipe} />
                ))}
              </div>
            </div>
          )}

          {/* All integrations */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">All integrations</h2>
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {paginatedPipes.map((pipe) => (
                <IntegrationCard key={pipe.route} pipe={pipe} />
              ))}
            </div>

            {/* Empty state */}
            {filteredPipes.length === 0 && (
              <div className="flex h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No integrations found. Try adjusting your search or filter.
                </p>
              </div>
            )}

            {/* Pagination */}
            {filteredPipes.length > 0 && (
              <Pagination className="mt-8">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: Math.min(5, totalPages) }).map(
                    (_, i) => {
                      let pageNumber: number;

                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1;
                        if (i === 4)
                          return (
                            <PaginationItem key={i}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                        if (i === 0)
                          return (
                            <PaginationItem key={i}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                      } else {
                        if (i === 0)
                          return (
                            <PaginationItem key={i}>
                              <PaginationLink
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setCurrentPage(1);
                                }}
                              >
                                1
                              </PaginationLink>
                            </PaginationItem>
                          );
                        if (i === 1)
                          return (
                            <PaginationItem key={i}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        if (i === 3)
                          return (
                            <PaginationItem key={i}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        if (i === 4)
                          return (
                            <PaginationItem key={i}>
                              <PaginationLink
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setCurrentPage(totalPages);
                                }}
                              >
                                {totalPages}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        pageNumber = currentPage + i - 2;
                      }

                      return (
                        <PaginationItem key={i}>
                          <PaginationLink
                            href="#"
                            isActive={currentPage === pageNumber}
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(pageNumber);
                            }}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                  )}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages)
                          setCurrentPage(currentPage + 1);
                      }}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
