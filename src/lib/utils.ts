import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency: string = "USD", locale: string = "en-US") {
  const num = typeof value === 'number' ? value : parseFloat(String(value));
  if (isNaN(num)) return "N/A";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatCompactCurrency(value: number, currency: string = "USD", locale: string = "en-US") {
  const num = typeof value === 'number' ? value : parseFloat(String(value));
  if (isNaN(num)) return "N/A";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(num);
}
