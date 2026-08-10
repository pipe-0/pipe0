import { getSearchDefaultPayload, type SearchId, type SearchPayload } from "@pipe0/base";
import {
  SearchForm,
  SearchFormContent,
  SearchFormFooter,
  SearchFormSubmitButton,
} from "@pipe0/react";
import { useMemo } from "react";
import { PUBLIC_KEY } from "../lib/client";
import { makeResolvers } from "../lib/resolvers";
import { Modal } from "./Modal";

export function ConfigureSearchDialog({
  open,
  onClose,
  searchId,
  running,
  onRun,
}: {
  open: boolean;
  onClose: () => void;
  searchId: SearchId | null;
  running: boolean;
  onRun: (payload: SearchPayload) => void;
}) {
  const resolvers = useMemo(() => makeResolvers(), []);

  return (
    <Modal open={open && !!searchId} onClose={onClose} title="Configure search">
      {searchId ? (
        <SearchForm
          searchId={searchId}
          publicKey={PUBLIC_KEY}
          defaultValues={getSearchDefaultPayload(searchId)}
          resolvers={resolvers}
          className="flex flex-1 flex-col min-h-0"
          onSubmit={(_, { form }) => {
            onRun(form.getValues());
            onClose();
          }}
        >
          <SearchFormContent className="flex-1 overflow-auto px-4 py-3" />
          <SearchFormFooter className="flex justify-end border-t px-4 py-3">
            <SearchFormSubmitButton
              disabled={running}
              className="rounded bg-zinc-900 px-3 py-1.5 text-sm text-white hover:bg-zinc-700 disabled:opacity-40"
            >
              {running ? "Searching…" : "Search"}
            </SearchFormSubmitButton>
          </SearchFormFooter>
        </SearchForm>
      ) : null}
    </Modal>
  );
}
