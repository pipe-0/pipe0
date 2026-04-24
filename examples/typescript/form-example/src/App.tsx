import { useState } from "react";
import {
  getSearchPayloadFormConfig,
  isTextField,
  isIntegerField,
  type FormSection,
  type GeneratedFormElement,
  type AsyncMultiSelectMetadata,
  getSearchDefaultPayload,
  MultiSelectMetadata,
} from "@pipe0/elements";
import { AsyncMultiSelect } from "./AsyncMultiSelect";

// ---------------------------------------------------------------------------
// 1. Generate the form config for the crustdata people search
// ---------------------------------------------------------------------------
const formConfig = getSearchPayloadFormConfig({
  searchPayload: getSearchDefaultPayload("companies:profiles:crustdata@1"),
});

// Log the full config to the console so you can inspect it
console.log("Form config:", formConfig);

// ---------------------------------------------------------------------------
// 2. Build a simple React form from the config
// ---------------------------------------------------------------------------
export default function App() {
  // Simple flat state keyed by field path (e.g. "config.limit")
  const [values, setValues] = useState<Record<string, unknown>>({});

  const setValue = (path: string, value: unknown) =>
    setValues((prev) => ({ ...prev, [path]: value }));

  return (
    <div
      style={{
        fontFamily: "system-ui",
        maxWidth: 640,
        margin: "0 auto",
        padding: 32,
      }}
    >
      <h1>@pipe0/ops Form Config Example</h1>
      <p style={{ color: "#666" }}>
        Open the browser console to see the raw <code>formConfig</code> object.
      </p>

      {formConfig.map((section) => (
        <SectionRenderer
          key={section.metadata?.path ?? "unknown"}
          section={section}
          values={values}
          setValue={setValue}
        />
      ))}

      <h3 style={{ marginTop: 40 }}>Current form values</h3>
      <pre
        style={{
          background: "#f5f5f5",
          padding: 16,
          borderRadius: 8,
          fontSize: 13,
        }}
      >
        {JSON.stringify(values, null, 2)}
      </pre>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section & group renderers
// ---------------------------------------------------------------------------
function SectionRenderer({
  section,
  values,
  setValue,
}: {
  section: FormSection;
  values: Record<string, unknown>;
  setValue: (path: string, value: unknown) => void;
}) {
  return (
    <div style={{ marginTop: 24 }}>
      <h2 style={{ borderBottom: "1px solid #ddd", paddingBottom: 4 }}>
        {section.metadata?.label ?? section.metadata?.path}
      </h2>
      {section.groups.map((group) => (
        <fieldset
          key={group.groupPath}
          style={{
            border: "1px solid #e0e0e0",
            borderRadius: 8,
            padding: 16,
            marginTop: 12,
          }}
        >
          {group.label && (
            <legend style={{ fontWeight: 600 }}>{group.label}</legend>
          )}
          {group.fields.map((field) => (
            <FieldRenderer
              key={field.path}
              field={field}
              values={values}
              setValue={setValue}
            />
          ))}
        </fieldset>
      ))}
    </div>
  );
}

function FieldRenderer({
  field,
  values,
  setValue,
}: {
  field: GeneratedFormElement;
  values: Record<string, unknown>;
  setValue: (path: string, value: unknown) => void;
}) {
  // --- Async multi-select (autocomplete) ---
  if (field.type === "async_multi_select_input") {
    const f = field as AsyncMultiSelectMetadata;
    return (
      <AsyncMultiSelect
        field={f}
        selected={(values[f.path] as string[]) ?? []}
        onChange={(next) => setValue(f.path, next)}
      />
    );
  }

  if (field.type === "multi_select_input") {
    const f = field as MultiSelectMetadata;
    const selected = (values[f.path] as string[]) ?? [];
    return (
      <div style={{ marginTop: 12 }}>
        <span style={{ fontWeight: 500 }}>{f.label}</span>
        <div
          style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}
        >
          {f.options.map((opt) => {
            const active = selected.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() =>
                  setValue(
                    f.path,
                    active
                      ? selected.filter((v) => v !== opt.value)
                      : [...selected, opt.value],
                  )
                }
                style={{
                  padding: "4px 10px",
                  borderRadius: 4,
                  border: "1px solid #ccc",
                  background: active ? "#3b82f6" : "#fff",
                  color: active ? "#fff" : "#333",
                  cursor: "pointer",
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // --- Text input ---
  if (isTextField(field)) {
    return (
      <label style={{ display: "block", marginTop: 12 }}>
        <span style={{ fontWeight: 500 }}>{field.label}</span>
        {field.description && (
          <span style={{ color: "#888", marginLeft: 8 }}>
            {field.description}
          </span>
        )}
        <input
          type={field.inputType}
          value={(values[field.path] as string) ?? ""}
          onChange={(e) => setValue(field.path, e.target.value)}
          placeholder={field.placeholder}
          style={{
            display: "block",
            width: "100%",
            marginTop: 4,
            padding: "6px 8px",
          }}
        />
      </label>
    );
  }

  // --- Integer input ---
  if (isIntegerField(field)) {
    return (
      <label style={{ display: "block", marginTop: 12 }}>
        <span style={{ fontWeight: 500 }}>{field.label}</span>
        <input
          type="number"
          min={field.min}
          max={field.max}
          value={(values[field.path] as number) ?? ""}
          onChange={(e) => setValue(field.path, Number(e.target.value))}
          style={{
            display: "block",
            width: "100%",
            marginTop: 4,
            padding: "6px 8px",
          }}
        />
      </label>
    );
  }

  // For this example we skip all other field types.
  // You can add more type guards (isBooleanField, isRangeField, etc.)
  return (
    <div style={{ marginTop: 12, color: "#aaa", fontSize: 13 }}>
      <em>
        Unsupported field type: <code>{field.type}</code> —{" "}
        {field.label ?? field.path}
      </em>
    </div>
  );
}
