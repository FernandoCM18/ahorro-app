import type { Record } from "../hooks/use-records";
import { HistoryItem } from "./history-item";

type HistoryListProps = {
  records: Record[];
  limit?: number;
  onRecordClick?: (record: Record) => void;
  onEdit?: (record: Record) => void;
  onDelete?: (record: Record) => void;
  title?: string;
  showViewAll?: boolean;
  onViewAll?: () => void;
};

export function HistoryList({
  records,
  limit,
  onRecordClick,
  onEdit,
  onDelete,
  title = "Historial de Ahorro",
  showViewAll = false,
  onViewAll,
}: HistoryListProps) {
  const displayRecords = limit ? records.slice(0, limit) : records;
  const shouldShowViewAll =
    showViewAll && limit !== undefined && records.length > limit;

  if (records.length === 0) {
    return (
      <section>
        <h2 className="mb-4 px-1 font-medium text-sm text-white tracking-tight">
          {title}
        </h2>
        <div className="rounded-2xl border border-white/0.08 border-dashed p-4 text-center">
          <p className="text-neutral-500 text-sm">No hay registros aún</p>
          <p className="mt-1 text-neutral-600 text-xs">
            Agrega tu primer ahorro para comenzar
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="mb-4 flex items-center justify-between px-1">
        <h2 className="font-medium text-sm text-white tracking-tight">
          {title}
        </h2>
        {shouldShowViewAll ? (
          <button
            className="text-emerald-500 text-xs transition-colors hover:text-emerald-400"
            onClick={onViewAll}
            type="button"
          >
            Ver todo
          </button>
        ) : null}
      </div>
      <div className="space-y-1">
        {displayRecords.map((record) => (
          <HistoryItem
            key={record.id}
            onClick={() => onRecordClick?.(record)}
            onDelete={onDelete}
            onEdit={onEdit}
            record={record}
          />
        ))}
      </div>
    </section>
  );
}
