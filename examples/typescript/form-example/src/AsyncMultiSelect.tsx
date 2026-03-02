import { useState, useEffect, useRef } from "react";
import type { AsyncMultiSelectMetadata } from "@pipe0/ops";

/**
 * Minimal async multi-select component.
 *
 * This demonstrates how to work with async autocomplete fields from
 * the form config. The `field.options` property is an async function
 * that takes a query string and returns matching options.
 */
export function AsyncMultiSelect({
  field,
  selected,
  onChange,
}: {
  field: AsyncMultiSelectMetadata;
  selected: string[];
  onChange: (values: string[]) => void;
}) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Fetch suggestions when query changes (debounced)
  useEffect(() => {
    clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await field.options(query);
        setSuggestions(results);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query, field]);

  const toggle = (value: string) => {
    onChange(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value]
    );
  };

  return (
    <div style={{ marginTop: 12, position: "relative" }}>
      <span style={{ fontWeight: 500 }}>{field.label}</span>

      {/* Selected tags */}
      {selected.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 }}>
          {selected.map((v) => (
            <span
              key={v}
              style={{
                background: "#e0e7ff",
                padding: "2px 8px",
                borderRadius: 4,
                fontSize: 13,
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              {v}
              <button
                type="button"
                onClick={() => toggle(v)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                x
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search input */}
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder={`Search ${field.label?.toLowerCase()}...`}
        style={{ display: "block", width: "100%", marginTop: 4, padding: "6px 8px" }}
      />

      {/* Dropdown */}
      {open && (query.trim() || loading) && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: 6,
            maxHeight: 200,
            overflowY: "auto",
            zIndex: 10,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          {loading && <div style={{ padding: 8, color: "#888" }}>Loading...</div>}
          {!loading && suggestions.length === 0 && (
            <div style={{ padding: 8, color: "#888" }}>No results</div>
          )}
          {suggestions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                toggle(opt.value);
                setQuery("");
                setOpen(false);
              }}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "6px 10px",
                border: "none",
                background: selected.includes(opt.value) ? "#e0e7ff" : "#fff",
                cursor: "pointer",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
