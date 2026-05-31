"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Check, Download, MessageCircle, Mail, Calendar } from "lucide-react";
import { formatINR } from "@/lib/utils";

interface BookingData {
  bookingId: string;
  productName: string;
  travelDate: string;
  adults: number;
  children: number;
  total: number;
  payableNow: number;
  paymentMode: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export default function BookingConfirmationPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const bookingId = params.id as string;
  const txnid = searchParams.get("txnid") || "";
  const amount = searchParams.get("amount") || "";
  const verified = searchParams.get("verified") === "1";

  const [booking, setBooking] = useState<BookingData | null>(null);

  useEffect(() => {
    // Recover booking data from sessionStorage
    const stored = sessionStorage.getItem("pendingBooking");
    if (stored) {
      const data = JSON.parse(stored);
      setBooking(data);
      // Clear after reading
      sessionStorage.removeItem("pendingBooking");
    }
  }, []);

  const displayName = booking?.customerName || "Guest";
  const displayAmount = booking ? formatINR(booking.payableNow) : amount ? formatINR(parseFloat(amount)) : "—";
  const balanceDue = booking && booking.paymentMode === "advance" ? formatINR(booking.total - booking.payableNow) : null;

  return (
    <div className="min-h-screen bg-cosmic-950 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg text-center">
        {/* Success animation */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20 animate-[pulse-gold_2s_ease-in-out_1]">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/30">
            <Check className="h-8 w-8 text-green-400" />
          </div>
        </div>

        <h1 className="font-display text-3xl font-bold text-white md:text-4xl">
          Booking <span className="text-gold-gradient">Confirmed!</span>
        </h1>

        <p className="mt-3 text-text-muted">
          Thank you, {displayName}! Your Goa experience is booked.
        </p>

        {/* Booking card */}
        <div className="glass-card rounded-2xl p-6 mt-8 text-left">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-text-muted">Booking ID</span>
              <span className="font-mono font-medium text-gold">{bookingId || booking?.bookingId || "—"}</span>
            </div>
            {booking?.productName && (
              <div className="flex justify-between">
                <span className="text-text-muted">Experience</span>
                <span className="text-white font-medium text-right max-w-[60%]">{booking.productName}</span>
              </div>
            )}
            {booking?.travelDate && (
              <div className="flex justify-between">
                <span className="text-text-muted">Travel Date</span>
                <span className="text-white">{new Date(booking.travelDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
              </div>
            )}
            {booking && (
              <div className="flex justify-between">
                <span className="text-text-muted">Guests</span>
                <span className="text-white">{booking.adults} adult{booking.adults > 1 ? "s" : ""}{booking.children > 0 ? ` + ${booking.children} child${booking.children > 1 ? "ren" : ""}` : ""}</span>
              </div>
            )}
            <div className="gold-divider my-3" />
            <div className="flex justify-between">
              <span className="text-text-muted">Amount Paid</span>
              <span className="text-lg font-bold text-green-400">{displayAmount}</span>
            </div>
            {balanceDue && (
              <div className="flex justify-between">
                <span className="text-text-muted">Balance Due</span>
                <span className="text-gold font-medium">{balanceDue}</span>
              </div>
            )}
            {txnid && (
              <div className="flex justify-between">
                <span className="text-text-muted">Transaction ID</span>
                <span className="font-mono text-xs text-text-dim">{txnid}</span>
              </div>
            )}
            {verified && (
              <div className="flex items-center gap-2 text-green-400 text-xs mt-2">
                <Check className="h-3.5 w-3.5" /> Payment verified by PayU
              </div>
            )}
          </div>
        </div>

        {/* What happens next */}
        <div className="glass-card rounded-2xl p-6 mt-6 text-left">
          <h2 className="font-bold text-white mb-4">What happens next?</h2>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold/20 text-xs font-bold text-gold">1</div>
              <div>
                <p className="text-sm font-medium text-white">Confirmation on WhatsApp</p>
                <p className="text-xs text-text-dim mt-0.5">Within 5 minutes — booking details + contact</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold/20 text-xs font-bold text-gold">2</div>
              <div>
                <p className="text-sm font-medium text-white">Invoice via Email</p>
                <p className="text-xs text-text-dim mt-0.5">PDF receipt with booking details + GST</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold/20 text-xs font-bold text-gold">3</div>
              <div>
                <p className="text-sm font-medium text-white">Day-before Reminder</p>
                <p className="text-xs text-text-dim mt-0.5">Pickup time, location, driver name + phone</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <a
            href={`https://wa.me/919890830249?text=${encodeURIComponent(`Hi, I just booked ${booking?.productName || ""}. Booking ID: ${bookingId || booking?.bookingId || ""}`)}`}
            className="flex h-12 items-center justify-center gap-2 rounded-xl border border-border-gold text-sm font-medium text-gold hover:bg-surface transition-colors"
          >
            <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
          </a>
          <Link
            href="/my-booking"
            className="flex h-12 items-center justify-center gap-2 rounded-xl border border-border-gold text-sm font-medium text-text-muted hover:text-white hover:bg-surface transition-colors"
          >
            <Calendar className="h-4 w-4" /> Track Booking
          </Link>
        </div>

        <Link href="/" className="inline-block mt-6 text-sm text-text-dim hover:text-gold transition-colors">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
