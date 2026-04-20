"use client";

import { ConditionalWrapper } from "@/components/conditional-wrapper";
import { AvatarGroup } from "@/components/features/docs/avatar-group";
import { H1 } from "@/components/headings";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { getPipeDocsURI } from "@/lib/pipes/get-pipe-docs-uri";
import { cn, copyToClipboard } from "@/lib/utils";
import {
  getDefaultOutputFields,
  getDefaultPipeProviders,
  getPipeVersion,
  getStartingCostPerPipesProvider,
  pipeCatalog,
  PipeCatalogEntry,
  PipeCategory,
  PipeEntryWithLatestVersion,
  PipeId,
  providerCatalog,
  ProviderName,
} from "@pipe0/elements";
import { usePipeCatalogTable } from "@pipe0/react-sdk";
import {
  ArrowDown,
  ArrowUp,
  Building2,
  Coins,
  Copy,
  Database,
  ExternalLink,
  Filter,
  Hammer,
  ScanFace,
  Search,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { ComponentType, useMemo, useState } from "react";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
});

// Featured pipes - you can customize this list with your featured pipe IDs
const FEATURED_PIPE_IDS = [
  "people:phone:profile:waterfall@1",
  "people:workemail:waterfall@1",
  "company:techstack:builtwith@1",
  "company:identity@2",
  "company:overview@2",
] satisfies PipeId[];

// Integration card component - memoized to prevent unnecessary re-renders
const IntegrationCard = ({
  tableEntry,
  filterByField,
}: {
  tableEntry: PipeEntryWithLatestVersion;
  filterByField: (
    id: "inputFields" | "outputFields",
    fieldName: string,
  ) => void;
}) => {
  const pipeId = tableEntry.pipeId;

  const pipeStartingPrice = useMemo(() => {
    const starting = getStartingCostPerPipesProvider(pipeId) as Record<
      ProviderName,
      number
    >;
    return Math.min(...Object.values(starting));
  }, []);

  const isNew = (tableEntry.tags as string[]).includes("new");

  const providers = getDefaultPipeProviders(pipeId);

  return (
    <Link href={getPipeDocsURI(pipeId)}>
      <Card className="flex flex-col justify-stretch border-input hover:border-primary/50 transition-colors relative h-[290px]">
        <span className="absolute right-4 top-4 inline-flex gap-1 text-muted-foreground text-sm items-center">
          <Coins className=" size-4" /> {pipeStartingPrice || "Free"}
        </span>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="flex">
                <AvatarGroup
                  providerCatalog={providerCatalog}
                  providers={providers}
                />
              </div>
              <div>
                <CardTitle
                  className={cn(
                    "text-base flex items-center gap-2",
                    tableEntry.lifecycle?.deprecatedOn && "line-through",
                  )}
                >
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
          {tableEntry.lifecycle?.replacedBy && (
            <Alert variant="destructive" className="py-1 px-2 mb-2">
              <AlertTitle>
                Deprecated by{" "}
                {dateFormatter.format(
                  new Date(tableEntry.lifecycle.deprecatedOn),
                )}
              </AlertTitle>
              <AlertDescription>
                Use: {tableEntry.lifecycle.replacedBy}
              </AlertDescription>
            </Alert>
          )}
          <p>{tableEntry.description}</p>
        </CardContent>
        <CardFooter className="pt-2 block pb-3">
          <div className="flex items-center justify-end pb-4 gap-2 text-muted-foreground text-sm">
            <span className="break-all">{pipeId}</span>
            <Button
              size="icon"
              className="size-4"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                copyToClipboard(pipeId || "");
              }}
            >
              <Copy className="size-3" />
            </Button>
          </div>
          {tableEntry.inputFieldMode === "static" && (
            <div className="flex gap-1 items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-muted-foreground text-sm hover:text-foreground"
                  >
                    <ArrowUp className="size-3" /> Inputs
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
                    {tableEntry.defaultInputGroups.map((group) =>
                      Object.values(group.fields).map((field) => (
                        <DropdownMenuItem
                          className="py-1 cursor-pointer block text-muted-foreground hover:text-foreground"
                          key={field.name}
                          onClick={() =>
                            filterByField("outputFields", field.name)
                          }
                        >
                          {field.name}
                        </DropdownMenuItem>
                      )),
                    )}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
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
                    {getDefaultOutputFields(tableEntry).map((field) => (
                      <DropdownMenuItem
                        key={field}
                        className="py-1 cursor-pointer block text-muted-foreground hover:text-foreground"
                        onClick={() => filterByField("inputFields", field)}
                      >
                        {field}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
};

const quickStartOptions = [
  {
    id: null,
    title: "All",
    icon: Database,
    disabled: false,
  },
  {
    id: "people_data",
    title: "People Data",
    icon: ScanFace,
    disabled: false,
  },
  {
    id: "company_data",
    title: "Company Data",
    icon: Building2,
    disabled: false,
  },
  {
    id: "tools",
    title: "Tools",
    icon: Hammer,
    disabled: false,
  },
  {
    id: "actions",
    title: "Actions",
    icon: Zap,
    disabled: false,
  },
  {
    id: "deprecated",
    title: "Deprecated",
    icon: X,
    disabled: false,
  },
] satisfies {
  id: PipeCategory | null;
  title: string;
  icon: ComponentType;
  disabled: boolean;
}[];

type FilterColumn = "tags" | "providers" | "inputFields" | "outputFields";

const filterSections: { key: FilterColumn; label: string }[] = [
  { key: "tags", label: "Tags" },
  { key: "providers", label: "Providers" },
  { key: "inputFields", label: "Input Fields" },
  { key: "outputFields", label: "Output Fields" },
];

export function PipeCatalogIndex() {
  const {
    category,
    filterByField,
    globalFilterInput,
    isFilterChecked,
    setCategory,
    setGlobalFilterInput,
    table,
    showFeaturedPipes,
    sidebar: {
      addColumnFilter,
      removeColumnFilter,
      sortedInputFieldEntries,
      sortedOutputFieldEntries,
      sortedProviderEntries,
      sortedTagEntries,
    },
  } = usePipeCatalogTable();

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
      case "inputFields":
        return sortedInputFieldEntries;
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
        <div className="flex items-baseline justify-between">
          <H1>Pipe Catalog</H1>
          <Link
            href={appInfo.links.requestPipe}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Button size="sm" variant="link">
              Request a pipe <ExternalLink />
            </Button>
          </Link>
        </div>
        <p className="text-lg text-muted-foreground">
          Use pipes to find email addresses, phone number, or to trigger
          automations like slack messages. Pipes are composable enrichment
          functions.
        </p>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search pipes..."
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
                  <ArrowUp className="h-3 w-3 rotate-[-90deg]" />
                  <span>
                    {
                      filterSections.find((s) => s.key === activeFilterSection)
                        ?.label
                    }
                  </span>
                </button>
                <div className="max-h-[280px] overflow-y-auto px-1 py-1">
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
      {showFeaturedPipes && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Featured</h2>
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {FEATURED_PIPE_IDS.map((pipeId) => {
              return (
                <IntegrationCard
                  key={pipeId}
                  tableEntry={{
                    ...(pipeCatalog[pipeId] as PipeCatalogEntry),
                    latestVersion: getPipeVersion(pipeId),
                  }}
                  filterByField={filterByField}
                />
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {showFeaturedPipes && <h2 className="text-2xl font-bold">All pipes</h2>}
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {rows.map((row) => {
            return (
              <IntegrationCard
                key={row.original.pipeId}
                tableEntry={row.original as any}
                filterByField={filterByField}
              />
            );
          })}
        </div>

        {/* Empty state */}
        {rows.length === 0 && (
          <div className="flex h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No pipes found. Try adjusting your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
