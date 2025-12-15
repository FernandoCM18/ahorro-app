import { MoreVertical, Pencil, Trash2 } from "lucide-react";

type HistoryItemMenuProps = {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export function HistoryItemMenu({
  isOpen,
  onToggle,
  onClose,
  onEdit,
  onDelete,
}: HistoryItemMenuProps) {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
    onEdit?.();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
    onDelete?.();
  };

  if (!(onEdit || onDelete)) {
    return null;
  }

  return (
    <div className="relative ml-2">
      <button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="Opciones"
        className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-white/10 hover:text-white"
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        type="button"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {isOpen ? (
        <>
          <div
            aria-hidden="true"
            className="fixed inset-0 z-10"
            onClick={onClose}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                onClose();
              }
            }}
          />
          <div
            className="absolute top-10 right-0 z-20 min-w-[140px] rounded-xl border border-white/0.08 bg-neutral-900 p-1 shadow-lg"
            role="menu"
          >
            {onEdit ? (
              <button
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-neutral-300 text-sm transition-colors hover:bg-white/10 hover:text-white"
                onClick={handleEdit}
                role="menuitem"
                type="button"
              >
                <Pencil aria-hidden="true" className="h-4 w-4" />
                Editar
              </button>
            ) : null}
            {onDelete ? (
              <button
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-red-500 text-sm transition-colors hover:bg-red-500/10"
                onClick={handleDelete}
                role="menuitem"
                type="button"
              >
                <Trash2 aria-hidden="true" className="h-4 w-4" />
                Eliminar
              </button>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
}
