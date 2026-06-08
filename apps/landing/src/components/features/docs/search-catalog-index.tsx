"use client";

import { ConditionalWrapper } from "@/components/conditional-wrapper";
import {
  CatalogFieldList,
  CatalogListRow,
} from "@/components/features/pipe-catalog/catalog-list-row";
import { H1 } from "@/components/headings";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { appInfo } from "@/lib/const";
import { SearchEntryMap } from "@/lib/get-searches";
import { getSearchDocsURI } from "@/lib/search/get-search-docs-uri";
import { cn, copyToClipboard } from "@/lib/utils";
import {
  getDefaultSearchOutputFields,
  getSearchEntry,
  getSearchVersion,
  searchCatalog,
  SearchCatalogEntry,
  SearchCatalogTableData,
  SearchCategory,
  SearchId,
  sortSearchCatalogByBaseSearch,
} from "@pipe0/base";
import {
  AvatarGroup,
  PricingBadge,
  type SearchCardData,
  SearchCatalog,
  SearchCatalogActiveFilters,
  SearchCatalogCategoryFilter,
  SearchCatalogEmpty,
  SearchCatalogList,
  SearchCatalogOutputFieldFilter,
  SearchCatalogProviderFilter,
  SearchCatalogSearchFilter,
  useSearchCatalogContext,
  useSearchCatalogTable,
} from "@pipe0/react";
import { Callout } from "fumadocs-ui/components/callout";
import {
  ArrowDown,
  ChevronDown,
  Copy,
  ExternalLink,
  Search,
  X,
} from "lucide-react";
import Link from "next/link";
import { type ComponentType, type ReactNode, useMemo } from "react";

const FEATURED_SEARCHES_IDS = [] satisfies SearchId[];
const FEATURED_SEARCHES_ID_SET = new Set<string>(FEATURED_SEARCHES_IDS);

function getSearchCost(entry: SearchCatalogTableData): number {
  return entry.cost.credits?.default || 0;
}

function getSearchUnit(entry: SearchCatalogTableData): string {
  if (entry.cost.mode === "per_result") return "result";
  if (entry.cost.mode === "per_search") return "search";
  return "page";
}

type CategoryOption = {
  id: SearchCategory | null;
  title: string;
  color?: string;
  disabled: boolean;
};

// Search category colors mirror the catalog used in the related app.
const SEARCH_CATEGORY_COLORS: Record<SearchCategory, string> = {
  people: "#8B7DFF",
  companies: "#10B981",
  data: "#F59E0B",
  deprecated: "#94A3B8",
};

const quickStartOptions: CategoryOption[] = [
  { id: null, title: "All", disabled: false },
  {
    id: "companies",
    title: "Companies",
    color: SEARCH_CATEGORY_COLORS.companies,
    disabled: false,
  },
  {
    id: "people",
    title: "People",
    color: SEARCH_CATEGORY_COLORS.people,
    disabled: false,
  },
  {
    id: "data",
    title: "Data",
    color: SEARCH_CATEGORY_COLORS.data,
    disabled: false,
  },
  {
    id: "deprecated",
    title: "Deprecated",
    color: SEARCH_CATEGORY_COLORS.deprecated,
    disabled: false,
  },
];

const GROUP_CATEGORIES: { id: SearchCategory; title: string }[] = [
  { id: "companies", title: "Find Companies" },
  { id: "people", title: "Find People" },
  { id: "data", title: "Data" },
  { id: "deprecated", title: "Deprecated" },
];

// Render-prop option type used by the headless filter components.
type FilterOption = {
  label: ReactNode;
  value: string;
  icon?: ComponentType<{ className?: string }>;
  imageSrc?: string;
};

function DocsFilterDropdown({
  defaultLabel,
  leadingIcon,
  value,
  setValue,
  options,
  renderItem,
}: {
  defaultLabel: string;
  leadingIcon?: ReactNode;
  value: string;
  setValue: (v: string | null) => void;
  options: ReadonlyArray<FilterOption>;
  renderItem: (option: FilterOption) => ReactNode;
}) {
  const activeOption = value
    ? options.find((o) => o.value === value)
    : undefined;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md border transition-colors max-w-[220px]",
            value
              ? "border-primary text-primary bg-primary/5"
              : "border-input text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          {leadingIcon && (
            <span className="shrink-0 text-muted-foreground">{leadingIcon}</span>
          )}
          <span className="truncate text-left">
            {activeOption ? activeOption.label : defaultLabel}
          </span>
          <ChevronDown className="size-3 shrink-0 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="max-h-72 overflow-y-auto w-56"
      >
        {value && (
          <>
            <DropdownMenuItem className="pl-2" onClick={() => setValue(null)}>
              Clear
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        {options.map((option) => {
          const checked = option.value === value;
          return (
            <DropdownMenuItem
              key={option.value}
              className={cn(
                "pl-2",
                checked && "bg-primary/10 text-primary focus:bg-primary/15",
              )}
              onSelect={(e) => {
                e.preventDefault();
                if (checked) setValue(null);
                else setValue(option.value);
              }}
            >
              <span className="flex items-center gap-2 flex-1 min-w-0">
                {renderItem(option)}
              </span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function DocsCategoryButtons({
  value,
  setValue,
}: {
  value: SearchCategory | null;
  setValue: (v: SearchCategory | null) => void;
}) {
  // Counts per category, derived from the latest version of each base search.
  // Stable across other filter changes (matches today's behavior).
  const categoryCounts = useMemo(() => {
    const counts: Partial<Record<"all" | SearchCategory, number>> = {};
    let allCount = 0;
    const byBaseSearch = sortSearchCatalogByBaseSearch();
    for (const versions of Object.values(byBaseSearch)) {
      const latest = versions[0];
      if (!latest) continue;
      const entry = searchCatalog[latest.searchId] as
        | { categories?: readonly SearchCategory[] }
        | undefined;
      const cats = (entry?.categories ?? []) as SearchCategory[];
      const isDeprecated = cats.includes("deprecated");
      if (!isDeprecated) allCount += 1;
      for (const cat of cats) {
        counts[cat] = (counts[cat] ?? 0) + 1;
      }
    }
    counts.all = allCount;
    return counts;
  }, []);

  return (
    <div className="flex gap-1 flex-wrap items-center">
      {quickStartOptions.map((option) => {
        const isActive = value === option.id;
        const count =
          option.id === null ? categoryCounts.all : categoryCounts[option.id];
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
                "inline-flex items-center gap-1.5 px-2.5 py-1 text-sm rounded-md transition-colors",
                option.id === "deprecated" && !isActive && "opacity-60",
                isActive
                  ? "bg-foreground text-background font-medium"
                  : "text-foreground hover:bg-muted",
                "data-[disabled=true]:opacity-50 data-[disabled=true]:pointer-events-none",
              )}
              onClick={() => setValue(option.id)}
            >
              {option.color && (
                <span
                  className="size-2 rounded-full shrink-0"
                  style={{ backgroundColor: option.color }}
                  aria-hidden
                />
              )}
              {option.id === "deprecated" ? <s>{option.title}</s> : option.title}
              {typeof count === "number" && count > 0 && (
                <span
                  className={cn(
                    "tabular-nums text-xs",
                    isActive ? "text-background/70" : "text-muted-foreground",
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          </ConditionalWrapper>
        );
      })}
    </div>
  );
}

function DocsActiveFiltersStrip({
  filters,
}: {
  filters: ReadonlyArray<{
    id: string;
    value: string;
    label: string;
    remove: () => void;
  }>;
}) {
  const { resetFilters } = useSearchCatalogContext();
  if (filters.length === 0) return null;
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {filters.map((filter) => (
        <span
          key={filter.id}
          className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-md bg-primary/10 text-primary"
        >
          <span className="text-primary/60">{filter.label}:</span>
          {filter.value}
          <button
            onClick={filter.remove}
            className="ml-0.5 hover:text-primary/80"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <button
        onClick={resetFilters}
        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        Clear all
      </button>
    </div>
  );
}

const SearchCard = ({ tableEntry }: { tableEntry: SearchCatalogTableData }) => {
  const searchId = tableEntry.searchId;
  const isNew = (tableEntry.tags as string[]).includes("new");
  const cost = getSearchCost(tableEntry);

  return (
    <Link href={getSearchDocsURI(searchId)}>
      <Card className="flex flex-col justify-stretch border-input hover:border-primary/50 transition-colors relative h-full min-h-[230px]">
        <span className="absolute right-3 top-3 inline-flex gap-1 text-muted-foreground text-xs items-center">
          {cost ? <PricingBadge credits={cost} /> : "Free"}
          {cost ? (
            <span className="text-muted-foreground/70">
              / {getSearchUnit(tableEntry)}
            </span>
          ) : null}
        </span>
        <CardHeader className="pb-1.5">
          <div className="flex items-start gap-3">
            <AvatarGroup providers={[tableEntry.provider]} size="sm" />
            <div className="min-w-0 pr-12">
              <CardTitle className="text-sm font-semibold leading-tight flex items-center gap-2">
                <span className="truncate">{tableEntry.label}</span>
                {isNew && (
                  <Badge
                    variant="default"
                    className="text-[10px] px-1.5 py-0 leading-none bg-foreground text-background shrink-0"
                  >
                    New
                  </Badge>
                )}
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grow text-xs text-muted-foreground leading-relaxed">
          <p className="line-clamp-3">{tableEntry.description}</p>
        </CardContent>
        <CardFooter className="pt-0 pb-3 px-4 flex flex-col items-stretch gap-2">
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
            <span className="font-mono break-all truncate">{searchId}</span>
            <Button
              size="icon"
              className="size-5 shrink-0"
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
          <div className="flex gap-1 items-center -mx-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-muted-foreground text-xs hover:text-foreground h-7 px-2"
                >
                  <ArrowDown className="size-3" /> Outputs
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

function Featured({ searchEntryMap }: { searchEntryMap: SearchEntryMap }) {
  const { category, globalFilterInput, table } = useSearchCatalogContext();
  const showFeatured =
    category === null &&
    globalFilterInput === "" &&
    table.getState().columnFilters.length === 0;

  const featuredEntries = useMemo(() => {
    return FEATURED_SEARCHES_IDS.map((searchId) => {
      const searchEntry = searchEntryMap[searchId];
      if (!searchEntry) return null;
      return {
        ...getSearchEntry(searchId),
        searchId,
        latestVersion: getSearchVersion(searchId),
      } as unknown as SearchCatalogTableData;
    }).filter((e): e is SearchCatalogTableData => e !== null);
  }, [searchEntryMap]);

  if (!showFeatured || featuredEntries.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-baseline gap-2">
        <h2 className="text-lg font-semibold tracking-tight">Featured</h2>
        <span className="text-xs text-muted-foreground">
          · Most-used searches.
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {featuredEntries.map((entry) => (
          <SearchCard key={entry.searchId} tableEntry={entry} />
        ))}
      </div>
    </div>
  );
}

function GroupedList({ cards }: { cards: ReadonlyArray<SearchCardData> }) {
  const { category, globalFilterInput, table } = useSearchCatalogContext();
  const featuredShown =
    category === null &&
    globalFilterInput === "" &&
    table.getState().columnFilters.length === 0;

  const visible = useMemo(
    () =>
      featuredShown
        ? cards.filter((c) => !FEATURED_SEARCHES_ID_SET.has(c.searchId))
        : cards,
    [cards, featuredShown],
  );

  // Each search is placed in the first matching category (deprecated last).
  const groupedRows = useMemo(() => {
    const seen = new Set<string>();
    const groups: {
      category: SearchCategory;
      entries: SearchCardData[];
    }[] = [];
    for (const cat of GROUP_CATEGORIES) {
      const entries: SearchCardData[] = [];
      for (const card of visible) {
        if (seen.has(card.searchId)) continue;
        const cats = ((card.latestEntry as SearchCatalogEntry).categories ??
          []) as SearchCategory[];
        if (cats.includes(cat.id)) {
          entries.push(card);
          seen.add(card.searchId);
        }
      }
      if (entries.length > 0) groups.push({ category: cat.id, entries });
    }
    const leftovers = visible.filter((c) => !seen.has(c.searchId));
    if (leftovers.length > 0) {
      groups.push({
        category: "companies" as SearchCategory,
        entries: leftovers,
      });
    }
    return groups;
  }, [visible]);

  return (
    <div className="space-y-6">
      {groupedRows.map(({ category: catId, entries }) => {
        const meta = GROUP_CATEGORIES.find((c) => c.id === catId);
        if (!meta) return null;
        return (
          <section key={catId} className="space-y-2">
            <div className="flex items-baseline gap-2">
              <h2 className="text-lg font-semibold tracking-tight">
                {meta.title}
              </h2>
              <span className="text-xs text-muted-foreground tabular-nums">
                {entries.length}
              </span>
            </div>
            <div>
              {entries.map((card) => {
                const entry = card.entry;
                const credits = getSearchCost(entry);
                const isNew = (entry.tags as string[]).includes("new");
                const outputFields: CatalogFieldList =
                  getDefaultSearchOutputFields(card.searchId).map((name) => ({
                    name,
                  }));
                return (
                  <CatalogListRow
                    key={card.searchId}
                    href={getSearchDocsURI(card.searchId)}
                    label={card.label}
                    entryId={card.searchId}
                    description={card.description}
                    providers={[card.provider]}
                    outputFields={outputFields}
                    credits={credits}
                    billableUnit={getSearchUnit(entry)}
                    isNew={isNew}
                  />
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export function SearchCatalogIndex({
  searchEntryMap,
}: {
  searchEntryMap: SearchEntryMap;
}) {
  const ctx = useSearchCatalogTable();

  return (
    <SearchCatalog
      context={ctx}
      className="space-y-5 mx-auto min-w-0 max-w-full"
    >
      {/* Header */}
      <div className="space-y-2 min-w-0">
        <div className="flex items-baseline justify-between gap-4">
          <H1 className="pb-0">Search Catalog</H1>
          <Link
            href={appInfo.links.requestPipe}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Button size="sm" variant="link">
              Request a search <ExternalLink />
            </Button>
          </Link>
        </div>
        <p className="text-sm text-muted-foreground max-w-3xl">
          Searches give you access to datasets for finding leads and companies
          using various filters. You can combine multiple searches into one
          request and deduplicate the results.
        </p>
      </div>

      {/* Legacy docs callout */}
      <Callout type="info" title="Looking for the old search docs?">
        The legacy search endpoint documentation is still available at{" "}
        <a
          href="https://legacydocs.pipe0.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-medium"
        >
          legacydocs.pipe0.com
        </a>
        .
      </Callout>

      {/* Search bar */}
      <SearchCatalogSearchFilter
        render={(_, { value, setValue }) => (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full pl-9 h-10"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
        )}
      />

      {/* Filters cluster: categories + provider/output quick filters */}
      <div className="space-y-2">
        <SearchCatalogCategoryFilter
          render={(_, { value, setValue }) => (
            <DocsCategoryButtons value={value} setValue={setValue} />
          )}
        />

        <div className="flex items-center gap-1.5 flex-wrap">
          <SearchCatalogProviderFilter
            render={(_, { value, setValue, options }) => (
              <DocsFilterDropdown
                defaultLabel="Provider"
                value={value}
                setValue={setValue}
                options={options}
                renderItem={(option) => (
                  <>
                    {option.imageSrc && (
                      <img
                        src={option.imageSrc}
                        alt=""
                        className="size-4 shrink-0 rounded-sm"
                      />
                    )}
                    <span className="truncate">{option.label}</span>
                  </>
                )}
              />
            )}
          />

          <SearchCatalogOutputFieldFilter
            render={(_, { value, setValue, options }) => (
              <DocsFilterDropdown
                defaultLabel="Output fields"
                leadingIcon={<ArrowDown className="size-3.5" />}
                value={value}
                setValue={setValue}
                options={options}
                renderItem={(option) => (
                  <span className="truncate">{option.label}</span>
                )}
              />
            )}
          />
        </div>
      </div>

      {/* Active filter pills */}
      <SearchCatalogActiveFilters
        render={(_, { activeFilters }) => (
          <DocsActiveFiltersStrip filters={activeFilters} />
        )}
      />

      {/* Featured section */}
      <Featured searchEntryMap={searchEntryMap} />

      {/* Grouped list view */}
      <SearchCatalogList
        render={(_, { cards }) => <GroupedList cards={cards} />}
      />

      {/* Empty state */}
      <SearchCatalogEmpty
        render={() => (
          <div className="flex h-50 flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No searches found. Try adjusting your filters.
            </p>
          </div>
        )}
      />
    </SearchCatalog>
  );
}
