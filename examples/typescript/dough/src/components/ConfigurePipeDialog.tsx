import {
  getPipeDefaultPayload,
  type PipeId,
  PipelineValidationError,
  type PipePayload,
  type PipesInput,
  type ValidationContext,
  validatePipesOrError,
} from "@pipe0/base";
import {
  PipeForm,
  PipeFormContent,
  PipeFormFooter,
  PipeFormGroup,
  PipeFormSection,
  PipeFormSubmitButton,
  usePipeForm,
} from "@pipe0/react";
import { useEffect, useMemo, useState } from "react";
import { ENVIRONMENT, PUBLIC_KEY } from "../lib/client";
import { makeResolvers } from "../lib/resolvers";
import { Modal } from "./Modal";

type ConfigurePipeFormProps = {
  open: boolean;
  pipeId: PipeId;
  defaultValues?: PipePayload;
  onSubmit: (payload: PipePayload) => void;
  onClose: () => void;
  mode: "create" | "edit";
  validationContext: ValidationContext;
  existingPipes: PipePayload[];
  input: PipesInput[];
  editingIdx?: number;
};

function ConfigurePipeForm({
  open,
  pipeId,
  defaultValues,
  onSubmit,
  onClose,
  mode,
  validationContext,
  existingPipes,
  input,
  editingIdx,
}: ConfigurePipeFormProps) {
  const resolvers = useMemo(() => makeResolvers(), []);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) setError(null);
  }, [open]);

  const pipeForm = usePipeForm({
    pipeId,
    publicKey: PUBLIC_KEY,
    defaultValues: defaultValues ?? getPipeDefaultPayload(pipeId),
    resolvers,
    validationContext,
  });

  return (
    <PipeForm
      context={pipeForm}
      className="flex flex-1 flex-col min-h-0"
      onSubmit={(_, { form }) => {
        const payload = form.getValues();
        const proposed =
          mode === "edit" && editingIdx !== undefined
            ? existingPipes.map((p, i) => (i === editingIdx ? payload : p))
            : [...existingPipes, payload];
        try {
          validatePipesOrError({
            config: { environment: ENVIRONMENT },
            pipes: proposed,
            input,
          });
        } catch (err) {
          setError(
            err instanceof PipelineValidationError
              ? err.errors.map((e) => e.message).join(", ")
              : err instanceof Error
                ? err.message
                : String(err),
          );
          return;
        }
        setError(null);
        onSubmit(payload);
        onClose();
      }}
    >
      <PipeFormContent className="flex-1 overflow-auto px-4 py-3">
        {pipeForm.sections.map((section) => (
          <PipeFormSection key={section.key} section={section}>
            {section.groups.map((group) => (
              <PipeFormGroup key={group.key} group={group} />
            ))}
          </PipeFormSection>
        ))}
      </PipeFormContent>
      <PipeFormFooter className="flex flex-col gap-2 border-t px-4 py-3">
        {error ? (
          <div
            role="alert"
            className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
          >
            {error}
          </div>
        ) : null}
        <div className="flex justify-end">
          <PipeFormSubmitButton className="rounded bg-zinc-900 px-3 py-1.5 text-sm text-white hover:bg-zinc-700">
            {mode === "create" ? "Add pipe" : "Save"}
          </PipeFormSubmitButton>
        </div>
      </PipeFormFooter>
    </PipeForm>
  );
}

export function ConfigurePipeDialog({
  open,
  onClose,
  pipeId,
  defaultValues,
  onSubmit,
  mode,
  validationContext,
  existingPipes,
  input,
  editingIdx,
}: {
  open: boolean;
  onClose: () => void;
  pipeId: PipeId | null;
  defaultValues?: PipePayload;
  onSubmit: (payload: PipePayload) => void;
  mode: "create" | "edit";
  validationContext: ValidationContext;
  existingPipes: PipePayload[];
  input: PipesInput[];
  editingIdx?: number;
}) {
  return (
    <Modal
      open={open && !!pipeId}
      onClose={onClose}
      title={mode === "create" ? "Configure pipe" : "Edit pipe"}
    >
      {pipeId ? (
        <ConfigurePipeForm
          key={pipeId}
          open={open}
          pipeId={pipeId}
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          onClose={onClose}
          mode={mode}
          validationContext={validationContext}
          existingPipes={existingPipes}
          input={input}
          editingIdx={editingIdx}
        />
      ) : null}
    </Modal>
  );
}
