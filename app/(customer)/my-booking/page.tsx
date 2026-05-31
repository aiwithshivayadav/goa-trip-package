"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ArrowLeft, Phone, Hash } from "lucide-react";
import { toast } from "sonner";

export default function MyBookingPage() {
  const [bookingId, setBookingId] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();

    if (!bookingId || !phone) {
      toast.error("Please enter both booking ID and phone number");
      return;
    }

    setLoading(true);
    setNotFound(false);

    try {
      // TODO (Phase E): Call /api/bookings/lookup?id=...&phone=...
      // For now, simulate not-found since DB isn't connected
      await new Promise((r) => setTimeout(r, 1000));
      setNotFound(true);
      toast.error("Booking not found. Check your details and try again.");
    } catch {
      toast.error("Something went wrong. Try WhatsApp.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-cosmic-950">
      {/* Header */}
      <div className="border-b border-border-gold bg-cosmic-900/50">
        <div className="mx-auto max-w-7xl px-4 py-4 md:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-gold transition-colors">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-md px-4 py-16 md:px-8">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-white">
            Track Your <span className="text-gold-gradient">Booking</span>
          </h1>
          <p className="mt-3 text-text-muted">
            Enter your booking ID and phone number to view details.
          </p>
        </div>

        <form onSubmit={handleLookup} className="glass-card rounded-2xl p-6 space-y-5">
          <div>
            <label className="flex items-center gap-2 text-sm text-text-muted mb-2">
              <Hash className="h-3.5 w-3.5" /> Booking ID
            </label>
            <input
              type="text"
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value.toUpperCase())}
              placeholder="GTP-2026-XXXXX"
              required
              className="w-full h-12 rounded-lg bg-surface border border-border-gold px-4 text-white placeholder:text-text-dim font-mono focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-text-muted mb-2">
              <Phone className="h-3.5 w-3.5" /> Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98908 30249"
              required
              className="w-full h-12 rounded-lg bg-surface border border-border-gold px-4 text-white placeholder:text-text-dim focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
            />
            <p className="mt-1.5 text-xs text-text-dim">
              The phone number used during booking
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-gold-gradient text-sm font-bold text-cosmic-950 transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-cosmic-950/30 border-t-cosmic-950 animate-spin" />
                Looking up...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Search className="h-4 w-4" /> Find My Booking
              </span>
            )}
          </button>
        </form>

        {notFound && (
          <div className="mt-6 glass-card rounded-xl p-5 text-center">
            <p className="text-sm text-text-muted mb-3">
              Can&apos;t find your booking? It might be under a different phone number.
            </p>
            <a
              href={`https://wa.me/919890830249?text=${encodeURIComponent(`Hi, I need help finding my booking. ID: ${bookingId}`)}`}
              className="inline-flex items-center gap-2 text-sm text-gold hover:text-gold-200 transition-colors"
            >
              Get help on WhatsApp →
            </a>
          </div>
        )}

        <p className="mt-8 text-center text-xs text-text-dim">
          Your booking ID was sent via WhatsApp and email after payment.
        </p>
      </div>
    </div>
  );
}
