import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockRecords } from "../tests/fixtures";

// Mock Supabase using vi.hoisted
const { mockFrom } = vi.hoisted(() => ({
  mockFrom: vi.fn(),
}));

vi.mock("../lib/supabase", () => ({
  default: {
    from: mockFrom,
  },
}));

const { useRecords } = await import("./use-records");

describe("useRecords", () => {
  const userId = "test-user-id-123";
  let mockChain: ReturnType<typeof createMockChain>;

  function createMockChain(data: unknown = mockRecords, error: unknown = null) {
    const chain: Record<string, unknown> = {};
    chain.select = vi.fn(() => chain);
    chain.eq = vi.fn(() => chain);
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
    it("loads records when userId is provided", async () => {
      const { result } = renderHook(() => useRecords(userId));

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.records).toEqual(mockRecords);
      expect(mockFrom).toHaveBeenCalledWith("registros");
      expect(mockChain.select).toHaveBeenCalledWith("*");
      expect(mockChain.eq).toHaveBeenCalledWith("user_id", userId);
    });

    it("orders by fecha DESC and created_at DESC", async () => {
      renderHook(() => useRecords(userId));

      await waitFor(() => {
        expect(mockChain.order).toHaveBeenCalledWith("fecha", {
          ascending: false,
        });
      });

      expect(mockChain.order).toHaveBeenCalledWith("created_at", {
        ascending: false,
      });
    });

    it("does not load if userId is undefined", async () => {
      const { result } = renderHook(() => useRecords(undefined));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.records).toEqual([]);
      expect(mockFrom).not.toHaveBeenCalled();
    });

    it("handles fetch errors", async () => {
      const testError = new Error("Network error");
      mockChain = createMockChain(null, testError);
      mockFrom.mockReturnValue(mockChain);

      const { result } = renderHook(() => useRecords(userId));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toEqual(testError);
      expect(result.current.records).toEqual([]);
    });
  });

  describe("create", () => {
    it("creates record with all fields", async () => {
      const { result } = renderHook(() => useRecords(userId));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const newRecord = {
        monto: 500,
        descripcion: "Test",
        meta_id: "goal-1",
        fecha: "2024-01-15",
      };

      await result.current.create(newRecord);

      expect(mockChain.insert).toHaveBeenCalledWith({
        user_id: userId,
        monto: 500,
        descripcion: "Test",
        meta_id: "goal-1",
        fecha: "2024-01-15",
      });
    });

    it("uses today as default fecha", async () => {
      const { result } = renderHook(() => useRecords(userId));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.create({ monto: 100 });

      expect(mockChain.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          fecha: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
        })
      );
    });

    it("returns null if no userId", async () => {
      const { result } = renderHook(() => useRecords(undefined));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const response = await result.current.create({ monto: 100 });

      expect(response).toBeNull();
      expect(mockChain.insert).not.toHaveBeenCalled();
    });
  });

  describe("update", () => {
    it("updates only provided fields", async () => {
      const { result } = renderHook(() => useRecords(userId));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.update("record-1", { monto: 600 });

      expect(mockChain.update).toHaveBeenCalledWith({ monto: 600 });
      expect(mockChain.eq).toHaveBeenCalledWith("id", "record-1");
      expect(mockChain.eq).toHaveBeenCalledWith("user_id", userId);
    });

    it("returns null if no userId", async () => {
      const { result } = renderHook(() => useRecords(undefined));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const response = await result.current.update("record-1", { monto: 600 });

      expect(response).toBeNull();
      expect(mockChain.update).not.toHaveBeenCalled();
    });
  });

  describe("remove", () => {
    it("deletes record by id and user_id", async () => {
      const { result } = renderHook(() => useRecords(userId));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const success = await result.current.remove("record-1");

      expect(success).toBe(true);
      expect(mockChain.delete).toHaveBeenCalled();
      expect(mockChain.eq).toHaveBeenCalledWith("id", "record-1");
      expect(mockChain.eq).toHaveBeenCalledWith("user_id", userId);
    });

    it("returns false on error", async () => {
      mockChain = createMockChain(null, new Error("Delete failed"));
      mockFrom.mockReturnValue(mockChain);

      const { result } = renderHook(() => useRecords(userId));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const success = await result.current.remove("record-1");

      expect(success).toBe(false);
    });
  });

  describe("calculation functions", () => {
    it("getTotal sums all records", async () => {
      const { result } = renderHook(() => useRecords(userId));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const total = result.current.getTotal();

      // mockRecords: 500 + 1000 - 200 + 300 = 1600
      expect(total).toBe(1600);
    });

    it("getTotal filters by goalId", async () => {
      const { result } = renderHook(() => useRecords(userId));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const total = result.current.getTotal("goal-1");

      // Only record-1 has goal-1: 500
      expect(total).toBe(500);
    });

    it("getByGoal filters records by meta_id", async () => {
      const { result } = renderHook(() => useRecords(userId));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const filtered = result.current.getByGoal("goal-1");

      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe("record-1");
    });

    it("getLastRecord returns first record in ordered array", async () => {
      const { result } = renderHook(() => useRecords(userId));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const last = result.current.getLastRecord();

      // First in mockRecords array
      expect(last).toEqual(mockRecords[0]);
    });
  });
});
