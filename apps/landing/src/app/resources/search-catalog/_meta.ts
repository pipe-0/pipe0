import { MetaRecord } from "nextra";

export default {
  index: {
    title: "Search Catalog | Index",
  },
  "*": {
    theme: {
      sidebar: false,
      toc: false,
      layout: "full",
      pagination: false,
      collapsed: true,
    },
  },
} as MetaRecord;
