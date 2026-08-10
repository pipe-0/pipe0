import { getPipeDefaultPayload, type PipePayload, type PipesInput } from "@pipe0/base";

export const seedInput: PipesInput[] = [
  {
    id: "1",
    name: "Adam Sandler",
    company_name: "Happy Madison",
    location_hint: "United States",
  },
  {
    id: "2",
    name: "Margot Robbie",
    company_name: "LuckyChap Entertainment",
    location_hint: "Australia",
  },
  {
    id: "3",
    name: "Christopher Nolan",
    company_name: "Syncopy",
    location_hint: "United Kingdom",
  },
];

export const seedPipes: PipePayload[] = [getPipeDefaultPayload("person:profileurl:name@1")];
