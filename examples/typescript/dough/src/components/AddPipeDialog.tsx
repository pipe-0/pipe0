import type { PipeId } from "@pipe0/base";
import {
  PipeCatalog,
  PipeCatalogCard,
  PipeCatalogEmpty,
  PipeCatalogList,
  PipeCatalogSearchFilter,
  usePipeCatalogTable,
} from "@pipe0/react";
import { CatalogCardBody } from "./CatalogCardBody";
import { Modal } from "./Modal";

export function AddPipeDialog({
  open,
  onClose,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (pipeId: PipeId) => void;
}) {
  const ctx = usePipeCatalogTable();

  return (
    <Modal open={open} onClose={onClose} title="Add a pipe">
      <div className="flex flex-1 min-h-0 flex-col gap-3 p-4">
        <PipeCatalog
          context={ctx}
          onSelectPipe={(card) => onPick(card.pipeId)}
          className="flex flex-1 min-h-0 flex-col gap-3"
        >
          <PipeCatalogSearchFilter
            render={(_, { value, setValue }) => (
              <input
                type="search"
                placeholder="Search pipes..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="h-9 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
              />
            )}
          />
          <div className="flex-1 min-h-0 overflow-auto">
            <PipeCatalogList
              render={(_, { cards }) => (
                <div className="flex flex-col gap-2">
                  {cards.map((card) => (
                    <PipeCatalogCard
                      key={card.pipeId}
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
            <PipeCatalogEmpty
              render={() => (
                <div className="grid h-40 place-items-center text-sm text-zinc-500">
                  No pipes match.
                </div>
              )}
            />
          </div>
        </PipeCatalog>
      </div>
    </Modal>
  );
}
