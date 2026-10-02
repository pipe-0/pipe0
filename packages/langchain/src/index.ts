import { enrichCompany } from "./enrich-company.js";
import { enrichPerson } from "./enrich-person.js";
import { findPeople } from "./find-people.js";
import type { Pipe0ToolOptions } from "./shared.js";

export { enrichCompany } from "./enrich-company.js";
export { enrichPerson } from "./enrich-person.js";
export { findPeople } from "./find-people.js";
export type { Pipe0Environment, Pipe0ToolOptions } from "./shared.js";

/** All pipe0 tools, sharing one set of options. */
export function pipe0Tools(options: Pipe0ToolOptions = {}) {
  return [findPeople(options), enrichPerson(options), enrichCompany(options)];
}
