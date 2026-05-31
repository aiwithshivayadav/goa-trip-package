import type { Metadata } from "next";
import { Inter, Fraunces, Geist } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


// ── Fonts (next/font/google auto-downloads + self-hosts at build time) ──
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

// ── Metadata ──
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://goatrippackage.in"),
  title: {
    default: "Goa Trip Package — Your Royal Goa Experience",
    template: "%s | Goa Trip Package",
  },
  description:
    "Book premium Goa packages, cruises, yachts, activities & hotels. 1,200+ happy guests. Best prices guaranteed. 24/7 concierge support.",
  keywords: [
    "Goa trip package",
    "Goa tour packages",
    "Goa cruise booking",
    "yacht charter Goa",
    "water activities Goa",
    "honeymoon package Goa",
    "group trip Goa",
    "Goa holiday packages",
  ],
  authors: [{ name: "Goa Trip Package" }],
  creator: "Goa Trip Package",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Goa Trip Package",
    title: "Goa Trip Package — Your Royal Goa Experience",
    description:
      "Book premium Goa packages, cruises, yachts, activities & hotels. 1,200+ happy guests.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Goa Trip Package — Your Royal Goa Experience",
    description:
      "Book premium Goa packages, cruises, yachts, activities & hotels.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: "/favicon-32.png",
    apple: "/favicon-goatrippackage-192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", inter.variable, fraunces.variable, "font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content="#05000F" />
      </head>
      <body className="min-h-full bg-cosmic-950 text-white font-sans antialiased">
        {/* Skip to content — accessibility */}
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>

        {/* Main content */}
        <div id="main-content" className="flex min-h-screen flex-col">
          {children}
        </div>

        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "rgba(10, 0, 32, 0.95)",
              border: "1px solid rgba(201, 168, 76, 0.25)",
              color: "#ffffff",
              backdropFilter: "blur(16px)",
            },
          }}
          richColors
          closeButton
        />
      </body>
    </html>
  );
}
