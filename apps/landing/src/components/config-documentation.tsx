"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { copyToClipboard } from "@/lib/utils";
import {
  DateRangeMetadata,
  GeneratedFormField,
  getPayloadFormConfig,
  getPipePayloadSchema,
  getSearchPayloadSchema,
  IntegerMetadata,
  isBooleanField,
  isDateRangeField,
  isIncludeExcludeField,
  isIncludeExcludeSelectField,
  isIntegerField,
  isJSONExtractionField,
  isJsonSchemaInput,
  isNumberField,
  isOutputField,
  isRangeField,
  isSelectField,
  isTextareaField,
  isTextField,
  NumberMetadata,
  PipeId,
  RangeMetadata,
  RECORD_FIELD_FORMATS,
  RECORD_FIELD_TYPES,
  SearchId,
  SelectMetadata,
  TextMetadata,
} from "@pipe0/client-sdk";
import {
  Calendar,
  Copy,
  FileText,
  Hash,
  List,
  ToggleLeft,
  Type,
} from "lucide-react";
import { PropsWithChildren, useMemo } from "react";

const isNumericField = (
  field: GeneratedFormField
): field is RangeMetadata | IntegerMetadata | NumberMetadata =>
  isRangeField(field) || isIntegerField(field) || isNumberField(field);

const FIELD_ICONS = {
  include_exclude_input: List,
  include_exclude_select_input: List,
  range_input: Hash,
  int_input: Hash,
  number_input: Hash,
  date_range_input: Calendar,
  boolean_input: ToggleLeft,
  text_input: Type,
  textarea_input: Type,
  select_input: List,
} as const;

function getFieldIcon(type: string) {
  return FIELD_ICONS[type as keyof typeof FIELD_ICONS] || FileText;
}

// Code example generators - each handles its own type safely
const generateIncludeExcludeExample = (fieldName: string) => `{
  "${fieldName}": {
    "include": ["value1", "value2"],
    "exclude": ["unwanted1", "unwanted2"]
  }
}`;

const generateJsonExtractionExample = (fieldName: string) => `{
  "${fieldName}": {
    "extractions": [
      "path": "foo.bar",
      "output_field": {
        "name": "extracted_name",
        "format": "text",
        "label": "Extracted name",
        "type": "string",
      }
    ]
  }
}`;

const generateJsonSchemaExample = (fieldName: string) => `{
  "${fieldName}": {
    "type": "object",
    "properties": {
      "foo": {
        "type": "string"
      }
    },
    "required": ["foo"]
  }
}`;

const generateRangeExample = (fieldName: string, field: RangeMetadata) => `{
  "${fieldName}": {
    "gt": ${field.min || 0},
    "lt": ${field.max || 100},
  }
}`;

const generateDateRangeExample = (fieldName: string) => `{
  "${fieldName}": {
    "gt": "2024-01-01T00:00:00Z",
    "lt": "2024-12-31T23:59:59Z",
    "gte": "",
    "lte": ""
  }
}`;

const generateBooleanExample = (fieldName: string) => `{
  "${fieldName}": true
}`;

const generateTextExample = (fieldName: string) => `{
  "${fieldName}": "example text"
}`;

const generateSelectExample = (fieldName: string, field: SelectMetadata) =>
  field.multiple
    ? `{
  "${fieldName}": ["option1", "option2"]
}`
    : `{
  "${fieldName}": "option1"
}`;

const generateNumericExample = (
  fieldName: string,
  field: IntegerMetadata | NumberMetadata
) => `{
  "${fieldName}": ${field.min || 0}
}`;

const generateOutputFieldExmple = (fieldName: string) => `{
  "${fieldName}": {
    "enabled": true,
    "alias": ""
  }
}`;

function generateCodeExample(field: GeneratedFormField): string {
  const pathParts = field.path.split(".");
  const fieldName = pathParts[pathParts.length - 1];

  if (isIncludeExcludeField(field) || isIncludeExcludeSelectField(field)) {
    return generateIncludeExcludeExample(fieldName);
  }
  if (isRangeField(field)) {
    return generateRangeExample(fieldName, field);
  }
  if (isDateRangeField(field)) {
    return generateDateRangeExample(fieldName);
  }
  if (isBooleanField(field)) {
    return generateBooleanExample(fieldName);
  }
  if (isTextField(field) || isTextareaField(field)) {
    return generateTextExample(fieldName);
  }
  if (isSelectField(field)) {
    return generateSelectExample(fieldName, field);
  }
  if (isIntegerField(field) || isNumberField(field)) {
    return generateNumericExample(fieldName, field);
  }
  if (isJSONExtractionField(field)) {
    return generateJsonExtractionExample(fieldName);
  }
  if (isJsonSchemaInput(field)) {
    return generateJsonSchemaExample(fieldName);
  }
  if (isOutputField(field)) {
    return generateOutputFieldExmple(fieldName);
  }

  return `{
  "${fieldName}": "value"
}`;
}

function getConstraintInfo(field: GeneratedFormField): string[] {
  const constraints: string[] = [];

  if (isNumericField(field)) {
    const unit = isRangeField(field) ? field.unit || "" : "";

    if (field.min !== undefined && field.max !== undefined) {
      constraints.push(`${field.min}-${field.max}${unit ? ` ${unit}` : ""}`);
    } else if (field.min !== undefined) {
      constraints.push(`min: ${field.min}${unit ? ` ${unit}` : ""}`);
    } else if (field.max !== undefined) {
      constraints.push(`max: ${field.max}${unit ? ` ${unit}` : ""}`);
    }
  }

  if (isIncludeExcludeField(field) || isIncludeExcludeSelectField(field)) {
    if (field.maxItems) {
      constraints.push(`max: ${field.maxItems} items`);
    }
  }

  if (isSelectField(field) && field.multiple) {
    constraints.push("multiple");
  }

  return constraints;
}

function NumericConfig({
  field,
}: {
  field: NumberMetadata | IntegerMetadata | RangeMetadata;
}) {
  return (
    <ConfigSectionWrapper>
      {field.min && (
        <div>
          <span className="text-gray-500">Min value: </span>
          <span className="text-gray-900">{field.min}</span>
        </div>
      )}
      {field.max && (
        <div>
          <span className="text-gray-500">Max value: </span>
          <span className="text-gray-900">{field.max}</span>
        </div>
      )}
    </ConfigSectionWrapper>
  );
}

function DateRangeConfig({ field }: { field: DateRangeMetadata }) {
  return (
    <ConfigSectionWrapper>
      {field.format && (
        <div className="flex justify-between">
          <span className="text-gray-500">Format:</span>
          <span className="text-gray-900">{field.format}</span>
        </div>
      )}
      {field.minDate && (
        <div className="flex justify-between">
          <span className="text-gray-500">Min date:</span>
          <span className="text-gray-900">{field.minDate}</span>
        </div>
      )}
      {field.maxDate && (
        <div className="flex justify-between">
          <span className="text-gray-500">Max date:</span>
          <span className="text-gray-900">{field.maxDate}</span>
        </div>
      )}
    </ConfigSectionWrapper>
  );
}

function TextConfig({ field }: { field: TextMetadata }) {
  return (
    <ConfigSectionWrapper>
      {field.minLength && (
        <div className="flex justify-between">
          <span className="text-gray-500">Min length:</span>
          <span className="text-gray-900">{field.minLength}</span>
        </div>
      )}
      {field.maxLength && (
        <div className="flex justify-between">
          <span className="text-gray-500">Max length:</span>
          <span className="text-gray-900">{field.maxLength}</span>
        </div>
      )}
    </ConfigSectionWrapper>
  );
}

function ConfigSectionWrapper({ children }: PropsWithChildren) {
  return (
    <div>
      <h4 className="text-sm font-medium text-gray-900 mb-3">Configuration</h4>
      <div className="space-y-2 text-sm">{children}</div>
    </div>
  );
}

function ConfigurationSection({ field }: { field: GeneratedFormField }) {
  return (
    <>
      {isNumericField(field) && <NumericConfig field={field} />}
      {isDateRangeField(field) && <DateRangeConfig field={field} />}
      {isTextField(field) && (field.minLength || field.maxLength) && (
        <TextConfig field={field} />
      )}
    </>
  );
}

function OptionsSection({ field }: { field: GeneratedFormField }) {
  const getOptions = () => {
    if (isSelectField(field)) return field.options;
    if (isIncludeExcludeSelectField(field)) return field.options;
    if (isIncludeExcludeField(field)) return field.suggestions;
    return null;
  };

  const options = getOptions();
  if (!options) return null;

  const handleCopyOptions = () => {
    const value = field.suggestions || field.options;
    copyToClipboard(JSON.stringify(value, null, 2));
  };

  return (
    <div>
      <div className="flex justify-between">
        <h4 className="text-sm font-medium text-gray-900 mb-3">
          {isIncludeExcludeField(field) && field.suggestions
            ? "Suggestions"
            : "Available options"}
        </h4>

        <Button
          size={"icon"}
          variant="ghost"
          className="size-7"
          onClick={handleCopyOptions}
        >
          <Copy className="size-4" />
        </Button>
      </div>

      {isIncludeExcludeField(field) && field.suggestions ? (
        <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3">
          <div className="flex flex-wrap gap-1.5">
            {field.suggestions.map((suggestion, idx) => (
              <Badge
                key={idx}
                variant="secondary"
                className="text-xs font-normal"
              >
                {suggestion.label}
              </Badge>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg">
          <div className="divide-y divide-gray-100">
            {options.map((option, idx) => (
              <div
                key={idx}
                className="px-3 py-2 flex items-center justify-between"
              >
                <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded font-mono">
                  {option.value}
                </code>
                <span className="text-sm text-gray-600">{option.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ReferencesSection({ field }: { field: GeneratedFormField }) {
  const showFieldFormatOptions = useMemo(() => {
    return isJSONExtractionField(field);
  }, []);

  const showTypeOptions = useMemo(() => {
    return isJSONExtractionField(field);
  }, []);

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

function OperatorsSection({ field }: { field: GeneratedFormField }) {
  if (!isRangeField(field) && !isDateRangeField(field)) return null;

  const operators = isDateRangeField(field)
    ? DATE_OPERATOR_INFO
    : OPERATOR_INFO;

  return (
    <div>
      <h4 className="text-sm font-medium text-gray-900 mb-3">Operators</h4>
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-3 text-sm">
          {operators.map(({ symbol, description }) => (
            <div key={symbol} className="flex items-center gap-2">
              <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">
                {symbol}
              </code>
              <span className="text-gray-600">{description}</span>
            </div>
          ))}
        </div>
        {isDateRangeField(field) && (
          <p className="text-xs text-gray-500 mt-2">
            Use ISO 8601 format: YYYY-MM-DDTHH:mm:ssZ
          </p>
        )}
      </div>
    </div>
  );
}

function FieldDocumentation({ field }: { field: GeneratedFormField }) {
  const codeExample = generateCodeExample(field);

  return (
    <div className="space-y-6">
      {field.description && (
        <div>
          <p className="text-sm text-gray-600 leading-relaxed">
            {field.description}
          </p>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-900">Example</h4>
        </div>
        <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm overflow-x-auto">
          <code className="text-gray-800">{codeExample}</code>
        </pre>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConfigurationSection field={field} />
        <div className="space-y-6">
          <OptionsSection field={field} />
          <OperatorsSection field={field} />
        </div>
      </div>
      <ReferencesSection field={field} />
    </div>
  );
}

interface FilterDocumentationProps {
  searchId?: SearchId;
  pipeId?: PipeId;
}

export function PayloadDocumenation({
  searchId,
  pipeId,
}: FilterDocumentationProps) {
  const formConfig = useMemo(() => {
    let PayloadSchema: any;
    if (searchId) {
      PayloadSchema = getSearchPayloadSchema(searchId);
    } else if (pipeId) {
      PayloadSchema = getPipePayloadSchema(pipeId);
    } else {
      throw new Error("Must define either pipeId or searchId");
    }
    const config = getPayloadFormConfig({
      schema: PayloadSchema,
      staticOnly: false,
    });

    return config;
  }, [searchId, pipeId]);

  const allFields = formConfig.flatMap((section) =>
    section.groups.flatMap((group) => group.fields)
  );

  return (
    <div className="">
      <Accordion type="multiple" className="w-full space-y-1">
        {allFields.map((field, idx) => {
          const Icon = getFieldIcon(field.type);
          const constraints = getConstraintInfo(field);

          return (
            <AccordionItem key={`${field.path}-${idx}`} value={`field-${idx}`}>
              <AccordionTrigger>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <p className="text-sm  px-1.5 py-0.5 rounded">
                          {field.path}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {constraints.length > 0 && (
                      <span className="text-xs text-gray-500 px-2 py-1 rounded">
                        {constraints.join(", ")}
                      </span>
                    )}
                    <Badge
                      variant={field.required ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {field.required ? "required" : "optional"}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {field.type.replace(/_/g, " ")}
                    </Badge>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <FieldDocumentation field={field} />
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
