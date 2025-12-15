import "./index.css";
import { useEffect, useState } from "react";
import { AddRecordModal } from "./components/add-record-modal";
import { AuthScreen } from "./components/auth-screen";
import { BalanceHero } from "./components/balance-hero";
import { FloatingDock, type View } from "./components/floating-dock";
import { GoalCard } from "./components/goal-card";
import { GoalFormModal } from "./components/goal-form-modal";
import { GoalList } from "./components/goal-list";
import { Header } from "./components/header";
import { HistoryList } from "./components/history-list";
import { QuickActions } from "./components/quick-actions";
import { useAuth } from "./hooks/use-auth";
import { type Goal, useGoals } from "./hooks/use-goals";
import { type Record, useRecords } from "./hooks/use-records";
import supabase from "./lib/supabase";

type RecordFormData = Omit<Record, "id" | "user_id" | "created_at">;

export default function App() {
  const { user, loading: authLoading, signIn } = useAuth();
  const {
    goals,
    create: createGoal,
    update: updateGoal,
    remove: removeGoal,
    getPrimary,
  } = useGoals(user?.id);
  const {
    records,
    create: createRecord,
    update: updateRecord,
    remove: removeRecord,
    getTotal,
    getLastRecord,
  } = useRecords(user?.id);

  // URL params for magic link callback
  const urlParams = new URLSearchParams(window.location.search);
  const hasTokenHash = urlParams.get("token_hash");

  const [verifying, setVerifying] = useState(!!hasTokenHash);
  const [authError, setAuthError] = useState<string | null>(null);

  // Navigation state
  const [activeView, setActiveView] = useState<View>("home");

  // Modal states
  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [recordModalMode, setRecordModalMode] = useState<"add" | "withdraw">(
    "add"
  );
  const [editingRecord, setEditingRecord] = useState<Record | null>(null);
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  // Handle magic link verification
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token_hash = params.get("token_hash");

    if (token_hash) {
      supabase.auth
        .verifyOtp({
          token_hash,
          type: "email",
        })
        .then(({ error }) => {
          if (error) {
            setAuthError(error.message);
          } else {
            window.history.replaceState({}, document.title, "/");
          }
          setVerifying(false);
        });
    }
  }, []);

  // Show loading state
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  // Show auth screen if not logged in
  if (!user) {
    return (
      <AuthScreen
        authError={authError}
        onClearError={() => {
          setAuthError(null);
          window.history.replaceState({}, document.title, "/");
        }}
        onSubmit={signIn}
        verifying={verifying}
      />
    );
  }

  const primaryGoal = getPrimary();
  const totalSaved = getTotal();
  const lastRecord = getLastRecord();

  const getAmountForGoal = (goalId: string): number =>
    records
      .filter((r) => r.meta_id === goalId)
      .reduce((sum, r) => sum + Number(r.monto), 0);

  const handleAddRecord = () => {
    setRecordModalMode("add");
    setRecordModalOpen(true);
  };

  const handleWithdraw = () => {
    setRecordModalMode("withdraw");
    setRecordModalOpen(true);
  };

  const handleEditGoal = () => {
    setEditingGoal(primaryGoal ?? null);
    setGoalModalOpen(true);
  };

  const handleAddGoal = () => {
    setEditingGoal(null);
    setGoalModalOpen(true);
  };

  const handleGoalClick = (goal: Goal) => {
    setEditingGoal(goal);
    setGoalModalOpen(true);
  };

  const handleRecordSubmit = async (data: RecordFormData) => {
    if (editingRecord) {
      await updateRecord(editingRecord.id, data);
      setEditingRecord(null);
    } else {
      await createRecord(data);
    }
  };

  const handleEditRecord = (record: Record) => {
    setEditingRecord(record);
    setRecordModalMode(record.monto >= 0 ? "add" : "withdraw");
    setRecordModalOpen(true);
  };

  const handleDeleteRecord = async (record: Record) => {
    await removeRecord(record.id);
  };

  const handleGoalSubmit = async (data: {
    nombre: string;
    icono: string;
    meta_total: number;
    es_principal: boolean;
  }) => {
    if (editingGoal) {
      await updateGoal(editingGoal.id, data);
    } else {
      await createGoal(data);
    }
    setEditingGoal(null);
  };

  const handleGoalDelete = async () => {
    if (editingGoal) {
      await removeGoal(editingGoal.id);
      setEditingGoal(null);
      setGoalModalOpen(false);
    }
  };

  // Render view content
  const renderContent = () => {
    switch (activeView) {
      case "goals":
        return (
          <GoalList
            getAmountForGoal={getAmountForGoal}
            goals={goals}
            onAddClick={handleAddGoal}
            onGoalClick={handleGoalClick}
            showAddButton={true}
            title="Todas las Alcancías"
          />
        );

      case "history":
        return (
          <HistoryList
            onDelete={handleDeleteRecord}
            onEdit={handleEditRecord}
            records={records}
            title="Historial Completo"
          />
        );

      default: // home
        return (
          <>
            <BalanceHero
              lastRecordDate={lastRecord?.fecha}
              total={totalSaved}
            />

            {primaryGoal ? (
              <GoalCard
                currentAmount={getAmountForGoal(primaryGoal.id)}
                goal={primaryGoal}
              />
            ) : (
              <div className="mb-4 rounded-2xl border border-white/8 border-dashed p-6 text-center">
                <p className="mb-2 text-neutral-500 text-sm">
                  No tienes una meta principal
                </p>
                <button
                  className="text-emerald-500 text-sm transition-colors hover:text-emerald-400"
                  onClick={handleAddGoal}
                  type="button"
                >
                  Crear tu primera meta
                </button>
              </div>
            )}

            <QuickActions
              onAdd={handleAddRecord}
              onEditGoal={handleEditGoal}
              onWithdraw={handleWithdraw}
            />

            <GoalList
              getAmountForGoal={getAmountForGoal}
              goals={goals}
              onAddClick={handleAddGoal}
              onGoalClick={handleGoalClick}
            />

            <HistoryList
              limit={3}
              onDelete={handleDeleteRecord}
              onEdit={handleEditRecord}
              onViewAll={() => setActiveView("history")}
              records={records}
              showViewAll={true}
            />
          </>
        );
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center py-8 pb-24 text-neutral-400">
      <div className="relative z-10 mx-auto w-full max-w-md px-6">
        <Header />

        {renderContent()}
      </div>

      <FloatingDock activeView={activeView} onViewChange={setActiveView} />

      <AddRecordModal
        goals={goals}
        isOpen={recordModalOpen}
        mode={recordModalMode}
        onClose={() => {
          setRecordModalOpen(false);
          setEditingRecord(null);
        }}
        onSubmit={handleRecordSubmit}
        record={editingRecord}
      />

      <GoalFormModal
        goal={editingGoal}
        isOpen={goalModalOpen}
        onClose={() => {
          setGoalModalOpen(false);
          setEditingGoal(null);
        }}
        {...(editingGoal !== null && { onDelete: handleGoalDelete })}
        onSubmit={handleGoalSubmit}
      />
    </div>
  );
}
