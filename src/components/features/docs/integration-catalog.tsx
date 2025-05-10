"use client";

import type { PipeEntry } from "@/app/resources/pipe-catalog/get-pipes";
import { AvatarGroup } from "@/components/features/docs/avatar-group";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
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
  sortPipeCatalog,
  getLowestCreditAmount,
} from "@pipe0/client-sdk";
import { Separator } from "@radix-ui/react-separator";
import { ArrowDown, ArrowUp, Coins, Copy, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";

// Precompute the sorted catalog data - will only run once on module load
const {
  byInputField,
  byOutputField,
  byTag,
  byBasePipe,
  sortedInputFields,
  sortedOutputFields,
  sortedTags,
} = sortPipeCatalog();

// Featured pipes - you can customize this list with your featured pipe IDs
const FEATURED_PIPE_IDS = [
  "people:mobilenumber:waterfall@1",
  "people:workemail:waterfall@1",
  "website:technologystack:builtwith@1",
  "company:identity@1",
];

const FilterSchema = z.object({
  type: z.enum(["input", "input-field", "output-field", "tag", ""]).default(""),
  value: z.string().default(""),
});

type Filter = z.infer<typeof FilterSchema>;

// Integration card component - memoized to prevent unnecessary re-renders
const IntegrationCard = ({
  pipe,
  setFilter,
}: {
  pipe: PipeEntry;
  setFilter: (filter: Filter) => unknown;
}) => {
  const lastChildEntry = getLastPipeVersionEntry(pipe);
  const pipeCatalogEntry =
    pipeMetaCatalog[lastChildEntry?.frontMatter.pipeId as PipeId];

  if (!lastChildEntry || !pipeCatalogEntry) return null;

  const isNew = (pipeCatalogEntry.tags as string[]).includes("new");

  return (
    <Link href={lastChildEntry.route}>
      <Card className="h-full border-input hover:border-primary/50 transition-colors relative">
        <span className="absolute right-4 top-4 inline-flex gap-1 text-muted-foreground text-sm items-center">
          <Coins className=" size-4" />{" "}
          {getLowestCreditAmount(pipeCatalogEntry.costPerProvider) || "Free"}
        </span>
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
        <CardFooter className="pt-2 block">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            {lastChildEntry.frontMatter.pipeId}{" "}
            <Button
              size="icon"
              className="size-4"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                copyToClipboard(lastChildEntry.frontMatter.pipeId);
              }}
            >
              <Copy className="size-3" />
            </Button>
          </div>
          <Separator className="my-4" />
          <div className="flex gap-3 items-center justify-end">
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground">
                  <ArrowUp className="size-3" /> Inputs
                </div>
              </HoverCardTrigger>
              <HoverCardContent
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
              >
                {pipeCatalogEntry.inputGroups.map((group) =>
                  Object.values(group.fields).map((field) => (
                    <button
                      className="py-1 cursor-pointer block text-muted-foreground hover:text-foreground"
                      key={field.name}
                      onClick={() =>
                        setFilter({ type: "output-field", value: field.name })
                      }
                    >
                      {field.name}
                    </button>
                  ))
                )}
              </HoverCardContent>
            </HoverCard>
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground">
                  <ArrowDown className="size-3" /> Ouputs
                </div>
              </HoverCardTrigger>
              <HoverCardContent
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
              >
                {pipeCatalogEntry.outputFields.map((field) => (
                  <button
                    key={field}
                    className="py-1 cursor-pointer block text-muted-foreground hover:text-foreground"
                    onClick={() =>
                      setFilter({ type: "input-field", value: field })
                    }
                  >
                    {field}
                  </button>
                ))}
              </HoverCardContent>
            </HoverCard>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

// Function to get pipe ID from pipe entry
const getPipeId = (pipe: PipeEntry): PipeId | null => {
  const lastChildEntry = getLastPipeVersionEntry(pipe);
  return (lastChildEntry?.frontMatter.pipeId as PipeId) || null;
};

// Create cached maps for faster lookup
const createPipeIdMap = (pipeEntries: PipeEntry[]) => {
  const map = new Map<string, PipeEntry>();
  for (const pipe of pipeEntries) {
    const pipeId = getPipeId(pipe);
    if (pipeId) map.set(pipeId, pipe);
  }
  return map;
};

export function IntegrationCatalog({
  pipeEntries,
}: {
  pipeEntries: PipeEntry[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

  // Cache pipe ID map
  const pipeIdMapRef = useRef<Map<string, PipeEntry>>(null);
  if (!pipeIdMapRef.current) {
    pipeIdMapRef.current = createPipeIdMap(pipeEntries);
  }

  // Parse filter from URL params
  const filter: Filter = useMemo(() => {
    const defaultFilter: Filter = { type: "", value: "" };
    const type = searchParams.get("type");
    const value = searchParams.get("value");

    try {
      const result = FilterSchema.safeParse({ type, value });
      return result.success ? result.data : defaultFilter;
    } catch {
      return defaultFilter;
    }
  }, [searchParams]);

  const setFilter = useCallback(
    (filter: Filter | null) => {
      // Reset to page 1 when filter changes
      setCurrentPage(1);

      if (filter) {
        const query = new URLSearchParams({
          type: filter.type,
          value: filter.value,
        });
        router.push(pathname + "?" + query);
      } else {
        router.push(pathname);
      }
    },
    [router, pathname]
  );

  // Efficiently filter pipes based on criteria
  const filteredPipes = useMemo(() => {
    // If no filter, return all pipes
    if (filter.type === "" && filter.value === "") {
      return pipeEntries;
    }

    let matchingPipeIds: Set<string> | null = null;

    if (filter.type === "input-field") {
      const entries = byInputField[filter.value];
      if (entries) {
        matchingPipeIds = new Set(entries.map((e) => e.pipeId));
      }
    } else if (filter.type === "output-field") {
      const entries = byOutputField[filter.value];
      if (entries) {
        matchingPipeIds = new Set(entries.map((e) => e.pipeId));
      }
    } else if (filter.type === "tag") {
      matchingPipeIds = new Set();
      const entries = byTag[filter.value];
      if (entries) {
        entries.forEach((e) => matchingPipeIds!.add(e.pipeId));
      }
    } else if (filter.type === "input") {
      matchingPipeIds = new Set();
      const searchLower = filter.value.toLowerCase();

      Object.entries(byBasePipe).forEach(([baseName, entries]) => {
        const entry = entries[0];
        if (!entry) return;

        if (
          baseName.toLowerCase().includes(searchLower) ||
          entry.description.toLowerCase().includes(searchLower) ||
          entry.tags.some((t) => t.toLowerCase().includes(searchLower))
        ) {
          matchingPipeIds!.add(entry.pipeId);
        }
      });
    }

    // If no matches found or invalid filter
    if (!matchingPipeIds || matchingPipeIds.size === 0) {
      return [];
    }

    // Filter pipeEntries using the Set for O(1) lookups
    return pipeEntries.filter((pipe) => {
      const pipeId = getPipeId(pipe);
      return pipeId && matchingPipeIds!.has(pipeId);
    });
  }, [pipeEntries, filter]);

  // Get featured pipes without recalculating on every render
  const featuredPipes = useMemo(() => {
    if (filter.value !== "") return [];

    // Use the pipeIdMap for efficient lookup
    if (!pipeIdMapRef.current) return [];

    return FEATURED_PIPE_IDS.map((id) => pipeIdMapRef.current!.get(id)).filter(
      Boolean
    ) as PipeEntry[];
  }, [filter.value]);

  // Calculate pagination values only when needed
  const { totalPages, paginatedPipes } = useMemo(() => {
    const total = Math.max(1, Math.ceil(filteredPipes.length / itemsPerPage));
    // Ensure current page is valid
    const validPage = Math.min(Math.max(1, currentPage), total);

    // Only calculate paginated pipes if there are pipes to show
    const startIndex = (validPage - 1) * itemsPerPage;
    const paginated = filteredPipes.slice(
      startIndex,
      startIndex + itemsPerPage
    );

    return { totalPages: total, paginatedPipes: paginated };
  }, [filteredPipes, currentPage, itemsPerPage]);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  // Handle search input with debounce
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchQuery(value);

      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      debounceTimeout.current = setTimeout(() => {
        if (value) {
          setFilter({ type: "input", value });
        } else {
          setFilter(null);
        }
      }, 300);
    },
    [setFilter]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  return (
    <div className="space-y-8 mx-auto pt-12">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Pipe Catalog</h1>
        <p className="text-lg text-muted-foreground">
          Pipe automate data enrichment via various providers. The Pipe Catalog
          lists all available pipes for your apps.
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
              placeholder="Search pipes..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <div className="pt-2 h-6">
              {filter.value !== "" && (
                <Badge
                  variant="secondary"
                  className="py-1.5 inline-flex gap-2 items-center text-muted-foreground hover:text-foreground cursor-default transition-colors"
                  onClick={() => {
                    setFilter(null);
                    setSearchQuery("");
                  }}
                >
                  <X className="size-4" />
                  {filter.value}
                </Badge>
              )}
            </div>
          </div>

          <Accordion
            type="multiple"
            className="w-full"
            defaultValue={filter ? [filter.type, "tag"] : ["tag"]}
          >
            <AccordionItem value="tag">
              <AccordionTrigger>
                <h3 className="font-medium">Category</h3>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {sortedTags.map(([tagName, entries]) => {
                    const isChecked =
                      filter.type === "tag" && filter.value === tagName;
                    return (
                      <div
                        key={tagName}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`tag-${tagName}`}
                          checked={isChecked}
                          onCheckedChange={(v) => {
                            if (v === true) {
                              setFilter({ type: "tag", value: tagName });
                            } else {
                              setFilter(null);
                            }
                          }}
                        />
                        <label
                          htmlFor={`tag-${tagName}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {tagName}

                          <span className="ml-1 text-muted-foreground">
                            ({entries.length})
                          </span>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="input-field">
              <AccordionTrigger>
                <h3 className="font-medium">Input Fields</h3>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {sortedInputFields.map(([fieldName, entries]) => {
                    const isChecked =
                      filter.type === "input-field" &&
                      filter.value === fieldName;
                    return (
                      <div
                        key={fieldName}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`input-field-${fieldName}`}
                          checked={isChecked}
                          onCheckedChange={(v) => {
                            if (v === true) {
                              setFilter({
                                type: "input-field",
                                value: fieldName,
                              });
                            } else if (v === false) {
                              setFilter(null);
                            }
                          }}
                        />
                        <label
                          htmlFor={`input-field-${fieldName}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {fieldName}
                          <span className="ml-1 text-muted-foreground">
                            ({entries.length})
                          </span>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="output-field">
              <AccordionTrigger>
                <h3 className="font-medium">Output Fields</h3>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {sortedOutputFields.map(([fieldName, entries]) => {
                    const isChecked =
                      filter.type === "output-field" &&
                      filter.value === fieldName;
                    return (
                      <div
                        key={fieldName}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`output-field-${fieldName}`}
                          checked={isChecked}
                          onCheckedChange={(v) => {
                            if (v === true) {
                              setFilter({
                                type: "output-field",
                                value: fieldName,
                              });
                            } else if (v === false) {
                              setFilter(null);
                            }
                          }}
                        />
                        <label
                          htmlFor={`output-field-${fieldName}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {fieldName}
                          <span className="ml-1 text-muted-foreground">
                            ({entries.length})
                          </span>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="pt-4">
            <Link href={appInfo.links.requestPipe}>
              <Button variant="outline" className="w-full">
                Request a pipe
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
                  <IntegrationCard
                    key={pipe.route}
                    pipe={pipe}
                    setFilter={setFilter}
                  />
                ))}
              </div>
            </div>
          )}

          {/* All integrations */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">All integrations</h2>
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {paginatedPipes.map((pipe) => (
                <IntegrationCard
                  key={pipe.route}
                  pipe={pipe}
                  setFilter={setFilter}
                />
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

            {/* Pagination - optimized to prevent unnecessary calculations */}
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
