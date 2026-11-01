import {
  FormPreview,
  toComponentName,
} from "@/components/features/docs/form-preview";
import type { SearchId, SearchPayload } from "@pipe0/base";
import { lazy } from "react";

const SearchFormInner = lazy(() =>
  import("./search-form-inner").then((mod) => ({
    default: mod.SearchFormInner,
  })),
);

function exampleCode(searchId: SearchId, searchLabel: string) {
  return `import {
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
import { getSearchDefaultPayload } from "@pipe0/base";

export function ${toComponentName(searchId)}Form() {
  const searchForm = useSearchForm({
    searchId: "${searchId}",
    publicKey: "pk_abc...",
    defaultValues: getSearchDefaultPayload("${searchId}"),
    sectionMap: { pagination: null },
  });

  return (
    <SearchForm
      context={searchForm}
      onSubmit={(payload) => console.log(payload)}
      className="flex flex-col h-full"
    >
      <SearchFormHeader className="shrink-0 border-b border-input px-4 py-3">
        <SearchFormTitle label="${searchLabel.replace(/"/g, '\\"')}" className="text-sm font-semibold m-0" />
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
        <SearchFormSubmitButton className="w-full">Run search</SearchFormSubmitButton>
      </SearchFormFooter>
    </SearchForm>
  );
}
`;
}

export function SearchFormPreview({
  searchId,
  searchLabel,
  defaultValues,
  docsHref,
}: {
  searchId: SearchId;
  searchLabel: string;
  defaultValues: SearchPayload;
  docsHref: string;
}) {
  return (
    <FormPreview docsHref={docsHref} code={exampleCode(searchId, searchLabel)}>
      <SearchFormInner
        searchId={searchId}
        searchLabel={searchLabel}
        defaultValues={defaultValues}
      />
    </FormPreview>
  );
}
