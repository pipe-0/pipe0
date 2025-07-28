import { MetaRecord } from "nextra";

const meta: MetaRecord = {
  documentation: {
    title: "Documentation",
    type: "page",
  },
  "pipe-catalog": {
    type: "page",
    theme: {
      collapsed: true,
    },
  },
  "search-catalog": {
    type: "page",
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
};

export default meta;
