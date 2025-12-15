import { History, Home, Target } from "lucide-react";

export type View = "home" | "goals" | "history";

type FloatingDockProps = {
  activeView: View;
  onViewChange: (view: View) => void;
};

export function FloatingDock({ activeView, onViewChange }: FloatingDockProps) {
  const navItems: { view: View; icon: typeof Home; label: string }[] = [
    { view: "home", icon: Home, label: "Inicio" },
    { view: "goals", icon: Target, label: "Metas" },
    { view: "history", icon: History, label: "Historial" },
  ];

  return (
    <nav className="glass-dock fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full px-2 py-2">
      {navItems.map(({ view, icon: Icon, label }) => (
        <button
          aria-label={label}
          className={`rounded-full p-3 transition-all hover:scale-105 ${
            activeView === view
              ? "bg-white/10 text-white"
              : "text-neutral-500 hover:bg-white/5 hover:text-white"
          }`}
          key={view}
          onClick={() => onViewChange(view)}
          type="button"
        >
          <Icon className="h-5 w-5" />
        </button>
      ))}
    </nav>
  );
}
