import {
  inputFromRecord,
  type PipeId,
  type PipePayload,
  type PipesInput,
  type PipesRecord,
  transformIntoResponse,
  validatePipesOrError,
} from "@pipe0/base";
import type { PipesRequest } from "@pipe0/client";
import {
  type ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";
import { client, ENVIRONMENT } from "../lib/client";
import { mergeResponseIntoInput } from "../lib/merge-response";
import { AddPipeDialog } from "./AddPipeDialog";
import { CellValue } from "./CellValue";
import { ConfigurePipeDialog } from "./ConfigurePipeDialog";
import { PipeColumnHeader } from "./PipeColumnHeader";

const helper = createColumnHelper<PipesRecord>();

type State = { pipes: PipePayload[]; input: PipesInput[] };

export function DoughTable({
  initialInput,
  initialPipes,
  onReset,
}: {
  initialInput: PipesInput[];
  initialPipes: PipePayload[];
  onReset?: () => void;
}) {
  const [state, setState] = useState<State>({
    pipes: initialPipes,
    input: initialInput,
  });
  const [running, setRunning] = useState(false);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const [addOpen, setAddOpen] = useState(false);
  const [configure, setConfigure] = useState<{
    pipeId: PipeId;
    defaultValues?: PipePayload;
    mode: "create" | "edit";
    editingIdx?: number;
  } | null>(null);

  const validationContext = useMemo(
    () =>
      validatePipesOrError({
        config: { environment: ENVIRONMENT },
        pipes: state.pipes,
        input: state.input,
      }),
    [state.pipes, state.input],
  );

  const records = useMemo(
    () =>
      Object.values(
        transformIntoResponse({
          context: validationContext,
          input: state.input,
        }).records,
      ),
    [validationContext, state.input],
  );

  const runPipes = useCallback(async (pipes: PipePayload[], input: PipesInput[]) => {
    if (pipes.length === 0 || input.length === 0) return;
    setRunning(true);
    try {
      const res = await client.pipes.pipe({
        pipes: pipes as PipesRequest["pipes"],
        input,
        config: { environment: ENVIRONMENT },
      });
      setState((s) => ({
        ...s,
        input: mergeResponseIntoInput(s.input, res),
      }));
    } catch (err) {
      console.error("run failed", err);
      alert(`Run failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setRunning(false);
    }
  }, []);

  const onAddPipe = (payload: PipePayload) => {
    setState((s) => ({ ...s, pipes: [...s.pipes, payload] }));
  };
  const onEditPipe = (idx: number, payload: PipePayload) => {
    setState((s) => ({
      ...s,
      pipes: s.pipes.map((p, i) => (i === idx ? payload : p)),
    }));
  };
  const onRemovePipe = (idx: number) => {
    setState((s) => ({ ...s, pipes: s.pipes.filter((_, i) => i !== idx) }));
  };

  const onDeleteSelected = () => {
    const ids = new Set(Object.keys(rowSelection));
    if (ids.size === 0) return;
    setState((s) => ({
      ...s,
      input: s.input.filter((row) => !ids.has(String(row.id))),
    }));
    setRowSelection({});
  };

  const columns: ColumnDef<PipesRecord, any>[] = useMemo(() => {
    const inputColumns = Object.entries(validationContext.derivedInputFields)
      .filter(([, def]) => def.addedBy === "input")
      .map(([name]) =>
        helper.accessor((row) => row.fields[name], {
          id: `input.${name}`,
          header: name,
          cell: (info) => <CellValue field={info.getValue()} />,
        }),
      );

    const pipeGroups = validationContext.orderedPipeInstances.map((pipe, pipeIdx) =>
      helper.group({
        id: `pipe.${pipeIdx}.${pipe.pipeId}`,
        header: () => (
          <PipeColumnHeader
            pipe={pipe}
            onRun={() => runPipes([state.pipes[pipeIdx]], state.input)}
            onEdit={() =>
              setConfigure({
                pipeId: pipe.pipeId,
                defaultValues: state.pipes[pipeIdx],
                mode: "edit",
                editingIdx: pipeIdx,
              })
            }
            onDelete={() => onRemovePipe(pipeIdx)}
          />
        ),
        columns: Object.values(pipe.getOutputFields()).map((f) =>
          helper.accessor((row) => row.fields[f.resolvedName], {
            id: `pipe.${pipeIdx}.${f.resolvedName}`,
            header: f.resolvedName,
            cell: (info) => <CellValue field={info.getValue()} />,
          }),
        ),
      }),
    );

    return [
      helper.display({
        id: "select",
        size: 36,
        header: ({ table }) => (
          <input
            type="checkbox"
            aria-label="Select all"
            checked={table.getIsAllRowsSelected()}
            ref={(el) => {
              if (el) el.indeterminate = table.getIsSomeRowsSelected();
            }}
            onChange={(e) => table.toggleAllRowsSelected(e.target.checked)}
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            aria-label="Select row"
            checked={row.getIsSelected()}
            onChange={(e) => row.toggleSelected(e.target.checked)}
          />
        ),
      }),
      helper.group({
        id: "input",
        header: "Input",
        columns: inputColumns,
      }),
      ...pipeGroups,
    ];
  }, [validationContext, state.pipes, state.input, runPipes]);

  const table = useReactTable({
    data: records,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (r) => String(r.id),
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
  });

  const selectedInput = useMemo(() => {
    const ids = new Set(Object.keys(rowSelection));
    if (ids.size === 0) return [];
    return records
      .filter((r) => ids.has(String(r.id)))
      .map((r) => inputFromRecord(r) as PipesInput);
  }, [rowSelection, records]);

  return (
    <div className="flex w-full min-w-0 flex-col gap-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="rounded border bg-white px-3 py-1.5 text-sm hover:bg-zinc-50"
        >
          + Add pipe
        </button>
        {onReset ? (
          <button
            type="button"
            onClick={onReset}
            className="text-sm text-zinc-500 hover:text-zinc-900"
          >
            Start over
          </button>
        ) : null}
        <span className="flex-1" />
        <button
          type="button"
          onClick={onDeleteSelected}
          disabled={selectedInput.length === 0}
          className="rounded border bg-white px-3 py-1.5 text-sm hover:bg-zinc-50 disabled:opacity-40"
        >
          Delete selected
        </button>
        <button
          type="button"
          onClick={() => runPipes(state.pipes, selectedInput)}
          disabled={running || selectedInput.length === 0}
          className="rounded border bg-white px-3 py-1.5 text-sm hover:bg-zinc-50 disabled:opacity-40"
        >
          Run selected
        </button>
        <button
          type="button"
          onClick={() => runPipes(state.pipes, state.input)}
          disabled={running}
          className="rounded bg-zinc-900 px-3 py-1.5 text-sm text-white hover:bg-zinc-700 disabled:opacity-40"
        >
          {running ? "Running…" : "Run table"}
        </button>
      </div>

      <div className="overflow-auto rounded border">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-zinc-50">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b">
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className="border-r px-3 py-2 text-left align-middle font-normal text-zinc-700 last:border-r-0"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b last:border-b-0">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="max-w-xs border-r px-3 py-1.5 align-middle last:border-r-0"
                  >
                    <div className="truncate">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddPipeDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onPick={(pipeId) => {
          setAddOpen(false);
          setConfigure({ pipeId, mode: "create" });
        }}
      />
      <ConfigurePipeDialog
        open={configure !== null}
        onClose={() => setConfigure(null)}
        pipeId={configure?.pipeId ?? null}
        defaultValues={configure?.defaultValues}
        mode={configure?.mode ?? "create"}
        validationContext={validationContext}
        existingPipes={state.pipes}
        input={state.input}
        editingIdx={configure?.editingIdx}
        onSubmit={(payload) => {
          if (configure?.mode === "edit" && configure.editingIdx !== undefined) {
            onEditPipe(configure.editingIdx, payload);
          } else {
            onAddPipe(payload);
          }
        }}
      />
    </div>
  );
}
