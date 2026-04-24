import { OptionsSection } from "@/components/config-documentation-options-section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  FormSection,
  GeneratedInputMeta,
  GeneratedInputMetaMap,
  inputGuards,
  RECORD_FIELD_FORMATS,
  RECORD_FIELD_TYPES,
} from "@pipe0/elements";
import { Calendar, FileText, Hash, List, ToggleLeft, Type } from "lucide-react";
import { PropsWithChildren, useMemo } from "react";

const isNumericField = (
  field: GeneratedInputMeta,
): field is
  | GeneratedInputMetaMap["range_input"]
  | GeneratedInputMetaMap["int_input"]
  | GeneratedInputMetaMap["number_input"] =>
  inputGuards.range_input(field) ||
  inputGuards.int_input(field) ||
  inputGuards.number_input(field);

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

// Code example generators - each handles its own type safely
const generateAsyncInlcudeExcludeSelectFieldExample = (fieldName: string) => `{
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

const generateExactRangeExample = (
  fieldName: string,
  field: GeneratedInputMetaMap["exact_range_input"],
) => `{
  "${fieldName}": {
    "gt": ${field.min || 0},
    "lt": ${field.max || 100},
  }
}`;

const generateRangeExample = (
  fieldName: string,
  field: GeneratedInputMetaMap["range_input"],
) => `{
  "${fieldName}": {
    "from": ${field.min || 0},
    "to": ${field.max || 100},
  }
}`;

const generateProvidersExample = (fieldName: string) => `{
  "${fieldName}": [{ "provider": "value" }, { "provider": "value" }]
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

const generateSelectExample = (
  fieldName: string,
  field: GeneratedInputMetaMap["select_input"],
) =>
  `{
  "${fieldName}": "option1"
}`;

const generateMultiSelectExample = (
  fieldName: string,
  field: GeneratedInputMetaMap["multi_select_input"],
) => {
  if (Array.isArray(field.options) === false) return "";

  const options = field.options.slice(0, 2).map((o) => o.value);

  if (options.length < 2) {
    return `{
  "${fieldName}": ["option1", "option2"]
}`;
  }

  return `{
  "${fieldName}": ["${options[0]}", "${options[1]}"]
}`;
};

const generateAsyncMultiSelectExample = (fieldName: string) => {
  return `{
    "${fieldName}": ["option1", "option2"]
}`;
};

const generateOrderedMultiCreateExample = (fieldName: string) => {
  return `{
    "${fieldName}": ["option1", "option2"]
}`;
};

const generateNumericExample = (
  fieldName: string,
  field:
    | GeneratedInputMetaMap["int_input"]
    | GeneratedInputMetaMap["number_input"],
) => `{
  "${fieldName}": ${field.min || 0}
}`;

const generateOutputFieldExmple = (fieldName: string) => `{
  "${fieldName}": {
    "enabled": true,
    "alias": ""
  }
}`;

const generateConnectorExample = (fieldName: string) => `{
  "${fieldName}": {
    "strategy": "first",
    "connections": [
      {
        "type": "vault",
        "connection": "provider_connection_id"
      }
    ]
  }
}`;

const generatePipeTriggerExample = (fieldName: string) => `{
  "${fieldName}": {
    "action": "run",
    "when": {
      "logic": "and",
      "conditions": [
        {
          "property": "value",
          "field_name": "field_name",
          "operator": "eq",
          "value": "example"
        }
      ]
    }
  }
}`;

function generateCodeExample(field: GeneratedInputMeta): string {
  const pathParts = field.path.split(".");
  const fieldName = pathParts[pathParts.length - 1];

  if (
    inputGuards.include_exclude_input(field) ||
    inputGuards.include_exclude_select_input(field)
  ) {
    return generateIncludeExcludeExample(fieldName);
  }
  if (inputGuards.connector_input(field)) {
    return generateConnectorExample(fieldName);
  }
  if (inputGuards.pipes_trigger_input(field)) {
    return generatePipeTriggerExample(fieldName);
  }
  if (inputGuards.providers_input(field)) {
    return generateProvidersExample(fieldName);
  }
  if (inputGuards.exact_range_input(field)) {
    return generateExactRangeExample(fieldName, field);
  }
  if (inputGuards.range_input(field)) {
    return generateRangeExample(fieldName, field);
  }
  if (inputGuards.date_range_input(field)) {
    return generateDateRangeExample(fieldName);
  }
  if (inputGuards.boolean_input(field)) {
    return generateBooleanExample(fieldName);
  }
  if (inputGuards.nullable_boolean_input(field)) {
    return generateBooleanExample(fieldName);
  }
  if (inputGuards.text_input(field) || inputGuards.textarea_input(field)) {
    return generateTextExample(fieldName);
  }
  if (inputGuards.select_input(field)) {
    return generateSelectExample(fieldName, field);
  }

  if (inputGuards.multi_select_input(field)) {
    return generateMultiSelectExample(fieldName, field);
  }

  if (inputGuards.async_include_exclude_select_input(field)) {
    return generateAsyncInlcudeExcludeSelectFieldExample(fieldName);
  }

  if (inputGuards.async_multi_select_input(field)) {
    return generateAsyncMultiSelectExample(fieldName);
  }

  if (inputGuards.ordered_multi_create_input(field)) {
    return generateOrderedMultiCreateExample(fieldName);
  }

  if (inputGuards.multi_create_input(field)) {
    return generateOrderedMultiCreateExample(fieldName);
  }

  if (inputGuards.int_input(field) || inputGuards.number_input(field)) {
    return generateNumericExample(fieldName, field);
  }
  if (inputGuards.json_extraction_input(field)) {
    return generateJsonExtractionExample(fieldName);
  }
  if (inputGuards.json_schema_input(field)) {
    return generateJsonSchemaExample(fieldName);
  }
  if (inputGuards.output_field_input(field)) {
    return generateOutputFieldExmple(fieldName);
  }

  return `{
  "${fieldName}": "value"
}`;
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

  if (
    inputGuards.include_exclude_input(field) ||
    inputGuards.include_exclude_select_input(field)
  ) {
    if (field.maxItems) {
      constraints.push(`max: ${field.maxItems} items`);
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
      {field.min && (
        <div>
          <span className="">Min value: </span>
          <span className="text-muted-foreground">{field.min}</span>
        </div>
      )}
      {field.max && (
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

function TextConfig({
  field,
}: {
  field: GeneratedInputMetaMap["text_input"];
}) {
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
  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const showFieldFormatOptions = useMemo(() => {
    return inputGuards.json_extraction_input(field);
  }, []);

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const showTypeOptions = useMemo(() => {
    return inputGuards.json_extraction_input(field);
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

function OperatorsSection({ field }: { field: GeneratedInputMeta }) {
  if (!inputGuards.exact_range_input(field) && !inputGuards.date_range_input(field))
    return null;

  const operators = inputGuards.date_range_input(field)
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

function FieldDocumentation({ field }: { field: GeneratedInputMeta }) {
  const codeExample = generateCodeExample(field);

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
        </div>
        <pre className=" border rounded-lg p-4 text-sm overflow-x-auto">
          <code className="">{codeExample}</code>
        </pre>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConfigurationSection field={field} />
        <div className="space-y-6">
          <OptionsSection
            options={
              "options" in field && Array.isArray(field.options)
                ? field.options
                : undefined
            }
            suggestions={
              "suggestions" in field && Array.isArray(field.suggestions)
                ? field.suggestions
                : undefined
            }
          />
          <OperatorsSection field={field} />
        </div>
      </div>
      <ReferencesSection field={field} />
    </div>
  );
}

interface FilterDocumentationProps {
  formConfig: FormSection[];
}

export function PayloadDocumenation({ formConfig }: FilterDocumentationProps) {
  const allFields = formConfig.flatMap((section) =>
    section.groups.flatMap((group) => group.fields),
  );

  return (
    <div className="">
      <Accordion type="multiple" className="w-full space-y-1">
        {allFields.map((field, idx) => {
          const Icon = getFieldIcon(field.type);
          const constraints = getConstraintInfo(field);

          const hasRequired = "required" in field && field.required;

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
                      <span className="text-xs px-2 py-1 rounded">
                        {constraints.join(", ")}
                      </span>
                    )}
                    <Badge
                      variant={hasRequired ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {hasRequired ? "required" : "optional"}
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
