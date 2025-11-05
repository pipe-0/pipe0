"use client";

import {
  SearchEntry,
  SearchEntryMap,
} from "@/app/resources/search-catalog/get-searches";
import { ConditionalWrapper } from "@/components/conditional-wrapper";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { appInfo } from "@/lib/const";
import { cn, copyToClipboard } from "@/lib/utils";
import {
  getDefaultSearchOutputFields,
  getSearchEntry,
  getSearchVersion,
  providerCatalog,
  SearchCatalogTableData,
  SearchCategory,
  SearchId,
} from "@pipe0/client-sdk";
import { useSearchCatalogTable } from "@pipe0/react-sdk";
import {
  ArrowDown,
  Building2,
  Coins,
  Copy,
  Database,
  Search,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { ComponentType, useMemo } from "react";

// Featured searches - you can customize this list with your featured searches IDs
const FEATURED_SEARCHES_IDS = [] satisfies SearchId[];

// Integration card component - memoized to prevent unnecessary re-renders
const SearchIntegrationCard = ({
  searchEntry,
  tableEntry,
}: {
  searchEntry: SearchEntry["children"][number];
  tableEntry: SearchCatalogTableData;
}) => {
  const searchId = tableEntry.searchId;

  const isNew = (tableEntry.tags as string[]).includes("new");

  return (
    <Link href={searchEntry.route}>
      <Card className="flex flex-col justify-stretch border-input hover:border-primary/50 transition-colors relative h-[290px]">
        <span className="absolute right-4 top-4 inline-flex gap-1 text-muted-foreground text-sm items-center">
          <Coins className=" size-4" />{" "}
          {tableEntry.cost.mode === "per_result"
            ? tableEntry.cost.creditsPerResult
            : tableEntry.cost.mode === "per_search"
            ? tableEntry.cost.creditsPerSearch
            : tableEntry.cost.creditsPerPage}
        </span>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="flex">
                <AvatarGroup
                  providerCatalog={providerCatalog}
                  providers={[tableEntry.provider]}
                />
              </div>
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  {tableEntry.label}
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
        <CardContent className="grow text-sm">
          <p>{tableEntry.description}</p>
        </CardContent>
        <CardFooter className="pt-2 block pb-3">
          <div className="flex items-center justify-end pb-4 gap-2 text-muted-foreground text-sm">
            <span className="break-all">{searchId}</span>
            <Button
              size="icon"
              className="size-4"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                copyToClipboard(searchId || "");
              }}
            >
              <Copy className="size-3" />
            </Button>
          </div>

          <div className="flex gap-1 items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-muted-foreground text-sm hover:text-foreground"
                >
                  <ArrowDown className="size-3" /> Ouputs
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
              >
                <DropdownMenuGroup>
                  {getDefaultSearchOutputFields(tableEntry.searchId).map(
                    (field) => (
                      <DropdownMenuItem
                        key={field}
                        className="py-1 cursor-pointer block text-muted-foreground hover:text-foreground"
                      >
                        {field}
                      </DropdownMenuItem>
                    )
                  )}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

const quickStartOptions = [
  {
    id: null,
    disabled: false,
    icon: Database,
    title: "All",
  },
  {
    id: "companies",
    disabled: false,
    icon: Building2,
    title: "Find Companies",
  },
  {
    id: "people",
    disabled: false,
    icon: User,
    title: "Find People",
  },
  {
    id: "deprecated",
    disabled: false,
    icon: X,
    title: "Deprecated",
  },
] satisfies {
  id: SearchCategory | null;
  title: string;
  icon: ComponentType;
  disabled: boolean;
}[];

export function SearchCatalogIndex({
  searchEntryMap,
}: {
  searchEntryMap: SearchEntryMap;
}) {
  const {
    category,
    globalFilterInput,
    isFilterChecked,
    setCategory,
    setGlobalFilterInput,
    table,
    showFeaturedSearches,
    sidebar: {
      addColumnFilter,
      expandedSidebarSections,
      removeColumnFilter,
      setExpandedSidebarSections,
      sortedOutputFieldEntries,
      sortedProviderEntries,
      sortedTagEntries,
    },
  } = useSearchCatalogTable();

  const rows = table.getRowModel().rows;
  const totalPages = table.getPageCount();
  const currentPageNumber = table.getState().pagination.pageIndex;

  return (
    <div className="space-y-8 mx-auto pt-12">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Search Catalog</h1>
        <p className="text-lg text-muted-foreground">
          Searches give you access to datasets for finding leads and companies
          using various filters. You can combine multiple searches into one
          request and deduplicate the results.
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
              placeholder="Search..."
              className="w-full pl-8"
              value={globalFilterInput}
              onChange={(v) => setGlobalFilterInput(v.target.value)}
            />
          </div>

          <h6 className="text-sm">
            Filtered by category{" "}
            <span className="font-semibold text-primary">
              {category?.replace("_", " ") || "all"}
            </span>
          </h6>

          <Accordion
            type="multiple"
            value={expandedSidebarSections}
            onValueChange={setExpandedSidebarSections}
          >
            <AccordionItem value="tags" className="border-none">
              <AccordionTrigger className="py-1">Tags</AccordionTrigger>
              <AccordionContent className="pt-2">
                <div className="space-y-2">
                  {sortedTagEntries.map(([tagName, searchIdList]) => {
                    return (
                      <div
                        key={tagName}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`tag-${tagName}`}
                          checked={isFilterChecked("tags", tagName)}
                          onCheckedChange={(v) => {
                            if (v === true) {
                              addColumnFilter("tags", tagName);
                            } else {
                              removeColumnFilter("tags");
                            }
                          }}
                        />
                        <label
                          htmlFor={`tag-${tagName}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {tagName}
                          <span className="ml-1 text-muted-foreground">
                            ({searchIdList.length})
                          </span>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="providers" className="border-none">
              <AccordionTrigger className="py-1">
                <h3 className="font-medium">Providers</h3>
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                <div className="space-y-2">
                  {sortedProviderEntries.map(([providerName, searchIdList]) => {
                    const providerEntry =
                      providerCatalog[
                        providerName as keyof typeof providerCatalog
                      ];
                    return (
                      <div
                        key={providerName}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`providers-${providerName}`}
                          checked={isFilterChecked("providers", providerName)}
                          onCheckedChange={(v) => {
                            if (v === true) {
                              addColumnFilter("providers", providerName);
                            } else if (v === false) {
                              removeColumnFilter("providers");
                            }
                          }}
                        />
                        <label
                          htmlFor={`providers-${providerName}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          <img
                            src={providerEntry.logoUrl}
                            alt={providerEntry.label}
                            className="inline-block w-4 mr-2"
                          />
                          {providerEntry.label}
                          <span className="ml-1 text-muted-foreground">
                            ({searchIdList.length})
                          </span>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="outputFields" className="border-none">
              <AccordionTrigger className="py-1">
                <h3 className="font-medium">Output Fields</h3>
              </AccordionTrigger>
              <AccordionContent className="pt-2">
                <div className="space-y-2">
                  {sortedOutputFieldEntries.map(([fieldName, searchIdList]) => {
                    return (
                      <div
                        key={fieldName}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`output-field-${fieldName}`}
                          checked={isFilterChecked("outputFields", fieldName)}
                          onCheckedChange={(v) => {
                            if (v === true) {
                              addColumnFilter("outputFields", fieldName);
                            } else if (v === false) {
                              removeColumnFilter("outputFields");
                            }
                          }}
                        />
                        <label
                          htmlFor={`output-field-${fieldName}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {fieldName}
                          <span className="ml-1 text-muted-foreground">
                            ({searchIdList.length})
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
                Request a new search function
              </Button>
            </Link>
          </div>
        </div>

        {/* Main content */}
        <div className="space-y-10">
          <div className="flex gap-3 flex-wrap">
            {quickStartOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <ConditionalWrapper
                  key={option.id}
                  condition={!!option.disabled}
                  wrapper={(c) => (
                    <Tooltip>
                      <TooltipTrigger>{c}</TooltipTrigger>
                      <TooltipContent>Coming soon</TooltipContent>
                    </Tooltip>
                  )}
                >
                  <Card
                    data-isactive={category === option.id}
                    data-disabled={option.disabled}
                    className={cn(
                      option.id === "deprecated" && "opacity-60",
                      "group cursor-pointer border hover:shadow-sm transition-all duration-200 pr-4",
                      "data-[isactive=true]:bg-primary data-[isactive=true]:text-primary-foreground data-[isactive=true]:border-primary data-[isactive=true]:font-semibold",
                      "data-[disabled=true]:bg-muted data-[disabled=true]:text-muted-foreground data-[disabled=true]:opacity-80"
                    )}
                    onClick={() => setCategory(option.id)}
                  >
                    <CardContent className="p-1">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg`}>
                          <IconComponent
                            className={`w-5 h-5`}
                            strokeWidth={1.5}
                          />
                        </div>
                        <div className="flex-1 whitespace-nowrap">
                          <h3 className="text-sm">
                            {option.id === "deprecated" ? (
                              <s>{option.title}</s>
                            ) : (
                              option.title
                            )}
                          </h3>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </ConditionalWrapper>
              );
            })}
          </div>

          {/* Featured section */}
          {showFeaturedSearches && FEATURED_SEARCHES_IDS.length ? (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Featured</h2>
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {FEATURED_SEARCHES_IDS.map((searchId) => {
                  const searchEntry = searchEntryMap[searchId];
                  if (!searchEntry) return null;
                  return (
                    <SearchIntegrationCard
                      key={searchId}
                      tableEntry={{
                        ...getSearchEntry(searchId),
                        searchId: searchId,
                        latestVersion: getSearchVersion(searchId),
                      }}
                      searchEntry={searchEntry}
                    />
                  );
                })}
              </div>
            </div>
          ) : null}

          {/* All integrations */}
          <div className="space-y-4">
            {showFeaturedSearches && (
              <h2 className="text-2xl font-bold">All integrations</h2>
            )}
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {rows.map((row) => {
                const searchEntry = searchEntryMap[row.original.searchId];
                if (!searchEntry) return null;
                return (
                  <SearchIntegrationCard
                    key={row.original.searchId}
                    tableEntry={row.original}
                    searchEntry={searchEntry}
                  />
                );
              })}
            </div>

            {/* Empty state */}
            {rows.length === 0 && (
              <div className="flex h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No integrations found. Try adjusting your filters.
                </p>
              </div>
            )}

            {/* Pagination - optimized to prevent unnecessary calculations */}
            {rows.length > 0 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      size="sm"
                      href="#"
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                    />
                  </PaginationItem>

                  {Array.from({ length: Math.min(5, totalPages) }).map(
                    (_, i) => {
                      let pageNumber: number;

                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (currentPageNumber <= 3) {
                        pageNumber = i + 1;
                      } else if (currentPageNumber >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                      } else {
                        pageNumber = currentPageNumber + i - 2;
                      }

                      return (
                        <PaginationItem key={i}>
                          <PaginationLink
                            size="sm"
                            href="#"
                            isActive={currentPageNumber === pageNumber - 1}
                            onClick={(e) => {
                              e.preventDefault();
                              table.setPageIndex(pageNumber - 1);
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
                      size="sm"
                      disabled={!table.getCanNextPage()}
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPageNumber < totalPages)
                          table.setPageIndex(currentPageNumber + 1);
                      }}
                      className={
                        currentPageNumber === totalPages
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
