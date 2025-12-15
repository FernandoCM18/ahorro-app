import { useCallback, useEffect, useState } from "react";
import supabase from "../lib/supabase";

export type Record = {
  id: string;
  user_id: string;
  meta_id: string | null;
  fecha: string;
  monto: number;
  descripcion: string | null;
  created_at: string;
};

// Campos que se pueden modificar de un registro
type RecordMutableFields = Omit<Record, "id" | "user_id" | "created_at">;

// Para crear: monto es requerido, resto opcionales
type CreateRecordInput = Pick<Record, "monto"> &
  Partial<Omit<RecordMutableFields, "monto">>;

// Para actualizar: todos los campos mutables son opcionales
type UpdateRecordInput = Partial<RecordMutableFields>;

type UseRecordsReturn = {
  records: Record[];
  loading: boolean;
  error: Error | null;
  create: (input: CreateRecordInput) => Promise<Record | null>;
  update: (id: string, input: UpdateRecordInput) => Promise<Record | null>;
  remove: (id: string) => Promise<boolean>;
  getByGoal: (goalId: string) => Record[];
  getTotal: (goalId?: string) => number;
  getLastRecord: () => Record | undefined;
  refresh: () => Promise<void>;
};

export function useRecords(userId: string | undefined): UseRecordsReturn {
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRecords = useCallback(async () => {
    if (!userId) {
      setRecords([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from("registros")
      .select("*")
      .eq("user_id", userId)
      .order("fecha", { ascending: false })
      .order("created_at", { ascending: false });

    if (fetchError) {
      setError(fetchError as Error);
      setRecords([]);
    } else {
      setRecords(data ?? []);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const create = useCallback(
    async (input: CreateRecordInput): Promise<Record | null> => {
      if (!userId) {
        return null;
      }

      const { data, error: insertError } = await supabase
        .from("registros")
        .insert({
          user_id: userId,
          meta_id: input.meta_id ?? null,
          fecha: input.fecha ?? new Date().toISOString().split("T")[0],
          monto: input.monto,
          descripcion: input.descripcion ?? null,
        })
        .select()
        .single();

      if (insertError) {
        setError(insertError as Error);
        return null;
      }

      await fetchRecords();
      return data;
    },
    [userId, fetchRecords]
  );

  const update = useCallback(
    async (id: string, input: UpdateRecordInput): Promise<Record | null> => {
      if (!userId) {
        return null;
      }

      const updateData: Partial<Record> = {};
      if (input.meta_id !== undefined) {
        updateData.meta_id = input.meta_id;
      }
      if (input.fecha !== undefined) {
        updateData.fecha = input.fecha;
      }
      if (input.monto !== undefined) {
        updateData.monto = input.monto;
      }
      if (input.descripcion !== undefined) {
        updateData.descripcion = input.descripcion;
      }

      const { data, error: updateError } = await supabase
        .from("registros")
        .update(updateData)
        .eq("id", id)
        .eq("user_id", userId)
        .select()
        .single();

      if (updateError) {
        setError(updateError as Error);
        return null;
      }

      await fetchRecords();
      return data;
    },
    [userId, fetchRecords]
  );

  const remove = useCallback(
    async (id: string): Promise<boolean> => {
      if (!userId) {
        return false;
      }

      const { error: deleteError } = await supabase
        .from("registros")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);

      if (deleteError) {
        setError(deleteError as Error);
        return false;
      }

      await fetchRecords();
      return true;
    },
    [userId, fetchRecords]
  );

  const getByGoal = useCallback(
    (goalId: string): Record[] => records.filter((r) => r.meta_id === goalId),
    [records]
  );

  const getTotal = useCallback(
    (goalId?: string): number => {
      const filteredRecords = goalId
        ? records.filter((r) => r.meta_id === goalId)
        : records;
      return filteredRecords.reduce((sum, r) => sum + Number(r.monto), 0);
    },
    [records]
  );

  const getLastRecord = useCallback(
    (): Record | undefined => records[0],
    [records]
  );

  return {
    records,
    loading,
    error,
    create,
    update,
    remove,
    getByGoal,
    getTotal,
    getLastRecord,
    refresh: fetchRecords,
  };
}
