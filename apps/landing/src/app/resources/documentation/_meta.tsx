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
  "searches-request-payload": {
    title: "Request Payload",
  },
  "searches-response-object": {
    title: "Response Object",
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
  "pipes-request-payload": {
    title: "Request Payload",
  },
  "pipes-response-object": {
    title: "Response Object",
  },
  "pipe-concepts": {
    title: (
      <>
        Concepts <span className="badge-new" />
      </>
    ),
  },
  "pipes-inputs": {
    title: "Inputs",
  },
  ____: {
    type: "separator",
    title: "Concepts",
  },
  requests: {
    title: "Requests",
    theme: {
      toc: false,
      layout: "full",
    },
  },
  authentication: {
    title: "Authentication",
    theme: {
      toc: true,
      layout: "full",
    },
  },
  connections: {
    title: (
      <>
        Connections <span className="badge-new" />
      </>
    ),
    theme: {
      toc: true,
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
  "examples-code": {
    title: "Code",
  },
  "examples-workflows": {
    title: "Workflows",
  },
};

export default meta;
