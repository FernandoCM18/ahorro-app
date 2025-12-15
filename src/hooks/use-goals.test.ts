import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockGoal, mockGoals } from "../tests/fixtures";

// Mock Supabase using vi.hoisted
const { mockFrom } = vi.hoisted(() => ({
  mockFrom: vi.fn(),
}));

vi.mock("../lib/supabase", () => ({
  default: {
    from: mockFrom,
  },
}));

const { useGoals } = await import("./use-goals");

describe("useGoals", () => {
  const userId = "test-user-id-123";
  let mockChain: ReturnType<typeof createMockChain>;

  function createMockChain(data: unknown = mockGoals, error: unknown = null) {
    const chain: Record<string, unknown> = {};
    chain.select = vi.fn(() => chain);
    chain.eq = vi.fn(() => chain);
    chain.neq = vi.fn(() => chain);
    chain.order = vi.fn(() => chain);
    chain.insert = vi.fn(() => chain);
    chain.update = vi.fn(() => chain);
    chain.delete = vi.fn(() => chain);
    chain.single = vi.fn(() => Promise.resolve({ data, error }));
    chain.then = (resolve: (value: unknown) => void) =>
      Promise.resolve({ data, error }).then(resolve);
    return chain;
  }

  beforeEach(() => {
    vi.clearAllMocks();
    mockChain = createMockChain();
    mockFrom.mockReturnValue(mockChain);
  });

  describe("initial fetch", () => {
    it("loads goals when userId is provided", async () => {
      const { result } = renderHook(() => useGoals(userId));

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.goals).toEqual(mockGoals);
      expect(mockFrom).toHaveBeenCalledWith("metas");
    });

    it("orders by es_principal DESC and created_at ASC", async () => {
      renderHook(() => useGoals(userId));

      await waitFor(() => {
        expect(mockChain.order).toHaveBeenCalledWith("es_principal", {
          ascending: false,
        });
      });

      expect(mockChain.order).toHaveBeenCalledWith("created_at", {
        ascending: true,
      });
    });

    it("does not load if userId is undefined", async () => {
      const { result } = renderHook(() => useGoals(undefined));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.goals).toEqual([]);
      expect(mockFrom).not.toHaveBeenCalled();
    });
  });

  describe("create", () => {
    it("creates goal with required fields", async () => {
      const { result } = renderHook(() => useGoals(userId));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.create({
        nombre: "Vacaciones",
        meta_total: 10_000,
      });

      expect(mockChain.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: userId,
          nombre: "Vacaciones",
          meta_total: 10_000,
        })
      );
    });

    it("uses default icon if not provided", async () => {
      const { result } = renderHook(() => useGoals(userId));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.create({
        nombre: "Test",
        meta_total: 5000,
      });

      expect(mockChain.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          icono: expect.any(String),
        })
      );
    });

    it("sets es_principal to false by default", async () => {
      const { result } = renderHook(() => useGoals(userId));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.create({
        nombre: "Test",
        meta_total: 5000,
      });

      expect(mockChain.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          es_principal: false,
        })
      );
    });

    it("unsets other principal goals when creating a principal goal", async () => {
      const { result } = renderHook(() => useGoals(userId));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.create({
        nombre: "New Principal",
        meta_total: 15_000,
        es_principal: true,
      });

      // Should update existing principal goals first
      expect(mockChain.update).toHaveBeenCalledWith({ es_principal: false });
      expect(mockChain.eq).toHaveBeenCalledWith("user_id", userId);
      expect(mockChain.eq).toHaveBeenCalledWith("es_principal", true);
    });
  });

  describe("update", () => {
    it("updates goal fields", async () => {
      const { result } = renderHook(() => useGoals(userId));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.update("goal-1", { nombre: "Updated" });

      expect(mockChain.update).toHaveBeenCalledWith({ nombre: "Updated" });
      expect(mockChain.eq).toHaveBeenCalledWith("id", "goal-1");
      expect(mockChain.eq).toHaveBeenCalledWith("user_id", userId);
    });

    it("unsets other principal goals when setting es_principal=true", async () => {
      const { result } = renderHook(() => useGoals(userId));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.update("goal-2", { es_principal: true });

      // Should unset other principals, excluding this goal
      expect(mockChain.neq).toHaveBeenCalledWith("id", "goal-2");
    });
  });

  describe("remove", () => {
    it("deletes goal by id and user_id", async () => {
      const { result } = renderHook(() => useGoals(userId));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const success = await result.current.remove("goal-1");

      expect(success).toBe(true);
      expect(mockChain.delete).toHaveBeenCalled();
      expect(mockChain.eq).toHaveBeenCalledWith("id", "goal-1");
      expect(mockChain.eq).toHaveBeenCalledWith("user_id", userId);
    });

    it("returns false on error", async () => {
      mockChain = createMockChain(null, new Error("Delete failed"));
      mockFrom.mockReturnValue(mockChain);

      const { result } = renderHook(() => useGoals(userId));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const success = await result.current.remove("goal-1");

      expect(success).toBe(false);
    });
  });

  describe("getPrimary", () => {
    it("returns goal where es_principal is true", async () => {
      const { result } = renderHook(() => useGoals(userId));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const primary = result.current.getPrimary();

      expect(primary).toEqual(mockGoal); // mockGoal has es_principal: true
    });

    it("returns undefined if no principal goal exists", async () => {
      const goalsWithoutPrincipal = mockGoals.map((g) => ({
        ...g,
        es_principal: false,
      }));

      mockChain = createMockChain(goalsWithoutPrincipal, null);
      mockFrom.mockReturnValue(mockChain);

      const { result } = renderHook(() => useGoals(userId));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const primary = result.current.getPrimary();

      expect(primary).toBeUndefined();
    });
  });
});
