import type { ThemeRegistrationRaw } from "shiki";

/**
 * pipe0's code theme — the marketing site's code palette (indigo keywords,
 * emerald strings, slate punctuation) as a Shiki theme, so docs code blocks
 * and the landing page's code previews read as one product. Light only: the
 * site has one theme.
 */
export const pipe0CodeTheme: ThemeRegistrationRaw = {
  name: "pipe0-light",
  type: "light",
  colors: {
    "editor.background": "#fbfbfd",
    "editor.foreground": "#2b3350",
  },
  settings: [
    { settings: { background: "#fbfbfd", foreground: "#2b3350" } },
    {
      scope: ["comment", "punctuation.definition.comment"],
      settings: { foreground: "#98a1b5", fontStyle: "italic" },
    },
    {
      scope: [
        "keyword",
        "storage",
        "storage.type",
        "storage.modifier",
        "keyword.control",
        "keyword.operator.new",
        "keyword.operator.expression",
      ],
      settings: { foreground: "#2c37a4" },
    },
    {
      scope: ["string", "string.quoted", "string.template", "markup.inline.raw"],
      settings: { foreground: "#047857" },
    },
    {
      scope: ["constant.numeric", "constant.language", "constant.character"],
      settings: { foreground: "#b45309" },
    },
    {
      scope: [
        "entity.name.function",
        "support.function",
        "meta.function-call entity.name.function",
      ],
      settings: { foreground: "#3b49e0" },
    },
    {
      scope: [
        "entity.name.type",
        "support.type",
        "support.class",
        "entity.name.class",
        "entity.other.inherited-class",
      ],
      settings: { foreground: "#7c3aed" },
    },
    {
      scope: [
        "support.type.property-name",
        "meta.object-literal.key",
        "variable.other.property",
        "meta.property-name",
      ],
      settings: { foreground: "#1e40af" },
    },
    {
      scope: ["variable", "variable.other", "variable.parameter"],
      settings: { foreground: "#2b3350" },
    },
    {
      scope: ["punctuation", "meta.brace", "keyword.operator"],
      settings: { foreground: "#5b6478" },
    },
    {
      scope: ["entity.name.tag", "support.class.component"],
      settings: { foreground: "#2c37a4" },
    },
    {
      scope: ["entity.other.attribute-name"],
      settings: { foreground: "#3b49e0" },
    },
    {
      scope: ["markup.heading", "markup.bold"],
      settings: { foreground: "#0b0d12", fontStyle: "bold" },
    },
  ],
};
