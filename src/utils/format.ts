import { DEFAULT_LOCALE } from "./constants";

export const formatCurrency = (
  amount: number,
  options?: {
    locale?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  }
): string => {
  const {
    locale = DEFAULT_LOCALE,
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  } = options ?? {};

  return amount.toLocaleString(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
  });
};

export const formatCurrencyParts = (
  amount: number
): { intPart: string; decPart: string } => {
  const formatted = formatCurrency(amount);
  const [intPart = "0", decPart = "00"] = formatted.split(".");
  return { intPart, decPart };
};
