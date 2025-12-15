import { Trash, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Goal } from "../hooks/use-goals";
import { DEFAULT_GOAL_ICON } from "../utils/constants";

type GoalFormData = Omit<Goal, "id" | "user_id" | "created_at">;

type GoalFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GoalFormData) => void;
  onDelete?: () => void;
  goal?: Goal | null;
};

const ICON_OPTIONS = [
  { value: "piggy-bank", label: "Alcancía" },
  { value: "target", label: "Meta" },
  { value: "laptop", label: "Laptop" },
  { value: "plane", label: "Viaje" },
  { value: "home", label: "Casa" },
  { value: "car", label: "Auto" },
  { value: "gift", label: "Regalo" },
  { value: "graduation-cap", label: "Educación" },
  { value: "heart", label: "Salud" },
  { value: "wallet", label: "Emergencia" },
] as const;

export function GoalFormModal({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  goal,
}: GoalFormModalProps) {
  const [nombre, setNombre] = useState("");
  const [icono, setIcono] = useState(DEFAULT_GOAL_ICON);
  const [metaTotal, setMetaTotal] = useState("");
  const [esPrincipal, setEsPrincipal] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    if (goal) {
      setNombre(goal.nombre);
      setIcono(goal.icono);
      setMetaTotal(goal.meta_total.toString());
      setEsPrincipal(goal.es_principal);
    } else {
      setNombre("");
      setIcono(DEFAULT_GOAL_ICON);
      setMetaTotal("");
      setEsPrincipal(false);
    }
    setErrors({});
  }, [isOpen, goal]);

  if (!isOpen) {
    return null;
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    } else if (nombre.trim().length < 3) {
      newErrors.nombre = "El nombre debe tener al menos 3 caracteres";
    }

    const amount = Number.parseFloat(metaTotal);
    if (!metaTotal) {
      newErrors.metaTotal = "La meta es requerida";
    } else if (Number.isNaN(amount)) {
      newErrors.metaTotal = "La meta debe ser un número válido";
    } else if (amount <= 0) {
      newErrors.metaTotal = "La meta debe ser mayor a 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const amount = Number.parseFloat(metaTotal);

    onSubmit({
      nombre: nombre.trim(),
      icono,
      meta_total: amount,
      es_principal: esPrincipal,
    });

    onClose();
  };

  const isEditing = !!goal;
  const showDeleteButton = isEditing && onDelete !== undefined;
  const title = isEditing ? "Editar Meta" : "Nueva Alcancía";
  const buttonText = isEditing ? "Guardar Cambios" : "Crear Alcancía";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="glass-panel fade-in zoom-in-95 relative w-full max-w-sm animate-in rounded-2xl border border-white/8 p-6 duration-200">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-medium text-lg text-white">{title}</h2>
          <button
            aria-label="Cerrar modal"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-neutral-400 transition-colors hover:text-white"
            onClick={onClose}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label
              className="mb-2 block text-neutral-500 text-xs uppercase tracking-wide"
              htmlFor="nombre"
            >
              Nombre
            </label>
            <input
              aria-describedby={errors.nombre}
              aria-invalid={!!errors.nombre}
              className={`w-full rounded-xl border ${
                errors.nombre
                  ? "border-red-500/50 focus:border-red-500"
                  : "border-white/8 focus:border-emerald-500/50"
              } bg-neutral-900 px-4 py-3 text-white transition-colors placeholder:text-neutral-600 focus:outline-none`}
              id="nombre"
              onChange={(e) => {
                setNombre(e.target.value);
                if (errors.nombre) {
                  setErrors((prev) => ({ ...prev, nombre: "" }));
                }
              }}
              placeholder="Ej: Fondo de emergencia"
              type="text"
              value={nombre}
            />
            {errors.nombre ? (
              <p className="mt-1 text-red-500 text-xs" id="nombre-error">
                {errors.nombre}
              </p>
            ) : null}
          </div>

          {/* Icon */}
          <div>
            <label
              className="mb-2 block text-neutral-500 text-xs uppercase tracking-wide"
              htmlFor="icono"
            >
              Icono
            </label>
            <select
              className="w-full cursor-pointer appearance-none rounded-xl border border-white/8 bg-neutral-900 px-4 py-3 text-white transition-colors focus:border-emerald-500/50 focus:outline-none"
              id="icono"
              onChange={(e) => setIcono(e.target.value)}
              value={icono}
            >
              {ICON_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Goal Amount */}
          <div>
            <label
              className="mb-2 block text-neutral-500 text-xs uppercase tracking-wide"
              htmlFor="metaTotal"
            >
              Meta Total
            </label>
            <div className="relative">
              <span className="absolute top-1/2 left-4 -translate-y-1/2 text-neutral-400">
                $
              </span>
              <input
                aria-describedby={errors.metaTotal}
                aria-invalid={!!errors.metaTotal}
                className={`w-full rounded-xl border ${
                  errors.metaTotal
                    ? "border-red-500/50 focus:border-red-500"
                    : "border-white/8 focus:border-emerald-500/50"
                } bg-neutral-900 px-4 py-3 pl-8 text-white transition-colors placeholder:text-neutral-600 focus:outline-none`}
                id="metaTotal"
                min="0.01"
                onChange={(e) => {
                  setMetaTotal(e.target.value);
                  if (errors.metaTotal) {
                    setErrors((prev) => ({ ...prev, metaTotal: "" }));
                  }
                }}
                placeholder="0.00"
                step="0.01"
                type="number"
                value={metaTotal}
              />
            </div>
            {errors.metaTotal ? (
              <p className="mt-1 text-red-500 text-xs" id="metaTotal-error">
                {errors.metaTotal}
              </p>
            ) : null}
          </div>

          {/* Is Principal */}
          <div className="flex items-center gap-3">
            <input
              aria-describedby="esPrincipal-description"
              checked={esPrincipal}
              className="h-4 w-4 rounded border border-white/8 bg-neutral-900 text-emerald-500 focus:ring-0 focus:ring-offset-0"
              id="esPrincipal"
              onChange={(e) => setEsPrincipal(e.target.checked)}
              type="checkbox"
            />
            <label
              className="cursor-pointer text-neutral-400 text-sm"
              htmlFor="esPrincipal"
              id="esPrincipal-description"
            >
              Establecer como meta principal
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            {showDeleteButton ? (
              <button
                aria-label="Eliminar meta"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500/10 py-3 font-medium text-red-500 transition-colors hover:bg-red-500/20"
                onClick={onDelete}
                type="button"
              >
                <Trash aria-hidden="true" className="h-4 w-4" />
                Eliminar
              </button>
            ) : null}
            <button
              className={`rounded-xl bg-emerald-500 py-3 font-medium text-white transition-colors hover:bg-emerald-600 ${
                showDeleteButton ? "flex-1" : "w-full"
              }`}
              type="submit"
            >
              {buttonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
