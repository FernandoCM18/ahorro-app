import { KeyRound, Loader2, Mail } from "lucide-react";
import { useState } from "react";

type AuthScreenProps = {
  onSubmit: (email: string) => Promise<{ error: Error | null }>;
  verifying?: boolean;
  authError?: string | null;
  onClearError?: () => void;
};

export function AuthScreen({
  onSubmit,
  verifying = false,
  authError,
  onClearError,
}: AuthScreenProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await onSubmit(email);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("¡Revisa tu correo para el link de acceso!");
    }
    setLoading(false);
  };

  // Show verification state
  if (verifying) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div aria-live="polite" className="text-center">
          <Loader2
            aria-hidden="true"
            className="mx-auto mb-4 h-8 w-8 animate-spin text-emerald-500"
          />
          <p className="text-neutral-400">Verificando tu enlace mágico...</p>
        </div>
      </div>
    );
  }

  // Show auth error
  if (authError) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div
          aria-live="assertive"
          className="glass-panel w-full max-w-sm rounded-2xl border border-white/0.08 p-6 text-center"
          role="alert"
        >
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10">
            <KeyRound aria-hidden="true" className="h-6 w-6 text-red-500" />
          </div>
          <h2 className="mb-2 font-medium text-lg text-white">
            Error de autenticación
          </h2>
          <p className="mb-6 text-neutral-400 text-sm">{authError}</p>
          <button
            className="w-full rounded-xl bg-white/10 py-3 font-medium text-white transition-colors hover:bg-white/20"
            onClick={onClearError}
            type="button"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-white/0.08 bg-subtle text-emerald-500">
            <KeyRound aria-hidden="true" className="h-8 w-8" />
          </div>
          <h1 className="mb-2 font-light text-2xl text-white tracking-tight">
            Mi Alcancía
          </h1>
          <p className="text-neutral-500 text-sm">
            Ingresa tu correo para recibir un enlace mágico
          </p>
        </div>

        {/* Form */}
        <form
          className="glass-panel rounded-2xl border border-white/0.08 p-6"
          onSubmit={handleSubmit}
        >
          <div className="mb-4">
            <label
              className="mb-2 block text-neutral-500 text-xs uppercase tracking-wide"
              htmlFor="email"
            >
              Correo electrónico
            </label>
            <div className="relative">
              <Mail
                aria-hidden="true"
                className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-neutral-400"
              />
              <input
                className="w-full rounded-xl border border-white/0.08 bg-neutral-900 px-4 py-3 pl-11 text-white transition-colors placeholder:text-neutral-600 focus:border-emerald-500/50 focus:outline-none"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                required
                type="email"
                value={email}
              />
            </div>
          </div>

          {message ? (
            <div
              aria-live="polite"
              className={`mb-4 rounded-xl p-3 text-sm ${
                message.includes("Revisa")
                  ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                  : "border border-red-500/20 bg-red-500/10 text-red-500"
              }`}
              role="alert"
            >
              {message}
            </div>
          ) : null}

          <button
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 font-medium text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={loading}
            type="submit"
          >
            {loading ? (
              <>
                <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              "Enviar enlace mágico"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
