import type { Metadata } from "next";
import Link from "next/link";
import { IndianRupee } from "lucide-react";

export const metadata: Metadata = {
  title: "Refund Policy",
  description:
    "Goa Trip Package refund policy — clear refund timelines based on cancellation window, PayU refund processing, and special case refunds.",
};

const refundTiers = [
  {
    window: "48+ hours before experience",
    refund: "100%",
    note: "Full refund, no questions asked",
  },
  {
    window: "24 to 48 hours before",
    refund: "75%",
    note: "25% retained as processing fee",
  },
  {
    window: "12 to 24 hours before",
    refund: "50%",
    note: "50% retained as late cancellation fee",
  },
  {
    window: "Less than 12 hours / No-show",
    refund: "0%",
    note: "No refund applicable",
  },
];

export default function RefundPage() {
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
            Refund <span className="text-gold-gradient">Policy</span>
          </h1>
          <p className="mt-4 text-lg text-text-muted">
            Transparent refund terms. No hidden clauses.
          </p>
          <p className="mt-3 text-xs text-text-dim">
            Last updated: June 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-4xl px-4 py-16 md:px-8 space-y-8">
        {/* Overview */}
        <div className="glass-card rounded-2xl p-8 md:p-10">
          <div className="flex items-center gap-3 mb-4">
            <IndianRupee className="h-5 w-5 text-gold" />
            <h2 className="font-display text-xl font-bold text-white">
              Refund Overview
            </h2>
          </div>
          <p className="text-sm text-text-muted leading-relaxed">
            At Goa Trip Package, operated by Shivendra Yadav, we believe in
            fair and transparent refund practices. Your refund amount depends on
            when you cancel relative to the scheduled experience. All refunds
            are processed through the original payment method via PayU.
          </p>
        </div>

        {/* Refund Table */}
        <div className="glass-card rounded-2xl p-8 md:p-10">
          <h2 className="font-display text-xl font-bold text-white mb-6">
            Refund Schedule
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-gold/30">
                  <th className="py-3 pr-4 text-left font-bold text-gold">
                    Cancellation Window
                  </th>
                  <th className="py-3 px-4 text-center font-bold text-gold">
                    Refund
                  </th>
                  <th className="py-3 pl-4 text-left font-bold text-gold">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody>
                {refundTiers.map((tier, i) => (
                  <tr
                    key={i}
                    className="border-b border-border-gold/10 last:border-0"
                  >
                    <td className="py-4 pr-4 text-white font-medium">
                      {tier.window}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${
                          tier.refund === "100%"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : tier.refund === "75%"
                              ? "bg-gold/10 text-gold"
                              : tier.refund === "50%"
                                ? "bg-amber-500/10 text-amber-400"
                                : "bg-rose/10 text-rose"
                        }`}
                      >
                        {tier.refund}
                      </span>
                    </td>
                    <td className="py-4 pl-4 text-text-muted">{tier.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* PayU Refund Timeline */}
        <div className="glass-card rounded-2xl p-8 md:p-10">
          <h2 className="font-display text-xl font-bold text-white mb-4">
            PayU Refund Timeline
          </h2>
          <div className="space-y-3 text-sm text-text-muted leading-relaxed">
            <p>
              Once a refund is approved by Goa Trip Package, the following
              processing timelines apply:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <span className="text-white font-medium">
                  Refund initiation:
                </span>{" "}
                Within 24 hours of cancellation approval.
              </li>
              <li>
                <span className="text-white font-medium">
                  Credit/Debit Cards:
                </span>{" "}
                5&ndash;7 business days to reflect in your account.
              </li>
              <li>
                <span className="text-white font-medium">UPI:</span>{" "}
                2&ndash;4 business days.
              </li>
              <li>
                <span className="text-white font-medium">Net Banking:</span>{" "}
                5&ndash;7 business days.
              </li>
              <li>
                <span className="text-white font-medium">Wallets:</span>{" "}
                1&ndash;3 business days.
              </li>
              <li>
                <span className="text-white font-medium">Bank Transfer:</span>{" "}
                3&ndash;5 business days after initiating NEFT/RTGS.
              </li>
            </ul>
            <p>
              You will receive a refund confirmation on WhatsApp and email with
              the PayU refund reference number for tracking.
            </p>
          </div>
        </div>

        {/* Special Cases */}
        <div className="glass-card rounded-2xl p-8 md:p-10">
          <h2 className="font-display text-xl font-bold text-white mb-4">
            Special Cases
          </h2>
          <div className="space-y-4 text-sm text-text-muted leading-relaxed">
            <div>
              <h3 className="text-sm font-bold text-white mb-2">
                Weather-Related Cancellations
              </h3>
              <p>
                If an experience is cancelled due to adverse weather conditions
                (heavy rain, high seas, storms, or government weather
                advisories), you will receive a{" "}
                <span className="text-gold font-medium">full refund</span> or
                the option to reschedule at no extra cost, at your choice.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white mb-2">
                Operator Cancellations
              </h3>
              <p>
                If a cruise operator, yacht owner, or activity vendor cancels
                the experience for any reason (mechanical issues, overbooking,
                crew unavailability), you will receive a{" "}
                <span className="text-gold font-medium">full refund</span>{" "}
                within 24 hours. We will also attempt to offer an equivalent
                alternative at no additional cost.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white mb-2">
                Partial Service Delivery
              </h3>
              <p>
                If an experience is significantly shorter or differs from what
                was described (e.g., cruise route changed, activity reduced),
                you may request a partial refund. We will review the case and
                provide a fair resolution within 48 hours.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white mb-2">
                Government Restrictions or Force Majeure
              </h3>
              <p>
                Cancellations due to government orders, lockdowns, curfews, or
                natural disasters qualify for a full refund or credit towards a
                future booking (valid for 12 months).
              </p>
            </div>
          </div>
        </div>

        {/* Non-Refundable */}
        <div className="glass-card rounded-2xl p-8 md:p-10">
          <h2 className="font-display text-xl font-bold text-white mb-4">
            Non-Refundable Items
          </h2>
          <div className="space-y-3 text-sm text-text-muted leading-relaxed">
            <ul className="list-disc pl-5 space-y-1.5">
              <li>No-shows without prior cancellation communication</li>
              <li>
                Services already rendered (even if partially utilised)
              </li>
              <li>
                Convenience fees and payment gateway charges (applicable only
                for refunds below 100%)
              </li>
              <li>
                Custom/bespoke arrangements (e.g., personalised decorations,
                custom cakes) where the vendor has already incurred costs
              </li>
            </ul>
          </div>
        </div>

        {/* How to Request */}
        <div className="glass-card rounded-2xl p-8 md:p-10">
          <h2 className="font-display text-xl font-bold text-white mb-4">
            How to Request a Refund
          </h2>
          <div className="space-y-3 text-sm text-text-muted leading-relaxed">
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                Contact us on{" "}
                <a
                  href="https://wa.me/919890830249"
                  className="text-gold underline underline-offset-2 hover:text-gold-300"
                >
                  WhatsApp (+91 98908 30249)
                </a>{" "}
                or email{" "}
                <a
                  href="mailto:info@goatrippackage.com"
                  className="text-gold underline underline-offset-2 hover:text-gold-300"
                >
                  info@goatrippackage.com
                </a>{" "}
                with your booking ID.
              </li>
              <li>
                Our team will verify the cancellation window and confirm your
                eligible refund amount.
              </li>
              <li>
                Upon confirmation, the refund is initiated through PayU within
                24 hours.
              </li>
              <li>
                You will receive a refund confirmation with reference number on
                WhatsApp and email.
              </li>
            </ol>
          </div>
        </div>

        {/* Related links */}
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link
            href="/cancellation"
            className="text-sm text-gold underline underline-offset-2 hover:text-gold-300"
          >
            Cancellation Policy
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
