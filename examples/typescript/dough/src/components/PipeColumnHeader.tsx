import { getPipeEntry, type Pipe } from "@pipe0/base";
import { AvatarGroup } from "@pipe0/react";

export function PipeColumnHeader({
  pipe,
  onRun,
  onEdit,
  onDelete,
}: {
  pipe: Pipe;
  onRun: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const entry = getPipeEntry(pipe.pipeId);
  return (
    <div className="flex items-center gap-2">
      <AvatarGroup providers={pipe.getProviderNames()} size="sm" />
      <span className="font-medium truncate">{entry.label}</span>
      <span className="flex-1" />
      <button
        type="button"
        onClick={onRun}
        title="Run this pipe"
        className="rounded px-1.5 py-0.5 text-xs text-zinc-600 hover:bg-zinc-100"
      >
        ▶
      </button>
      <button
        type="button"
        onClick={onEdit}
        title="Edit pipe"
        className="rounded px-1.5 py-0.5 text-xs text-zinc-600 hover:bg-zinc-100"
      >
        ✎
      </button>
      <button
        type="button"
        onClick={onDelete}
        title="Remove pipe"
        className="rounded px-1.5 py-0.5 text-xs text-zinc-600 hover:bg-zinc-100"
      >
        ✕
      </button>
    </div>
  );
}
