"use client";

import { ConditionalWrapper } from "@/components/conditional-wrapper";
import {
  CatalogFieldList,
  CatalogListRow,
} from "@/components/features/pipe-catalog/catalog-list-row";
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
import { getPipeStartingPrice } from "@/lib/pipes/get-pipe-starting-price";
import { cn, copyToClipboard } from "@/lib/utils";
import {
  getDefaultOutputFields,
  getDefaultPipeProviders,
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
  AvatarGroup,
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
  PricingBadge,
  usePipeCatalogContext,
  usePipeCatalogTable,
} from "@pipe0/react";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  Copy,
  ExternalLink,
  Search,
  X,
} from "lucide-react";
import Link from "next/link";
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
  disabled: boolean;
};

const quickStartOptions: CategoryOption[] = [
  { id: null, title: "All", disabled: false },
  {
    id: "people_data",
    title: "People",
    color: PIPE_CATEGORY_COLORS.people_data,
    disabled: false,
  },
  {
    id: "company_data",
    title: "Company",
    color: PIPE_CATEGORY_COLORS.company_data,
    disabled: false,
  },
  {
    id: "tools",
    title: "Tools",
    color: PIPE_CATEGORY_COLORS.tools,
    disabled: false,
  },
  {
    id: "actions",
    title: "Actions",
    color: PIPE_CATEGORY_COLORS.actions,
    disabled: false,
  },
  {
    id: "deprecated",
    title: "Deprecated",
    color: PIPE_CATEGORY_COLORS.deprecated,
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
  const pipeStartingPrice = useMemo(
    () => getPipeStartingPrice(pipeId),
    [pipeId],
  );

  const isNew = (tableEntry.tags as string[]).includes("new");
  const providers = getDefaultPipeProviders(pipeId);

  return (
    <Link href={getPipeDocsURI(pipeId)}>
      <Card className="flex flex-col justify-stretch border-input hover:border-primary/50 transition-colors relative h-full min-h-[230px]">
        <span className="absolute right-3 top-3 inline-flex gap-1 text-muted-foreground text-xs items-center">
          {pipeStartingPrice ? (
            <PricingBadge credits={pipeStartingPrice} />
          ) : (
            "Free"
          )}
        </span>
        <CardHeader className="pb-1.5">
          <div className="flex items-start gap-3">
            <AvatarGroup providers={providers} size="sm" />
            <div className="min-w-0 pr-12">
              <CardTitle
                className={cn(
                  "text-sm font-semibold leading-tight flex items-center gap-2",
                  tableEntry.lifecycle?.deprecatedOn && "line-through",
                )}
              >
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
        <CardFooter className="pt-0 pb-3 px-4 flex flex-col items-stretch gap-2">
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
            <span className="font-mono break-all truncate">{pipeId}</span>
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
    table.getState().columnFilters.length === 0;

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

function GroupedList({ cards }: { cards: ReadonlyArray<PipeCardData> }) {
  const { category, globalFilterInput, table } = usePipeCatalogContext();
  // Featured pipes render in the section above only when no filter is active.
  // When a filter is active, surface them inside the grouped list so they
  // don't disappear from the catalog entirely.
  const featuredShown =
    category === null &&
    globalFilterInput === "" &&
    table.getState().columnFilters.length === 0;

  const visible = useMemo(
    () =>
      featuredShown
        ? cards.filter((c) => !FEATURED_PIPE_ID_SET.has(c.pipeId))
        : cards,
    [cards, featuredShown],
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
    // Anything that didn't match a known category lands under "Other" → tools bucket.
    const leftovers = visible.filter((c) => !seen.has(c.pipeId));
    if (leftovers.length > 0) {
      groups.push({ category: "tools" as PipeCategory, entries: leftovers });
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
                const providers = getDefaultPipeProviders(card.pipeId);
                const credits = getPipeStartingPrice(card.pipeId);
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
                    key={card.pipeId}
                    href={getPipeDocsURI(card.pipeId)}
                    label={card.label}
                    entryId={card.pipeId}
                    description={card.description}
                    providers={providers}
                    inputFields={inputFields}
                    outputFields={outputFields}
                    credits={credits}
                    isNew={isNew}
                    isDeprecated={!!entry.lifecycle?.deprecatedOn}
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

export function PipeCatalogIndex() {
  const ctx = usePipeCatalogTable();

  return (
    <PipeCatalog
      context={ctx}
      className="space-y-5 mx-auto min-w-0 max-w-full"
    >
      {/* Header */}
      <div className="space-y-2 min-w-0">
        <div className="flex items-baseline justify-between gap-4">
          <H1 className="pb-0">Pipe Catalog</H1>
          <Link
            href={appInfo.links.requestPipe}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Button size="sm" variant="link">
              Request a pipe <ExternalLink />
            </Button>
          </Link>
        </div>
        <p className="text-sm text-muted-foreground max-w-3xl">
          Use pipes to find email addresses, phone numbers, or to trigger
          automations like Slack messages. Pipes are composable enrichment
          functions.
        </p>
      </div>

      {/* Search bar */}
      <PipeCatalogSearchFilter
        render={(_, { value, setValue }) => (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search pipes..."
              className="w-full pl-9 h-10"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
        )}
      />

      {/* Filters cluster: categories + provider/input/output quick filters */}
      <div className="space-y-2">
        <PipeCatalogCategoryFilter
          render={(_, { value, setValue }) => (
            <DocsCategoryButtons value={value} setValue={setValue} />
          )}
        />

        <div className="flex items-center gap-1.5 flex-wrap">
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
                leadingIcon={<ArrowUp className="size-3.5" />}
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
