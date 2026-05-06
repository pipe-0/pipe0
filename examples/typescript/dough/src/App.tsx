import type {
  PipePayload,
  PipesInput,
  SearchId,
  SearchPayload,
  SearchResponse,
} from "@pipe0/base";
import { useState } from "react";
import { AddSearchDialog } from "./components/AddSearchDialog";
import { ConfigureSearchDialog } from "./components/ConfigureSearchDialog";
import { DoughTable } from "./components/DoughTable";
import { seedInput, seedPipes } from "./data/seed";
import { API_BASE_URL, ENVIRONMENT } from "./lib/client";
import { searchResultsToInput } from "./lib/search-results-to-input";

type TableData = {
  source: "example" | "search";
  input: PipesInput[];
  pipes: PipePayload[];
};

export default function App() {
  const [data, setData] = useState<TableData | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pendingSearch, setPendingSearch] = useState<SearchId | null>(null);
  const [searching, setSearching] = useState(false);

  const runSearch = async (payload: SearchPayload) => {
    setSearching(true);
    try {
      const res = await fetch(`${API_BASE_URL}/search/run/sync`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          config: { environment: ENVIRONMENT },
          search: payload,
        }),
      });
      if (!res.ok) throw new Error(`search failed (${res.status})`);
      const body = (await res.json()) as SearchResponse;
      setData({
        source: "search",
        input: searchResultsToInput(body),
        pipes: [],
      });
    } catch (err) {
      console.error("search failed", err);
      alert(`Search failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="min-h-dvh bg-white text-zinc-900">
      <header className="border-b px-6 py-4">
        <h1 className="text-lg font-medium">pipe0 — dough</h1>
        <p className="text-sm text-zinc-500">
          Minimal example: in-memory table with pipe catalog + forms, running against the pipe0
          sandbox proxy.
        </p>
      </header>
      <main className="mx-auto w-full max-w-7xl p-6">
        {data ? (
          <DoughTable
            key={data.source}
            initialInput={data.input}
            initialPipes={data.pipes}
            onReset={() => setData(null)}
          />
        ) : (
          <div className="grid place-items-center rounded border border-dashed border-zinc-300 px-6 py-20">
            <div className="flex flex-col items-center gap-4">
              <p className="text-sm text-zinc-500">
                Start with a sandbox search or load the example table.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPickerOpen(true)}
                  disabled={searching}
                  className="rounded bg-zinc-900 px-3 py-1.5 text-sm text-white hover:bg-zinc-700 disabled:opacity-40"
                >
                  {searching ? "Searching…" : "Sandbox search"}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setData({
                      source: "example",
                      input: seedInput,
                      pipes: seedPipes,
                    })
                  }
                  disabled={searching}
                  className="rounded border bg-white px-3 py-1.5 text-sm hover:bg-zinc-50 disabled:opacity-40"
                >
                  Load example table
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <AddSearchDialog
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onPick={(searchId) => {
          setPickerOpen(false);
          setPendingSearch(searchId);
        }}
      />
      <ConfigureSearchDialog
        open={pendingSearch !== null}
        onClose={() => setPendingSearch(null)}
        searchId={pendingSearch}
        running={searching}
        onRun={runSearch}
      />
    </div>
  );
}
