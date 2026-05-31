"use client";

import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, MessageCircle, RotateCcw } from "lucide-react";

export default function BookingFailedPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const bookingId = params.id as string;
  const reason = searchParams.get("reason") || "unknown";
  const txnid = searchParams.get("txnid") || "";

  const reasonMessages: Record<string, string> = {
    hash_mismatch: "Payment verification failed. This may be a temporary issue.",
    failure: "Payment was declined by your bank or card provider.",
    cancelled: "You cancelled the payment.",
    timeout: "Payment session timed out.",
    server_error: "Our server encountered an error. Your card was NOT charged.",
    unknown: "Something unexpected happened. Your card was NOT charged.",
  };

  const message = reasonMessages[reason] || reasonMessages.unknown;

  return (
    <div className="min-h-screen bg-cosmic-950 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-rose/20">
          <AlertTriangle className="h-10 w-10 text-rose" />
        </div>

        <h1 className="font-display text-2xl font-bold text-white md:text-3xl">
          Payment <span className="text-rose">Failed</span>
        </h1>

        <p className="mt-3 text-text-muted">{message}</p>

        {txnid && (
          <p className="mt-2 text-xs text-text-dim font-mono">
            Ref: {txnid}
          </p>
        )}

        <div className="mt-8 space-y-3">
          <button
            onClick={() => window.history.back()}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gold-gradient text-sm font-bold text-cosmic-950 transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <RotateCcw className="h-4 w-4" /> Try Again
          </button>

          <a
            href={`https://wa.me/919890830249?text=${encodeURIComponent(`Hi, my payment failed. Booking: ${bookingId}, TXN: ${txnid}. Can you help?`)}`}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border-gold text-sm font-medium text-gold hover:bg-surface transition-colors"
          >
            <MessageCircle className="h-4 w-4" /> Get Help on WhatsApp
          </a>

          <Link
            href="/"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border-gold text-sm text-text-muted hover:text-white hover:bg-surface transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </div>

        <p className="mt-8 text-xs text-text-dim max-w-sm mx-auto">
          If money was deducted, it will be refunded within 5-7 business days.
          Contact us on WhatsApp for immediate assistance.
        </p>
      </div>
    </div>
  );
}
