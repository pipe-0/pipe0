import {
  collectRequirementFields,
  type FieldAnnotationsType,
  getPipeInstances,
  type PipePayload,
  validatePipesOrError,
} from "@pipe0/base";

/** Validates a catalog snippet against the fields its pipe declares. */
export function validateSnippet(payload: PipePayload) {
  const [instance] = getPipeInstances([payload]);
  if (!instance) throw new Error("Can't create pipe instance");
  const annotations: FieldAnnotationsType = {};
  for (const { field } of collectRequirementFields(
    instance.getInputRequirement(),
  )) {
    annotations[field.resolvedName] = {
      type: typeof field.type === "function" ? "unknown" : field.type,
      format: typeof field.format === "function" ? null : field.format,
      json_metadata: null,
      label: field.label,
    };
  }
  return validatePipesOrError({
    config: { environment: "production" },
    pipes: [payload],
    field_annotations: annotations,
  });
}
