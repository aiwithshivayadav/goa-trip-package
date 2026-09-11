"use client";

import { AlertTriangle, RotateCcw, MessageCircle } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-ground px-6 py-20 text-center">
      <div className="relative z-10 mx-auto max-w-lg">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-rose/30 bg-rose/5">
          <AlertTriangle className="h-10 w-10 text-rose" />
        </div>

        <p className="text-sm uppercase tracking-[0.15em] text-rose mb-3">
          Error 500
        </p>
        <h1 className="font-display text-4xl font-bold text-ink md:text-5xl">
          Something Went <span className="text-lagoon">Wrong</span>
        </h1>
        <p className="mt-4 text-gray-500 leading-relaxed">
          We encountered an unexpected error. This has been logged and our team
          has been notified. Please try again or reach out for help.
        </p>

        {error?.digest && (
          <p className="mt-3 text-xs text-gray-400">
            Error reference: {error.digest}
          </p>
        )}

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-lagoon px-8 text-sm font-bold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <RotateCcw className="h-4 w-4" />
            Try Again
          </button>
          <a
            href="https://wa.me/919890830249?text=Hi%2C%20I%27m%20experiencing%20an%20error%20on%20your%20website"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border-warm px-8 text-sm text-lagoon transition-colors hover:bg-lagoon-50"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp Support
          </a>
        </div>

        <div className="mt-12 border-t border-border-warm pt-8">
          <p className="text-xs text-gray-500 mb-4">
            You can also try these links:
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/" className="text-sm text-lagoon underline underline-offset-2 hover:text-lagoon-600">Homepage</a>
            <a href="/packages" className="text-sm text-lagoon underline underline-offset-2 hover:text-lagoon-600">Packages</a>
            <a href="/cruises" className="text-sm text-lagoon underline underline-offset-2 hover:text-lagoon-600">Cruises</a>
            <a href="/search" className="text-sm text-lagoon underline underline-offset-2 hover:text-lagoon-600">Search</a>
          </div>
        </div>
      </div>
    </div>
  );
}
