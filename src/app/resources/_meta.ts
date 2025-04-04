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
  "api-reference": {
    type: "page",
    display: "hidden",
  },
  blog: {
    type: "page",
    title: "Blog",
    href: "/blog",
  },
  legal: {
    display: "hidden",
  },
};

export default meta;
