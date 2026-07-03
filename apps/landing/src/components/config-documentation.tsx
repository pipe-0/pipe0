"use client";

import { OptionsSection } from "@/components/config-documentation-options-section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  buildPopulatedExample,
  ExamplePayload,
  generateFieldExampleSnippet,
  optionsDefSummary,
} from "@/lib/docs/build-populated-example";
import { copyToClipboard } from "@/lib/utils";
import {
  FormSection,
  GeneratedInputMeta,
  GeneratedInputMetaMap,
  IconKey,
  inputGuards,
  RECORD_FIELD_FORMATS,
  RECORD_FIELD_TYPES,
  RUN_IF_OPERATOR_LABELS,
  RUN_IF_VALUE_OPERATORS,
} from "@pipe0/base";
import {
  Activity,
  Award,
  Bolt,
  Book,
  Box,
  Boxes,
  Braces,
  Brain,
  Briefcase,
  Building2,
  Calculator,
  Calendar,
  Check,
  Code,
  Contact,
  Copy,
  Download,
  ExternalLink,
  Factory,
  FileText,
  Filter,
  Globe,
  GraduationCap,
  Handshake,
  Hash,
  History,
  Languages,
  LineChart,
  Link as LinkIcon,
  Linkedin,
  List,
  ListOrdered,
  Mail,
  MapPin,
  Network,
  Plug,
  Search,
  Settings2,
  Sparkles,
  Star,
  Swords,
  Tag,
  ToggleLeft,
  Type,
  User,
  Workflow,
} from "lucide-react";
import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

const isNumericField = (
  field: GeneratedInputMeta,
): field is
  | GeneratedInputMetaMap["range_input"]
  | GeneratedInputMetaMap["int_input"]
  | GeneratedInputMetaMap["number_input"] =>
  inputGuards.range_input(field) ||
  inputGuards.int_input(field) ||
  inputGuards.number_input(field);

function FieldIcon({
  type,
  className,
}: {
  type: string;
  className?: string;
}) {
  switch (type) {
    case "include_exclude_input":
    case "include_exclude_select_input":
    case "async_include_exclude_select_input":
    case "select_input":
    case "multi_select_input":
    case "async_multi_select_input":
      return <List className={className} />;
    case "range_input":
    case "int_input":
    case "number_input":
    case "exact_range_input":
    case "min_max_int_input":
      return <Hash className={className} />;
    case "date_range_input":
      return <Calendar className={className} />;
    case "boolean_input":
    case "nullable_boolean_input":
      return <ToggleLeft className={className} />;
    case "text_input":
    case "textarea_input":
    case "tagged_text_input":
    case "template_input":
      return <Type className={className} />;
    case "prompt_input":
      return <Sparkles className={className} />;
    case "condition_block_input":
      return <Filter className={className} />;
    case "loose_object_input":
    case "json_schema_input":
      return <Braces className={className} />;
    case "fields_select_input":
    case "context_select_input":
    case "multi_create_input":
    case "ordered_multi_create_input":
    case "tagged_ordered_multi_create_input":
      return <List className={className} />;
    default:
      return <FileText className={className} />;
  }
}

function GroupIcon({
  iconKey,
  className,
}: {
  iconKey?: IconKey;
  className?: string;
}) {
  switch (iconKey) {
    case "school":
    case "scholar":
      return <GraduationCap className={className} />;
    case "user":
      return <User className={className} />;
    case "location":
      return <MapPin className={className} />;
    case "language":
      return <Languages className={className} />;
    case "brain":
      return <Brain className={className} />;
    case "book":
      return <Book className={className} />;
    case "web":
      return <Globe className={className} />;
    case "plug":
    case "source":
      return <Plug className={className} />;
    case "money":
    case "bill":
      return <Calculator className={className} />;
    case "office":
      return <Building2 className={className} />;
    case "job":
    case "briefcase":
      return <Briefcase className={className} />;
    case "search":
      return <Search className={className} />;
    case "output":
    case "input":
      return <ListOrdered className={className} />;
    case "mix":
      return <Network className={className} />;
    case "linkedin":
      return <Linkedin className={className} />;
    case "text":
      return <Type className={className} />;
    case "workflow":
      return <Workflow className={className} />;
    case "letter":
    case "mail":
      return <Mail className={className} />;
    case "activity":
      return <Activity className={className} />;
    case "boxes":
      return <Boxes className={className} />;
    case "cometition":
      return <Swords className={className} />;
    case "bolt":
      return <Bolt className={className} />;
    case "star":
      return <Star className={className} />;
    case "history":
      return <History className={className} />;
    case "sparkles":
      return <Sparkles className={className} />;
    case "list":
      return <List className={className} />;
    case "sliders":
      return <Settings2 className={className} />;
    case "factory":
      return <Factory className={className} />;
    case "award":
      return <Award className={className} />;
    case "tags":
      return <Tag className={className} />;
    case "handshake":
      return <Handshake className={className} />;
    case "contact":
      return <Contact className={className} />;
    case "calendar":
      return <Calendar className={className} />;
    case "chart":
      return <LineChart className={className} />;
    case "code":
      return <Code className={className} />;
    case "braces":
      return <Braces className={className} />;
    case "filter":
      return <Filter className={className} />;
    default:
      return <Box className={className} />;
  }
}

function getConstraintInfo(field: GeneratedInputMeta): string[] {
  const constraints: string[] = [];

  if (isNumericField(field)) {
    const unit = inputGuards.range_input(field) ? field.unit || "" : "";

    if (field.min !== undefined && field.max !== undefined) {
      constraints.push(`${field.min}-${field.max}${unit ? ` ${unit}` : ""}`);
    } else if (field.min !== undefined) {
      constraints.push(`min: ${field.min}${unit ? ` ${unit}` : ""}`);
    } else if (field.max !== undefined) {
      constraints.push(`max: ${field.max}${unit ? ` ${unit}` : ""}`);
    }
  }

  if (inputGuards.min_max_int_input(field)) {
    if (field.min !== undefined && field.max !== undefined) {
      constraints.push(`${field.min}-${field.max}`);
    }
  }

  if (
    inputGuards.include_exclude_input(field) ||
    inputGuards.include_exclude_select_input(field)
  ) {
    if (field.maxItems) {
      constraints.push(`max: ${field.maxItems} items`);
    }
  }

  if (
    inputGuards.multi_create_input(field) ||
    inputGuards.ordered_multi_create_input(field) ||
    inputGuards.tagged_ordered_multi_create_input(field)
  ) {
    if ("minItems" in field && field.minItems) {
      constraints.push(`min: ${field.minItems} items`);
    }
    if ("maxItems" in field && field.maxItems) {
      constraints.push(`max: ${field.maxItems} items`);
    }
  }

  if (inputGuards.fields_select_input(field)) {
    if ("minItems" in field && field.minItems) {
      constraints.push(`min: ${field.minItems} fields`);
    }
  }

  if (inputGuards.loose_object_input(field)) {
    if ("maxKeys" in field && field.maxKeys) {
      constraints.push(`max: ${field.maxKeys} keys`);
    }
  }

  if (inputGuards.multi_select_input(field)) {
    constraints.push("multiple");
  }

  return constraints;
}

function NumericConfig({
  field,
}: {
  field:
    | GeneratedInputMetaMap["number_input"]
    | GeneratedInputMetaMap["int_input"]
    | GeneratedInputMetaMap["range_input"];
}) {
  return (
    <ConfigSectionWrapper>
      {field.min !== undefined && field.min !== null && (
        <div>
          <span className="">Min value: </span>
          <span className="text-muted-foreground">{field.min}</span>
        </div>
      )}
      {field.max !== undefined && field.max !== null && (
        <div>
          <span className="">Max value: </span>
          <span className="text-muted-foreground">{field.max}</span>
        </div>
      )}
    </ConfigSectionWrapper>
  );
}

function DateRangeConfig({
  field,
}: {
  field: GeneratedInputMetaMap["date_range_input"];
}) {
  return (
    <ConfigSectionWrapper>
      {field.format && (
        <div className="flex justify-between">
          <span className="">Format:</span>
          <span className="text-muted-foreground">{field.format}</span>
        </div>
      )}
      {field.minDate && (
        <div className="flex justify-between">
          <span className="">Min date:</span>
          <span className="text-muted-foreground">{field.minDate}</span>
        </div>
      )}
      {field.maxDate && (
        <div className="flex justify-between">
          <span className="">Max date:</span>
          <span className="text-muted-foreground">{field.maxDate}</span>
        </div>
      )}
    </ConfigSectionWrapper>
  );
}

function TextConfig({ field }: { field: GeneratedInputMetaMap["text_input"] }) {
  return (
    <ConfigSectionWrapper>
      {field.minLength && (
        <div className="flex justify-between">
          <span className="">Min length:</span>
          <span className="text-muted-foreground">{field.minLength}</span>
        </div>
      )}
      {field.maxLength && (
        <div className="flex justify-between">
          <span className="">Max length:</span>
          <span className="text-muted-foreground">{field.maxLength}</span>
        </div>
      )}
    </ConfigSectionWrapper>
  );
}

function ConfigSectionWrapper({ children }: PropsWithChildren) {
  return (
    <div>
      <h4 className="text-sm font-medium mb-3">Configuration</h4>
      <div className="space-y-2 text-sm">{children}</div>
    </div>
  );
}

function ConfigurationSection({ field }: { field: GeneratedInputMeta }) {
  return (
    <>
      {isNumericField(field) && <NumericConfig field={field} />}
      {inputGuards.date_range_input(field) && <DateRangeConfig field={field} />}
      {inputGuards.text_input(field) &&
        (field.minLength || field.maxLength) && <TextConfig field={field} />}
    </>
  );
}

function ReferencesSection({ field }: { field: GeneratedInputMeta }) {
  const showFieldFormatOptions = inputGuards.json_extraction_input(field);
  const showTypeOptions = inputGuards.json_extraction_input(field);

  if (!showFieldFormatOptions && !showTypeOptions) return null;

  return (
    <div className="flex gap-3 flex-wrap">
      {showFieldFormatOptions && (
        <div className="flex-1">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Field Format options
          </h4>
          <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3">
            <div className="flex flex-wrap gap-1.5">
              {RECORD_FIELD_FORMATS.map((format, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="text-xs font-normal"
                >
                  {format}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
      {showTypeOptions && (
        <div className="flex-1">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Field type options
          </h4>
          <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3">
            <div className="flex flex-wrap gap-1.5">
              {RECORD_FIELD_TYPES.map((type, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="text-xs font-normal"
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const OPERATOR_INFO = [
  { symbol: "gt", description: "Greater than" },
  { symbol: "lt", description: "Less than" },
  { symbol: "gte", description: "Greater or equal" },
  { symbol: "lte", description: "Less or equal" },
];

const DATE_OPERATOR_INFO = [
  { symbol: "gt", description: "After date" },
  { symbol: "lt", description: "Before date" },
  { symbol: "gte", description: "On or after" },
  { symbol: "lte", description: "On or before" },
];

const CONDITION_OPERATOR_INFO = RUN_IF_VALUE_OPERATORS.map((symbol) => ({
  symbol,
  description: RUN_IF_OPERATOR_LABELS[symbol] ?? symbol,
}));

function OperatorsSection({ field }: { field: GeneratedInputMeta }) {
  const isCondition =
    inputGuards.condition_block_input(field) ||
    inputGuards.pipes_run_if_input(field);

  if (
    !inputGuards.exact_range_input(field) &&
    !inputGuards.date_range_input(field) &&
    !isCondition
  )
    return null;

  const operators = isCondition
    ? CONDITION_OPERATOR_INFO
    : inputGuards.date_range_input(field)
      ? DATE_OPERATOR_INFO
      : OPERATOR_INFO;

  return (
    <div>
      <h4 className="text-sm font-medium mb-3">Operators</h4>
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-3 text-sm">
          {operators.map(({ symbol, description }) => (
            <div key={symbol} className="flex items-center gap-2">
              <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">
                {symbol}
              </code>
              <span className="text-muted-foreground">{description}</span>
            </div>
          ))}
        </div>
        {inputGuards.date_range_input(field) && (
          <p className="text-xs text-muted-foreground mt-2">
            Use ISO 8601 format: YYYY-MM-DDTHH:mm:ssZ
          </p>
        )}
      </div>
    </div>
  );
}

function FieldDocumentation({
  field,
  examplePayload,
}: {
  field: GeneratedInputMeta;
  examplePayload?: ExamplePayload;
}) {
  const codeExample = generateFieldExampleSnippet(field, examplePayload);
  const sourceSummary = optionsDefSummary(field);

  return (
    <div className="space-y-6">
      {field.description && (
        <div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {field.description}
          </p>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium">Example</h4>
          <Button
            size="icon"
            variant="ghost"
            className="size-7"
            aria-label="Copy example"
            onClick={() => copyToClipboard(codeExample)}
          >
            <Copy className="size-3.5" />
          </Button>
        </div>
        <pre className="border rounded-lg p-4 text-sm overflow-x-auto bg-muted/30">
          <code>{codeExample}</code>
        </pre>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConfigurationSection field={field} />
        <div className="space-y-6">
          <OptionsSection
            options={
              "options" in field && Array.isArray(field.options)
                ? field.options
                : sourceSummary?.kind === "static"
                  ? sourceSummary.options.map((o) => ({
                      value: o.value,
                      label: o.label ?? o.value,
                    }))
                  : undefined
            }
            suggestions={
              "suggestions" in field && Array.isArray(field.suggestions)
                ? field.suggestions
                : undefined
            }
            optionsDef={sourceSummary}
          />
          <OperatorsSection field={field} />
        </div>
      </div>
      <ReferencesSection field={field} />
    </div>
  );
}

function SourceBadge({ field }: { field: GeneratedInputMeta }) {
  const summary = optionsDefSummary(field);
  if (!summary) return null;

  if (summary.kind === "csv") {
    return (
      <a
        href={summary.url}
        target="_blank"
        rel="noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="hidden md:inline-flex items-center gap-1 text-[10px] text-blue-600 hover:underline"
      >
        {summary.file}
        <ExternalLink className="size-2.5" />
      </a>
    );
  }
  if (summary.kind === "provider") {
    return (
      <span className="hidden md:inline text-[10px] text-muted-foreground">
        provider-driven
      </span>
    );
  }
  if (summary.kind === "static" && summary.count > 0) {
    return (
      <span className="hidden md:inline text-[10px] text-muted-foreground">
        {summary.count} values
      </span>
    );
  }
  return null;
}

function FieldAnchorButton({
  fieldPath,
  onCopied,
}: {
  fieldPath: string;
  onCopied?: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const trigger = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (typeof window === "undefined") return;
    const url = `${window.location.origin}${window.location.pathname}#${fieldPath}`;
    void navigator.clipboard?.writeText(url);
    if (window.history && window.location.hash !== `#${fieldPath}`) {
      window.history.replaceState(null, "", `#${fieldPath}`);
    }
    setCopied(true);
    onCopied?.();
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          role="button"
          tabIndex={0}
          onClick={trigger}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") trigger(e);
          }}
          aria-label={`Copy link to ${fieldPath}`}
          className="size-5 flex items-center justify-center rounded text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity cursor-pointer"
        >
          {copied ? (
            <Check className="size-3 text-green-600" />
          ) : (
            <LinkIcon className="size-3" />
          )}
        </span>
      </TooltipTrigger>
      <TooltipContent>Copy link</TooltipContent>
    </Tooltip>
  );
}

function FieldAccordionItem({
  field,
  examplePayload,
}: {
  field: GeneratedInputMeta;
  examplePayload?: ExamplePayload;
}) {
  const constraints = getConstraintInfo(field);
  const hasRequired = "required" in field && field.required;

  return (
    <AccordionItem
      value={field.path}
      id={field.path}
      className="scroll-mt-24 group"
    >
      <AccordionTrigger>
        <div className="flex items-center justify-between w-full gap-2 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <FieldIcon
              type={field.type}
              className="h-3.5 w-3.5 text-muted-foreground shrink-0"
            />
            <span className="font-mono text-sm truncate">{field.path}</span>
            <FieldAnchorButton fieldPath={field.path} />
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {constraints.length > 0 && (
              <span className="text-[10px] text-muted-foreground hidden md:inline">
                {constraints.join(", ")}
              </span>
            )}
            <SourceBadge field={field} />
            <Badge
              variant="outline"
              className="text-[10px] font-mono px-1.5 py-0"
            >
              {field.type.replace(/_/g, " ")}
            </Badge>
            <Badge
              variant={hasRequired ? "default" : "secondary"}
              className="text-[10px] uppercase tracking-wide px-1.5 py-0"
            >
              {hasRequired ? "required" : "optional"}
            </Badge>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pl-6 pb-4">
        <FieldDocumentation field={field} examplePayload={examplePayload} />
      </AccordionContent>
    </AccordionItem>
  );
}

interface FilterDocumentationProps {
  formConfig: FormSection[];
  searchable?: boolean;
  exampleFilename?: string;
  /**
   * The payload the page is documenting (a pipe's snippet payload or a
   * search's snippet payload). Field examples prefer the real value found at
   * each field's path over a synthetic one.
   */
  examplePayload?: ExamplePayload;
}

type FilteredGroup = {
  groupPath: string;
  label?: string;
  description?: string;
  iconKey?: IconKey;
  defaultExpand: boolean;
  fields: GeneratedInputMeta[];
};

type FilteredSection = {
  path: string;
  label?: string;
  description?: string;
  groups: FilteredGroup[];
};

function buildFilteredSections(
  formConfig: FormSection[],
  query: string,
): FilteredSection[] {
  const q = query.trim().toLowerCase();
  const matches = (field: GeneratedInputMeta) => {
    if (!q) return true;
    const path = field.path?.toLowerCase() ?? "";
    const label = ("label" in field && field.label
      ? String(field.label)
      : ""
    ).toLowerCase();
    const type = field.type.toLowerCase();
    return path.includes(q) || label.includes(q) || type.includes(q);
  };

  const result: FilteredSection[] = [];
  const seenPaths = new Set<string>();

  for (const section of formConfig) {
    const groups: FilteredGroup[] = [];
    for (const group of section.groups) {
      const fields: GeneratedInputMeta[] = [];
      for (const field of group.fields) {
        if (seenPaths.has(field.path)) continue;
        if (!matches(field)) continue;
        seenPaths.add(field.path);
        fields.push(field);
      }
      if (fields.length === 0) continue;
      groups.push({
        groupPath: group.groupPath,
        label: group.label,
        description: group.description,
        iconKey: group.iconKey,
        defaultExpand: false,
        fields,
      });
    }
    if (groups.length === 0) continue;
    result.push({
      path: section.metadata.path,
      label: section.metadata.label,
      description: section.metadata.description,
      groups,
    });
  }

  return result;
}

function GroupBlock({
  group,
  forceOpenFieldPaths,
  examplePayload,
}: {
  group: FilteredGroup;
  forceOpenFieldPaths: Set<string>;
  examplePayload?: ExamplePayload;
}) {
  const [userOpenItems, setUserOpenItems] = useState<string[] | null>(null);

  const openItems = useMemo(() => {
    const base =
      userOpenItems ??
      (group.defaultExpand ? group.fields.map((f) => f.path) : []);
    const next = new Set(base);
    group.fields.forEach((f) => {
      if (forceOpenFieldPaths.has(f.path)) next.add(f.path);
    });
    return Array.from(next);
  }, [userOpenItems, group, forceOpenFieldPaths]);

  return (
    <div className="rounded-lg border border-border bg-card/40">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
        <GroupIcon
          iconKey={group.iconKey}
          className="size-4 text-muted-foreground"
        />
        <div className="min-w-0">
          <div className="text-sm font-medium leading-tight">
            {group.label ?? group.groupPath}
          </div>
          {group.description && (
            <div className="text-xs text-muted-foreground">
              {group.description}
            </div>
          )}
        </div>
        <span className="ml-auto text-[10px] text-muted-foreground tabular-nums">
          {group.fields.length}
        </span>
      </div>
      <Accordion
        type="multiple"
        value={openItems}
        onValueChange={setUserOpenItems}
        className="px-3"
      >
        {group.fields.map((field) => (
          <FieldAccordionItem
            key={field.path}
            field={field}
            examplePayload={examplePayload}
          />
        ))}
      </Accordion>
    </div>
  );
}

export function PayloadDocumenation({
  formConfig,
  searchable,
  exampleFilename,
  examplePayload,
}: FilterDocumentationProps) {
  const [query, setQuery] = useState("");
  const [hashField, setHashField] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const apply = () => {
      const hash = window.location.hash.replace(/^#/, "");
      setHashField(hash || null);
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  useEffect(() => {
    if (!hashField) return;
    const el = document.getElementById(hashField);
    if (el) {
      requestAnimationFrame(() =>
        el.scrollIntoView({ behavior: "smooth", block: "start" }),
      );
    }
  }, [hashField]);

  const sections = useMemo(
    () => buildFilteredSections(formConfig, query),
    [formConfig, query],
  );

  const totalFields = useMemo(
    () =>
      formConfig.reduce(
        (acc, s) =>
          acc + s.groups.reduce((a, g) => a + g.fields.length, 0),
        0,
      ),
    [formConfig],
  );

  const visibleFields = useMemo(
    () =>
      sections.reduce(
        (acc, s) => acc + s.groups.reduce((a, g) => a + g.fields.length, 0),
        0,
      ),
    [sections],
  );

  const forceOpenFieldPaths = useMemo(() => {
    const set = new Set<string>();
    if (hashField) set.add(hashField);
    return set;
  }, [hashField]);

  const handleCopyAll = useCallback(() => {
    const populated = buildPopulatedExample(formConfig, {
      payload: examplePayload,
    });
    copyToClipboard(JSON.stringify(populated, null, 2));
  }, [formConfig, examplePayload]);

  const handleDownload = useCallback(() => {
    const populated = buildPopulatedExample(formConfig, {
      payload: examplePayload,
    });
    const blob = new Blob([JSON.stringify(populated, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${exampleFilename ?? "config-example"}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [formConfig, exampleFilename, examplePayload]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {searchable && (
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter config keys..."
              className="h-8 pl-8 text-sm"
            />
          </div>
        )}
        <div className="flex items-center gap-2 ml-auto">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5"
            onClick={handleCopyAll}
          >
            <Copy className="size-3.5" />
            Copy example
          </Button>
        </div>
      </div>

      {visibleFields === 0 ? (
        <div className="rounded-md border border-dashed py-6 text-center text-xs text-muted-foreground">
          {query.trim()
            ? `No config keys match "${query}".`
            : "No config keys."}
        </div>
      ) : (
        <div className="space-y-6">
          {sections.map((section) => (
            <section
              key={section.path}
              id={`section-${section.path}`}
              className="space-y-3"
            >
              {(section.label || section.description) && (
                <div className="space-y-0.5">
                  {section.label && (
                    <h3 className="text-base font-semibold tracking-tight">
                      {section.label}
                    </h3>
                  )}
                  {section.description && (
                    <p className="text-xs text-muted-foreground">
                      {section.description}
                    </p>
                  )}
                </div>
              )}
              <div className="space-y-3">
                {section.groups.map((group) => (
                  <GroupBlock
                    key={group.groupPath}
                    group={group}
                    forceOpenFieldPaths={forceOpenFieldPaths}
                    examplePayload={examplePayload}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {searchable && query.trim() && visibleFields > 0 && (
        <p className="text-[11px] text-muted-foreground">
          Showing {visibleFields} of {totalFields} fields.
        </p>
      )}
    </div>
  );
}
