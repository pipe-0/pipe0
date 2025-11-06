import type { SearchesRequestPayload, SearchesResponse } from "@pipe0/ops";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";

const API_BASE_URL = "https://sandbox-proxy.pipe0.com/v1";

const useSearch = () => {
  return useMutation<SearchesResponse, Error, SearchesRequestPayload>({
    mutationFn: async (payload) => {
      const response = await fetch(`${API_BASE_URL}/searches/run/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    },
    onError: (error) => {
      console.error("Search failed:", error);
    },
  });
};

interface SearchSectionProps {
  title: string;
  description: string;
  payload: SearchesRequestPayload;
  emoji: string;
}

export const SearchSection: React.FC<SearchSectionProps> = ({
  title,
  description,
  payload,
  emoji,
}) => {
  const [showCode, setShowCode] = useState(false);
  const searchMutation = useSearch();

  const handleSearch = () => {
    searchMutation.mutate(payload);
  };

  return (
    <div className="border border-slate-200 rounded-lg p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4 text-slate-800">
        {emoji} {title}
      </h3>
      <p className="text-slate-600 mb-4 text-sm">{description}</p>

      <button
        onClick={handleSearch}
        disabled={searchMutation.isPending}
        className="bg-blue-500 hover:bg-blue-600 disabled:bg-slate-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
      >
        {searchMutation.isPending ? "Searching..." : "Search"}
      </button>

      <div className="mt-3">
        <button
          onClick={() => setShowCode(!showCode)}
          className="bg-slate-600 hover:bg-slate-700 text-white text-sm py-1 px-3 rounded transition-colors duration-200"
        >
          {showCode ? "Hide" : "Show"} Request Code
        </button>

        {showCode && <RequestCodeBlock code={payload} />}
      </div>

      {searchMutation.isPending && (
        <div className="mt-5 text-slate-600 italic">Searching...</div>
      )}

      {searchMutation.error && (
        <div className="mt-5 text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
          Error: {searchMutation.error.message}
        </div>
      )}

      {searchMutation.data && (
        <div className="mt-5">
          <h4 className="font-medium mb-4 text-slate-800">Results:</h4>
          <pre className="bg-slate-900 text-slate-100 p-4 rounded-md text-xs overflow-x-auto mt-3 font-mono max-h-[400px] overflow-auto">
            {JSON.stringify(searchMutation.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

interface CodeBlockProps {
  code: unknown;
}

export const RequestCodeBlock: React.FC<CodeBlockProps> = ({ code }) => {
  const codeString = `const response = await fetch("https://api.pipe0.com/v1/searches/run", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(${JSON.stringify(code, null, 2)})
});

const data = await response.json();`;

  return (
    <pre className="bg-slate-900 text-slate-100 p-4 rounded-md text-xs overflow-x-auto mt-3 font-mono  max-h-[400px] overflow-auto">
      {codeString}
    </pre>
  );
};
