import type { SearchId } from "@pipe0/base";
import {
  SearchCatalog,
  SearchCatalogCard,
  SearchCatalogEmpty,
  SearchCatalogList,
  SearchCatalogSearchFilter,
  useSearchCatalogTable,
} from "@pipe0/react";
import { CatalogCardBody } from "./CatalogCardBody";
import { Modal } from "./Modal";

export function AddSearchDialog({
  open,
  onClose,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (searchId: SearchId) => void;
}) {
  const ctx = useSearchCatalogTable();

  return (
    <Modal open={open} onClose={onClose} title="Pick a search">
      <div className="flex flex-1 min-h-0 flex-col gap-3 p-4">
        <SearchCatalog
          context={ctx}
          onSelectSearch={(card) => onPick(card.searchId)}
          className="flex flex-1 min-h-0 flex-col gap-3"
        >
          <SearchCatalogSearchFilter
            render={({ value, setValue }) => (
              <input
                type="search"
                placeholder="Search…"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="h-9 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
              />
            )}
          />
          <div className="flex-1 min-h-0 overflow-auto">
            <SearchCatalogList
              render={({ cards }) => (
                <div className="flex flex-col gap-2">
                  {cards.map((card) => (
                    <SearchCatalogCard
                      key={card.searchId}
                      card={card}
                      render={(props) => (
                        <div
                          {...props}
                          className="cursor-pointer rounded-md border border-zinc-200 bg-white px-3 py-2.5 transition-colors hover:bg-zinc-50"
                        >
                          <CatalogCardBody
                            title={card.label}
                            description={card.description}
                            cost={card.startingCreditAmount}
                            costMode={card.costMode}
                            providers={card.providers.length}
                          />
                        </div>
                      )}
                    />
                  ))}
                </div>
              )}
            />
            <SearchCatalogEmpty
              render={() => (
                <div className="grid h-40 place-items-center text-sm text-zinc-500">
                  No searches match.
                </div>
              )}
            />
          </div>
        </SearchCatalog>
      </div>
    </Modal>
  );
}
