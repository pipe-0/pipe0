import { MetaRecord } from "nextra";

const meta: MetaRecord = {
  _: {
    type: "separator",
    title: "Getting Started",
  },
  index: {
    title: "Introduction",
    theme: {
      layout: "full",
      toc: false,
    },
  },
  catalogs: {
    title: "Catalogs",
    theme: {
      layout: "full",
      toc: false,
    },
  },
  __: {
    type: "separator",
    title: <span className="badge-new">Searches</span>,
  },
  "searches-quickstart": {
    title: "Quickstart",
    theme: {
      layout: "full",
      toc: false,
    },
  },
  ___: {
    type: "separator",
    title: "Pipes",
  },
  "pipes-quickstart": {
    title: "Quickstart",
    theme: {
      layout: "full",
      toc: false,
    },
  },
  "request-payload": {
    title: "Request Payload",
  },
  "response-object": {
    title: "Response Object",
  },
  "pipe-concepts": {
    title: "Concepts",
  },
  "input-sanitation": {
    title: "Input Sanitation",
  },
  ____: {
    type: "separator",
    title: "Concepts",
  },
  authentication: {
    title: "Authentication",
    theme: {
      toc: false,
      layout: "full",
    },
  },
  billing: {
    title: "Billing",
  },
  ______: {
    type: "separator",
    title: "Examples",
  },
  "code-examples": {
    title: "Code",
  },
};

export default meta;
