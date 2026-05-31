import type { Metadata } from "next";
import Link from "next/link";
import { FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Terms and conditions for using Goa Trip Package services, including booking terms, payment policies, cancellation rules, and liability information.",
};

export default function TermsPage() {
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
            Terms &amp; <span className="text-gold-gradient">Conditions</span>
          </h1>
          <p className="mt-4 text-lg text-text-muted">
            Please read these terms carefully before using our services.
          </p>
          <p className="mt-3 text-xs text-text-dim">
            Last updated: June 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-4xl px-4 py-16 md:px-8 space-y-8">
        {/* Introduction */}
        <div className="glass-card rounded-2xl p-8 md:p-10">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="h-5 w-5 text-gold" />
            <h2 className="font-display text-xl font-bold text-white">
              Introduction
            </h2>
          </div>
          <div className="space-y-3 text-sm text-text-muted leading-relaxed">
            <p>
              These Terms &amp; Conditions (&quot;Terms&quot;) govern your use
              of the website goatrippackage.com (&quot;Website&quot;) and all
              services provided by Goa Trip Package, operated by Shivendra Yadav
              (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, or
              &quot;our&quot;). By accessing our Website or booking any service,
              you agree to be bound by these Terms.
            </p>
            <p>
              If you do not agree with any part of these Terms, please do not use
              our Website or services.
            </p>
          </div>
        </div>

        {/* Booking Terms */}
        <div className="glass-card rounded-2xl p-8 md:p-10">
          <h2 className="font-display text-xl font-bold text-white mb-4">
            1. Booking Terms
          </h2>
          <div className="space-y-3 text-sm text-text-muted leading-relaxed">
            <ul className="list-disc pl-5 space-y-2">
              <li>
                All bookings are subject to availability and confirmation by Goa
                Trip Package.
              </li>
              <li>
                A booking is confirmed only after payment is received and a
                confirmation message is sent via WhatsApp and/or email with a
                valid booking ID.
              </li>
              <li>
                You must provide accurate personal details (name, phone number,
                email) at the time of booking. Incorrect information may result
                in service denial without refund.
              </li>
              <li>
                Group bookings (10+ guests) may require a minimum advance
                payment of 50% and are subject to separate group terms
                communicated at the time of quotation.
              </li>
              <li>
                Custom trip itineraries are valid for 7 days from the date of the
                quote. Prices may change after this period.
              </li>
              <li>
                We reserve the right to modify or cancel any booking due to
                unforeseen circumstances, weather conditions, or safety concerns.
                In such cases, a full refund or alternative arrangement will be
                offered.
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Terms */}
        <div className="glass-card rounded-2xl p-8 md:p-10">
          <h2 className="font-display text-xl font-bold text-white mb-4">
            2. Payment Terms
          </h2>
          <div className="space-y-3 text-sm text-text-muted leading-relaxed">
            <ul className="list-disc pl-5 space-y-2">
              <li>
                All payments are processed securely through PayU, which supports
                credit/debit cards, UPI, net banking, and digital wallets. All
                transactions are encrypted with 256-bit SSL.
              </li>
              <li>
                Prices displayed on the Website are in Indian Rupees (INR) and
                include applicable taxes unless stated otherwise.
              </li>
              <li>
                We offer two payment options: full payment at the time of
                booking, or a 25% advance with the balance due before the
                experience date.
              </li>
              <li>
                For advance payment bookings, failure to pay the remaining
                balance at least 24 hours before the scheduled experience may
                result in automatic cancellation. The advance amount will be
                subject to our cancellation policy.
              </li>
              <li>
                Bank transfer is available for bookings exceeding INR 25,000.
                Details will be shared upon request.
              </li>
              <li>
                We do not store your payment card details. All payment
                information is handled exclusively by PayU in compliance with PCI
                DSS standards.
              </li>
            </ul>
          </div>
        </div>

        {/* Cancellation Policy */}
        <div className="glass-card rounded-2xl p-8 md:p-10">
          <h2 className="font-display text-xl font-bold text-white mb-4">
            3. Cancellation Policy
          </h2>
          <div className="space-y-3 text-sm text-text-muted leading-relaxed">
            <p>
              Cancellations are subject to the following terms. Please refer to
              our detailed{" "}
              <Link
                href="/cancellation"
                className="text-gold underline underline-offset-2 hover:text-gold-300"
              >
                Cancellation Policy
              </Link>{" "}
              and{" "}
              <Link
                href="/refund"
                className="text-gold underline underline-offset-2 hover:text-gold-300"
              >
                Refund Policy
              </Link>{" "}
              pages for complete information.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Cancellations made 48+ hours before the experience: full refund.
              </li>
              <li>
                Cancellations made 24&ndash;48 hours before: 75% refund.
              </li>
              <li>
                Cancellations made 12&ndash;24 hours before: 50% refund.
              </li>
              <li>
                Cancellations made less than 12 hours before or no-shows: no
                refund.
              </li>
              <li>
                Certain premium experiences (mega yachts, large group events) may
                have different cancellation windows as stated on the product
                page.
              </li>
            </ul>
          </div>
        </div>

        {/* Liability */}
        <div className="glass-card rounded-2xl p-8 md:p-10">
          <h2 className="font-display text-xl font-bold text-white mb-4">
            4. Limitation of Liability
          </h2>
          <div className="space-y-3 text-sm text-text-muted leading-relaxed">
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Goa Trip Package acts as an intermediary between customers and
                service providers (cruise operators, yacht owners, hotel
                partners, activity vendors). We are not directly liable for the
                quality, safety, or execution of third-party services.
              </li>
              <li>
                We take reasonable steps to vet and partner with reputable
                service providers. However, we cannot guarantee the performance
                of third parties.
              </li>
              <li>
                We are not liable for losses arising from natural disasters,
                weather conditions, government restrictions, pandemics, or any
                force majeure events.
              </li>
              <li>
                Our total liability for any claim shall not exceed the amount
                paid by you for the specific booking in question.
              </li>
              <li>
                Participation in water sports, adventure activities, and boat
                trips involves inherent risks. You agree to follow all safety
                instructions provided by operators. We recommend purchasing
                travel insurance.
              </li>
            </ul>
          </div>
        </div>

        {/* Intellectual Property */}
        <div className="glass-card rounded-2xl p-8 md:p-10">
          <h2 className="font-display text-xl font-bold text-white mb-4">
            5. Intellectual Property
          </h2>
          <div className="space-y-3 text-sm text-text-muted leading-relaxed">
            <ul className="list-disc pl-5 space-y-2">
              <li>
                All content on the Website, including text, images,
                photographs, logos, graphics, and software, is the property of
                Goa Trip Package or its licensors and is protected by Indian
                copyright and intellectual property laws.
              </li>
              <li>
                You may not reproduce, distribute, modify, or create derivative
                works from any content on this Website without prior written
                consent.
              </li>
              <li>
                The names &quot;Goa Trip Package&quot;, &quot;Party Yacht
                Goa&quot;, and &quot;Royal Cruise Goa&quot; and associated logos
                are trademarks of the Company.
              </li>
              <li>
                User-submitted reviews, photos, and feedback may be used by us
                for promotional purposes across our platforms, with attribution
                where appropriate.
              </li>
            </ul>
          </div>
        </div>

        {/* Privacy */}
        <div className="glass-card rounded-2xl p-8 md:p-10">
          <h2 className="font-display text-xl font-bold text-white mb-4">
            6. Privacy
          </h2>
          <div className="space-y-3 text-sm text-text-muted leading-relaxed">
            <p>
              Your privacy is important to us. Please review our{" "}
              <Link
                href="/privacy"
                className="text-gold underline underline-offset-2 hover:text-gold-300"
              >
                Privacy Policy
              </Link>{" "}
              for detailed information on how we collect, use, and protect your
              personal data. By using our Website, you consent to the data
              practices described in our Privacy Policy.
            </p>
          </div>
        </div>

        {/* Governing Law */}
        <div className="glass-card rounded-2xl p-8 md:p-10">
          <h2 className="font-display text-xl font-bold text-white mb-4">
            7. Governing Law &amp; Jurisdiction
          </h2>
          <div className="space-y-3 text-sm text-text-muted leading-relaxed">
            <ul className="list-disc pl-5 space-y-2">
              <li>
                These Terms shall be governed by and construed in accordance with
                the laws of India.
              </li>
              <li>
                Any disputes arising from or related to these Terms or our
                services shall be subject to the exclusive jurisdiction of the
                courts located in Goa, India.
              </li>
              <li>
                Before initiating legal proceedings, both parties agree to
                attempt resolution through good-faith negotiation and, if
                necessary, mediation.
              </li>
            </ul>
          </div>
        </div>

        {/* Changes */}
        <div className="glass-card rounded-2xl p-8 md:p-10">
          <h2 className="font-display text-xl font-bold text-white mb-4">
            8. Changes to These Terms
          </h2>
          <div className="space-y-3 text-sm text-text-muted leading-relaxed">
            <p>
              We reserve the right to update these Terms at any time. Changes
              will be posted on this page with a revised &quot;Last updated&quot;
              date. Continued use of the Website after changes constitutes
              acceptance of the updated Terms.
            </p>
          </div>
        </div>

        {/* Contact */}
        <div className="glass-card rounded-2xl p-8 md:p-10">
          <h2 className="font-display text-xl font-bold text-white mb-4">
            9. Contact Us
          </h2>
          <div className="space-y-3 text-sm text-text-muted leading-relaxed">
            <p>
              If you have questions about these Terms, please reach out:
            </p>
            <ul className="list-none space-y-2 pl-0">
              <li>
                <span className="text-gold font-medium">WhatsApp:</span>{" "}
                <a
                  href="https://wa.me/919890830249"
                  className="text-white hover:text-gold transition-colors"
                >
                  +91 98908 30249
                </a>
              </li>
              <li>
                <span className="text-gold font-medium">Email:</span>{" "}
                <a
                  href="mailto:info@goatrippackage.com"
                  className="text-white hover:text-gold transition-colors"
                >
                  info@goatrippackage.com
                </a>
              </li>
              <li>
                <span className="text-gold font-medium">Address:</span> Panaji,
                North Goa, India 403001
              </li>
            </ul>
          </div>
        </div>

        {/* Related links */}
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link
            href="/privacy"
            className="text-sm text-gold underline underline-offset-2 hover:text-gold-300"
          >
            Privacy Policy
          </Link>
          <Link
            href="/refund"
            className="text-sm text-gold underline underline-offset-2 hover:text-gold-300"
          >
            Refund Policy
          </Link>
          <Link
            href="/cancellation"
            className="text-sm text-gold underline underline-offset-2 hover:text-gold-300"
          >
            Cancellation Policy
          </Link>
        </div>
      </section>
    </div>
  );
}
