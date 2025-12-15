import { CalendarClock } from "lucide-react";
import { getDaysAgo } from "../utils/date";
import { formatCurrencyParts } from "../utils/format";

type BalanceHeroProps = {
  total: number;
  lastRecordDate?: string;
};

export function BalanceHero({ total, lastRecordDate }: BalanceHeroProps) {
  const { intPart, decPart } = formatCurrencyParts(total);

  return (
    <section className="group relative mb-10 cursor-default text-center">
      <p className="mb-3 font-medium text-neutral-500 text-xs uppercase tracking-[0.2em] transition-colors group-hover:text-neutral-400">
        Total Ahorrado
      </p>
      <h1 className="mb-2 font-thin text-[4rem] text-white leading-none tracking-tighter transition-transform duration-700 ease-out group-hover:scale-[1.02]">
        ${intPart}
        <span className="ml-1 align-top font-light text-2xl text-neutral-600 tracking-normal">
          .{decPart}
        </span>
      </h1>

      {/* SVG Accumulation Chart */}
      <div className="relative mx-auto mt-4 h-16 w-full max-w-[280px] overflow-hidden opacity-80 transition-opacity duration-500 group-hover:opacity-100">
        <svg
          aria-hidden="true"
          className="h-full w-full overflow-visible fill-none stroke-emerald-500"
          role="presentation"
          viewBox="0 0 280 60"
        >
          <defs>
            <linearGradient id="gradient" x1="0%" x2="0%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(16, 185, 129, 0.2)" />
              <stop offset="100%" stopColor="rgba(16, 185, 129, 0)" />
            </linearGradient>
          </defs>
          {/* Graph going only up to represent savings */}
          <path
            d="M0,55 C40,50 60,45 100,40 C140,35 180,25 220,15 C240,10 260,5 280,2"
            strokeLinecap="round"
            strokeWidth="1.5"
          />
          <path
            className="opacity-30"
            d="M0,55 C40,50 60,45 100,40 C140,35 180,25 220,15 C240,10 260,5 280,2 V60 H0 Z"
            fill="url(#gradient)"
            stroke="none"
          />
        </svg>
      </div>

      <div className="relative z-10 -mt-2 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/10 bg-emerald-500/5 px-3 py-1 backdrop-blur-sm">
        <CalendarClock
          aria-hidden="true"
          className="h-3 w-3 text-emerald-500"
        />
        <span className="font-medium text-emerald-500 text-xs tracking-wide">
          {getDaysAgo(lastRecordDate ?? null)}
        </span>
      </div>
    </section>
  );
}
