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
  quickstart: {
    title: "Quickstart",
    theme: {
      layout: "full",
      toc: false,
    },
  },
  __: {
    type: "separator",
    title: "Concepts",
  },
  "request-payload": {
    title: "Request Payload",
  },
  "response-object": {
    title: "Response Object",
  },
  authentication: {
    title: "Authentication",
    theme: {
      toc: false,
      layout: "full",
    },
  },
  _____: {
    type: "separator",
    title: "Advanced",
  },
  "pipe-concepts": {
    title: "Pipe Concepts",
  },
  "input-sanitation": {
    title: "Input Sanitation",
  },
  ____: {
    type: "separator",
    title: "Other",
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
