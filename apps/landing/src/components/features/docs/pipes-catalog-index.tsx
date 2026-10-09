"use client";

import { CatalogBanner } from "@/components/features/pipe-catalog/catalog-banner";
import { ConditionalWrapper } from "@/components/conditional-wrapper";
import {
  CatalogFieldList,
  CatalogListRow,
  ProviderTileStrip,
} from "@/components/features/pipe-catalog/catalog-list-row";
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
import { PIPE_CATEGORY_COLORS } from "@/lib/pipes/category-colors";
import { getPipeDocsURI } from "@/lib/pipes/get-pipe-docs-uri";
import { getPipeLowestPrice } from "@/lib/pipes/get-pipe-starting-price";
import { getPipeProvidersInWaterfallOrder } from "@/lib/pipes/provider-order";
import { cn, copyToClipboard, formatCredits } from "@/lib/utils";
import {
  getDefaultOutputFields,
  getPipeVersion,
  pipeCatalog,
  PipeCatalogEntry,
  PipeCategory,
  PipeEntryWithLatestVersion,
  PipeId,
  Requirement,
  requirementToInputFields,
  sortPipeCatalogByBasePipe,
} from "@pipe0/base";
import {
  type PipeCardData,
  PipeCatalog,
  PipeCatalogActiveFilters,
  PipeCatalogCategoryFilter,
  PipeCatalogEmpty,
  PipeCatalogInputFieldFilter,
  PipeCatalogList,
  PipeCatalogOutputFieldFilter,
  PipeCatalogProviderFilter,
  PipeCatalogSearchFilter,
  usePipeCatalogContext,
  usePipeCatalogTable,
} from "@pipe0/react";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  Copy,
  Search,
  X,
  Zap,
  Archive,
  type LucideIcon,
  Wrench,
  Building2,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useIntentPrefetch } from "@/hooks/use-intent-prefetch";
import { type ComponentType, type ReactNode, useMemo } from "react";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
});

const FEATURED_PIPE_IDS = [
  "person:mobile:profileurl:waterfall@1",
  "person:workemail:profileurl:waterfall@1",
  "company:identity:crustdata@1",
  "company:newssummary:domain@1",
  "company:overview@3",
] satisfies PipeId[];

const FEATURED_PIPE_ID_SET = new Set<string>(FEATURED_PIPE_IDS);

// Walks the requirement tree to flatten input fields and mark which are required.
// Required = reachable through "all"/"field" only. "any" branches are at-least-one,
// "optional" branches are not required. Dedupes by name (required wins).
function getInputFieldsWithRequired(
  req: Requirement | null | undefined,
): { name: string; required: boolean }[] {
  if (!req) return [];
  const map = new Map<string, boolean>();
  function walk(node: Requirement, parentRequired: boolean) {
    switch (node.kind) {
      case "field": {
        const n = node.field.resolvedName;
        map.set(n, (map.get(n) ?? false) || parentRequired);
        break;
      }
      case "all":
        node.of.forEach((c) => walk(c, parentRequired));
        break;
      case "any":
        node.of.forEach((c) => walk(c, false));
        break;
      case "optional": {
        const n = node.field.resolvedName;
        if (!map.has(n)) map.set(n, false);
        break;
      }
    }
  }
  walk(req, true);
  return Array.from(map, ([name, required]) => ({ name, required }));
}

type CategoryOption = {
  id: PipeCategory | null;
  title: string;
  color?: string;
  /** Category glyph, drawn in the category colour (replaces the dot). */
  icon?: LucideIcon;
  disabled: boolean;
};

const quickStartOptions: CategoryOption[] = [
  { id: null, title: "All", disabled: false },
  {
    id: "people_data",
    title: "People",
    color: PIPE_CATEGORY_COLORS.people_data,
    icon: UserRound,
    disabled: false,
  },
  {
    id: "company_data",
    title: "Company",
    color: PIPE_CATEGORY_COLORS.company_data,
    icon: Building2,
    disabled: false,
  },
  {
    id: "tools",
    title: "Tools",
    color: PIPE_CATEGORY_COLORS.tools,
    icon: Wrench,
    disabled: false,
  },
  {
    id: "actions",
    title: "Actions",
    color: PIPE_CATEGORY_COLORS.actions,
    icon: Zap,
    disabled: false,
  },
  {
    id: "deprecated",
    title: "Deprecated",
    color: PIPE_CATEGORY_COLORS.deprecated,
    icon: Archive,
    disabled: false,
  },
];

// Categories that group the non-featured list view.
const GROUP_CATEGORIES: { id: PipeCategory; title: string }[] = [
  { id: "people_data", title: "People Data" },
  { id: "company_data", title: "Company Data" },
  { id: "tools", title: "Tools" },
  { id: "actions", title: "Actions" },
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
  value: PipeCategory | null;
  setValue: (v: PipeCategory | null) => void;
}) {
  // Counts per category, derived from the latest version of each base pipe.
  // Stable across other filter changes (matches today's behavior).
  const categoryCounts = useMemo(() => {
    const counts: Partial<Record<"all" | PipeCategory, number>> = {};
    let allCount = 0;
    const byBasePipe = sortPipeCatalogByBasePipe();
    for (const versions of Object.values(byBasePipe)) {
      const latest = versions[0];
      if (!latest) continue;
      const entry = pipeCatalog[latest.pipeId] as PipeCatalogEntry | undefined;
      const cats = (entry?.categories ?? []) as PipeCategory[];
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
  const { resetFilters } = usePipeCatalogContext();
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

const PipeCard = ({
  tableEntry,
}: {
  tableEntry: PipeEntryWithLatestVersion;
}) => {
  const { addColumnFilter } = usePipeCatalogContext();
  const pipeId = tableEntry.pipeId;
  const { lowest: pipeStartingPrice, isDiscounted } = useMemo(
    () => getPipeLowestPrice(pipeId),
    [pipeId],
  );

  const isNew = (tableEntry.tags as string[]).includes("new");
  const providers = getPipeProvidersInWaterfallOrder(pipeId);
  const href = getPipeDocsURI(pipeId);
  const intentPrefetch = useIntentPrefetch(href);

  return (
    <Link href={href} {...intentPrefetch}>
      <Card className="relative flex h-full min-h-[230px] flex-col justify-stretch border-[var(--rule)] transition-colors hover:border-[var(--rule-strong)] hover:bg-[var(--well)]">
        <CardHeader className="pb-1.5">
          <div className="flex items-start justify-between gap-3">
            <CardTitle
              className={cn(
                "flex min-w-0 items-center gap-2 text-[15px] font-medium leading-snug tracking-[-0.01em]",
                tableEntry.lifecycle?.deprecatedOn && "line-through",
              )}
            >
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
            <span className="shrink-0 pt-0.5 text-[12.5px] tabular-nums text-muted-foreground">
              {pipeStartingPrice
                ? `${isDiscounted ? "from " : ""}${formatCredits(pipeStartingPrice)} cr`
                : "Free"}
            </span>
          </div>
        </CardHeader>
        <CardContent className="grow text-[13.5px] leading-relaxed text-muted-foreground">
          {tableEntry.lifecycle?.replacedBy && (
            <Alert variant="destructive" className="py-1 px-2 mb-2">
              <AlertTitle>
                Deprecated by{" "}
                {dateFormatter.format(
                  new Date(tableEntry.lifecycle.deprecatedOn || ""),
                )}
              </AlertTitle>
              <AlertDescription>
                Use: {tableEntry.lifecycle.replacedBy}
              </AlertDescription>
            </Alert>
          )}
          <p className="line-clamp-3">{tableEntry.description}</p>
        </CardContent>
        <CardFooter className="flex flex-col items-stretch gap-2.5 px-6 pb-3 pt-0">
          <div className="-mr-6 py-1">
            <ProviderTileStrip providers={providers} />
          </div>
          <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
            <span className="truncate">{pipeId}</span>
            <Button
              size="icon"
              className="size-5 shrink-0"
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
            <div className="flex gap-1 items-center -mx-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-muted-foreground text-xs hover:text-foreground h-7 px-2"
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
                    {tableEntry.defaultInputRequirement &&
                      requirementToInputFields(
                        tableEntry.defaultInputRequirement,
                      ).map((field) => (
                        <DropdownMenuItem
                          className="py-1 cursor-pointer block text-muted-foreground hover:text-foreground"
                          key={field.name}
                          onClick={() =>
                            addColumnFilter("outputFields", field.name)
                          }
                        >
                          {field.name}
                        </DropdownMenuItem>
                      ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
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
                    {getDefaultOutputFields(tableEntry).map((field) => (
                      <DropdownMenuItem
                        key={field}
                        className="py-1 cursor-pointer block text-muted-foreground hover:text-foreground"
                        onClick={() => addColumnFilter("inputFields", field)}
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

function Featured() {
  const { category, globalFilterInput, table } = usePipeCatalogContext();
  const showFeatured =
    category === null &&
    globalFilterInput === "" &&
    table.state.columnFilters.length === 0;

  const featuredEntries = useMemo(() => {
    return FEATURED_PIPE_IDS.map((pipeId) => {
      const entry = pipeCatalog[pipeId] as PipeCatalogEntry | undefined;
      if (!entry) return null;
      return {
        ...entry,
        latestVersion: getPipeVersion(pipeId),
      } as PipeEntryWithLatestVersion;
    }).filter((e): e is PipeEntryWithLatestVersion => e !== null);
  }, []);

  if (!showFeatured || featuredEntries.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-baseline gap-2">
        <h2 className="text-lg font-semibold tracking-tight">Featured</h2>
        <span className="text-xs text-muted-foreground">
          · Most-used pipes.
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {featuredEntries.map((entry) => (
          <PipeCard key={entry.pipeId} tableEntry={entry} />
        ))}
      </div>
    </div>
  );
}

// Single catalog row, shared by the grouped browse view and the flat
// search/filter results view so both render identically.
function CatalogRow({ card }: { card: PipeCardData }) {
  const entry = card.entry;
  const providers = getPipeProvidersInWaterfallOrder(card.pipeId);
  const { lowest: credits, isDiscounted } = getPipeLowestPrice(card.pipeId);
  const isNew = (entry.tags as string[]).includes("new");
  const inputFields: CatalogFieldList =
    entry.inputFieldMode === "static"
      ? getInputFieldsWithRequired(entry.defaultInputRequirement)
      : "dynamic";
  const outputFields: CatalogFieldList =
    entry.outputFieldMode === "static"
      ? getDefaultOutputFields(entry).map((name) => ({ name }))
      : "dynamic";
  return (
    <CatalogListRow
      href={getPipeDocsURI(card.pipeId)}
      label={card.label}
      entryId={card.pipeId}
      description={card.description}
      providers={providers}
      inputFields={inputFields}
      outputFields={outputFields}
      credits={credits}
      priceFrom={isDiscounted}
      isNew={isNew}
      isDeprecated={!!entry.lifecycle?.deprecatedOn}
    />
  );
}

function GroupedList({ cards }: { cards: ReadonlyArray<PipeCardData> }) {
  const { category, globalFilterInput, table } = usePipeCatalogContext();
  const columnFilters = table.state.columnFilters;
  // When a search query, category, or column filter is active, the hook has
  // already scored and ordered `cards` by relevance. Re-bucketing them by
  // category here scatters the top hits under unrelated headers, so we render
  // a single flat list in the given order whenever a filter is active and only
  // fall back to the category-grouped browse view when nothing is set.
  const isFiltering =
    category !== null || globalFilterInput !== "" || columnFilters.length > 0;

  // Featured pipes render in the section above only in the browse view.
  const visible = useMemo(
    () =>
      isFiltering
        ? cards
        : cards.filter((c) => !FEATURED_PIPE_ID_SET.has(c.pipeId)),
    [cards, isFiltering],
  );

  // Each pipe is placed in the first matching category (deprecated last).
  const groupedRows = useMemo(() => {
    const seen = new Set<string>();
    const groups: {
      category: PipeCategory;
      entries: PipeCardData[];
    }[] = [];
    for (const cat of GROUP_CATEGORIES) {
      const entries: PipeCardData[] = [];
      for (const card of visible) {
        if (seen.has(card.pipeId)) continue;
        const cats = (card.latestEntry.categories ?? []) as PipeCategory[];
        if (cats.includes(cat.id)) {
          entries.push(card);
          seen.add(card.pipeId);
        }
      }
      if (entries.length > 0) groups.push({ category: cat.id, entries });
    }
    // Anything that didn't match a known category joins the "tools" group.
    // Merge into the existing tools group rather than pushing a second one,
    // which previously rendered a duplicate "Tools" heading.
    const leftovers = visible.filter((c) => !seen.has(c.pipeId));
    if (leftovers.length > 0) {
      const toolsGroup = groups.find((g) => g.category === "tools");
      if (toolsGroup) toolsGroup.entries.push(...leftovers);
      else
        groups.push({ category: "tools" as PipeCategory, entries: leftovers });
    }
    return groups;
  }, [visible]);

  // While searching or filtering, preserve relevance order as one flat list.
  if (isFiltering) {
    return (
      <div>
        {visible.map((card) => (
          <CatalogRow key={card.pipeId} card={card} />
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
                <CatalogRow key={card.pipeId} card={card} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export function PipeCatalogIndex() {
  const ctx = usePipeCatalogTable();

  return (
    <PipeCatalog
      context={ctx}
      className="space-y-5 mx-auto min-w-0 max-w-full"
    >
      <CatalogBanner
        title="Pipe catalog"
        description="Pipes enrich rows: work emails, mobile numbers, company data, AI steps, and actions like CRM writes or Slack messages. Each one composes with the rest."
        image="/media/website/illustrations/catalog.png"
        requestHref={appInfo.links.requestPipe}
        requestLabel="Request a pipe"
      />

      {/* Toolbar: search and the field filters on one line, categories as
          tabs underneath — one framed control instead of three loose rows. */}
      <div className="overflow-hidden rounded-[12px] border border-[var(--rule)] bg-background">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="min-w-0 flex-1">
            <PipeCatalogSearchFilter
              render={(_, { value, setValue }) => (
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search pipes by name, field, or provider"
                    className="h-12 w-full rounded-none border-0 bg-transparent pl-11 text-[15px] shadow-none focus-visible:ring-0"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  />
                </div>
              )}
            />
          </div>
          <div className="flex flex-wrap items-center gap-1 border-t border-[var(--rule)] px-2 py-1.5 md:border-l md:border-t-0">
              <PipeCatalogProviderFilter
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

              <PipeCatalogInputFieldFilter
                render={(_, { value, setValue, options }) => (
                  <DocsFilterDropdown
                    defaultLabel="Input fields"
                        value={value}
                    setValue={setValue}
                    options={options}
                    renderItem={(option) => (
                      <span className="truncate">{option.label}</span>
                    )}
                  />
                )}
              />

              <PipeCatalogOutputFieldFilter
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
          <PipeCatalogCategoryFilter
            render={(_, { value, setValue }) => (
              <DocsCategoryButtons value={value} setValue={setValue} />
            )}
          />
        </div>
      </div>

      {/* Active filter pills */}
      <PipeCatalogActiveFilters
        render={(_, { activeFilters }) => (
          <DocsActiveFiltersStrip filters={activeFilters} />
        )}
      />

      {/* Featured section */}
      <Featured />

      {/* Grouped list view */}
      <PipeCatalogList
        render={(_, { cards }) => <GroupedList cards={cards} />}
      />

      {/* Empty state */}
      <PipeCatalogEmpty
        render={() => (
          <div className="flex h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No pipes found. Try adjusting your filters.
            </p>
          </div>
        )}
      />
    </PipeCatalog>
  );
}
