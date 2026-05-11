"use client";

import type { SearchId, SearchPayload } from "@pipe0/base";
import {
  SearchForm,
  SearchFormContent,
  SearchFormFooter,
  SearchFormGroup,
  SearchFormHeader,
  SearchFormSection,
  SearchFormSubmitButton,
  SearchFormTitle,
  useSearchForm,
} from "@pipe0/react";

export function SearchFormInner({
  searchId,
  searchLabel,
  defaultValues,
}: {
  searchId: SearchId;
  searchLabel: string;
  defaultValues: SearchPayload;
}) {
  const searchForm = useSearchForm({
    searchId,
    publicKey: "pk_docs_preview",
    defaultValues,
    sectionMap: { pagination: null },
  });

  return (
    <SearchForm
      context={searchForm}
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
      <SearchFormContent className="flex-1 overflow-auto min-h-0 p-4 max-h-120">
        {searchForm.sections.map((section) => (
          <SearchFormSection key={section.key} section={section}>
            {section.groups.map((group) => (
              <SearchFormGroup key={group.key} group={group} />
            ))}
          </SearchFormSection>
        ))}
      </SearchFormContent>
      <SearchFormFooter className="shrink-0 border-t border-input p-3">
        <SearchFormSubmitButton className="w-full">
          Run search
        </SearchFormSubmitButton>
      </SearchFormFooter>
    </SearchForm>
  );
}
