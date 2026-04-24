"use client";

import type { SearchId, SearchPayload } from "@pipe0/elements";
import {
  SearchForm,
  SearchFormContent,
  SearchFormFooter,
  SearchFormHeader,
  SearchFormSubmitButton,
  SearchFormTitle,
} from "@pipe0/elements-react";

export function SearchFormInner({
  searchId,
  searchLabel,
  defaultValues,
}: {
  searchId: SearchId;
  searchLabel: string;
  defaultValues: SearchPayload;
}) {
  return (
    <SearchForm
      searchId={searchId}
      publicKey="pk_docs_preview"
      defaultValues={defaultValues}
      sectionMap={{ pagination: null }}
      onSubmit={(payload) => {
        console.log("Submitted search payload:", payload);
      }}
      className="flex flex-col h-full"
    >
      <SearchFormHeader className="shrink-0 border-b border-input px-4 py-3">
        <SearchFormTitle
          label={searchLabel}
          className="text-sm font-semibold m-0"
        />
      </SearchFormHeader>
      <SearchFormContent className="flex-1 overflow-auto min-h-0 p-4 max-h-120" />
      <SearchFormFooter className="shrink-0 border-t border-input p-3">
        <SearchFormSubmitButton className="w-full">
          Run search
        </SearchFormSubmitButton>
      </SearchFormFooter>
    </SearchForm>
  );
}
