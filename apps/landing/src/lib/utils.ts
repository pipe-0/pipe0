import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBaseUrl() {
  return process.env.NODE_ENV === "production"
    ? "https://pipe0.com"
    : "http://localhost:3000";
}
const creditsFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});
const smallCreditsFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 4,
});

/**
 * Renders a credit amount for display. Trailing zeros are stripped, so whole
 * numbers show no decimals and a value like 0.3 shows one. Amounts below 0.1
 * get up to 4 decimal places so small prices (e.g. 0.001) stay visible instead
 * of rounding down to "0". Use this anywhere credits are shown so the
 * formatting stays consistent app-wide.
 */
export function formatCredits(credits: number | string | null) {
  const c = credits ? Number(credits) : 0;
  const abs = Math.abs(c);
  const formatter =
    abs > 0 && abs < 0.1 ? smallCreditsFormatter : creditsFormatter;
  return formatter.format(c);
}

export const copyToClipboard = async (text: string) => {
  await navigator.clipboard.writeText(text);
  toast("Copied to clipboard ✅");
};
