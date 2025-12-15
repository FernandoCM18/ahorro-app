import { X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Goal } from "../hooks/use-goals";
import type { Record as RecordType } from "../hooks/use-records";
import { getTodayISO } from "../utils/date";

type RecordFormData = Omit<RecordType, "id" | "user_id" | "created_at">;

type AddRecordModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RecordFormData) => void;
  goals: Goal[];
  mode: "add" | "withdraw";
  record?: RecordType | null;
};

export function AddRecordModal({
  isOpen,
  onClose,
  onSubmit,
  goals,
  mode,
  record,
}: AddRecordModalProps) {
  const [monto, setMonto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [metaId, setMetaId] = useState<string | null>(null);
  const [fecha, setFecha] = useState(getTodayISO());
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditMode = !!record;

  // Initialize form when record changes or modal opens
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    if (record) {
      setMonto(Math.abs(record.monto).toString());
      setDescripcion(record.descripcion || "");
      setMetaId(record.meta_id || null);
      setFecha(record.fecha);
    } else {
      setMonto("");
      setDescripcion("");
      setMetaId(null);
      setFecha(getTodayISO());
    }
    setErrors({});
  }, [isOpen, record]);

  if (!isOpen) {
    return null;
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    const amount = Number.parseFloat(monto);
    if (!monto) {
      newErrors.monto = "El monto es requerido";
    } else if (Number.isNaN(amount)) {
      newErrors.monto = "El monto debe ser un número válido";
    } else if (amount <= 0) {
      newErrors.monto = "El monto debe ser mayor a 0";
    }

    if (!fecha) {
      newErrors.fecha = "La fecha es requerida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const amount = Number.parseFloat(monto);

    // In edit mode, preserve the sign of the original amount if it was negative
    let finalAmount = amount;
    if (isEditMode && record.monto < 0) {
      finalAmount = -amount;
    } else if (mode === "withdraw") {
      finalAmount = -amount;
    }

    onSubmit({
      monto: finalAmount,
      descripcion,
      meta_id: metaId,
      fecha,
    });

    // Reset form
    if (!isEditMode) {
      setMonto("");
      setDescripcion("");
      setMetaId(null);
      setFecha(getTodayISO());
    }
    onClose();
  };

  let title = "Agregar Ahorro";
  if (isEditMode) {
    title = "Editar Registro";
  } else if (mode === "withdraw") {
    title = "Retirar Dinero";
  }

  let buttonText = "Agregar";
  if (isEditMode) {
    buttonText = "Guardar";
  } else if (mode === "withdraw") {
    buttonText = "Retirar";
  }

  const buttonColor =
    isEditMode || mode === "add"
      ? "bg-emerald-500 hover:bg-emerald-600"
      : "bg-red-500 hover:bg-red-600";

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
          {/* Amount */}
          <div>
            <label
              className="mb-2 block text-neutral-500 text-xs uppercase tracking-wide"
              htmlFor="monto"
            >
              Monto
            </label>
            <div className="relative">
              {/* biome-ignore lint/nursery/useSortedClasses: false positive */}
              <span className="text-neutral-400 absolute top-1/2 left-4 -translate-y-1/2">
                $
              </span>
              <input
                aria-describedby={errors.monto}
                aria-invalid={!!errors.monto}
                className={`w-full rounded-xl border ${
                  errors.monto
                    ? "border-red-500/50 focus:border-red-500"
                    : "border-white/8 focus:border-emerald-500/50"
                } bg-neutral-900 px-4 py-3 pl-8 text-white transition-colors placeholder:text-neutral-600 focus:outline-none`}
                id="monto"
                min="0.01"
                onChange={(e) => {
                  setMonto(e.target.value);
                  if (errors.monto) {
                    setErrors((prev) => ({ ...prev, monto: "" }));
                  }
                }}
                placeholder="0.00"
                step="0.01"
                type="number"
                value={monto}
              />
            </div>
            {errors.monto ? (
              <p className="mt-1 text-red-500 text-xs" id="monto-error">
                {errors.monto}
              </p>
            ) : null}
          </div>

          {/* Goal select */}
          <div>
            <label
              className="mb-2 block text-neutral-500 text-xs uppercase tracking-wide"
              htmlFor="meta"
            >
              Alcancía (opcional)
            </label>
            <select
              className="w-full cursor-pointer appearance-none rounded-xl border border-white/8 bg-neutral-900 px-4 py-3 text-white transition-colors focus:border-emerald-500/50 focus:outline-none"
              id="meta"
              onChange={(e) => setMetaId(e.target.value || null)}
              value={metaId || ""}
            >
              <option value="">General</option>
              {goals.map((goal) => (
                <option key={goal.id} value={goal.id}>
                  {goal.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label
              className="mb-2 block text-neutral-500 text-xs uppercase tracking-wide"
              htmlFor="fecha"
            >
              Fecha
            </label>
            <input
              aria-describedby={errors.fecha}
              aria-invalid={!!errors.fecha}
              className={`w-full rounded-xl border ${
                errors.fecha
                  ? "border-red-500/50 focus:border-red-500"
                  : "border-white/8 focus:border-emerald-500/50"
              } bg-neutral-900 px-4 py-3 text-white transition-colors focus:outline-none`}
              id="fecha"
              onChange={(e) => {
                setFecha(e.target.value);
                if (errors.fecha) {
                  setErrors((prev) => ({ ...prev, fecha: "" }));
                }
              }}
              type="date"
              value={fecha}
            />
            {errors.fecha ? (
              <p className="mt-1 text-red-500 text-xs" id="fecha-error">
                {errors.fecha}
              </p>
            ) : null}
          </div>

          {/* Description */}
          <div>
            <label
              className="mb-2 block text-neutral-500 text-xs uppercase tracking-wide"
              htmlFor="descripcion"
            >
              Descripción (opcional)
            </label>
            <input
              className="w-full rounded-xl border border-white/8 bg-neutral-900 px-4 py-3 text-white transition-colors placeholder:text-neutral-600 focus:border-emerald-500/50 focus:outline-none"
              id="descripcion"
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Ej: Ahorro semanal"
              type="text"
              value={descripcion}
            />
          </div>

          {/* Submit */}
          <button
            className={`w-full rounded-xl py-3 font-medium text-white transition-colors ${buttonColor}`}
            type="submit"
          >
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  );
}
