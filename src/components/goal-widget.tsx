import {
  Car,
  Gift,
  GraduationCap,
  Heart,
  Home,
  Laptop,
  type LucideIcon,
  PiggyBank,
  Plane,
  Target,
  Wallet,
} from "lucide-react";
import type { Goal } from "../hooks/use-goals";
import {
  CIRCUMFERENCE,
  PROGRESS_MAX,
  PROGRESS_THRESHOLD,
} from "../utils/constants";
import { formatCurrency } from "../utils/format";

const ICON_MAP: Record<string, LucideIcon> = {
  "piggy-bank": PiggyBank,
  target: Target,
  laptop: Laptop,
  plane: Plane,
  home: Home,
  car: Car,
  gift: Gift,
  "graduation-cap": GraduationCap,
  heart: Heart,
  wallet: Wallet,
};

type GoalWidgetProps = {
  goal: Goal;
  currentAmount: number;
  onClick?: () => void;
};

export function GoalWidget({ goal, currentAmount, onClick }: GoalWidgetProps) {
  const progress =
    goal.meta_total > 0
      ? Math.min(
          PROGRESS_MAX,
          Math.round((currentAmount / goal.meta_total) * 100)
        )
      : 0;

  const strokeDashoffset = CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE;

  const formattedCurrent = formatCurrency(currentAmount, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const formattedGoal = formatCurrency(goal.meta_total, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const IconComponent = ICON_MAP[goal.icono] ?? PiggyBank;

  return (
    <button
      className="group flex w-full cursor-pointer items-center justify-between rounded-2xl border border-white/0.08 bg-subtle/20 p-4 text-left transition-all duration-300 hover:bg-subtle/40"
      onClick={onClick}
      type="button"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/0.08 bg-neutral-900 text-neutral-400">
          <IconComponent aria-hidden="true" className="h-4 w-4" />
        </div>
        <div>
          <p className="font-medium text-sm text-white">{goal.nombre}</p>
          <span className="text-neutral-500 text-xs">
            ${formattedCurrent} / ${formattedGoal}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1.5">
        <span
          className={`font-semibold text-xs ${
            progress >= PROGRESS_THRESHOLD
              ? "text-emerald-500"
              : "text-neutral-400"
          }`}
        >
          {progress}%
        </span>
        {/* Circular Progress Mini */}
        <svg
          aria-hidden="true"
          className="h-5 w-5 -rotate-90 transform"
          role="presentation"
        >
          <circle
            className="text-neutral-800"
            cx="10"
            cy="10"
            fill="transparent"
            r="8"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle
            className={
              progress >= PROGRESS_THRESHOLD ? "text-emerald-500" : "text-white"
            }
            cx="10"
            cy="10"
            fill="transparent"
            r="8"
            stroke="currentColor"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            strokeWidth="2"
          />
        </svg>
      </div>
    </button>
  );
}
