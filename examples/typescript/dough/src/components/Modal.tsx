import { type ReactNode, useEffect, useRef } from "react";

export function Modal({
  open,
  onClose,
  children,
  title,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (open && !node.open) node.showModal();
    if (!open && node.open) node.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className="m-auto rounded-md p-0 backdrop:bg-black/40 w-[min(900px,95vw)] max-h-[90dvh] overflow-hidden"
    >
      <div className="flex flex-col max-h-[90dvh]">
        {title ? (
          <div className="flex items-center justify-between border-b px-4 py-2.5">
            <div className="text-sm font-medium">{title}</div>
            <button type="button" onClick={onClose} className="text-zinc-500 hover:text-zinc-900">
              ✕
            </button>
          </div>
        ) : null}
        <div className="flex flex-1 min-h-0 flex-col">{children}</div>
      </div>
    </dialog>
  );
}
