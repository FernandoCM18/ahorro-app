import { Target } from "lucide-react";
import type { Goal } from "../hooks/use-goals";
import { PROGRESS_MAX } from "../utils/constants";
import { formatCurrency } from "../utils/format";

type GoalCardProps = {
  goal: Goal;
  currentAmount: number;
};

export function GoalCard({ goal, currentAmount }: GoalCardProps) {
  const progress =
    goal.meta_total > 0
      ? Math.min(
          PROGRESS_MAX,
          Math.round((currentAmount / goal.meta_total) * 100)
        )
      : 0;

  const formattedGoal = formatCurrency(goal.meta_total, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return (
    <div className="group relative mb-4 cursor-pointer">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-neutral-800 to-black opacity-40 blur-xl transition duration-700 group-hover:opacity-60" />
      <div className="glass-panel relative flex h-40 w-full flex-col justify-between rounded-2xl border border-white/8 p-6 transition-all duration-500 group-hover:translate-y-[-2px] group-hover:border-neutral-700">
        {/* Header of Card */}
        <div className="flex items-start justify-between">
          <div>
            <span className="font-medium text-neutral-500 text-xs uppercase tracking-widest">
              Meta Principal
            </span>
            <h3 className="mt-1 font-medium text-lg text-white tracking-tight">
              {goal.nombre}
            </h3>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5">
            <Target aria-hidden="true" className="h-4 w-4 text-white" />
          </div>
        </div>

        {/* Progress Section */}
        <div>
          <div className="mb-2 flex items-end justify-between">
            <span className="font-light text-2xl text-white tracking-tight">
              {progress}%
            </span>
            <span className="font-medium text-neutral-400 text-xs">
              Meta: ${formattedGoal}
            </span>
          </div>
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-neutral-800">
            <div
              className="absolute top-0 left-0 h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
            {/* Shine effect on bar */}
            <div
              className="absolute top-0 left-0 h-full overflow-hidden rounded-full"
              style={{ width: `${progress}%` }}
            >
              <div className="progress-bar-shine h-full w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
