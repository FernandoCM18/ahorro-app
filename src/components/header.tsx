import { PiggyBank } from "lucide-react";
import { useAuth } from "../hooks/use-auth";

export function Header() {
  const { user } = useAuth();
  return (
    <header className="mb-10 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/0.08 bg-subtle text-emerald-500 shadow-emerald-500/5 shadow-lg">
          <PiggyBank aria-hidden="true" className="h-4 w-4 opacity-90" />
        </div>
        <span className="font-medium text-neutral-500 text-xs uppercase tracking-wide">
          Mi Alcancía
        </span>
      </div>
      <button
        aria-label="Perfil de usuario"
        className="flex h-8 w-8 flex-col items-center justify-center overflow-hidden rounded-full border border-white/0.08 bg-neutral-800"
        type="button"
      >
        <span className="font-medium text-neutral-300 text-xs">
          {user?.user_metadata?.name?.slice(0, 2).toUpperCase() ?? "FC"}
        </span>
      </button>
    </header>
  );
}
