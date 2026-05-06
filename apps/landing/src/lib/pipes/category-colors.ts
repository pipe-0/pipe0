import type { PipeCategory } from "@pipe0/base";

export const PIPE_CATEGORY_COLORS: Record<PipeCategory, string> = {
  people_data: "#8B7DFF",
  find_people: "#A78BFA",
  company_data: "#10B981",
  find_comapnies: "#34D399",
  tools: "#EAB308",
  integrations: "#06B6D4",
  actions: "#F97316",
  deprecated: "#94A3B8",
};

const PIPE_CATEGORY_LABELS: Record<PipeCategory, string> = {
  people_data: "People Data",
  find_people: "Find People",
  company_data: "Company Data",
  find_comapnies: "Find Companies",
  tools: "Tools",
  integrations: "Integrations",
  actions: "Actions",
  deprecated: "Deprecated",
};

export function getPipeCategoryMeta(category: PipeCategory) {
  return {
    color: PIPE_CATEGORY_COLORS[category],
    label: PIPE_CATEGORY_LABELS[category],
  };
}
