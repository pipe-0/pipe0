import { MetaRecord } from "nextra";

const meta: MetaRecord = {
  documentation: {
    title: "Documentation",
    type: "page",
  },
  "pipe-catalog": {
    type: "page",
    title: "Pipes",
    theme: {
      collapsed: true,
    },
  },
  "search-catalog": {
    type: "page",
    title: "Searches",
    theme: {
      collapsed: true,
    },
  },
  "api-reference": {
    type: "page",
    title: "API Reference",
    theme: {
      layout: "full",
      sidebar: false,
      toc: false,
    },
  },
  legal: {
    display: "hidden",
  },
};

export default meta;
