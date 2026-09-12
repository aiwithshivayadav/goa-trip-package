"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

interface QuoteActionsProps {
  token: string;
  status: string;
  isExpired: boolean;
  advancePercent: number;
  advanceAmount: string;
  whatsappUrl: string;
}

export function QuoteActions({
  token,
  status,
  isExpired,
  advancePercent,
  advanceAmount,
  whatsappUrl,
}: QuoteActionsProps) {
  const [currentStatus, setCurrentStatus] = useState(status);
  const [loading, setLoading] = useState<"accept" | "decline" | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  // Show payment failure message from URL params
  useEffect(() => {
    const payment = searchParams.get("payment");
    if (payment === "failed") {
      setError("Payment failed. Please try again.");
    } else if (payment === "expired") {
      setError("This quote has expired. Please contact us for a revised quote.");
    } else if (payment === "unavailable") {
      setError("Payment is not available for this quote. Please contact us.");
    } else if (payment === "error") {
      setError("Something went wrong. Please try again.");
    } else if (payment === "success") {
      setMessage("Payment successful! Your booking has been confirmed.");
    }
  }, [searchParams]);

  const handleAcceptAndPay = () => {
    setLoading("accept");
    setError(null);
    setMessage(null);
    // Redirect to the PayU payment flow
    window.location.href = `/api/quotes/public/${token}/pay`;
  };

  const handleDecline = async () => {
    setLoading("decline");
    setError(null);
    setMessage(null);

    try {
      const res = await fetch(`/api/quotes/public/${token}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "decline" }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setMessage(data.message);
      setCurrentStatus("declined");
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(null);
    }
  };

  const canAccept =
    !isExpired &&
    !["accepted", "declined", "converted", "expired"].includes(currentStatus);

  const canDecline =
    !["accepted", "declined", "converted", "expired"].includes(currentStatus);

  // Already accepted (but not yet paid — show pay button)
  if (currentStatus === "accepted") {
    return (
      <div className="space-y-4">
        {/* Feedback messages */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {message && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {message}
          </div>
        )}

        <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50 px-5 py-4 text-center">
          <div className="mb-1 text-2xl">&#10003;</div>
          <p className="font-semibold text-emerald-800">Quote Accepted</p>
          <p className="mt-1 text-sm text-emerald-600">
            Complete your payment to confirm the booking.
          </p>
        </div>

        {/* Pay now button */}
        {!isExpired && (
          <button
            onClick={handleAcceptAndPay}
            disabled={loading === "accept"}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1A8E7D] px-6 py-4 text-base font-bold text-white shadow-lg shadow-[#1A8E7D]/25 transition-all hover:bg-[#158572] hover:shadow-xl hover:shadow-[#1A8E7D]/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
          >
            {loading === "accept" ? (
              <Spinner />
            ) : (
              <>
                <LockIcon />
                Pay {advancePercent}% Advance ({advanceAmount})
              </>
            )}
          </button>
        )}

        <div className="flex gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-[#25D366] bg-[#25D366] px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#20bd5a]"
          >
            <WhatsAppIcon />
            Chat with Us
          </a>
          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-5 py-3.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 print:hidden"
          >
            <PrintIcon />
            Print
          </button>
        </div>
      </div>
    );
  }

  // Converted — booking already created
  if (currentStatus === "converted") {
    return (
      <div className="space-y-4">
        {message && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {message}
          </div>
        )}
        <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50 px-5 py-4 text-center">
          <div className="mb-1 text-2xl">&#10003;</div>
          <p className="font-semibold text-emerald-800">Booking Confirmed</p>
          <p className="mt-1 text-sm text-emerald-600">
            This quote has been converted to a booking. Check your email for details.
          </p>
        </div>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#25D366] bg-[#25D366] px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#20bd5a]"
        >
          <WhatsAppIcon />
          Chat with Us
        </a>
      </div>
    );
  }

  // Already declined
  if (currentStatus === "declined") {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border-2 border-gray-200 bg-gray-50 px-5 py-4 text-center">
          <p className="font-semibold text-gray-700">Quote Declined</p>
          <p className="mt-1 text-sm text-gray-500">
            {message || "Changed your mind? Reach out and we'll create a new quote for you."}
          </p>
        </div>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#25D366] bg-[#25D366] px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#20bd5a]"
        >
          <WhatsAppIcon />
          Get a New Quote
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Feedback messages */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {message && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      )}

      {/* Primary CTA — Accept & Pay */}
      <button
        onClick={handleAcceptAndPay}
        disabled={!canAccept || loading === "accept"}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1A8E7D] px-6 py-4 text-base font-bold text-white shadow-lg shadow-[#1A8E7D]/25 transition-all hover:bg-[#158572] hover:shadow-xl hover:shadow-[#1A8E7D]/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
      >
        {loading === "accept" ? (
          <Spinner />
        ) : (
          <>
            <CheckCircleIcon />
            Accept Quote{advancePercent > 0 ? ` — Pay ${advancePercent}% Advance (${advanceAmount})` : ""}
          </>
        )}
      </button>

      {/* Secondary actions row */}
      <div className="flex gap-3">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-[#25D366] px-5 py-3 text-sm font-semibold text-[#25D366] transition-colors hover:bg-[#25D366]/5"
        >
          <WhatsAppIcon />
          WhatsApp Us
        </a>
        <button
          onClick={() => window.print()}
          className="flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 print:hidden"
        >
          <PrintIcon />
          Print
        </button>
      </div>

      {/* Decline link */}
      {canDecline && (
        <div className="pt-2 text-center">
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to decline this quote?")) {
                handleDecline();
              }
            }}
            disabled={loading === "decline"}
            className="text-sm text-gray-400 underline decoration-gray-300 underline-offset-2 transition-colors hover:text-gray-600"
          >
            {loading === "decline" ? "Processing..." : "Decline this quote"}
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Inline SVG icons (no dependency) ── */

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function PrintIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9V2h12v7" />
      <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
