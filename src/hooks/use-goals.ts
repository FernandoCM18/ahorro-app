import { useCallback, useEffect, useState } from "react";
import supabase from "../lib/supabase";
import { DEFAULT_GOAL_ICON } from "../utils/constants";

export type Goal = {
  id: string;
  user_id: string;
  nombre: string;
  icono: string;
  meta_total: number;
  es_principal: boolean;
  created_at: string;
};

// Campos que se pueden modificar de una meta
type GoalMutableFields = Omit<Goal, "id" | "user_id" | "created_at">;

// Para crear: nombre y meta_total son requeridos, resto opcionales
type CreateGoalInput = Pick<Goal, "nombre" | "meta_total"> &
  Partial<Pick<Goal, "icono" | "es_principal">>;

// Para actualizar: todos los campos mutables son opcionales
type UpdateGoalInput = Partial<GoalMutableFields>;

type UseGoalsReturn = {
  goals: Goal[];
  loading: boolean;
  error: Error | null;
  create: (input: CreateGoalInput) => Promise<Goal | null>;
  update: (id: string, input: UpdateGoalInput) => Promise<Goal | null>;
  remove: (id: string) => Promise<boolean>;
  getPrimary: () => Goal | undefined;
  refresh: () => Promise<void>;
};

export function useGoals(userId: string | undefined): UseGoalsReturn {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchGoals = useCallback(async () => {
    if (!userId) {
      setGoals([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from("metas")
      .select("*")
      .eq("user_id", userId)
      .order("es_principal", { ascending: false })
      .order("created_at", { ascending: true });

    if (fetchError) {
      setError(fetchError as Error);
      setGoals([]);
    } else {
      setGoals(data ?? []);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const create = useCallback(
    async (input: CreateGoalInput): Promise<Goal | null> => {
      if (!userId) {
        return null;
      }

      // If setting as principal, unset any existing principal
      if (input.es_principal) {
        await supabase
          .from("metas")
          .update({ es_principal: false })
          .eq("user_id", userId)
          .eq("es_principal", true);
      }

      const { data, error: insertError } = await supabase
        .from("metas")
        .insert({
          user_id: userId,
          nombre: input.nombre,
          icono: input.icono ?? DEFAULT_GOAL_ICON,
          meta_total: input.meta_total,
          es_principal: input.es_principal ?? false,
        })
        .select()
        .single();

      if (insertError) {
        setError(insertError as Error);
        return null;
      }

      await fetchGoals();
      return data;
    },
    [userId, fetchGoals]
  );

  const update = useCallback(
    async (id: string, input: UpdateGoalInput): Promise<Goal | null> => {
      if (!userId) {
        return null;
      }

      // If setting as principal, unset any existing principal
      if (input.es_principal) {
        await supabase
          .from("metas")
          .update({ es_principal: false })
          .eq("user_id", userId)
          .eq("es_principal", true)
          .neq("id", id);
      }

      const { data, error: updateError } = await supabase
        .from("metas")
        .update(input)
        .eq("id", id)
        .eq("user_id", userId)
        .select()
        .single();

      if (updateError) {
        setError(updateError as Error);
        return null;
      }

      await fetchGoals();
      return data;
    },
    [userId, fetchGoals]
  );

  const remove = useCallback(
    async (id: string): Promise<boolean> => {
      if (!userId) {
        return false;
      }

      const { error: deleteError } = await supabase
        .from("metas")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);

      if (deleteError) {
        setError(deleteError as Error);
        return false;
      }

      await fetchGoals();
      return true;
    },
    [userId, fetchGoals]
  );

  const getPrimary = useCallback(
    (): Goal | undefined => goals.find((g) => g.es_principal),
    [goals]
  );

  return {
    goals,
    loading,
    error,
    create,
    update,
    remove,
    getPrimary,
    refresh: fetchGoals,
  };
}
