import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merge Tailwind classes with clsx — the standard shadcn/ui pattern
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number as Indian Rupees (₹1,23,456)
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a number as INR with decimals (₹1,23,456.78)
 */
export function formatINRDecimal(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a Date object to "15 Jun 2026"
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Format a Date to "15 Jun 2026, 3:30 PM"
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Format relative time ("2 hours ago", "3 days ago")
 */
export function timeAgo(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(d);
}

/**
 * Generate a URL-safe slug from a string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Truncate a string to N characters with "..."
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}

/**
 * Generate a booking ID (GTP-2026-XXXXX format)
 */
export function generateBookingId(): string {
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `GTP-${year}-${rand}`;
}

/**
 * Generate a quote code (Q-2026-XXXXX format)
 */
export function generateQuoteCode(): string {
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `Q-${year}-${rand}`;
}

/**
 * Generate a lead code (L-2026-XXXXX format)
 */
export function generateLeadCode(): string {
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `L-${year}-${rand}`;
}

/**
 * Generate a random token for public quote URLs (32 chars)
 */
export function generatePublicToken(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 32; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}

/**
 * Normalize Indian phone number to 10 digits
 */
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("91") && digits.length === 12) return digits.slice(2);
  if (digits.startsWith("0") && digits.length === 11) return digits.slice(1);
  if (digits.length === 10) return digits;
  return digits;
}

/**
 * Format phone for display: "+91 98908 30249"
 */
export function formatPhone(phone: string): string {
  const digits = normalizePhone(phone);
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  return phone;
}

/**
 * Generate WhatsApp link
 */
export function whatsappLink(phone: string, message?: string): string {
  const digits = normalizePhone(phone);
  const url = `https://wa.me/91${digits}`;
  if (message) return `${url}?text=${encodeURIComponent(message)}`;
  return url;
}

/**
 * Calculate GST
 */
export function calculateGST(amount: number, rate: number = 5, included: boolean = true) {
  if (included) {
    const baseAmount = amount / (1 + rate / 100);
    const gstAmount = amount - baseAmount;
    return { baseAmount: Math.round(baseAmount * 100) / 100, gstAmount: Math.round(gstAmount * 100) / 100, total: amount };
  }
  const gstAmount = (amount * rate) / 100;
  return { baseAmount: amount, gstAmount: Math.round(gstAmount * 100) / 100, total: Math.round((amount + gstAmount) * 100) / 100 };
}

/**
 * Pluralize a word
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  if (count === 1) return `${count} ${singular}`;
  return `${count} ${plural || singular + "s"}`;
}
