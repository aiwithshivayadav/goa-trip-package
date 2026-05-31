"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Shield, ArrowLeft, Check, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { getProductBySlug } from "@/lib/data/products";
import { formatINR } from "@/lib/utils";

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-cosmic-950"><div className="animate-pulse text-text-muted">Loading checkout...</div></div>}>
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const productSlug = searchParams.get("product") || "";
  const productType = searchParams.get("type") || "";

  const product = getProductBySlug(productSlug);

  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [travelDate, setTravelDate] = useState("");
  const [paymentMode, setPaymentMode] = useState<"full" | "advance">("full");
  const [promoCode, setPromoCode] = useState("");
  const [loading, setLoading] = useState(false);

  // Customer details
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cosmic-950 px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Product not found</h1>
          <p className="text-text-muted mb-6">The product you&apos;re trying to book doesn&apos;t exist.</p>
          <Link href="/packages" className="text-gold hover:text-gold-200">Browse packages →</Link>
        </div>
      </div>
    );
  }

  // TypeScript can't narrow after hooks — safe to assert after guard
  const p = product;
  const unitPrice = Number(p.basePrice);
  const isPerPerson = p.priceUnit === "per person";
  const quantity = isPerPerson ? adults + children : 1;
  const subtotal = unitPrice * quantity;
  const gstRate = 5;
  const gstAmount = Math.round((subtotal * gstRate) / 105); // GST included in price
  const total = subtotal;
  const advanceAmount = Math.round(total * 0.25);
  const payableNow = paymentMode === "full" ? total : advanceAmount;

  async function handlePayNow() {
    if (!name || !email || !phone || !travelDate) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      // Generate booking ID
      const bookingId = `GTP-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      const txnid = `${bookingId}_${Date.now()}`;

      // Get hash from our API
      const hashRes = await fetch("/api/payu/hash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          txnid,
          amount: payableNow.toFixed(2),
          productinfo: p.name,
          firstname: name.split(" ")[0] ?? name,
          email,
          udf1: bookingId,
          udf2: travelDate,
          udf3: `${adults}+${children}`,
        }),
      });

      if (!hashRes.ok) {
        toast.error("Payment service unavailable. Try WhatsApp booking.");
        return;
      }

      const { key, hash, action } = await hashRes.json();

      // Build and submit PayU form
      const form = document.createElement("form");
      form.method = "POST";
      form.action = action;

      const fields: Record<string, string> = {
        key,
        txnid,
        amount: payableNow.toFixed(2),
        productinfo: p.name,
        firstname: name.split(" ")[0] ?? name,
        lastname: name.split(" ").slice(1).join(" ") || "",
        email,
        phone: phone.replace(/\D/g, ""),
        surl: `${window.location.origin}/api/payu/success`,
        furl: `${window.location.origin}/api/payu/failure`,
        hash,
        udf1: bookingId,
        udf2: travelDate,
        udf3: `${adults}+${children}`,
        udf4: "",
        udf5: "",
      };

      Object.entries(fields).forEach(([k, v]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = k;
        input.value = v;
        form.appendChild(input);
      });

      document.body.appendChild(form);

      // Store booking data in sessionStorage for post-payment recovery
      sessionStorage.setItem("pendingBooking", JSON.stringify({
        bookingId,
        productName: p.name,
        productSlug: p.slug,
        travelDate,
        adults,
        children,
        total,
        payableNow,
        paymentMode,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        specialRequests,
      }));

      form.submit();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-cosmic-950">
      {/* Header */}
      <div className="border-b border-border-gold bg-cosmic-900/50">
        <div className="mx-auto max-w-7xl px-4 py-4 md:px-8">
          <Link href={`/${productType}s/${productSlug}`} className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-gold transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to {p.name}
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <h1 className="font-display text-2xl font-bold text-white md:text-3xl mb-8">
          Secure <span className="text-gold-gradient">Checkout</span>
        </h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left: Form (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Booking details */}
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">Booking Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-text-muted mb-2">Travel Date *</label>
                  <input type="date" value={travelDate} onChange={(e) => setTravelDate(e.target.value)} required className="w-full h-12 rounded-lg bg-surface border border-border-gold px-4 text-white focus:border-gold focus:ring-1 focus:ring-gold transition-colors" />
                </div>

                {isPerPerson && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm text-text-muted mb-2">Adults</label>
                      <div className="flex items-center gap-3">
                        <button onClick={() => setAdults(Math.max(1, adults - 1))} className="flex h-10 w-10 items-center justify-center rounded-lg border border-border-gold text-text-muted hover:text-white hover:border-gold"><Minus className="h-4 w-4" /></button>
                        <span className="text-lg font-bold text-white w-8 text-center">{adults}</span>
                        <button onClick={() => setAdults(adults + 1)} className="flex h-10 w-10 items-center justify-center rounded-lg border border-border-gold text-text-muted hover:text-white hover:border-gold"><Plus className="h-4 w-4" /></button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-text-muted mb-2">Children (0-12)</label>
                      <div className="flex items-center gap-3">
                        <button onClick={() => setChildren(Math.max(0, children - 1))} className="flex h-10 w-10 items-center justify-center rounded-lg border border-border-gold text-text-muted hover:text-white hover:border-gold"><Minus className="h-4 w-4" /></button>
                        <span className="text-lg font-bold text-white w-8 text-center">{children}</span>
                        <button onClick={() => setChildren(children + 1)} className="flex h-10 w-10 items-center justify-center rounded-lg border border-border-gold text-text-muted hover:text-white hover:border-gold"><Plus className="h-4 w-4" /></button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Customer info */}
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">Your Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-text-muted mb-2">Full Name *</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required className="w-full h-12 rounded-lg bg-surface border border-border-gold px-4 text-white placeholder:text-text-dim focus:border-gold focus:ring-1 focus:ring-gold transition-colors" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm text-text-muted mb-2">Email *</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" required className="w-full h-12 rounded-lg bg-surface border border-border-gold px-4 text-white placeholder:text-text-dim focus:border-gold focus:ring-1 focus:ring-gold transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm text-text-muted mb-2">Phone (WhatsApp) *</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98908 30249" required className="w-full h-12 rounded-lg bg-surface border border-border-gold px-4 text-white placeholder:text-text-dim focus:border-gold focus:ring-1 focus:ring-gold transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-text-muted mb-2">Special Requests (optional)</label>
                  <textarea value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} placeholder="Dietary needs, celebrations, accessibility requirements..." rows={3} className="w-full rounded-lg bg-surface border border-border-gold px-4 py-3 text-white placeholder:text-text-dim focus:border-gold focus:ring-1 focus:ring-gold transition-colors resize-none" />
                </div>
              </div>
            </div>

            {/* Payment mode */}
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">Payment Option</h2>
              <div className="space-y-3">
                <button
                  onClick={() => setPaymentMode("full")}
                  className={`w-full rounded-lg p-4 text-left transition-all ${paymentMode === "full" ? "bg-gold/15 border border-gold" : "bg-surface border border-border-gold hover:border-gold/50"}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">Pay Full Amount</p>
                      <p className="text-sm text-text-muted mt-0.5">No balance due — booking confirmed instantly</p>
                    </div>
                    <p className="text-lg font-bold text-white">{formatINR(total)}</p>
                  </div>
                </button>
                <button
                  onClick={() => setPaymentMode("advance")}
                  className={`w-full rounded-lg p-4 text-left transition-all ${paymentMode === "advance" ? "bg-gold/15 border border-gold" : "bg-surface border border-border-gold hover:border-gold/50"}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">Pay 25% Advance</p>
                      <p className="text-sm text-text-muted mt-0.5">Balance {formatINR(total - advanceAmount)} due before travel</p>
                    </div>
                    <p className="text-lg font-bold text-white">{formatINR(advanceAmount)}</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right: Order summary (1/3, sticky) */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">Order Summary</h2>

              {/* Product */}
              <div className="flex gap-3 mb-4">
                <div className="h-16 w-16 shrink-0 rounded-lg bg-gradient-to-br from-cosmic-800 to-gold-800/20" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-sm line-clamp-2">{p.name}</p>
                  <p className="text-xs text-text-dim capitalize mt-1">{p.type}</p>
                </div>
              </div>

              <div className="gold-divider my-4" />

              {/* Price breakdown */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-muted">{formatINR(unitPrice)} × {quantity} {isPerPerson ? (quantity === 1 ? "person" : "persons") : ""}</span>
                  <span className="text-white">{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">GST (5% included)</span>
                  <span className="text-white">{formatINR(gstAmount)}</span>
                </div>
                {promoCode && (
                  <div className="flex justify-between text-green-400">
                    <span>Promo discount</span>
                    <span>-₹0</span>
                  </div>
                )}
              </div>

              <div className="gold-divider my-4" />

              <div className="flex justify-between text-lg font-bold">
                <span className="text-white">Total</span>
                <span className="text-white">{formatINR(total)}</span>
              </div>

              {paymentMode === "advance" && (
                <div className="mt-2 flex justify-between text-sm">
                  <span className="text-gold">Paying now (25%)</span>
                  <span className="text-gold font-medium">{formatINR(advanceAmount)}</span>
                </div>
              )}

              {/* Promo code */}
              <div className="mt-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="Promo code"
                    className="flex-1 h-10 rounded-lg bg-surface border border-border-gold px-3 text-sm text-white placeholder:text-text-dim focus:border-gold transition-colors"
                  />
                  <button className="h-10 rounded-lg border border-border-gold px-3 text-xs font-medium text-gold hover:bg-surface transition-colors">
                    Apply
                  </button>
                </div>
              </div>

              <div className="gold-divider my-4" />

              {/* Pay button */}
              <button
                onClick={handlePayNow}
                disabled={loading}
                className="w-full h-13 rounded-xl bg-gold-gradient text-sm font-bold text-cosmic-950 transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : `Pay ${formatINR(payableNow)} Securely`}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-text-dim">
                <Shield className="h-3.5 w-3.5 text-gold" />
                <span>Secured by PayU — 256-bit encryption</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
