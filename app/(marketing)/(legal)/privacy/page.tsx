import type { Metadata } from "next";
import Link from "next/link";
import { Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Goa Trip Package collects, uses, and protects your personal information. GDPR-compliant privacy practices.",
};

export default function PrivacyPage() {
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
            Privacy <span className="text-gold-gradient">Policy</span>
          </h1>
          <p className="mt-4 text-lg text-text-muted">
            Your privacy matters to us. Here&apos;s how we handle your data.
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
            <Shield className="h-5 w-5 text-gold" />
            <h2 className="font-display text-xl font-bold text-white">
              Introduction
            </h2>
          </div>
          <div className="space-y-3 text-sm text-text-muted leading-relaxed">
            <p>
              Goa Trip Package, operated by Shivendra Yadav (&quot;we&quot;,
              &quot;us&quot;, &quot;our&quot;), is committed to protecting your
              personal information. This Privacy Policy explains what data we
              collect, how we use it, and your rights regarding that data.
            </p>
            <p>
              This policy applies to all information collected through our
              website (goatrippackage.com), WhatsApp communications, and any
              related services or interactions.
            </p>
          </div>
        </div>

        {/* Information We Collect */}
        <div className="glass-card rounded-2xl p-8 md:p-10">
          <h2 className="font-display text-xl font-bold text-white mb-4">
            1. Information We Collect
          </h2>
          <div className="space-y-4 text-sm text-text-muted leading-relaxed">
            <div>
              <h3 className="text-sm font-bold text-white mb-2">
                Personal Information You Provide
              </h3>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  Full name, email address, and phone number (when booking or
                  enquiring)
                </li>
                <li>
                  Travel dates, group size, and trip preferences (for custom
                  itineraries)
                </li>
                <li>
                  Billing address and payment details (processed securely via
                  PayU; we do not store card numbers)
                </li>
                <li>
                  Messages, feedback, and reviews submitted through our website
                  or WhatsApp
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white mb-2">
                Information Collected Automatically
              </h3>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  Browser type, device information, IP address, and operating
                  system
                </li>
                <li>
                  Pages visited, time spent on pages, referring URLs, and click
                  patterns
                </li>
                <li>
                  Cookies and similar tracking technologies (see Section 4)
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* How We Use It */}
        <div className="glass-card rounded-2xl p-8 md:p-10">
          <h2 className="font-display text-xl font-bold text-white mb-4">
            2. How We Use Your Information
          </h2>
          <div className="space-y-3 text-sm text-text-muted leading-relaxed">
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                Process and confirm your bookings, send itineraries, and provide
                booking support
              </li>
              <li>
                Communicate with you via WhatsApp, email, or phone regarding
                your bookings and enquiries
              </li>
              <li>
                Process payments securely and send payment receipts and invoices
              </li>
              <li>
                Send promotional offers, new package announcements, and seasonal
                deals (you can opt out at any time)
              </li>
              <li>
                Improve our website, services, and customer experience based on
                usage patterns
              </li>
              <li>
                Comply with legal obligations and prevent fraudulent activities
              </li>
              <li>
                Generate anonymous, aggregated analytics to understand market
                trends
              </li>
            </ul>
          </div>
        </div>

        {/* Data Sharing */}
        <div className="glass-card rounded-2xl p-8 md:p-10">
          <h2 className="font-display text-xl font-bold text-white mb-4">
            3. Data Sharing &amp; Third Parties
          </h2>
          <div className="space-y-3 text-sm text-text-muted leading-relaxed">
            <p>
              We do not sell your personal data. We share information only with
              the following trusted partners, strictly for service delivery:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <span className="text-white font-medium">PayU</span> &mdash;
                Payment processing. PayU receives your payment details to
                process transactions securely under PCI DSS compliance. See{" "}
                <a
                  href="https://payu.in/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold underline underline-offset-2 hover:text-gold-300"
                >
                  PayU&apos;s Privacy Policy
                </a>
                .
              </li>
              <li>
                <span className="text-white font-medium">n8n</span> &mdash;
                Workflow automation. Used internally to automate booking
                confirmations, follow-ups, and notifications. Your data is
                processed on our self-hosted instance and not shared further.
              </li>
              <li>
                <span className="text-white font-medium">Interakt</span>{" "}
                &mdash; WhatsApp Business API. Used to send booking
                confirmations, reminders, and support messages via WhatsApp. See{" "}
                <a
                  href="https://www.interakt.shop/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold underline underline-offset-2 hover:text-gold-300"
                >
                  Interakt&apos;s Privacy Policy
                </a>
                .
              </li>
              <li>
                <span className="text-white font-medium">
                  Service Providers
                </span>{" "}
                &mdash; Cruise operators, yacht owners, hotels, and activity
                vendors receive only the information necessary to deliver your
                booked experience (name, contact number, group size, special
                requests).
              </li>
            </ul>
            <p>
              We may also disclose information if required by law, court order,
              or to protect our rights and safety.
            </p>
          </div>
        </div>

        {/* Cookies */}
        <div className="glass-card rounded-2xl p-8 md:p-10">
          <h2 className="font-display text-xl font-bold text-white mb-4">
            4. Cookies &amp; Tracking
          </h2>
          <div className="space-y-3 text-sm text-text-muted leading-relaxed">
            <p>We use cookies and similar technologies to:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <span className="text-white font-medium">
                  Essential cookies:
                </span>{" "}
                Maintain your session, remember your cart, and ensure the website
                functions properly.
              </li>
              <li>
                <span className="text-white font-medium">
                  Analytics cookies:
                </span>{" "}
                Understand how visitors use our website so we can improve
                content, navigation, and performance.
              </li>
              <li>
                <span className="text-white font-medium">
                  Marketing cookies:
                </span>{" "}
                Deliver relevant advertisements and track campaign effectiveness
                across platforms.
              </li>
            </ul>
            <p>
              You can manage cookie preferences through your browser settings.
              Disabling essential cookies may affect website functionality. Most
              browsers allow you to block or delete cookies, but this may impact
              your experience.
            </p>
          </div>
        </div>

        {/* Data Retention */}
        <div className="glass-card rounded-2xl p-8 md:p-10">
          <h2 className="font-display text-xl font-bold text-white mb-4">
            5. Data Retention
          </h2>
          <div className="space-y-3 text-sm text-text-muted leading-relaxed">
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                Booking records and transaction data are retained for 5 years
                for tax and legal compliance purposes.
              </li>
              <li>
                Marketing contact information is retained until you unsubscribe
                or request deletion.
              </li>
              <li>
                Website analytics data is anonymised and retained indefinitely
                for trend analysis.
              </li>
              <li>
                WhatsApp conversation logs are retained for 12 months for
                quality assurance, then deleted.
              </li>
              <li>
                Enquiry data (where no booking was made) is retained for 6
                months and then purged.
              </li>
            </ul>
          </div>
        </div>

        {/* Your Rights */}
        <div className="glass-card rounded-2xl p-8 md:p-10">
          <h2 className="font-display text-xl font-bold text-white mb-4">
            6. Your Rights
          </h2>
          <div className="space-y-3 text-sm text-text-muted leading-relaxed">
            <p>
              You have the following rights regarding your personal data:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <span className="text-white font-medium">
                  Right to Access:
                </span>{" "}
                Request a copy of the personal data we hold about you.
              </li>
              <li>
                <span className="text-white font-medium">
                  Right to Correction:
                </span>{" "}
                Request correction of inaccurate or incomplete data.
              </li>
              <li>
                <span className="text-white font-medium">
                  Right to Deletion:
                </span>{" "}
                Request deletion of your personal data, subject to legal
                retention requirements.
              </li>
              <li>
                <span className="text-white font-medium">
                  Right to Opt Out:
                </span>{" "}
                Unsubscribe from marketing communications at any time by
                replying &quot;STOP&quot; on WhatsApp or clicking &quot;unsubscribe&quot; in
                emails.
              </li>
              <li>
                <span className="text-white font-medium">
                  Right to Portability:
                </span>{" "}
                Request your data in a machine-readable format.
              </li>
              <li>
                <span className="text-white font-medium">
                  Right to Object:
                </span>{" "}
                Object to the processing of your data for specific purposes.
              </li>
            </ul>
            <p>
              To exercise any of these rights, contact us using the details
              below. We will respond within 30 days.
            </p>
          </div>
        </div>

        {/* Data Security */}
        <div className="glass-card rounded-2xl p-8 md:p-10">
          <h2 className="font-display text-xl font-bold text-white mb-4">
            7. Data Security
          </h2>
          <div className="space-y-3 text-sm text-text-muted leading-relaxed">
            <p>
              We implement appropriate technical and organisational measures to
              protect your personal data, including:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>SSL/TLS encryption for all data in transit</li>
              <li>PCI DSS compliant payment processing via PayU</li>
              <li>Access controls limiting data access to authorised staff only</li>
              <li>Regular security reviews and updates to our systems</li>
            </ul>
            <p>
              While we strive to protect your data, no method of transmission
              over the internet is 100% secure. We cannot guarantee absolute
              security.
            </p>
          </div>
        </div>

        {/* Contact for Privacy */}
        <div className="glass-card rounded-2xl p-8 md:p-10">
          <h2 className="font-display text-xl font-bold text-white mb-4">
            8. Contact for Privacy Queries
          </h2>
          <div className="space-y-3 text-sm text-text-muted leading-relaxed">
            <p>
              For any privacy-related questions, data access requests, or
              concerns about how your data is being handled, please contact:
            </p>
            <div className="mt-4 glass-card rounded-xl p-5">
              <p className="text-white font-medium text-sm">
                Shivendra Yadav
              </p>
              <p className="text-text-dim text-xs mt-1">
                Data Controller, Goa Trip Package
              </p>
              <ul className="list-none space-y-1.5 pl-0 mt-3">
                <li>
                  <span className="text-gold font-medium">Email:</span>{" "}
                  <a
                    href="mailto:privacy@goatrippackage.com"
                    className="text-white hover:text-gold transition-colors"
                  >
                    privacy@goatrippackage.com
                  </a>
                </li>
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
                  <span className="text-gold font-medium">Address:</span>{" "}
                  Panaji, North Goa, India 403001
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related links */}
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link
            href="/terms"
            className="text-sm text-gold underline underline-offset-2 hover:text-gold-300"
          >
            Terms &amp; Conditions
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
