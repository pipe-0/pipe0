import { MetaRecord } from "nextra";

const meta: MetaRecord = {
  documentation: {
    title: "Documentation",
    type: "page",
  },
  "pipe-catalog": {
    type: "page",
  },
  "api-reference": {
    type: "page",
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
