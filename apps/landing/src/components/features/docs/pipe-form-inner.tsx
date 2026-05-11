"use client";

import type { PipeId, PipePayload, ValidationContext } from "@pipe0/base";
import {
  PipeForm,
  PipeFormContent,
  PipeFormFooter,
  PipeFormGroup,
  PipeFormHeader,
  PipeFormSection,
  PipeFormSubmitButton,
  PipeFormTitle,
  usePipeForm,
} from "@pipe0/react";

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
  const pipeForm = usePipeForm({
    pipeId,
    publicKey: "pk_docs_preview",
    defaultValues,
    validationContext,
  });

  return (
    <PipeForm
      context={pipeForm}
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
      <PipeFormContent className="flex-1 overflow-auto min-h-0 p-4 max-h-120">
        {pipeForm.sections.map((section) => (
          <PipeFormSection key={section.key} section={section}>
            {section.groups.map((group) => (
              <PipeFormGroup key={group.key} group={group} />
            ))}
          </PipeFormSection>
        ))}
      </PipeFormContent>
      <PipeFormFooter className="shrink-0 border-t border-input p-3">
        <PipeFormSubmitButton className="w-full">Run</PipeFormSubmitButton>
      </PipeFormFooter>
    </PipeForm>
  );
}
