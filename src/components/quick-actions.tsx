import { Minus, Plus, Settings2 } from "lucide-react";

type QuickActionsProps = {
  onAdd: () => void;
  onWithdraw: () => void;
  onEditGoal: () => void;
};

export function QuickActions({
  onAdd,
  onWithdraw,
  onEditGoal,
}: QuickActionsProps) {
  const actions = [
    {
      icon: Plus,
      label: "Agregar",
      ariaLabel: "Agregar ahorro",
      onClick: onAdd,
      hoverColor: "group-hover:text-emerald-400",
    },
    {
      icon: Minus,
      label: "Retirar",
      ariaLabel: "Retirar dinero",
      onClick: onWithdraw,
      hoverColor: "group-hover:text-white",
    },
    {
      icon: Settings2,
      label: "Editar Meta",
      ariaLabel: "Editar meta principal",
      onClick: onEditGoal,
      hoverColor: "group-hover:text-white",
    },
  ] as const;

  return (
    <div className="mb-10 grid grid-cols-3 gap-3">
      {actions.map(({ icon: Icon, label, ariaLabel, onClick, hoverColor }) => (
        <button
          aria-label={ariaLabel}
          className="group flex h-16 flex-col items-center justify-center gap-2 rounded-2xl border border-white/8 bg-subtle/20 transition-all duration-300 hover:border-neutral-700 hover:bg-subtle"
          key={label}
          onClick={onClick}
          type="button"
        >
          <Icon
            aria-hidden="true"
            className={`h-5 w-5 text-neutral-400 ${hoverColor} transition-colors`}
          />
          <span className="font-medium text-[10px] text-neutral-500 uppercase tracking-wide group-hover:text-neutral-300">
            {label}
          </span>
        </button>
      ))}
    </div>
  );
}
