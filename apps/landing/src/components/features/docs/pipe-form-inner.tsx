import { validateSnippet } from "@/lib/pipes/validate-snippet";
import { type PipeId, pipesSnippetCatalog } from "@pipe0/base";
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

import { useMemo } from "react";
import "@pipe0/react/styles";

export function PipeFormInner({
  pipeId,
  pipeLabel,
}: {
  pipeId: PipeId;
  pipeLabel: string;
}) {
  const { payload, validationContext } = useMemo(() => {
    const payload = pipesSnippetCatalog[pipeId]![0]!.pipes[0]!;
    return { payload, validationContext: validateSnippet(payload) };
  }, [pipeId]);

  const pipeForm = usePipeForm({
    pipeId,
    publicKey: "pk_docs_preview",
    defaultValues: payload,
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
