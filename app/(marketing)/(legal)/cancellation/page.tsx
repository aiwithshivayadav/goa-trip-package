import type { Metadata } from "next";
import Link from "next/link";
import { XCircle, MessageCircle, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Cancellation Policy",
  description:
    "Goa Trip Package cancellation policy — how to cancel bookings, what happens to payments, group cancellation rules, and force majeure terms.",
};

export default function CancellationPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-cosmic-scene py-20 text-center md:py-28">
        <div className="bg-stars absolute inset-0" />
        <div className="relative z-10 mx-auto max-w-3xl px-6">
          <p className="text-sm uppercase tracking-[0.15em] text-gold mb-3">
            Legal
          </p>
          <h1 className="font-display text-4xl font-bold text-white md:text-5xl">
            Cancellation{" "}
            <span className="text-gold-gradient">Policy</span>
          </h1>
          <p className="mt-4 text-lg text-text-muted">
            Plans change. We get it. Here&apos;s how cancellations work.
          </p>
          <p className="mt-3 text-xs text-text-dim">
            Last updated: June 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-4xl px-4 py-16 md:px-8 space-y-8">
        {/* How to Cancel */}
        <div className="glass-card rounded-2xl p-8 md:p-10">
          <div className="flex items-center gap-3 mb-4">
            <XCircle className="h-5 w-5 text-gold" />
            <h2 className="font-display text-xl font-bold text-white">
              How to Cancel a Booking
            </h2>
          </div>
          <div className="space-y-4 text-sm text-text-muted leading-relaxed">
            <p>
              Cancellation requests can be submitted through the following
              channels:
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="glass-card rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle className="h-4 w-4 text-gold" />
                  <h3 className="text-sm font-bold text-white">
                    WhatsApp (Fastest)
                  </h3>
                </div>
                <p className="text-xs text-text-muted">
                  Send your booking ID and cancellation request to{" "}
                  <a
                    href="https://wa.me/919890830249"
                    className="text-gold hover:text-gold-300"
                  >
                    +91 98908 30249
                  </a>
                  . Average processing time: 30 minutes during business hours.
                </p>
              </div>
              <div className="glass-card rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="h-4 w-4 text-gold" />
                  <h3 className="text-sm font-bold text-white">Email</h3>
                </div>
                <p className="text-xs text-text-muted">
                  Email{" "}
                  <a
                    href="mailto:info@goatrippackage.com"
                    className="text-gold hover:text-gold-300"
                  >
                    info@goatrippackage.com
                  </a>{" "}
                  with subject &quot;Cancel Booking #[ID]&quot;. Response within 2
                  hours during business hours.
                </p>
              </div>
            </div>
            <div className="mt-2 rounded-xl border border-border-gold/30 bg-gold/5 p-4">
              <p className="text-xs text-gold">
                <span className="font-bold">Important:</span> Cancellation
                time is calculated from the moment we receive and acknowledge
                your request, not from when you send it. We recommend using
                WhatsApp for urgent cancellations.
              </p>
            </div>
          </div>
        </div>

        {/* Cancellation Windows */}
        <div className="glass-card rounded-2xl p-8 md:p-10">
          <h2 className="font-display text-xl font-bold text-white mb-4">
            Cancellation Windows &amp; Refunds
          </h2>
          <div className="space-y-3 text-sm text-text-muted leading-relaxed">
            <p>
              The refund you receive depends on when you cancel relative to
              your scheduled experience. All times are in IST.
            </p>
            <div className="space-y-3 mt-4">
              <div className="flex items-center gap-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                  <span className="text-sm font-bold text-emerald-400">
                    100%
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    48+ hours before experience
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">
                    Full refund processed within 24 hours
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-xl border border-gold/20 bg-gold/5 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/10">
                  <span className="text-sm font-bold text-gold">75%</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    24 to 48 hours before experience
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">
                    25% retained as processing fee
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/10">
                  <span className="text-sm font-bold text-amber-400">50%</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    12 to 24 hours before experience
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">
                    50% retained as late cancellation fee
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-xl border border-rose/20 bg-rose/5 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose/10">
                  <span className="text-sm font-bold text-rose">0%</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    Less than 12 hours or no-show
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">
                    No refund applicable
                  </p>
                </div>
              </div>
            </div>
            <p className="mt-4">
              For detailed refund processing timelines, see our{" "}
              <Link
                href="/refund"
                className="text-gold underline underline-offset-2 hover:text-gold-300"
              >
                Refund Policy
              </Link>
              .
            </p>
          </div>
        </div>

        {/* Partial Payments */}
        <div className="glass-card rounded-2xl p-8 md:p-10">
          <h2 className="font-display text-xl font-bold text-white mb-4">
            Partial Payment Bookings
          </h2>
          <div className="space-y-3 text-sm text-text-muted leading-relaxed">
            <p>
              If you booked with a 25% advance payment and wish to cancel:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <span className="text-white font-medium">
                  48+ hours before:
                </span>{" "}
                Your full advance (25%) is refunded. No further charges.
              </li>
              <li>
                <span className="text-white font-medium">
                  24&ndash;48 hours before:
                </span>{" "}
                75% of the advance amount is refunded. No obligation to pay the
                remaining balance.
              </li>
              <li>
                <span className="text-white font-medium">
                  12&ndash;24 hours before:
                </span>{" "}
                50% of the advance amount is refunded. No obligation to pay the
                remaining balance.
              </li>
              <li>
                <span className="text-white font-medium">
                  Less than 12 hours:
                </span>{" "}
                The advance payment is forfeited. No additional charges.
              </li>
            </ul>
            <p>
              You will never be charged more than what you have already paid.
              The outstanding balance is automatically voided upon cancellation.
            </p>
          </div>
        </div>

        {/* Group Cancellations */}
        <div className="glass-card rounded-2xl p-8 md:p-10">
          <h2 className="font-display text-xl font-bold text-white mb-4">
            Group Cancellation Rules
          </h2>
          <div className="space-y-3 text-sm text-text-muted leading-relaxed">
            <p>
              For group bookings (10 or more guests), the following additional
              rules apply:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <span className="text-white font-medium">Full group cancellation:</span>{" "}
                The standard cancellation windows apply. The group lead or
                booking contact must initiate the cancellation.
              </li>
              <li>
                <span className="text-white font-medium">
                  Partial group reduction:
                </span>{" "}
                If reducing group size by fewer than 30% of total guests, the
                price may remain the same (per-head pricing adjustments apply
                only above the 30% threshold).
              </li>
              <li>
                <span className="text-white font-medium">
                  Reducing group size by 30% or more:
                </span>{" "}
                This is treated as a cancellation and rebooking. The original
                booking is cancelled per standard terms, and a new booking is
                created at the revised group rate.
              </li>
              <li>
                <span className="text-white font-medium">
                  Corporate/event bookings:
                </span>{" "}
                May have custom cancellation terms as specified in the quotation
                or agreement. These terms supersede the standard policy.
              </li>
            </ul>
          </div>
        </div>

        {/* Force Majeure */}
        <div className="glass-card rounded-2xl p-8 md:p-10">
          <h2 className="font-display text-xl font-bold text-white mb-4">
            Force Majeure
          </h2>
          <div className="space-y-3 text-sm text-text-muted leading-relaxed">
            <p>
              Neither Goa Trip Package nor the customer shall be held liable
              for failure to perform obligations under a booking when such
              failure results from events beyond reasonable control, including
              but not limited to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Natural disasters (floods, earthquakes, cyclones)</li>
              <li>
                Severe weather conditions rendering activities unsafe
              </li>
              <li>
                Government actions (lockdowns, curfews, travel restrictions)
              </li>
              <li>Pandemics or public health emergencies</li>
              <li>Civil unrest, strikes, or port closures</li>
              <li>
                Technical failures beyond our control (e.g., widespread power
                outages, telecom failures)
              </li>
            </ul>
            <p className="mt-3">
              In force majeure situations, we offer a{" "}
              <span className="text-gold font-medium">full refund</span> or a{" "}
              <span className="text-gold font-medium">
                booking credit valid for 12 months
              </span>
              , at your choice.
            </p>
          </div>
        </div>

        {/* Cancellations by Us */}
        <div className="glass-card rounded-2xl p-8 md:p-10">
          <h2 className="font-display text-xl font-bold text-white mb-4">
            Cancellations by Goa Trip Package
          </h2>
          <div className="space-y-3 text-sm text-text-muted leading-relaxed">
            <p>
              In rare cases, we may need to cancel a booking due to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Operator unavailability or vessel maintenance</li>
              <li>Safety concerns identified before the experience</li>
              <li>Minimum group size not being met (applicable to shared cruises)</li>
              <li>Regulatory or permit issues</li>
            </ul>
            <p className="mt-3">
              In all such cases, you will receive a{" "}
              <span className="text-gold font-medium">full refund</span>{" "}
              within 24 hours, or we will offer an equivalent alternative
              experience at no extra cost. We will notify you as early as
              possible via WhatsApp and email.
            </p>
          </div>
        </div>

        {/* Contact */}
        <div className="glass-card rounded-2xl p-8 md:p-10">
          <h2 className="font-display text-xl font-bold text-white mb-4">
            Need Help with a Cancellation?
          </h2>
          <div className="space-y-3 text-sm text-text-muted leading-relaxed">
            <p>
              Our team is available to assist with cancellations and answer any
              questions:
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <a
                href="https://wa.me/919890830249?text=Hi%2C%20I%20need%20to%20cancel%20my%20booking"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 text-sm font-bold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <MessageCircle className="h-4 w-4" />
                Cancel via WhatsApp
              </a>
              <a
                href="mailto:info@goatrippackage.com?subject=Booking%20Cancellation"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border-gold px-6 text-sm text-gold transition-colors hover:bg-surface-hover"
              >
                <Mail className="h-4 w-4" />
                Email Us
              </a>
            </div>
          </div>
        </div>

        {/* Related links */}
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link
            href="/refund"
            className="text-sm text-gold underline underline-offset-2 hover:text-gold-300"
          >
            Refund Policy
          </Link>
          <Link
            href="/terms"
            className="text-sm text-gold underline underline-offset-2 hover:text-gold-300"
          >
            Terms &amp; Conditions
          </Link>
          <Link
            href="/privacy"
            className="text-sm text-gold underline underline-offset-2 hover:text-gold-300"
          >
            Privacy Policy
          </Link>
        </div>
      </section>
    </div>
  );
}
