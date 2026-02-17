"use client";

import { SearchEntryMap } from "@/lib/get-searches";
import { ConditionalWrapper } from "@/components/conditional-wrapper";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
} from "@pipe0/ops";
import { useSearchCatalogTable } from "@pipe0/react-sdk";
import {
  ArrowDown,
  ArrowUp,
  Building2,
  Coins,
  Copy,
  Database,
  ExternalLink,
  Filter,
  Search,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { ComponentType, useState } from "react";
import { getSearchDocsURI } from "@/lib/searches/get-search-docs-uri";
import { H1 } from "@/components/headings";

// Featured searches - you can customize this list with your featured searches IDs
const FEATURED_SEARCHES_IDS = [] satisfies SearchId[];

// Integration card component - memoized to prevent unnecessary re-renders
const SearchIntegrationCard = ({
  tableEntry,
}: {
  tableEntry: SearchCatalogTableData;
}) => {
  const searchId = tableEntry.searchId;

  const isNew = (tableEntry.tags as string[]).includes("new");

  return (
    <Link href={getSearchDocsURI(searchId)}>
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
          <div className="flex items-center justify-start pb-4 gap-2 text-muted-foreground text-sm">
            <span className="whitespace-nowrap">{searchId}</span>
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
                    ),
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

type FilterColumn = "tags" | "providers" | "outputFields";

const filterSections: { key: FilterColumn; label: string }[] = [
  { key: "tags", label: "Tags" },
  { key: "providers", label: "Providers" },
  { key: "outputFields", label: "Output Fields" },
];

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
      removeColumnFilter,
      sortedOutputFieldEntries,
      sortedProviderEntries,
      sortedTagEntries,
    },
  } = useSearchCatalogTable();

  // Workaround: the SDK's addColumnFilter for searches injects a reference to
  // a non-existent "categories" column, causing a TanStack Table error.
  // Use table.setColumnFilters directly instead.
  const addColumnFilter = (id: string, value: string) => {
    table.setColumnFilters([{ id, value }]);
  };

  const [activeFilterSection, setActiveFilterSection] =
    useState<FilterColumn | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const rows = table.getRowModel().rows;

  // Determine which filters are active (exclude null/undefined values left by removeColumnFilter)
  const activeFilters = table
    .getState()
    .columnFilters.filter((f) => f.value != null && f.value !== "");
  const hasActiveFilters = activeFilters.length > 0;

  const clearAllFilters = () => {
    table.setColumnFilters([]);
    setActiveFilterSection(null);
  };

  const getFilterEntries = (key: FilterColumn) => {
    switch (key) {
      case "tags":
        return sortedTagEntries;
      case "providers":
        return sortedProviderEntries;
      case "outputFields":
        return sortedOutputFieldEntries;
    }
  };

  const renderFilterOption = (
    key: FilterColumn,
    name: string,
    count: number,
  ) => {
    const isChecked = isFilterChecked(key, name);
    return (
      <button
        key={name}
        onClick={() => {
          if (isChecked) {
            removeColumnFilter(key);
          } else {
            addColumnFilter(key, name);
          }
        }}
        className={cn(
          "flex items-center gap-2 w-full px-3 py-1.5 text-sm rounded-md transition-colors text-left",
          isChecked
            ? "bg-primary/10 text-primary font-medium"
            : "text-muted-foreground hover:text-foreground hover:bg-muted",
        )}
      >
        {key === "providers" && (
          <img
            src={providerCatalog[name as keyof typeof providerCatalog]?.logoUrl}
            alt=""
            className="w-4 h-4 shrink-0"
          />
        )}
        <span className="truncate">
          {key === "providers"
            ? (providerCatalog[name as keyof typeof providerCatalog]?.label ??
              name)
            : name}
        </span>
        <span className="ml-auto text-xs text-muted-foreground shrink-0">
          {count}
        </span>
      </button>
    );
  };

  return (
    <div className="space-y-6 mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <H1>Search Catalog</H1>
          <Link
            href={appInfo.links.requestPipe}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Button size="sm" variant="link">
              Request a search <ExternalLink />
            </Button>
          </Link>
        </div>
        <p className="text-lg text-muted-foreground">
          Searches give you access to datasets for finding leads and companies
          using various filters. You can combine multiple searches into one
          request and deduplicate the results.
        </p>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full pl-9 h-10"
          value={globalFilterInput}
          onChange={(v) => setGlobalFilterInput(v.target.value)}
        />
      </div>

      {/* Categories + Filter button */}
      <div className="flex items-center gap-2">
        <div className="flex gap-2 flex-wrap flex-1">
          {quickStartOptions.map((option) => {
            const IconComponent = option.icon;
            const isActive = category === option.id;
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
                <button
                  data-disabled={option.disabled}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border transition-colors",
                    option.id === "deprecated" && "opacity-60",
                    isActive
                      ? "bg-primary text-primary-foreground border-primary font-medium"
                      : "bg-background text-muted-foreground border-input hover:text-foreground hover:bg-muted",
                    "data-[disabled=true]:opacity-50 data-[disabled=true]:pointer-events-none",
                  )}
                  onClick={() => setCategory(option.id)}
                >
                  <IconComponent className="w-3.5 h-3.5" strokeWidth={1.5} />
                  {option.id === "deprecated" ? (
                    <s>{option.title}</s>
                  ) : (
                    option.title
                  )}
                </button>
              </ConditionalWrapper>
            );
          })}
        </div>

        {/* Filter popover */}
        <Popover open={filterOpen} onOpenChange={setFilterOpen}>
          <PopoverTrigger asChild>
            <button
              className={cn(
                "inline-flex items-center justify-center rounded-md border p-2 transition-colors",
                hasActiveFilters
                  ? "border-primary text-primary bg-primary/5"
                  : "border-input text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
            >
              <Filter className="h-4 w-4" />
              {hasActiveFilters && (
                <span className="ml-1.5 text-xs font-medium">
                  {activeFilters.length}
                </span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-64 p-0" sideOffset={8}>
            {activeFilterSection === null ? (
              <div className="py-1">
                <div className="px-3 py-2 flex items-center justify-between">
                  <span className="text-sm font-medium">Filters</span>
                  {hasActiveFilters && (
                    <button
                      onClick={clearAllFilters}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                {filterSections.map(({ key, label }) => {
                  const currentFilter = activeFilters.find((f) => f.id === key);
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveFilterSection(key)}
                      className="flex items-center justify-between w-full px-3 py-2 text-sm hover:bg-muted transition-colors"
                    >
                      <span>{label}</span>
                      <span className="text-xs text-muted-foreground">
                        {currentFilter ? String(currentFilter.value) : "Any"}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="py-1">
                <button
                  onClick={() => setActiveFilterSection(null)}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full"
                >
                  <ArrowUp className="h-3 w-3 -rotate-90" />
                  <span>
                    {
                      filterSections.find((s) => s.key === activeFilterSection)
                        ?.label
                    }
                  </span>
                </button>
                <div className="max-h-70 overflow-y-auto px-1 py-1">
                  {getFilterEntries(activeFilterSection).map(([name, items]) =>
                    renderFilterOption(
                      activeFilterSection,
                      name,
                      (items as any[]).length,
                    ),
                  )}
                </div>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>

      {/* Active filter pills */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          {activeFilters.map((filter) => (
            <span
              key={filter.id}
              className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-md bg-primary/10 text-primary"
            >
              <span className="text-primary/60">
                {filterSections.find((s) => s.key === filter.id)?.label}:
              </span>
              {String(filter.value)}
              <button
                onClick={() => removeColumnFilter(filter.id as FilterColumn)}
                className="ml-0.5 hover:text-primary/80"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <button
            onClick={clearAllFilters}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

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
                />
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="space-y-4">
        {showFeaturedSearches && (
          <h2 className="text-2xl font-bold">All searches</h2>
        )}
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {rows.map((row) => {
            const searchEntry = searchEntryMap[row.original.searchId];
            if (!searchEntry) return null;
            return (
              <SearchIntegrationCard
                key={row.original.searchId}
                tableEntry={row.original}
              />
            );
          })}
        </div>

        {/* Empty state */}
        {rows.length === 0 && (
          <div className="flex h-50 flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No searches found. Try adjusting your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
