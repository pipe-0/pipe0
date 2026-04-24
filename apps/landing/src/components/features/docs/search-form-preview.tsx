"use client";

import { UiExampleCard } from "@/components/features/docs/ui-example-card";
import type { SearchId, SearchPayload } from "@pipe0/elements";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import "@pipe0/elements-react/styles";

const SearchFormComponents = dynamic(
  () => import("./search-form-inner").then((mod) => mod.SearchFormInner),
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

function generateExampleCode(searchId: SearchId, searchLabel: string): string {
  return `import {
  SearchForm,
  SearchFormContent,
  SearchFormFooter,
  SearchFormHeader,
  SearchFormSubmitButton,
  SearchFormTitle,
} from "@pipe0/elements-react";
import { getSearchDefaultPayload } from "@pipe0/elements";
import "@pipe0/elements-react/styles";

export function ${toComponentName(searchId)}Form() {
  return (
    <SearchForm
      searchId="${searchId}"
      publicKey="pk_abc..."
      defaultValues={getSearchDefaultPayload("${searchId}")}
      sectionMap={{ pagination: null }}
      onSubmit={(payload) => console.log(payload)}
      className="flex flex-col h-full"
    >
      <SearchFormHeader className="shrink-0 border-b px-4 py-3">
        <SearchFormTitle label="${escape(searchLabel)}" className="text-sm font-semibold m-0" />
      </SearchFormHeader>
      <SearchFormContent className="flex-1 overflow-auto min-h-0 p-4 max-h-120" />
      <SearchFormFooter className="shrink-0 border-t p-3">
        <SearchFormSubmitButton className="w-full">Run search</SearchFormSubmitButton>
      </SearchFormFooter>
    </SearchForm>
  );
}
`;
}

function toComponentName(searchId: string): string {
  return searchId
    .replace(/@.*$/, "")
    .split(/[:_-]/)
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}

function escape(s: string): string {
  return s.replace(/"/g, '\\"');
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
  const code = useMemo(
    () => generateExampleCode(searchId, searchLabel),
    [searchId, searchLabel],
  );

  return (
    <UiExampleCard
      docsHref={docsHref}
      code={code}
      preview={
        <SearchFormComponents
          searchId={searchId}
          searchLabel={searchLabel}
          defaultValues={defaultValues}
        />
      }
    />
  );
}
