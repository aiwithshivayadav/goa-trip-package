import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";

const quickLinks = [
  { href: "/packages", label: "Tour Packages" },
  { href: "/cruises", label: "Cruises" },
  { href: "/yachts", label: "Yacht Charter" },
  { href: "/activities", label: "Activities" },
  { href: "/hotels", label: "Hotels" },
  { href: "/custom-trip", label: "Plan Custom Trip" },
];

const companyLinks = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
  { href: "/help", label: "Help & FAQ" },
  { href: "/my-booking", label: "Track Booking" },
];

const legalLinks = [
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/refund", label: "Refund Policy" },
  { href: "/cancellation", label: "Cancellation Policy" },
];

export function Footer() {
  return (
    <footer className="border-t border-border-gold bg-cosmic-950">
      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src="/logo-mark.svg"
                alt="Goa Trip Package"
                width={40}
                height={40}
                className="h-10 w-10"
              />
              <span className="font-display text-2xl font-bold text-white">
                Goa Trip <span className="text-gold">Package</span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-text-muted">
              Premium Goa experiences — packages, cruises, yachts, activities &amp; hotels.
              Crafted for the moments that matter.
            </p>
            <div className="mt-6 flex gap-4">
              <a
                href="https://www.instagram.com/goatrip_packages/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-gold text-text-muted transition-colors hover:border-gold hover:text-gold"
                aria-label="Instagram"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a
                href="https://www.facebook.com/goatrippackage"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-gold text-text-muted transition-colors hover:border-gold hover:text-gold"
                aria-label="Facebook"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a
                href="https://x.com/goatrippackage"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-gold text-text-muted transition-colors hover:border-gold hover:text-gold"
                aria-label="X (Twitter)"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gold">
              Explore
            </h3>
            <ul className="mt-4 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-muted transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gold">
              Company
            </h3>
            <ul className="mt-4 space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-muted transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-muted transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gold">
              Contact Us
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a
                  href="tel:+919890830249"
                  className="flex items-start gap-3 text-sm text-text-muted transition-colors hover:text-white"
                >
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  +91 98908 30249
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/919890830249"
                  className="flex items-start gap-3 text-sm text-text-muted transition-colors hover:text-white"
                >
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-gold" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp Us
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@goatrippackage.com"
                  className="flex items-start gap-3 text-sm text-text-muted transition-colors hover:text-white"
                >
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  info@goatrippackage.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-text-muted">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>Panjim, Goa, India</span>
              </li>
            </ul>

            {/* Payment badges */}
            <div className="mt-8">
              <p className="text-xs font-medium uppercase tracking-wider text-text-dim mb-3">
                Secure Payments
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded bg-surface px-2 py-1 text-xs text-text-muted border border-border-gold">PayU</span>
                <span className="rounded bg-surface px-2 py-1 text-xs text-text-muted border border-border-gold">UPI</span>
                <span className="rounded bg-surface px-2 py-1 text-xs text-text-muted border border-border-gold">Cards</span>
                <span className="rounded bg-surface px-2 py-1 text-xs text-text-muted border border-border-gold">Net Banking</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-border-gold bg-cosmic-900/50">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-text-dim md:flex-row md:px-8">
          <p>
            &copy; {new Date().getFullYear()} Goa Trip Package. All rights reserved. | This website is operated by Shivendra Yadav.
          </p>
          <p>
            Built with intention.
          </p>
        </div>
      </div>
    </footer>
  );
}
