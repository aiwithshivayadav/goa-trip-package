import type { Metadata } from "next";
import { Outfit, Cormorant_Garamond } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { cn } from "@/lib/utils";
import { MetaPixel } from "@/components/tracking/MetaPixel";
import { GoogleAds } from "@/components/tracking/GoogleAds";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://goatrippackage.com"),
  title: {
    default: "Goa Trip Package — Premium Goa Experiences",
    template: "%s | Goa Trip Package",
  },
  description:
    "Book premium Goa packages, cruises, yachts, activities & hotels. 10,000+ happy travellers. Best prices guaranteed. 24/7 concierge support.",
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
    title: "Goa Trip Package — Premium Goa Experiences",
    description:
      "Book premium Goa packages, cruises, yachts, activities & hotels. 10,000+ happy travellers.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Goa Trip Package — Premium Goa Experiences",
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
      className={cn("h-full", outfit.variable, cormorant.variable, "font-sans")}
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content="#FBFAF8" />
      </head>
      <body className="min-h-full bg-ground text-ink font-sans antialiased">
        <MetaPixel />
        <GoogleAds />
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>

        <div id="main-content" className="flex min-h-screen flex-col">
          {children}
        </div>

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#ffffff",
              border: "1px solid #E8E6E1",
              color: "#1F2937",
            },
          }}
          richColors
          closeButton
        />
      </body>
    </html>
  );
}
