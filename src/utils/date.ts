const MS_PER_DAY = 1000 * 60 * 60 * 24;

export const getDaysAgo = (date: string | null): string => {
  if (!date) {
    return "Sin registros";
  }

  const last = new Date(date);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - last.getTime());
  const diffDays = Math.floor(diffTime / MS_PER_DAY);

  if (diffDays === 0) {
    return "Hoy";
  }
  if (diffDays === 1) {
    return "Ayer";
  }
  return `Hace ${diffDays} días`;
};

export const getTodayISO = (): string => new Date().toISOString().split("T")[0];
