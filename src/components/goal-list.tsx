import { Plus } from "lucide-react";
import type { Goal } from "../hooks/use-goals";
import { GoalWidget } from "./goal-widget";

type GoalListProps = {
  goals: Goal[];
  getAmountForGoal: (goalId: string) => number;
  onGoalClick?: (goal: Goal) => void;
  onAddClick?: () => void;
  title?: string;
  showAddButton?: boolean;
};

export function GoalList({
  goals,
  getAmountForGoal,
  onGoalClick,
  onAddClick,
  title = "Otras Alcancías",
  showAddButton = true,
}: GoalListProps) {
  // Filter out principal goal for this list
  const otherGoals = goals.filter((g) => !g.es_principal);

  if (otherGoals.length === 0 && !showAddButton) {
    return null;
  }

  return (
    <section className="mb-10">
      <div className="mb-4 flex items-center justify-between px-1">
        <h2 className="font-medium text-sm text-white tracking-tight">
          {title}
        </h2>
        {showAddButton ? (
          <button
            aria-label="Agregar alcancía"
            className="cursor-pointer text-neutral-600 transition-colors hover:text-white"
            onClick={onAddClick}
            type="button"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>

      {otherGoals.length === 0 ? (
        <div className="rounded-2xl border border-white/0.08 border-dashed p-4 text-center">
          <p className="text-neutral-500 text-sm">
            No tienes otras alcancías aún
          </p>
          <button
            className="mt-2 text-emerald-500 text-xs transition-colors hover:text-emerald-400"
            onClick={onAddClick}
            type="button"
          >
            Crear una nueva
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {otherGoals.map((goal) => (
            <GoalWidget
              currentAmount={getAmountForGoal(goal.id)}
              goal={goal}
              key={goal.id}
              onClick={() => onGoalClick?.(goal)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
