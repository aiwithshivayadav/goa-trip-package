"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { formatINR, timeAgo } from "@/lib/utils";
import {
  ArrowLeft,
  Loader2,
  Save,
  Copy,
  ExternalLink,
  Send,
  CheckCircle2,
  Calendar,
  User,
  Phone,
  Mail,
  FileText,
  Percent,
  Receipt,
  Tag,
  Clock,
  Eye,
  MessageCircle,
  Ship,
  Sailboat,
  Waves,
  Hotel,
  PartyPopper,
  Package,
  Edit3,
  Check,
  X,
} from "lucide-react";

export const dynamic = "force-dynamic";

type QuoteStatus = "draft" | "sent" | "viewed" | "accepted" | "declined" | "expired" | "converted";

interface Quote {
  id: number;
  quoteCode: string;
  title: string;
  totalPrice: number;
  discountAmount: number;
  gstAmount: number;
  advancePercent: number;
  status: QuoteStatus;
  validUntil: string;
  createdAt: string;
  updatedAt: string;
  viewedCount: number;
  viewedFirstAt: string | null;
  viewedLastAt: string | null;
  publicToken: string | null;
  itemsJson: string;
  termsMarkdown: string | null;
  brand: string;
  customer: { name: string; phone: string; email: string | null } | null;
  lead: { name: string; phone: string } | null;
}

const statusOptions: { value: QuoteStatus; label: string; color: string; bg: string }[] = [
  { value: "draft", label: "Draft", color: "text-text-muted", bg: "bg-surface text-text-muted" },
  { value: "sent", label: "Sent", color: "text-blue-400", bg: "bg-blue-500/20 text-blue-400" },
  { value: "viewed", label: "Viewed", color: "text-amber-400", bg: "bg-amber-500/20 text-amber-400" },
  { value: "accepted", label: "Accepted", color: "text-green-400", bg: "bg-green-500/20 text-green-400" },
  { value: "declined", label: "Declined", color: "text-rose", bg: "bg-rose/20 text-rose" },
  { value: "expired", label: "Expired", color: "text-text-dim", bg: "bg-surface text-text-dim" },
  { value: "converted", label: "Converted", color: "text-purple-400", bg: "bg-purple-500/20 text-purple-400" },
];

const statusBadgeColors: Record<QuoteStatus, string> = {
  draft: "bg-surface text-text-muted",
  sent: "bg-blue-500/20 text-blue-400",
  viewed: "bg-amber-500/20 text-amber-400",
  accepted: "bg-green-500/20 text-green-400",
  declined: "bg-rose/20 text-rose",
  expired: "bg-surface text-text-dim",
  converted: "bg-purple-500/20 text-purple-400",
};

const typeConfig: Record<string, { icon: typeof Package; color: string; bg: string }> = {
  package:  { icon: Package,     color: "text-violet-400", bg: "bg-violet-500/20" },
  cruise:   { icon: Ship,        color: "text-blue-400",   bg: "bg-blue-500/20" },
  yacht:    { icon: Sailboat,    color: "text-cyan-400",   bg: "bg-cyan-500/20" },
  activity: { icon: Waves,       color: "text-emerald-400",bg: "bg-emerald-500/20" },
  hotel:    { icon: Hotel,       color: "text-amber-400",  bg: "bg-amber-500/20" },
  party:    { icon: PartyPopper, color: "text-pink-400",   bg: "bg-pink-500/20" },
};

export default function QuoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Editable fields
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");
  const [status, setStatus] = useState<QuoteStatus>("draft");
  const [validUntil, setValidUntil] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [advancePercent, setAdvancePercent] = useState(25);
  const [termsMarkdown, setTermsMarkdown] = useState("");
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  const fetchQuote = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/quotes/${id}`);
      if (!res.ok) throw new Error("Not found");
      const data = await res.json();
      const q: Quote = data.quote;
      setQuote(q);
      setTitleDraft(q.title);
      setStatus(q.status);
      setValidUntil(q.validUntil ? (new Date(q.validUntil).toISOString().split("T")[0] ?? "") : "");
      setDiscountAmount(Number(q.discountAmount));
      setAdvancePercent(q.advancePercent);
      setTermsMarkdown(q.termsMarkdown || "");
    } catch {
      toast.error("Failed to load quote");
      router.push("/admin/quotes");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => { fetchQuote(); }, [fetchQuote]);

  async function saveChanges(overrides?: Record<string, unknown>) {
    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        title: titleDraft.trim(),
        status,
        validUntil,
        discountAmount,
        advancePercent,
        termsMarkdown: termsMarkdown.trim() || null,
        ...overrides,
      };
      const res = await fetch(`/api/quotes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to save");
      }
      toast.success("Quote updated");
      await fetchQuote();
      setEditingTitle(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function markAsSent() {
    setStatus("sent");
    await saveChanges({ status: "sent" });
  }

  function copyPublicLink() {
    if (!quote?.publicToken) return;
    const url = `${window.location.origin}/quote/${quote.publicToken}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  }

  function shareWhatsApp() {
    if (!quote?.publicToken) return;
    const url = `${window.location.origin}/quote/${quote.publicToken}`;
    const customerName = quote.customer?.name || quote.lead?.name || "there";
    const message = `Hi ${customerName}! Here's your quote for "${quote.title}" from GoaTripPackage:\n\n${url}\n\nValid until ${new Date(quote.validUntil).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}. Let us know if you have any questions!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  }

  // Parse itinerary
  let itinerary: { day: number; items: { id: string; name: string; price: number; type: string }[] }[] = [];
  if (quote?.itemsJson) {
    try {
      itinerary = JSON.parse(quote.itemsJson);
    } catch {
      itinerary = [];
    }
  }

  const totalItems = itinerary.reduce((s, d) => s + d.items.length, 0);
  const totalPrice = Number(quote?.totalPrice || 0);
  const gstAmount = Number(quote?.gstAmount || 0);
  const advanceAmount = Math.round((totalPrice * advancePercent) / 100);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-6 w-6 text-gold animate-spin" />
        <span className="ml-2 text-sm text-text-muted">Loading quote...</span>
      </div>
    );
  }

  if (!quote) return null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/quotes"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-gold text-text-muted hover:text-white hover:bg-surface transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            {editingTitle ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={titleDraft}
                  onChange={(e) => setTitleDraft(e.target.value)}
                  className="h-8 rounded-lg bg-surface border border-gold px-3 text-sm font-bold text-white focus:outline-none"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveChanges();
                    if (e.key === "Escape") { setTitleDraft(quote.title); setEditingTitle(false); }
                  }}
                />
                <button onClick={() => saveChanges()} className="flex h-7 w-7 items-center justify-center rounded-lg bg-gold/20 text-gold hover:bg-gold/30 transition-colors">
                  <Check className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => { setTitleDraft(quote.title); setEditingTitle(false); }} className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose/20 text-rose hover:bg-rose/30 transition-colors">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white">{quote.title}</h1>
                <button onClick={() => setEditingTitle(true)} className="flex h-6 w-6 items-center justify-center rounded text-text-dim hover:text-gold transition-colors">
                  <Edit3 className="h-3 w-3" />
                </button>
              </div>
            )}
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono text-xs text-gold">{quote.quoteCode}</span>
              <span className="text-text-dim text-[10px]">created {timeAgo(quote.createdAt)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => saveChanges()}
            disabled={saving}
            className="flex h-9 items-center gap-1.5 rounded-lg bg-gold-gradient px-4 text-xs font-bold text-cosmic-950 transition-transform hover:scale-[1.02] disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            Save Changes
          </button>
        </div>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left column: status + customer + pricing */}
        <div className="lg:col-span-1 space-y-4">
          {/* Status & Meta */}
          <div className="glass-card rounded-xl p-4 space-y-4">
            <h2 className="text-xs font-bold text-gold uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5" />
              Status & Details
            </h2>

            {/* Status dropdown */}
            <div>
              <label className="text-[10px] text-text-dim uppercase tracking-wider mb-1 block">Status</label>
              <div className="relative">
                <button
                  onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                  className="flex w-full h-8 items-center justify-between rounded-lg bg-surface border border-border-gold px-3 text-xs transition-colors hover:border-gold"
                >
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${statusBadgeColors[status]}`}>
                    {status}
                  </span>
                  <svg className={`h-3.5 w-3.5 text-text-dim transition-transform ${statusDropdownOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {statusDropdownOpen && (
                  <div className="absolute top-9 left-0 right-0 z-20 rounded-lg bg-cosmic-900 border border-border-gold shadow-xl py-1">
                    {statusOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => { setStatus(opt.value); setStatusDropdownOpen(false); }}
                        className={`w-full text-left px-3 py-1.5 text-xs hover:bg-surface transition-colors flex items-center gap-2 ${status === opt.value ? "text-gold" : "text-text-muted"}`}
                      >
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${opt.bg}`}>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Valid until */}
            <div>
              <label className="text-[10px] text-text-dim uppercase tracking-wider mb-1 block">Valid Until</label>
              <div className="relative">
                <Calendar className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-dim" />
                <input
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="w-full h-8 rounded-lg bg-surface border border-border-gold pl-8 pr-3 text-xs text-white focus:border-gold transition-colors"
                />
              </div>
            </div>

            {/* View stats */}
            {quote.viewedCount > 0 && (
              <div className="rounded-lg bg-surface border border-border-gold/30 p-3">
                <div className="flex items-center gap-1.5 text-xs text-text-muted mb-2">
                  <Eye className="h-3.5 w-3.5 text-violet-400" />
                  <span>Viewed {quote.viewedCount} time{quote.viewedCount !== 1 ? "s" : ""}</span>
                </div>
                {quote.viewedFirstAt && (
                  <p className="text-[10px] text-text-dim">First: {new Date(quote.viewedFirstAt).toLocaleString("en-IN")}</p>
                )}
                {quote.viewedLastAt && (
                  <p className="text-[10px] text-text-dim">Last: {new Date(quote.viewedLastAt).toLocaleString("en-IN")}</p>
                )}
              </div>
            )}
          </div>

          {/* Customer Info */}
          <div className="glass-card rounded-xl p-4 space-y-3">
            <h2 className="text-xs font-bold text-gold uppercase tracking-wider flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              Customer
            </h2>
            {quote.customer || quote.lead ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-text-dim" />
                  <span className="text-sm text-white font-medium">{quote.customer?.name || quote.lead?.name || "---"}</span>
                </div>
                {(quote.customer?.phone || quote.lead?.phone) && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-text-dim" />
                    <a href={`tel:${quote.customer?.phone || quote.lead?.phone}`} className="text-sm text-blue-400 hover:underline">
                      {quote.customer?.phone || quote.lead?.phone}
                    </a>
                  </div>
                )}
                {quote.customer?.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-text-dim" />
                    <a href={`mailto:${quote.customer.email}`} className="text-sm text-blue-400 hover:underline">
                      {quote.customer.email}
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-text-dim">No customer info attached</p>
            )}
          </div>

          {/* Pricing */}
          <div className="glass-card rounded-xl p-4 space-y-4">
            <h2 className="text-xs font-bold text-gold uppercase tracking-wider flex items-center gap-1.5">
              <Receipt className="h-3.5 w-3.5" />
              Pricing
            </h2>

            {/* Editable discount */}
            <div>
              <label className="text-[10px] text-text-dim uppercase tracking-wider mb-1 block">Discount Amount</label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-text-dim">&#8377;</span>
                <input
                  type="number"
                  min={0}
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(Math.max(0, Number(e.target.value)))}
                  className="w-full h-8 rounded-lg bg-surface border border-border-gold pl-7 pr-3 text-xs text-white focus:border-gold transition-colors"
                />
              </div>
            </div>

            {/* Editable advance */}
            <div>
              <label className="text-[10px] text-text-dim uppercase tracking-wider mb-1 block">Advance (%)</label>
              <div className="relative">
                <Percent className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-dim" />
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={advancePercent}
                  onChange={(e) => setAdvancePercent(Math.min(100, Math.max(0, Number(e.target.value))))}
                  className="w-full h-8 rounded-lg bg-surface border border-border-gold pl-8 pr-3 text-xs text-white focus:border-gold transition-colors"
                />
              </div>
            </div>

            {/* Breakdown */}
            <div className="rounded-lg bg-surface border border-border-gold/30 p-3 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-text-muted">Subtotal</span>
                <span className="text-white font-medium">{formatINR(totalPrice - gstAmount + discountAmount)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-green-400">Discount</span>
                  <span className="text-green-400 font-medium">-{formatINR(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-xs">
                <span className="text-text-muted">GST</span>
                <span className="text-white font-medium">+{formatINR(gstAmount)}</span>
              </div>
              <div className="border-t border-border-gold/20 pt-2 flex justify-between text-sm">
                <span className="text-white font-bold">Total</span>
                <span className="text-gold font-bold">{formatINR(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-xs pt-1">
                <span className="text-text-dim">Advance ({advancePercent}%)</span>
                <span className="text-amber-400 font-medium">{formatINR(advanceAmount)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-text-dim">Balance due</span>
                <span className="text-text-muted font-medium">{formatINR(totalPrice - advanceAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: itinerary + notes + sharing */}
        <div className="lg:col-span-2 space-y-4">
          {/* Itinerary */}
          <div className="glass-card rounded-xl p-4">
            <h2 className="text-xs font-bold text-gold uppercase tracking-wider flex items-center gap-1.5 mb-3">
              <FileText className="h-3.5 w-3.5" />
              Itinerary
              <span className="text-[10px] font-normal text-text-dim ml-1">
                {totalItems} item{totalItems !== 1 ? "s" : ""} across {itinerary.length} day{itinerary.length !== 1 ? "s" : ""}
              </span>
            </h2>

            {itinerary.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-8 w-8 text-gold/20 mb-2" />
                <p className="text-sm text-text-dim">No itinerary items</p>
              </div>
            ) : (
              <div className="space-y-4">
                {itinerary.map((day) => (
                  <div key={day.day}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-gold/20 text-[10px] font-bold text-gold px-2">
                        Day {day.day}
                      </span>
                      <div className="flex-1 h-px bg-border-gold/20" />
                      <span className="text-[10px] text-text-dim">{day.items.length} item{day.items.length !== 1 ? "s" : ""}</span>
                    </div>
                    {day.items.length === 0 ? (
                      <p className="text-xs text-text-dim pl-8 py-2">No activities planned</p>
                    ) : (
                      <div className="space-y-1.5 pl-2">
                        {day.items.map((item, idx) => {
                          const tc = typeConfig[item.type] ?? typeConfig["package_tour"];
                          const Icon = tc?.icon ?? Package;
                          const tcBg = tc?.bg ?? "bg-emerald-500/20";
                          const tcColor = tc?.color ?? "text-emerald-400";
                          return (
                            <div key={item.id || idx} className="flex items-center gap-3 rounded-lg bg-surface/50 border border-border-gold/20 px-3 py-2.5">
                              <span className="text-[10px] font-bold text-text-dim w-4 text-center">{idx + 1}</span>
                              <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${tcBg}`}>
                                <Icon className={`h-3.5 w-3.5 ${tcColor}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-white truncate">{item.name}</p>
                                <span className={`text-[9px] font-bold capitalize ${tcColor}`}>{item.type}</span>
                              </div>
                              <span className="text-xs font-bold text-gold whitespace-nowrap">{formatINR(item.price)}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes / Terms */}
          <div className="glass-card rounded-xl p-4">
            <h2 className="text-xs font-bold text-gold uppercase tracking-wider flex items-center gap-1.5 mb-3">
              <FileText className="h-3.5 w-3.5" />
              Notes & Terms
            </h2>
            <textarea
              value={termsMarkdown}
              onChange={(e) => setTermsMarkdown(e.target.value)}
              placeholder="Add terms, conditions, or notes for this quote..."
              rows={5}
              className="w-full rounded-lg bg-surface border border-border-gold px-3 py-2.5 text-xs text-white placeholder:text-text-dim focus:border-gold transition-colors resize-y"
            />
          </div>

          {/* Share Quote */}
          <div className="glass-card rounded-xl p-4">
            <h2 className="text-xs font-bold text-gold uppercase tracking-wider flex items-center gap-1.5 mb-3">
              <Send className="h-3.5 w-3.5" />
              Share Quote
            </h2>

            {quote.publicToken ? (
              <div className="space-y-3">
                {/* Public link */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 rounded-lg bg-surface border border-border-gold/30 px-3 py-2 text-xs text-text-muted font-mono truncate">
                    {typeof window !== "undefined" ? `${window.location.origin}/quote/${quote.publicToken}` : `/quote/${quote.publicToken}`}
                  </div>
                  <button
                    onClick={copyPublicLink}
                    className="flex h-8 items-center gap-1.5 rounded-lg border border-border-gold px-3 text-xs text-text-muted hover:text-white hover:bg-surface transition-colors"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </button>
                  <a
                    href={`/quote/${quote.publicToken}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 items-center gap-1.5 rounded-lg border border-border-gold px-3 text-xs text-text-muted hover:text-white hover:bg-surface transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Preview
                  </a>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={shareWhatsApp}
                    className="flex h-9 items-center gap-1.5 rounded-lg bg-green-600 hover:bg-green-500 px-4 text-xs font-bold text-white transition-colors"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    Share on WhatsApp
                  </button>
                  {quote.status === "draft" && (
                    <button
                      onClick={markAsSent}
                      disabled={saving}
                      className="flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 px-4 text-xs font-bold text-white transition-colors disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                      Mark as Sent
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-lg bg-surface border border-border-gold/30 p-4 text-center">
                <Clock className="h-6 w-6 text-gold/20 mx-auto mb-2" />
                <p className="text-xs text-text-dim">No public token generated for this quote</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
