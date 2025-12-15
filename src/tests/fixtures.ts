import type { User } from "@supabase/supabase-js";
import type { Goal } from "../hooks/use-goals";
import type { Record } from "../hooks/use-records";

// Mock User
export const mockUser: User = {
  id: "test-user-id-123",
  email: "test@example.com",
  aud: "authenticated",
  role: "authenticated",
  created_at: "2024-01-01T00:00:00Z",
  app_metadata: {},
  user_metadata: {},
};

// Mock Goals
export const mockGoal: Goal = {
  id: "goal-1",
  user_id: "test-user-id-123",
  nombre: "Vacaciones",
  icono: "🏖️",
  meta_total: 10_000,
  es_principal: true,
  created_at: "2024-01-01T00:00:00Z",
};

export const mockGoal2: Goal = {
  id: "goal-2",
  user_id: "test-user-id-123",
  nombre: "Nueva laptop",
  icono: "💻",
  meta_total: 25_000,
  es_principal: false,
  created_at: "2024-01-02T00:00:00Z",
};

export const mockGoal3: Goal = {
  id: "goal-3",
  user_id: "test-user-id-123",
  nombre: "Fondo de emergencia",
  icono: "🚨",
  meta_total: 50_000,
  es_principal: false,
  created_at: "2024-01-03T00:00:00Z",
};

export const mockGoals: Goal[] = [mockGoal, mockGoal2, mockGoal3];

// Mock Records
export const mockRecord: Record = {
  id: "record-1",
  user_id: "test-user-id-123",
  meta_id: "goal-1",
  fecha: "2024-01-15",
  monto: 500,
  descripcion: "Ahorro semanal",
  created_at: "2024-01-15T10:00:00Z",
};

export const mockRecord2: Record = {
  id: "record-2",
  user_id: "test-user-id-123",
  meta_id: "goal-2",
  fecha: "2024-01-14",
  monto: 1000,
  descripcion: "Bono trabajo",
  created_at: "2024-01-14T10:00:00Z",
};

export const mockRecordWithdrawal: Record = {
  id: "record-3",
  user_id: "test-user-id-123",
  meta_id: null,
  fecha: "2024-01-13",
  monto: -200,
  descripcion: "Emergencia médica",
  created_at: "2024-01-13T10:00:00Z",
};

export const mockRecordNoGoal: Record = {
  id: "record-4",
  user_id: "test-user-id-123",
  meta_id: null,
  fecha: "2024-01-12",
  monto: 300,
  descripcion: null,
  created_at: "2024-01-12T10:00:00Z",
};

export const mockRecords: Record[] = [
  mockRecord,
  mockRecord2,
  mockRecordWithdrawal,
  mockRecordNoGoal,
];
