import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const ICHI_MAN = 10_000;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function numberToJpy(value: number) {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    currencyDisplay: "name"
  }).format(value);
}

export function numberToMan(value: number) {
  if (value % ICHI_MAN === 0 || value % ICHI_MAN === 5_000) {
    return new Intl.NumberFormat("ja-JP").format(value / ICHI_MAN) + "万円";
  }
  return numberToJpy(value);
}
