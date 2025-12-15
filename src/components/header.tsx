import { LogOut, PiggyBank } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../hooks/use-auth";

export function Header() {
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    await signOut();
    setMenuOpen(false);
  };

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [menuOpen]);

  const userInitials =
    user?.user_metadata?.name?.slice(0, 2).toUpperCase() ??
    user?.email?.slice(0, 2).toUpperCase() ??
    "FC";

  return (
    <header className="mb-10 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/8 bg-subtle text-emerald-500 shadow-emerald-500/5 shadow-lg">
          <PiggyBank aria-hidden="true" className="h-4 w-4 opacity-90" />
        </div>
        <span className="font-medium text-neutral-500 text-xs uppercase tracking-wide">
          Mi Alcancía
        </span>
      </div>
      <div className="relative z-50" ref={menuRef}>
        <button
          aria-label="Perfil de usuario"
          className="flex h-8 w-8 flex-col items-center justify-center overflow-hidden rounded-full border border-white/8 bg-neutral-800 transition-colors hover:bg-neutral-700"
          onClick={() => {
            setMenuOpen(!menuOpen);
          }}
          type="button"
        >
          <span className="font-medium text-neutral-300 text-xs">
            {userInitials}
          </span>
        </button>
        {menuOpen ? (
          <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg border border-white/8 bg-neutral-800 shadow-lg">
            <div className="p-2">
              <div className="px-3 py-2 text-neutral-400 text-xs">
                <div className="font-medium text-neutral-300 text-sm">
                  {user?.email}
                </div>
              </div>
              <button
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-neutral-400 text-sm transition-colors hover:bg-neutral-700 hover:text-neutral-200"
                onClick={handleSignOut}
                type="button"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
