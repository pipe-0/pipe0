"use client";

import { CatalogBanner } from "@/components/features/pipe-catalog/catalog-banner";
import { ConditionalWrapper } from "@/components/conditional-wrapper";
import {
  ProviderTileStrip,
  CatalogFieldList,
  CatalogListRow,
} from "@/components/features/pipe-catalog/catalog-list-row";
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
import { hasHighVolume, lowestManagedCredit } from "@/lib/pricing/high-volume";
import {
  isUsageMeteredSearch,
  USAGE_METERED_LABEL,
} from "@/lib/pricing/usage-metered";
import { cn, copyToClipboard, formatCredits } from "@/lib/utils";
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
  Search,
  X,
  Archive,
  type LucideIcon,
  Database,
  Building2,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useIntentPrefetch } from "@/hooks/use-intent-prefetch";
import { type ComponentType, type ReactNode, useMemo } from "react";

const FEATURED_SEARCHES_IDS = [] satisfies SearchId[];
const FEATURED_SEARCHES_ID_SET = new Set<string>(FEATURED_SEARCHES_IDS);

function getSearchCost(entry: SearchCatalogTableData): {
  lowest: number;
  isDiscounted: boolean;
} {
  const credits = entry.cost.credits;
  const base = credits?.default ?? 0;
  if (!credits || !hasHighVolume(credits)) {
    return { lowest: base, isDiscounted: false };
  }
  const lowest = lowestManagedCredit(credits);
  return { lowest, isDiscounted: lowest < base };
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
  /** Category glyph, drawn in the category colour (replaces the dot). */
  icon?: LucideIcon;
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
    icon: Building2,
    disabled: false,
  },
  {
    id: "people",
    title: "People",
    color: SEARCH_CATEGORY_COLORS.people,
    icon: UserRound,
    disabled: false,
  },
  {
    id: "data",
    title: "Data",
    color: SEARCH_CATEGORY_COLORS.data,
    icon: Database,
    disabled: false,
  },
  {
    id: "deprecated",
    title: "Deprecated",
    color: SEARCH_CATEGORY_COLORS.deprecated,
    icon: Archive,
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
            "inline-flex h-8 max-w-[220px] items-center gap-1.5 rounded-[7px] px-2.5 text-[13.5px] transition-colors",
            value
              ? "bg-primary/[0.07] font-medium text-primary"
              : "text-muted-foreground hover:bg-[var(--well)] hover:text-foreground",
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
    <div className="flex flex-wrap items-center gap-1">
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
                "inline-flex h-8 items-center gap-1.5 rounded-[7px] border border-transparent px-3 text-[13.5px] transition-colors",
                option.id === "deprecated" && !isActive && "opacity-60",
                isActive
                  ? "btn-glossy font-medium text-white [&_[data-count]]:text-white/75 "
                  : "text-foreground hover:bg-background",
                "data-[disabled=true]:opacity-50 data-[disabled=true]:pointer-events-none",
              )}
              onClick={() => setValue(option.id)}
            >
              {option.icon && (
                <option.icon
                  data-dot
                  className="size-3.5 shrink-0"
                  style={{ color: isActive ? "white" : option.color }}
                  strokeWidth={2.2}
                  aria-hidden
                />
              )}
              {option.id === "deprecated" ? <s>{option.title}</s> : option.title}
              {typeof count === "number" && count > 0 && (
                <span
                  data-count
                  className="text-[12px] tabular-nums text-muted-foreground"
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
  const { lowest: cost, isDiscounted } = getSearchCost(tableEntry);
  const href = getSearchDocsURI(searchId);
  const intentPrefetch = useIntentPrefetch(href);

  return (
    <Link href={href} {...intentPrefetch}>
      <Card className="relative flex h-full min-h-[230px] flex-col justify-stretch border-[var(--rule)] transition-colors hover:border-[var(--rule-strong)] hover:bg-[var(--well)]">
        <span className="absolute right-3 top-3 inline-flex gap-1 text-muted-foreground text-xs items-center">
          {/* A usage-metered search prices variable work (model tokens, per-call
              provider tools), so `cost.credits.default` is 0 and reading it here
              printed "Free" for a search that bills real credits. There is no
              single per-unit number to show — the detail page breaks it down. */}
          {isUsageMeteredSearch(tableEntry) ? (
            <span>{USAGE_METERED_LABEL}</span>
          ) : (
            <>
              {cost ? (
                <span>
                  {isDiscounted ? "from " : ""}
                  {formatCredits(cost)} cr
                </span>
              ) : (
                "Free"
              )}
              {cost ? (
                <span className="text-muted-foreground/70">
                  / {getSearchUnit(tableEntry)}
                </span>
              ) : null}
            </>
          )}
        </span>
        <CardHeader className="pb-1.5">
          <div className="flex items-start gap-3">
            <div className="min-w-0 pr-24">
              <CardTitle className="flex items-center gap-2 text-[15px] font-medium leading-snug tracking-[-0.01em]">
                <span className="truncate">{tableEntry.label}</span>
                {isNew && (
                  <Badge
                    variant="default"
                    className="shrink-0 bg-primary px-1.5 py-0 text-[10px] leading-none text-white"
                  >
                    New
                  </Badge>
                )}
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grow text-[13.5px] leading-relaxed text-muted-foreground">
          <p className="line-clamp-3">{tableEntry.description}</p>
        </CardContent>
        <CardFooter className="flex flex-col items-stretch gap-2.5 px-6 pb-3 pt-0">
          <div className="-mr-6 py-1">
            <ProviderTileStrip providers={[tableEntry.provider]} />
          </div>
          <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
            <span className="truncate">{searchId}</span>
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
    table.state.columnFilters.length === 0;

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

// Single catalog row, shared by the grouped browse view and the flat
// search/filter results view so both render identically.
function CatalogRow({ card }: { card: SearchCardData }) {
  const entry = card.entry;
  const { lowest: credits, isDiscounted } = getSearchCost(entry);
  const isNew = (entry.tags as string[]).includes("new");
  const outputFields: CatalogFieldList = getDefaultSearchOutputFields(
    card.searchId,
  ).map((name) => ({ name }));
  return (
    <CatalogListRow
      href={getSearchDocsURI(card.searchId)}
      label={card.label}
      entryId={card.searchId}
      description={card.description}
      providers={[card.provider]}
      outputFields={outputFields}
      credits={credits}
      priceLabel={
        isUsageMeteredSearch(entry) ? USAGE_METERED_LABEL : undefined
      }
      priceFrom={isDiscounted}
      billableUnit={getSearchUnit(entry)}
      isNew={isNew}
      isDeprecated={!!entry.lifecycle?.deprecatedOn}
    />
  );
}

function GroupedList({ cards }: { cards: ReadonlyArray<SearchCardData> }) {
  const { category, globalFilterInput, table } = useSearchCatalogContext();
  const columnFilters = table.state.columnFilters;
  // When a search query, category, or column filter is active, the hook has
  // already scored and ordered `cards` by relevance. Re-bucketing them by
  // category here scatters the top hits under unrelated headers, so we render
  // a single flat list in the given order whenever a filter is active and only
  // fall back to the category-grouped browse view when nothing is set.
  const isFiltering =
    category !== null || globalFilterInput !== "" || columnFilters.length > 0;

  const visible = useMemo(
    () =>
      isFiltering
        ? cards
        : cards.filter((c) => !FEATURED_SEARCHES_ID_SET.has(c.searchId)),
    [cards, isFiltering],
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
    // Anything that didn't match a known category joins the "companies" group.
    // Merge into the existing group rather than pushing a second one, which
    // previously rendered a duplicate "Find Companies" heading.
    const leftovers = visible.filter((c) => !seen.has(c.searchId));
    if (leftovers.length > 0) {
      const companiesGroup = groups.find((g) => g.category === "companies");
      if (companiesGroup) companiesGroup.entries.push(...leftovers);
      else
        groups.push({
          category: "companies" as SearchCategory,
          entries: leftovers,
        });
    }
    return groups;
  }, [visible]);

  // While searching or filtering, preserve relevance order as one flat list.
  if (isFiltering) {
    return (
      <div>
        {visible.map((card) => (
          <CatalogRow key={card.searchId} card={card} />
        ))}
      </div>
    );
  }

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
              {entries.map((card) => (
                <CatalogRow key={card.searchId} card={card} />
              ))}
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
      <CatalogBanner
        title="Search catalog"
        description="Searches create rows from prospecting datasets and the systems you already run. Combine several in one request and deduplicate the results."
        image="/media/website/illustrations/search.png"
        requestHref={appInfo.links.requestPipe}
        requestLabel="Request a search"
      />

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

      {/* Toolbar: search and the field filters on one line, categories as
          tabs underneath — one framed control instead of three loose rows. */}
      <div className="overflow-hidden rounded-[12px] border border-[var(--rule)] bg-background">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="min-w-0 flex-1">
            <SearchCatalogSearchFilter
              render={(_, { value, setValue }) => (
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by name, field, or provider"
                    className="h-12 w-full rounded-none border-0 bg-transparent pl-11 text-[15px] shadow-none focus-visible:ring-0"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  />
                </div>
              )}
            />
          </div>
          <div className="flex flex-wrap items-center gap-1 border-t border-[var(--rule)] px-2 py-1.5 md:border-l md:border-t-0">
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
        <div className="border-t border-[var(--rule)] bg-[var(--well)] px-2 py-1.5">
          <SearchCatalogCategoryFilter
            render={(_, { value, setValue }) => (
              <DocsCategoryButtons value={value} setValue={setValue} />
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
