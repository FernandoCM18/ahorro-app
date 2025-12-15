import { describe, expect, it } from "vitest";
import { formatCurrency, formatCurrencyParts } from "./format";

describe("format utils", () => {
  describe("formatCurrency", () => {
    it("formats numbers with 2 decimals by default", () => {
      expect(formatCurrency(1000)).toBe("1,000.00");
      expect(formatCurrency(500.5)).toBe("500.50");
      expect(formatCurrency(99.99)).toBe("99.99");
    });

    it("handles zero correctly", () => {
      expect(formatCurrency(0)).toBe("0.00");
    });

    it("handles negative numbers correctly", () => {
      expect(formatCurrency(-500)).toBe("-500.00");
      expect(formatCurrency(-1234.56)).toBe("-1,234.56");
    });

    it("handles very large numbers", () => {
      expect(formatCurrency(1_000_000)).toBe("1,000,000.00");
      expect(formatCurrency(999_999.99)).toBe("999,999.99");
    });

    it("handles small decimal numbers", () => {
      expect(formatCurrency(0.01)).toBe("0.01");
      expect(formatCurrency(0.99)).toBe("0.99");
    });

    it("allows customizing minimumFractionDigits", () => {
      expect(formatCurrency(100, { minimumFractionDigits: 0 })).toBe("100");
      expect(formatCurrency(100.5, { minimumFractionDigits: 0 })).toBe("100.5");
    });

    it("allows customizing maximumFractionDigits", () => {
      expect(formatCurrency(100.123_456, { maximumFractionDigits: 3 })).toBe(
        "100.123"
      );
      expect(
        formatCurrency(100.56, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 1,
        })
      ).toBe("100.6");
    });

    it("uses es-MX locale by default (uses period as decimal separator)", () => {
      // es-MX uses period as decimal separator and comma for thousands
      const result = formatCurrency(1234.56);
      expect(result).toContain(".");
      expect(result).toContain(",");
    });

    it("allows customizing locale", () => {
      // en-US uses period for decimals and comma for thousands
      expect(formatCurrency(1000.5, { locale: "en-US" })).toBe("1,000.50");
    });
  });

  describe("formatCurrencyParts", () => {
    it("separates integer and decimal parts correctly", () => {
      const result = formatCurrencyParts(1000.5);
      expect(result).toEqual({
        intPart: "1,000",
        decPart: "50",
      });
    });

    it("handles zero correctly", () => {
      const result = formatCurrencyParts(0);
      expect(result).toEqual({
        intPart: "0",
        decPart: "00",
      });
    });

    it("handles numbers without decimal part", () => {
      const result = formatCurrencyParts(500);
      expect(result).toEqual({
        intPart: "500",
        decPart: "00",
      });
    });

    it("handles large numbers", () => {
      const result = formatCurrencyParts(123_456.78);
      expect(result).toEqual({
        intPart: "123,456",
        decPart: "78",
      });
    });

    it("handles negative numbers", () => {
      const result = formatCurrencyParts(-500.25);
      expect(result).toEqual({
        intPart: "-500",
        decPart: "25",
      });
    });

    it("decimal part is always 2 digits", () => {
      const result1 = formatCurrencyParts(100.5);
      expect(result1.decPart).toBe("50");

      const result2 = formatCurrencyParts(100.05);
      expect(result2.decPart).toBe("05");
    });
  });
});
