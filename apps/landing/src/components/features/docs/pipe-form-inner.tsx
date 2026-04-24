"use client";

import type { PipeId, PipePayload, ValidationContext } from "@pipe0/elements";
import {
  PipeForm,
  PipeFormContent,
  PipeFormFooter,
  PipeFormHeader,
  PipeFormSubmitButton,
  PipeFormTitle,
} from "@pipe0/elements-react";

export function PipeFormInner({
  pipeId,
  pipeLabel,
  defaultValues,
  validationContext,
}: {
  pipeId: PipeId;
  pipeLabel: string;
  defaultValues: PipePayload;
  validationContext?: ValidationContext;
}) {
  return (
    <PipeForm
      pipeId={pipeId}
      publicKey="pk_docs_preview"
      defaultValues={defaultValues}
      validationContext={validationContext}
      onSubmit={(payload) => {
        console.log("Submitted pipe payload:", payload);
      }}
      className="flex flex-col h-full"
    >
      <PipeFormHeader className="shrink-0 border-b border-input px-4 py-3">
        <PipeFormTitle
          label={pipeLabel}
          className="text-sm font-semibold m-0"
        />
      </PipeFormHeader>
      <PipeFormContent className="flex-1 overflow-auto min-h-0 p-4 max-h-120" />
      <PipeFormFooter className="shrink-0 border-t border-input p-3">
        <PipeFormSubmitButton className="w-full">Run</PipeFormSubmitButton>
      </PipeFormFooter>
    </PipeForm>
  );
}
