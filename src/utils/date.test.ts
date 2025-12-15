import { beforeEach, describe, expect, it, vi } from "vitest";
import { getDaysAgo, getTodayISO } from "./date";

describe("date utils", () => {
  describe("getDaysAgo", () => {
    beforeEach(() => {
      // Mock current date to 2024-01-20 for consistent testing
      vi.setSystemTime(new Date("2024-01-20T12:00:00Z"));
    });

    it("returns 'Sin registros' when date is null", () => {
      expect(getDaysAgo(null)).toBe("Sin registros");
    });

    it("returns 'Hoy' when date is today", () => {
      const today = "2024-01-20";
      expect(getDaysAgo(today)).toBe("Hoy");
    });

    it("returns 'Ayer' when date is yesterday", () => {
      const yesterday = "2024-01-19";
      expect(getDaysAgo(yesterday)).toBe("Ayer");
    });

    it("returns 'Hace 2 días' for 2 days ago", () => {
      const twoDaysAgo = "2024-01-18";
      expect(getDaysAgo(twoDaysAgo)).toBe("Hace 2 días");
    });

    it("returns 'Hace 7 días' for 7 days ago", () => {
      const sevenDaysAgo = "2024-01-13";
      expect(getDaysAgo(sevenDaysAgo)).toBe("Hace 7 días");
    });

    it("handles dates from previous month", () => {
      const lastMonth = "2023-12-25";
      expect(getDaysAgo(lastMonth)).toBe("Hace 26 días");
    });

    it("handles dates from previous year", () => {
      const lastYear = "2023-01-20";
      expect(getDaysAgo(lastYear)).toBe("Hace 365 días");
    });

    it("handles date strings with time", () => {
      const todayWithTime = "2024-01-20T08:30:00Z";
      expect(getDaysAgo(todayWithTime)).toBe("Hoy");
    });
  });

  describe("getTodayISO", () => {
    beforeEach(() => {
      // Mock current date to 2024-01-20
      vi.setSystemTime(new Date("2024-01-20T15:30:45Z"));
    });

    it("returns today's date in ISO format (YYYY-MM-DD)", () => {
      const result = getTodayISO();
      expect(result).toBe("2024-01-20");
    });

    it("returns date without time component", () => {
      const result = getTodayISO();
      expect(result).not.toContain("T");
      expect(result).not.toContain(":");
    });

    it("returns string with correct length (10 characters)", () => {
      const result = getTodayISO();
      expect(result).toHaveLength(10);
    });
  });
});
