"use client";

import { UiExampleCard } from "@/components/features/docs/ui-example-card";
import {
  type FieldAnnotationsType,
  getPipeInstances,
  pipesSnippetCatalog,
  type PipeId,
  type PipePayload,
  validatePipesOrError,
} from "@pipe0/elements";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import "@pipe0/elements-react/styles";

const PipeFormComponents = dynamic(
  () => import("./pipe-form-inner").then((mod) => mod.PipeFormInner),
  {
    ssr: false,
    loading: () => <FormSkeleton />,
  },
);

function FormSkeleton() {
  return (
    <div className="flex flex-col h-full">
      <div className="h-12 border-b bg-muted/30 animate-pulse" />
      <div className="flex-1 p-4 space-y-3">
        <div className="h-4 w-1/3 rounded bg-muted animate-pulse" />
        <div className="h-9 rounded bg-muted animate-pulse" />
        <div className="h-4 w-1/4 rounded bg-muted animate-pulse" />
        <div className="h-24 rounded bg-muted animate-pulse" />
      </div>
      <div className="border-t p-3">
        <div className="h-9 rounded bg-muted animate-pulse" />
      </div>
    </div>
  );
}

function getFieldAnnotations(payload: PipePayload): FieldAnnotationsType {
  const [instance] = getPipeInstances([payload]);
  if (!instance) return {};
  const annotations: FieldAnnotationsType = {};
  for (const inputGroup of instance.getInputGroups()) {
    for (const [fieldName, def] of Object.entries(inputGroup.fields)) {
      annotations[fieldName] = {
        type: typeof def.type === "function" ? "unknown" : def.type,
        format: typeof def.format === "function" ? null : def.format,
        json_metadata: null,
        label: def.label,
      };
    }
  }
  return annotations;
}

function generateExampleCode(pipeId: PipeId, pipeLabel: string): string {
  return `import {
  PipeForm,
  PipeFormContent,
  PipeFormFooter,
  PipeFormHeader,
  PipeFormSubmitButton,
  PipeFormTitle,
} from "@pipe0/elements-react";
import { getPipeDefaultPayload } from "@pipe0/elements";
import "@pipe0/elements-react/styles";

export function ${toComponentName(pipeId)}Form() {
  return (
    <PipeForm
      pipeId="${pipeId}"
      publicKey="pk_abc..."
      defaultValues={getPipeDefaultPayload("${pipeId}")}
      onSubmit={(payload) => console.log(payload)}
      className="flex flex-col h-full"
    >
      <PipeFormHeader className="shrink-0 border-b border-input px-4 py-3">
        <PipeFormTitle label="${escape(pipeLabel)}" className="text-sm font-semibold m-0" />
      </PipeFormHeader>
      <PipeFormContent className="flex-1 overflow-auto min-h-0 p-4 max-h-120" />
      <PipeFormFooter className="shrink-0 border-t border-input p-3">
        <PipeFormSubmitButton className="w-full">Run</PipeFormSubmitButton>
      </PipeFormFooter>
    </PipeForm>
  );
}
`;
}

function toComponentName(pipeId: string): string {
  return pipeId
    .replace(/@.*$/, "")
    .split(/[:_-]/)
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}

function escape(s: string): string {
  return s.replace(/"/g, '\\"');
}

export function PipeFormPreview({
  pipeId,
  pipeLabel,
  docsHref,
}: {
  pipeId: PipeId;
  pipeLabel: string;
  docsHref: string;
}) {
  const preview = useMemo(() => {
    try {
      const payload = pipesSnippetCatalog[pipeId]?.[0]?.pipes?.[0];
      if (!payload) return null;
      const validationContext = validatePipesOrError({
        config: { environment: "production" },
        pipes: [payload],
        field_annotations: getFieldAnnotations(payload),
      });
      return { payload, validationContext };
    } catch {
      return null;
    }
  }, [pipeId]);

  const code = useMemo(
    () => generateExampleCode(pipeId, pipeLabel),
    [pipeId, pipeLabel],
  );

  if (!preview) return null;

  return (
    <UiExampleCard
      docsHref={docsHref}
      code={code}
      preview={
        <PipeFormComponents
          pipeId={pipeId}
          pipeLabel={pipeLabel}
          defaultValues={preview.payload}
          validationContext={preview.validationContext}
        />
      }
    />
  );
}
