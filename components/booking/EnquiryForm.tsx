"use client";

import { useState } from "react";
import { X, Send, MessageCircle, User, Phone, Mail, Calendar, Users, MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface EnquiryFormProps {
  productName?: string;
  productSlug?: string;
  productType?: string;
  productPrice?: number;
  /** Controls visibility */
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Enquiry Form Modal — replaces raw WhatsApp links everywhere
 * Captures lead in DB via /api/leads, then opens WhatsApp with pre-filled message
 */
export function EnquiryForm({
  productName,
  productSlug,
  productType,
  productPrice,
  isOpen,
  onClose,
}: EnquiryFormProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    travelDate: "",
    adults: 2,
    children: 0,
    message: "",
  });

  function update(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Please enter your name and phone number");
      return;
    }

    if (form.phone.replace(/\D/g, "").length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setLoading(true);

    try {
      // Save lead to DB
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email || undefined,
          productInterest: productName || undefined,
          productSlug: productSlug || undefined,
          travelDateFrom: form.travelDate || undefined,
          adults: form.adults,
          children: form.children,
          message: form.message || undefined,
          source: "enquiry-form",
        }),
      });

      // Build WhatsApp message
      const lines = [
        `Hi, I'm interested in: *${productName || "Goa Trip Package"}*`,
        "",
        `Name: ${form.name}`,
        `Phone: ${form.phone}`,
      ];
      if (form.email) lines.push(`Email: ${form.email}`);
      if (form.travelDate) lines.push(`Travel Date: ${form.travelDate}`);
      if (form.adults) lines.push(`Guests: ${form.adults} adults${form.children > 0 ? ` + ${form.children} children` : ""}`);
      if (productPrice) lines.push(`Budget: ~₹${productPrice.toLocaleString("en-IN")} ${productType === "package" ? "per person" : ""}`);
      if (form.message) lines.push(`\nMessage: ${form.message}`);

      const waMessage = lines.join("\n");
      const waUrl = `https://wa.me/919890830249?text=${encodeURIComponent(waMessage)}`;

      toast.success("Enquiry sent! Opening WhatsApp...");

      // Small delay so toast is visible, then open WhatsApp
      setTimeout(() => {
        window.open(waUrl, "_blank");
        onClose();
        // Reset form
        setForm({ name: "", phone: "", email: "", travelDate: "", adults: 2, children: 0, message: "" });
      }, 800);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 mb-0 sm:mb-0 rounded-t-2xl sm:rounded-2xl bg-cosmic-900 border border-border-gold/50 shadow-gold-lg overflow-hidden animate-[slide-up_0.3s_ease-out]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-gold/30">
          <div>
            <h2 className="text-base font-bold text-white">Send Enquiry</h2>
            {productName && (
              <p className="text-xs text-text-muted mt-0.5 line-clamp-1">{productName}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:text-white hover:bg-surface transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-3.5 max-h-[70vh] overflow-y-auto">
          {/* Name */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-text-muted mb-1.5">
              <User className="h-3 w-3" /> Full Name <span className="text-rose">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Your name"
              required
              className="w-full h-11 rounded-lg bg-surface border border-border-gold px-3.5 text-sm text-white placeholder:text-text-dim focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-text-muted mb-1.5">
              <Phone className="h-3 w-3" /> WhatsApp Number <span className="text-rose">*</span>
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="+91 98908 30249"
              required
              className="w-full h-11 rounded-lg bg-surface border border-border-gold px-3.5 text-sm text-white placeholder:text-text-dim focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
            />
          </div>

          {/* Email */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-text-muted mb-1.5">
              <Mail className="h-3 w-3" /> Email <span className="text-text-dim">(optional)</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="you@email.com"
              className="w-full h-11 rounded-lg bg-surface border border-border-gold px-3.5 text-sm text-white placeholder:text-text-dim focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
            />
          </div>

          {/* Travel date + pax row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-text-muted mb-1.5">
                <Calendar className="h-3 w-3" /> Travel Date
              </label>
              <input
                type="date"
                value={form.travelDate}
                onChange={(e) => update("travelDate", e.target.value)}
                className="w-full h-11 rounded-lg bg-surface border border-border-gold px-3.5 text-sm text-white focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-text-muted mb-1.5">
                <Users className="h-3 w-3" /> Guests
              </label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={form.adults}
                    onChange={(e) => update("adults", parseInt(e.target.value) || 1)}
                    className="w-full h-11 rounded-lg bg-surface border border-border-gold px-3 text-sm text-white text-center focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                  />
                  <p className="text-[9px] text-text-dim text-center mt-0.5">Adults</p>
                </div>
                <div className="flex-1">
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={form.children}
                    onChange={(e) => update("children", parseInt(e.target.value) || 0)}
                    className="w-full h-11 rounded-lg bg-surface border border-border-gold px-3 text-sm text-white text-center focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                  />
                  <p className="text-[9px] text-text-dim text-center mt-0.5">Kids</p>
                </div>
              </div>
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-text-muted mb-1.5">
              <MessageSquare className="h-3 w-3" /> Message <span className="text-text-dim">(optional)</span>
            </label>
            <textarea
              value={form.message}
              onChange={(e) => update("message", e.target.value)}
              placeholder="Any special requests, budget preference, or questions..."
              rows={2}
              className="w-full rounded-lg bg-surface border border-border-gold px-3.5 py-2.5 text-sm text-white placeholder:text-text-dim focus:border-gold focus:ring-1 focus:ring-gold transition-colors resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-gold-gradient text-sm font-bold text-cosmic-950 transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-cosmic-950/30 border-t-cosmic-950 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send Enquiry & Open WhatsApp
              </>
            )}
          </button>

          {/* WhatsApp-only fallback */}
          <a
            href={`https://wa.me/919890830249?text=${encodeURIComponent(`Hi, I'm interested in ${productName || "Goa Trip Package"}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full h-10 items-center justify-center gap-2 rounded-xl border border-border-gold text-xs text-text-muted hover:text-gold transition-colors"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            Skip form — WhatsApp directly
          </a>

          <p className="text-[10px] text-text-dim text-center">
            Your details are shared only with our team. No spam, ever.
          </p>
        </form>
      </div>
    </div>
  );
}
