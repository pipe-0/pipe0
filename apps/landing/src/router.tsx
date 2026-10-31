import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  return createRouter({
    routeTree,
    scrollRestoration: true,
    trailingSlash: "never",
    // Catalog URLs carry raw colons, as in row:append:sheet.
    pathParamsAllowedCharacters: [":"],
    defaultPreload: "intent",
    // Content changes only on deploy, so loaded data stays good for the visit.
    defaultStaleTime: Number.POSITIVE_INFINITY,
    defaultPreloadStaleTime: Number.POSITIVE_INFINITY,
  });
}
