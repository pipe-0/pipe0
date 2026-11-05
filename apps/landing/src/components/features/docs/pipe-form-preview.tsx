import {
  FormPreview,
  toComponentName,
} from "@/components/features/docs/form-preview";
import type { PipeId } from "@pipe0/base";
import { lazy } from "react";

const PipeFormInner = lazy(() =>
  import("./pipe-form-inner").then((mod) => ({ default: mod.PipeFormInner })),
);

function exampleCode(pipeId: PipeId, pipeLabel: string) {
  return `import {
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
import { getPipeDefaultPayload } from "@pipe0/base";

export function ${toComponentName(pipeId)}Form() {
  const pipeForm = usePipeForm({
    pipeId: "${pipeId}",
    publicKey: "pk_abc...",
    defaultValues: getPipeDefaultPayload("${pipeId}"),
  });

  return (
    <PipeForm
      context={pipeForm}
      onSubmit={(payload) => console.log(payload)}
      className="flex flex-col h-full"
    >
      <PipeFormHeader className="shrink-0 border-b border-input px-4 py-3">
        <PipeFormTitle label="${pipeLabel.replace(/"/g, '\\"')}" className="text-sm font-semibold m-0" />
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
`;
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
  return (
    <FormPreview docsHref={docsHref} code={exampleCode(pipeId, pipeLabel)}>
      <PipeFormInner pipeId={pipeId} pipeLabel={pipeLabel} />
    </FormPreview>
  );
}
