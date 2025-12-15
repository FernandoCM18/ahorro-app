import { ArrowDown, ArrowUp } from "lucide-react";
import { useState } from "react";
import type { Record } from "../hooks/use-records";
import { formatCurrency } from "../utils/format";
import { HistoryItemMenu } from "./history-item-menu";

type HistoryItemProps = {
  record: Record;
  onClick?: () => void;
  onEdit?: (record: Record) => void;
  onDelete?: (record: Record) => void;
};

export function HistoryItem({
  record,
  onClick,
  onEdit,
  onDelete,
}: HistoryItemProps) {
  const [showMenu, setShowMenu] = useState(false);
  const isPositive = record.monto >= 0;
  const formattedAmount = formatCurrency(Math.abs(record.monto));

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-MX", {
      weekday: "long",
      day: "numeric",
      month: "short",
    });
  };

  const Icon = isPositive ? ArrowDown : ArrowUp;
  const description = record.descripcion || (isPositive ? "Ahorro" : "Retiro");

  const menuProps: {
    isOpen: boolean;
    onClose: () => void;
    onToggle: () => void;
    onDelete?: () => void;
    onEdit?: () => void;
  } = {
    isOpen: showMenu,
    onClose: () => setShowMenu(false),
    onToggle: () => setShowMenu((prev) => !prev),
  };

  if (onDelete) {
    menuProps.onDelete = () => onDelete(record);
  }

  if (onEdit) {
    menuProps.onEdit = () => onEdit(record);
  }

  return (
    <div className="group relative flex w-full items-center justify-between rounded-xl px-3 py-3 transition-colors hover:bg-white/5">
      <button
        className="flex flex-1 cursor-pointer items-center justify-between text-left"
        onClick={onClick}
        type="button"
      >
        <div className="flex items-center gap-4">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full border border-white/8 bg-black transition-colors ${
              isPositive
                ? "text-emerald-500 group-hover:border-emerald-500/20 group-hover:text-emerald-400"
                : "text-red-500 group-hover:border-red-500/20 group-hover:text-red-400"
            }`}
          >
            <Icon aria-hidden="true" className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-neutral-300 text-sm transition-colors group-hover:text-white">
              {description}
            </span>
            <span className="text-neutral-600 text-xs capitalize">
              {formatDate(record.fecha)}
            </span>
          </div>
        </div>
        <span
          className={`font-medium text-sm ${
            isPositive ? "text-emerald-500" : "text-red-500"
          }`}
        >
          {isPositive ? "+" : "-"}${formattedAmount}
        </span>
      </button>

      <HistoryItemMenu {...menuProps} />
    </div>
  );
}
