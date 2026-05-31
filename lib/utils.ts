import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format amount as Indian Rupees
 * formatINR(2500) → "₹2,500"
 * formatINR(2500.50) → "₹2,500.50"
 */
export function formatINR(amount: number, showDecimals = false): string {
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  });
  return formatter.format(amount);
}

/**
 * Format date for Indian locale
 * formatDate(new Date()) → "31 May 2026"
 */
export function formatDate(date: Date | string, style: "short" | "long" | "relative" = "long"): string {
  const d = typeof date === "string" ? new Date(date) : date;

  if (style === "relative") {
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    // Fall through to long format
  }

  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: style === "short" ? "short" : "long",
    year: "numeric",
  });
}

/**
 * Format date and time
 * formatDateTime(new Date()) → "31 May 2026 at 2:30 PM"
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return `${formatDate(d)} at ${d.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })}`;
}

/**
 * Slugify a string
 * slugify("Goa Honeymoon Classic 4N/5D") → "goa-honeymoon-classic-4n-5d"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "...";
}

/**
 * Generate a booking ID
 * generateBookingId() → "GTP-2026-00042"
 */
export function generateBookingId(sequence: number): string {
  const year = new Date().getFullYear();
  return `GTP-${year}-${String(sequence).padStart(5, "0")}`;
}

/**
 * Generate a quote code
 * generateQuoteCode(42) → "Q-2026-00042"
 */
export function generateQuoteCode(sequence: number): string {
  const year = new Date().getFullYear();
  return `Q-${year}-${String(sequence).padStart(5, "0")}`;
}

/**
 * Generate a random token (for public quote URLs)
 */
export function generateToken(length = 32): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    result += chars[array[i]! % chars.length];
  }
  return result;
}

/**
 * Normalize Indian phone number
 * normalizePhone("+91 98908 30249") → "919890830249"
 * normalizePhone("9890830249") → "919890830249"
 */
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("91") && digits.length === 12) return digits;
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

/**
 * Format phone for display
 * formatPhone("919890830249") → "+91 98908 30249"
 */
export function formatPhone(phone: string): string {
  const raw = normalizePhone(phone);
  if (raw.length === 12 && raw.startsWith("91")) {
    const local = raw.slice(2);
    return `+91 ${local.slice(0, 5)} ${local.slice(5)}`;
  }
  return phone;
}

/**
 * Build WhatsApp URL
 */
export function whatsappUrl(phone: string, message?: string): string {
  const base = `https://wa.me/${normalizePhone(phone)}`;
  if (message) return `${base}?text=${encodeURIComponent(message)}`;
  return base;
}

/**
 * Calculate GST amounts
 */
export function calculateGST(
  amount: number,
  gstRate: number,
  isIncluded: boolean
): { baseAmount: number; gstAmount: number; totalAmount: number } {
  if (isIncluded) {
    const baseAmount = amount / (1 + gstRate / 100);
    const gstAmount = amount - baseAmount;
    return {
      baseAmount: Math.round(baseAmount * 100) / 100,
      gstAmount: Math.round(gstAmount * 100) / 100,
      totalAmount: amount,
    };
  }
  const gstAmount = (amount * gstRate) / 100;
  return {
    baseAmount: amount,
    gstAmount: Math.round(gstAmount * 100) / 100,
    totalAmount: Math.round((amount + gstAmount) * 100) / 100,
  };
}

/**
 * Product category labels
 */
export const CATEGORY_LABELS: Record<string, string> = {
  package: "Tour Package",
  cruise: "Cruise",
  yacht: "Yacht",
  activity: "Activity",
  hotel: "Hotel",
  party: "Party",
  combo: "Combo",
  transfer: "Transfer",
};

/**
 * Lead status labels + colors
 */
export const LEAD_STATUS_CONFIG = {
  new: { label: "New", color: "bg-blue-500" },
  contacted: { label: "Contacted", color: "bg-yellow-500" },
  quoted: { label: "Quoted", color: "bg-purple-500" },
  negotiating: { label: "Negotiating", color: "bg-orange-500" },
  won: { label: "Won", color: "bg-green-500" },
  lost: { label: "Lost", color: "bg-red-500" },
  spam: { label: "Spam", color: "bg-zinc-400" },
} as const;

/**
 * Payment status labels
 */
export const PAYMENT_STATUS_CONFIG = {
  pending: { label: "Pending", color: "bg-yellow-500" },
  partial: { label: "Partial", color: "bg-orange-500" },
  paid: { label: "Paid", color: "bg-green-500" },
  failed: { label: "Failed", color: "bg-red-500" },
  refunded: { label: "Refunded", color: "bg-zinc-500" },
} as const;
