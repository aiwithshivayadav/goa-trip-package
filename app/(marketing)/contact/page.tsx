"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, MessageCircle, Clock, Send } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", subject: "", message: "" });

  function update(field: string, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) { toast.error("Please fill required fields"); return; }
    setLoading(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, phone: form.phone, email: form.email, message: `[Contact Form] ${form.subject}: ${form.message}`, source: "contact-page" }),
      });
      toast.success("Message sent! We'll respond within 30 minutes.");
      setForm({ name: "", phone: "", email: "", subject: "", message: "" });
    } catch { toast.error("Failed to send. Try WhatsApp."); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen">
      <section className="relative bg-cosmic-scene py-20 text-center md:py-28">
        <div className="bg-stars absolute inset-0" />
        <div className="relative z-10 mx-auto max-w-3xl px-6">
          <p className="text-sm uppercase tracking-[0.15em] text-gold mb-3">Get in Touch</p>
          <h1 className="font-display text-4xl font-bold text-white md:text-5xl">Contact <span className="text-gold-gradient">Us</span></h1>
          <p className="mt-4 text-lg text-text-muted">We respond within 30 minutes on WhatsApp. Always.</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 md:px-8">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Contact info (2/5) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-sm font-bold text-white mb-4">Contact Information</h2>
              <div className="space-y-4">
                <a href="tel:+919890830249" className="flex items-start gap-3 text-sm text-text-muted hover:text-gold transition-colors">
                  <Phone className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                  <div><p className="font-medium text-white">+91 98908 30249</p><p className="text-xs text-text-dim mt-0.5">Available 8 AM — 11 PM IST</p></div>
                </a>
                <a href="https://wa.me/919890830249" className="flex items-start gap-3 text-sm text-text-muted hover:text-gold transition-colors">
                  <MessageCircle className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                  <div><p className="font-medium text-white">WhatsApp</p><p className="text-xs text-text-dim mt-0.5">Fastest response — avg. 15 min</p></div>
                </a>
                <a href="mailto:info@goatrippackage.com" className="flex items-start gap-3 text-sm text-text-muted hover:text-gold transition-colors">
                  <Mail className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                  <div><p className="font-medium text-white">info@goatrippackage.com</p><p className="text-xs text-text-dim mt-0.5">For bookings, invoices, partnerships</p></div>
                </a>
                <div className="flex items-start gap-3 text-sm text-text-muted">
                  <MapPin className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                  <div><p className="font-medium text-white">Office</p><p className="text-xs text-text-dim mt-0.5">Panaji, North Goa, India 403001</p></div>
                </div>
                <div className="flex items-start gap-3 text-sm text-text-muted">
                  <Clock className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                  <div><p className="font-medium text-white">Business Hours</p><p className="text-xs text-text-dim mt-0.5">Mon–Sun: 8:00 AM — 11:00 PM IST<br/>WhatsApp: 24/7</p></div>
                </div>
              </div>
            </div>

            {/* Quick WhatsApp CTA */}
            <a
              href="https://wa.me/919890830249?text=Hi%2C%20I%20have%20a%20question%20about%20Goa%20Trip%20Package"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] text-sm font-bold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <MessageCircle className="h-5 w-5" /> Chat on WhatsApp
            </a>
          </div>

          {/* Contact form (3/5) */}
          <div className="lg:col-span-3">
            <div className="glass-card rounded-xl p-6 md:p-8">
              <h2 className="text-lg font-bold text-white mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1.5">Name <span className="text-rose">*</span></label>
                    <input type="text" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Your name" required className="w-full h-11 rounded-lg bg-surface border border-border-gold px-3.5 text-sm text-white placeholder:text-text-dim focus:border-gold focus:ring-1 focus:ring-gold transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1.5">Phone <span className="text-rose">*</span></label>
                    <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+91 98908 30249" required className="w-full h-11 rounded-lg bg-surface border border-border-gold px-3.5 text-sm text-white placeholder:text-text-dim focus:border-gold focus:ring-1 focus:ring-gold transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1.5">Email</label>
                  <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@email.com" className="w-full h-11 rounded-lg bg-surface border border-border-gold px-3.5 text-sm text-white placeholder:text-text-dim focus:border-gold focus:ring-1 focus:ring-gold transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1.5">Subject</label>
                  <select value={form.subject} onChange={(e) => update("subject", e.target.value)} className="w-full h-11 rounded-lg bg-surface border border-border-gold px-3.5 text-sm text-white focus:border-gold transition-colors">
                    <option value="">Select a topic</option>
                    <option>Booking Enquiry</option>
                    <option>Custom Trip Planning</option>
                    <option>Payment Issue</option>
                    <option>Cancellation / Refund</option>
                    <option>Partnership / Agent</option>
                    <option>Feedback / Complaint</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1.5">Message <span className="text-rose">*</span></label>
                  <textarea value={form.message} onChange={(e) => update("message", e.target.value)} placeholder="Tell us how we can help..." rows={4} required className="w-full rounded-lg bg-surface border border-border-gold px-3.5 py-2.5 text-sm text-white placeholder:text-text-dim focus:border-gold focus:ring-1 focus:ring-gold transition-colors resize-none" />
                </div>
                <button type="submit" disabled={loading} className="w-full h-12 rounded-xl bg-gold-gradient text-sm font-bold text-cosmic-950 transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading ? "Sending..." : <><Send className="h-4 w-4" /> Send Message</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
