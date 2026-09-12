"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { formatINR, cn } from "@/lib/utils";
import {
  ArrowLeft, Plus, Minus, X, Save, Send, Trash2,
  Pencil, ChevronUp, ChevronDown, Clock,
  Calendar, Eye, Package,
  User, Phone, Mail, MessageSquare,
  Receipt, Calculator,
  Loader2, Check, Copy, ExternalLink,
  Layers, FileText, Printer, Shield,
  Hotel, Car, Ship, UtensilsCrossed, Waves, Camera,
  CheckCircle, XCircle,
} from "lucide-react";
import type {
  ActivityType, TierKey, Activity, DayPlan, TierData, Template,
} from "./templates";
import {
  TEMPLATES, DEFAULT_INCLUSIONS, DEFAULT_EXCLUSIONS, DEFAULT_CANCELLATION,
} from "./templates";

// ─── Activity type visual config ────────────────────────────────
const ACT_CONFIG: Record<ActivityType, { label: string; color: string; bg: string; border: string; Icon: typeof Hotel }> = {
  hotel:       { label: "Hotel",       color: "text-amber-400",  bg: "bg-amber-500/20",  border: "border-amber-500/30",  Icon: Hotel },
  transfer:    { label: "Transfer",    color: "text-blue-400",   bg: "bg-blue-500/20",   border: "border-blue-500/30",   Icon: Car },
  cruise:      { label: "Cruise",      color: "text-teal-400",   bg: "bg-teal-500/20",   border: "border-teal-500/30",   Icon: Ship },
  meal:        { label: "Meal",        color: "text-green-400",  bg: "bg-green-500/20",  border: "border-green-500/30",  Icon: UtensilsCrossed },
  activity:    { label: "Activity",    color: "text-violet-400", bg: "bg-violet-500/20", border: "border-violet-500/30", Icon: Waves },
  sightseeing: { label: "Sightseeing", color: "text-orange-400", bg: "bg-orange-500/20", border: "border-orange-500/30", Icon: Camera },
};

const ALL_ACT_TYPES: ActivityType[] = ["hotel", "transfer", "cruise", "meal", "activity", "sightseeing"];

type Tab = "builder" | "package" | "preview" | "send";

function genId() {
  return `act-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ─── Component ──────────────────────────────────────────────────
export default function ItineraryBuilder() {
  const router = useRouter();

  // ── Tab ──────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<Tab>("builder");

  // ── Meta ─────────────────────────────────────────────────────
  const [title, setTitle] = useState("Goa Trip Package");
  const [travelFrom, setTravelFrom] = useState("");
  const [travelTo, setTravelTo] = useState("");
  const [paxCount, setPaxCount] = useState(2);
  const [createdBy, setCreatedBy] = useState("");

  // ── Days ─────────────────────────────────────────────────────
  const [days, setDays] = useState<DayPlan[]>([
    { day: 1, title: "Arrival", activities: [] },
    { day: 2, title: "Exploration", activities: [] },
    { day: 3, title: "Leisure", activities: [] },
    { day: 4, title: "Departure", activities: [] },
  ]);
  const [selectedDay, setSelectedDay] = useState(0);

  // ── Tiers ────────────────────────────────────────────────────
  const [tiers, setTiers] = useState<Record<TierKey, TierData>>({
    standard: { label: "Standard", perPerson: 15000, description: "Budget-friendly with 3-star stay" },
    premium:  { label: "Premium",  perPerson: 25000, description: "4-star resort, all transfers included" },
    luxury:   { label: "Luxury",   perPerson: 40000, description: "5-star all-inclusive luxury experience" },
  });
  const [selectedTier, setSelectedTier] = useState<TierKey>("premium");

  // ── Inclusions / Exclusions ──────────────────────────────────
  const [inclusions, setInclusions] = useState<string[]>([...DEFAULT_INCLUSIONS]);
  const [exclusions, setExclusions] = useState<string[]>([...DEFAULT_EXCLUSIONS]);
  const [cancellationPolicy, setCancellationPolicy] = useState(DEFAULT_CANCELLATION);
  const [newInclusion, setNewInclusion] = useState("");
  const [newExclusion, setNewExclusion] = useState("");

  // ── Send / Quote ─────────────────────────────────────────────
  const [customer, setCustomer] = useState({ name: "", phone: "", email: "" });
  const [validUntil, setValidUntil] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split("T")[0];
  });
  const [discount, setDiscount] = useState(0);
  const [advancePercent, setAdvancePercent] = useState(25);
  const [saving, setSaving] = useState(false);
  const [sentQuote, setSentQuote] = useState<{ code: string; token: string } | null>(null);

  // ── Activity modal ───────────────────────────────────────────
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalData, setModalData] = useState<Omit<Activity, "id">>({
    type: "activity", title: "", description: "", startTime: "09:00", endTime: "10:00", cost: 0, imageUrl: "", pills: [],
  });
  const [pillInput, setPillInput] = useState("");
  const [templateOpen, setTemplateOpen] = useState(false);

  // ═══ Computed ════════════════════════════════════════════════
  const dayCosts = useMemo(
    () => days.reduce((sum, d) => sum + d.activities.reduce((s, a) => s + a.cost, 0), 0),
    [days]
  );
  const tierPrice = tiers[selectedTier].perPerson;
  const subtotal = tierPrice * paxCount;
  const discountAmount = Math.round((subtotal * discount) / 100);
  const afterDiscount = subtotal - discountAmount;
  const gstAmount = Math.round(afterDiscount * 0.05);
  const total = afterDiscount + gstAmount;
  const advanceAmount = Math.round((total * advancePercent) / 100);

  const currentDay = days[selectedDay] ?? days[0];

  // ═══ Handlers ════════════════════════════════════════════════

  function loadTemplate(t: Template) {
    setDays(t.days.map(d => ({ ...d, activities: d.activities.map(a => ({ ...a, id: genId() })) })));
    setTiers({ ...t.tiers });
    setInclusions([...t.inclusions]);
    setExclusions([...t.exclusions]);
    setCancellationPolicy(t.cancellationPolicy);
    setTitle(t.name);
    setSelectedDay(0);
    setTemplateOpen(false);
    toast.success(`Loaded: ${t.name}`);
  }

  function addDay() {
    const next = days.length + 1;
    setDays(prev => [...prev, { day: next, title: `Day ${next}`, activities: [] }]);
  }
  function removeDay() {
    if (days.length <= 1) return;
    setDays(prev => {
      const n = prev.slice(0, -1);
      if (selectedDay >= n.length) setSelectedDay(n.length - 1);
      return n;
    });
  }
  function setDayTitle(idx: number, val: string) {
    setDays(prev => prev.map((d, i) => i === idx ? { ...d, title: val } : d));
  }

  function openAddModal() {
    setEditingId(null);
    setModalData({ type: "activity", title: "", description: "", startTime: "09:00", endTime: "10:00", cost: 0, imageUrl: "", pills: [] });
    setPillInput("");
    setModalOpen(true);
  }
  function openEditModal(act: Activity) {
    setEditingId(act.id);
    setModalData({ type: act.type, title: act.title, description: act.description, startTime: act.startTime, endTime: act.endTime, cost: act.cost, imageUrl: act.imageUrl, pills: [...act.pills] });
    setPillInput("");
    setModalOpen(true);
  }
  function saveActivity() {
    if (!modalData.title.trim()) { toast.error("Activity title is required"); return; }
    if (editingId) {
      setDays(prev => prev.map((d, i) => i === selectedDay
        ? { ...d, activities: d.activities.map(a => a.id === editingId ? { ...a, ...modalData } : a) }
        : d
      ));
      toast.success("Activity updated");
    } else {
      const newAct: Activity = { id: genId(), ...modalData };
      setDays(prev => prev.map((d, i) => i === selectedDay ? { ...d, activities: [...d.activities, newAct] } : d));
      toast.success("Activity added");
    }
    setModalOpen(false);
  }
  function deleteActivity(actId: string) {
    setDays(prev => prev.map((d, i) => i === selectedDay ? { ...d, activities: d.activities.filter(a => a.id !== actId) } : d));
  }
  function moveActivity(actId: string, dir: -1 | 1) {
    setDays(prev => prev.map((d, i) => {
      if (i !== selectedDay) return d;
      const idx = d.activities.findIndex(a => a.id === actId);
      if (idx < 0) return d;
      const target = idx + dir;
      if (target < 0 || target >= d.activities.length) return d;
      const items = [...d.activities];
      [items[idx]!, items[target]!] = [items[target]!, items[idx]!];
      return { ...d, activities: items };
    }));
  }

  function addPill() {
    const v = pillInput.trim();
    if (v && !modalData.pills.includes(v)) {
      setModalData(prev => ({ ...prev, pills: [...prev.pills, v] }));
      setPillInput("");
    }
  }
  function removePill(p: string) {
    setModalData(prev => ({ ...prev, pills: prev.pills.filter(x => x !== p) }));
  }

  function syncTiersFromDays() {
    const base = dayCosts || 1;
    setTiers({
      standard: { ...tiers.standard, perPerson: Math.round(base) },
      premium:  { ...tiers.premium,  perPerson: Math.round(base * 1.4) },
      luxury:   { ...tiers.luxury,   perPerson: Math.round(base * 2) },
    });
    toast.success("Tier pricing synced from activity costs");
  }

  function addInclusion() {
    const v = newInclusion.trim();
    if (v) { setInclusions(prev => [...prev, v]); setNewInclusion(""); }
  }
  function addExclusion() {
    const v = newExclusion.trim();
    if (v) { setExclusions(prev => [...prev, v]); setNewExclusion(""); }
  }

  async function saveQuote(status: "draft" | "sent") {
    if (!title.trim()) { toast.error("Quote title is required"); return; }
    if (status === "sent") {
      if (!customer.name.trim()) { toast.error("Customer name required"); return; }
      if (!customer.phone.trim()) { toast.error("Customer phone required"); return; }
    }

    const itineraryData = {
      version: 2,
      days,
      tiers,
      selectedTier,
      inclusions,
      exclusions,
      cancellationPolicy,
      travelDates: { from: travelFrom, to: travelTo },
      paxCount,
      createdBy,
    };

    setSaving(true);
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          customerName: customer.name.trim() || undefined,
          customerPhone: customer.phone.trim() || undefined,
          customerEmail: customer.email.trim() || undefined,
          validUntil,
          itemsJson: JSON.stringify(itineraryData),
          totalPrice: total,
          discountAmount,
          gstAmount,
          advancePercent,
          status,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to save");
      }
      const data = await res.json();
      if (status === "sent") {
        setSentQuote({ code: data.quoteCode, token: data.publicToken });
        toast.success("Quote published!", { description: `Code: ${data.quoteCode}` });
      } else {
        toast.success("Draft saved", { description: data.quoteCode });
        router.push("/admin/quotes");
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  function getQuoteUrl() {
    return sentQuote ? `${window.location.origin}/q/${sentQuote.token}` : "";
  }
  function shareWhatsApp() {
    const url = getQuoteUrl();
    const msg = `Hi ${customer.name},\n\nYour *${title}* quote is ready!\n\nTotal: *${formatINR(total)}* (${paxCount} pax)\nView & pay: ${url}\n\nValid until: ${validUntil}\n\n— GoaTripPackage.in`;
    window.open(`https://wa.me/${customer.phone.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`, "_blank");
  }
  function shareEmail() {
    const url = getQuoteUrl();
    const subject = `Your Quote: ${title} — GoaTripPackage`;
    const body = `Hi ${customer.name},\n\nYour quote for "${title}" is ready.\n\nTotal: ${formatINR(total)} (${paxCount} pax)\nView details & pay online: ${url}\n\nValid until: ${validUntil}\n\nBest regards,\nGoaTripPackage.in`;
    window.open(`mailto:${customer.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, "_blank");
  }
  function copyLink() {
    navigator.clipboard.writeText(getQuoteUrl());
    toast.success("Link copied!");
  }

  const TABS: { key: Tab; label: string; Icon: typeof Layers }[] = [
    { key: "builder", label: "Day Builder", Icon: Layers },
    { key: "package", label: "Package",     Icon: Package },
    { key: "preview", label: "Preview",     Icon: Eye },
    { key: "send",    label: "Send Quote",  Icon: Send },
  ];

  // ═══ Render ══════════════════════════════════════════════════
  return (
    <div className="space-y-4">
      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href="/admin/quotes" className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-gold text-text-muted hover:text-white hover:bg-surface transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-white">Itinerary Builder</h1>
            <p className="text-xs text-text-dim">Build day-wise itineraries, set tier pricing, and send branded quotes</p>
          </div>
        </div>
        <div className="relative">
          <button onClick={() => setTemplateOpen(!templateOpen)} className="flex items-center gap-2 rounded-lg border border-border-gold px-3 py-1.5 text-xs text-text-muted hover:text-gold hover:border-gold/50 transition-colors">
            <FileText className="h-3.5 w-3.5" /> Templates <ChevronDown className="h-3 w-3" />
          </button>
          {templateOpen && (
            <div className="absolute right-0 top-9 z-30 w-64 rounded-xl bg-cosmic-900 border border-border-gold shadow-2xl py-2">
              {TEMPLATES.map((t) => (
                <button key={t.name} onClick={() => loadTemplate(t)} className="w-full text-left px-4 py-2.5 text-xs hover:bg-surface transition-colors">
                  <span className="text-white font-medium">{t.name}</span>
                  <span className="block text-text-dim text-[10px] mt-0.5">{t.days.length} days · {t.days.reduce((s, d) => s + d.activities.length, 0)} activities</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Meta Bar ────────────────────────────────────────── */}
      <div className="glass-card rounded-xl p-3">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <div className="col-span-2 md:col-span-1">
            <label className="text-[10px] text-text-dim uppercase tracking-wider mb-1 block">Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Package name *" className="w-full h-8 rounded-lg bg-surface border border-border-gold px-3 text-xs text-white placeholder:text-text-dim focus:border-gold transition-colors" />
          </div>
          <div>
            <label className="text-[10px] text-text-dim uppercase tracking-wider mb-1 block">Travel From</label>
            <input type="date" value={travelFrom} onChange={e => setTravelFrom(e.target.value)} className="w-full h-8 rounded-lg bg-surface border border-border-gold px-2 text-xs text-white focus:border-gold transition-colors" />
          </div>
          <div>
            <label className="text-[10px] text-text-dim uppercase tracking-wider mb-1 block">Travel To</label>
            <input type="date" value={travelTo} onChange={e => setTravelTo(e.target.value)} className="w-full h-8 rounded-lg bg-surface border border-border-gold px-2 text-xs text-white focus:border-gold transition-colors" />
          </div>
          <div>
            <label className="text-[10px] text-text-dim uppercase tracking-wider mb-1 block">Guests</label>
            <div className="flex items-center gap-1">
              <button onClick={() => setPaxCount(Math.max(1, paxCount - 1))} className="h-8 w-8 rounded-lg bg-surface border border-border-gold text-text-muted hover:text-white transition-colors flex items-center justify-center"><Minus className="h-3 w-3" /></button>
              <span className="h-8 flex-1 rounded-lg bg-surface border border-border-gold text-xs text-white flex items-center justify-center font-medium">{paxCount}</span>
              <button onClick={() => setPaxCount(paxCount + 1)} className="h-8 w-8 rounded-lg bg-surface border border-border-gold text-text-muted hover:text-white transition-colors flex items-center justify-center"><Plus className="h-3 w-3" /></button>
            </div>
          </div>
          <div>
            <label className="text-[10px] text-text-dim uppercase tracking-wider mb-1 block">Created By</label>
            <input value={createdBy} onChange={e => setCreatedBy(e.target.value)} placeholder="Your name" className="w-full h-8 rounded-lg bg-surface border border-border-gold px-3 text-xs text-white placeholder:text-text-dim focus:border-gold transition-colors" />
          </div>
        </div>
      </div>

      {/* ── Tab Navigation ──────────────────────────────────── */}
      <div className="flex items-center gap-1 border-b border-border-gold/20 pb-0">
        {TABS.map(({ key, label, Icon }) => (
          <button key={key} onClick={() => setActiveTab(key)} className={cn(
            "flex items-center gap-1.5 px-4 py-2 text-xs font-medium border-b-2 transition-colors -mb-px",
            activeTab === key ? "border-gold text-gold" : "border-transparent text-text-muted hover:text-white"
          )}>
            <Icon className="h-3.5 w-3.5" /> {label}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════
          TAB: Day Builder
         ═══════════════════════════════════════════════════════ */}
      {activeTab === "builder" && (
        <div className="space-y-3">
          {/* Day pills */}
          <div className="flex items-center gap-1 flex-wrap">
            {days.map((d, i) => (
              <button key={i} onClick={() => setSelectedDay(i)} className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                selectedDay === i
                  ? "bg-gold/20 text-gold border border-gold/40"
                  : "text-text-muted hover:text-white hover:bg-surface border border-transparent"
              )}>
                Day {d.day}
                {d.activities.length > 0 && (
                  <span className={cn(
                    "flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold",
                    selectedDay === i ? "bg-gold/30 text-gold" : "bg-surface text-text-dim"
                  )}>{d.activities.length}</span>
                )}
              </button>
            ))}
            <button onClick={addDay} className="h-7 w-7 rounded-lg border border-border-gold text-text-muted hover:text-gold hover:border-gold/50 transition-colors flex items-center justify-center" title="Add day"><Plus className="h-3.5 w-3.5" /></button>
            <button onClick={removeDay} disabled={days.length <= 1} className="h-7 w-7 rounded-lg border border-border-gold text-text-muted hover:text-rose-400 hover:border-rose-400/50 disabled:opacity-30 transition-colors flex items-center justify-center" title="Remove last day"><Minus className="h-3.5 w-3.5" /></button>
          </div>

          {/* Day title */}
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-gold" />
            <input value={currentDay?.title || ""} onChange={e => setDayTitle(selectedDay, e.target.value)} placeholder="Day title..." className="flex-1 h-8 rounded-lg bg-surface border border-border-gold px-3 text-xs text-white placeholder:text-text-dim focus:border-gold transition-colors" />
            <span className="text-[10px] text-text-dim">{currentDay?.activities.length || 0} activities</span>
          </div>

          {/* Activities */}
          <div className="space-y-2">
            {(currentDay?.activities.length || 0) === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center glass-card rounded-xl">
                <div className="h-12 w-12 rounded-full bg-gold/10 flex items-center justify-center mb-3">
                  <Plus className="h-5 w-5 text-gold/40" />
                </div>
                <p className="text-sm text-text-muted">No activities in Day {currentDay?.day || 1}</p>
                <p className="text-xs text-text-dim mt-1">Click &ldquo;Add Activity&rdquo; below to start building</p>
              </div>
            ) : (
              currentDay?.activities.map((act, idx) => {
                const cfg = ACT_CONFIG[act.type];
                const ActIcon = cfg.Icon;
                return (
                  <div key={act.id} className={cn("glass-card rounded-xl p-3 group", `border-l-2 ${cfg.border}`)}>
                    <div className="flex items-start gap-3">
                      <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg shrink-0 mt-0.5", cfg.bg)}>
                        <ActIcon className={cn("h-4 w-4", cfg.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={cn("text-[9px] font-bold uppercase tracking-wider", cfg.color)}>{cfg.label}</span>
                          {act.startTime && (
                            <span className="text-[10px] text-text-dim flex items-center gap-0.5">
                              <Clock className="h-2.5 w-2.5" />{act.startTime}{act.endTime ? `–${act.endTime}` : ""}
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-medium text-white truncate">{act.title}</p>
                        {act.description && <p className="text-xs text-text-dim mt-0.5 line-clamp-1">{act.description}</p>}
                        {act.pills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {act.pills.map(p => (
                              <span key={p} className="rounded-full bg-surface px-2 py-0.5 text-[9px] text-text-muted border border-border-gold/20">{p}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-sm font-bold text-gold">{act.cost > 0 ? formatINR(act.cost) : "Free"}</span>
                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => moveActivity(act.id, -1)} disabled={idx === 0} className="h-5 w-5 rounded text-text-dim hover:text-white disabled:opacity-20 flex items-center justify-center"><ChevronUp className="h-3 w-3" /></button>
                          <button onClick={() => moveActivity(act.id, 1)} disabled={idx === (currentDay?.activities.length || 0) - 1} className="h-5 w-5 rounded text-text-dim hover:text-white disabled:opacity-20 flex items-center justify-center"><ChevronDown className="h-3 w-3" /></button>
                          <button onClick={() => openEditModal(act)} className="h-5 w-5 rounded text-text-dim hover:text-gold flex items-center justify-center"><Pencil className="h-3 w-3" /></button>
                          <button onClick={() => deleteActivity(act.id)} className="h-5 w-5 rounded text-text-dim hover:text-rose-400 flex items-center justify-center"><Trash2 className="h-3 w-3" /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <button onClick={openAddModal} className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border-gold/40 py-3 text-xs text-text-muted hover:text-gold hover:border-gold/50 transition-colors">
            <Plus className="h-4 w-4" /> Add Activity
          </button>

          <div className="flex items-center justify-between text-xs px-1">
            <span className="text-text-dim">{days.reduce((s, d) => s + d.activities.length, 0)} activities across {days.length} days</span>
            <span className="text-gold font-bold">Day costs total: {formatINR(dayCosts)}</span>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          TAB: Package (Tiers + Inclusions/Exclusions)
         ═══════════════════════════════════════════════════════ */}
      {activeTab === "package" && (
        <div className="space-y-5">
          {/* Tier Pricing */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold text-gold uppercase tracking-wider">Tier Pricing</h2>
              <button onClick={syncTiersFromDays} className="text-[10px] text-text-muted hover:text-gold transition-colors flex items-center gap-1">
                <Calculator className="h-3 w-3" /> Sync from day costs
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(["standard", "premium", "luxury"] as TierKey[]).map((key) => (
                <div key={key} onClick={() => setSelectedTier(key)} className={cn(
                  "glass-card rounded-xl p-4 cursor-pointer transition-all",
                  selectedTier === key ? "border-gold/60 ring-1 ring-gold/20" : "hover:border-gold/30"
                )}>
                  <div className="flex items-center justify-between mb-3">
                    <input value={tiers[key].label} onChange={e => setTiers(prev => ({ ...prev, [key]: { ...prev[key], label: e.target.value } }))} className="text-sm font-bold text-white bg-transparent border-none focus:outline-none w-full" onClick={e => e.stopPropagation()} />
                    {selectedTier === key && <Check className="h-4 w-4 text-gold shrink-0" />}
                  </div>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-lg font-bold text-gold">₹</span>
                    <input type="number" value={tiers[key].perPerson} onChange={e => setTiers(prev => ({ ...prev, [key]: { ...prev[key], perPerson: Number(e.target.value) } }))} className="text-2xl font-bold text-gold bg-transparent border-none focus:outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" onClick={e => e.stopPropagation()} />
                  </div>
                  <p className="text-[10px] text-text-dim mb-2">per person · {formatINR(tiers[key].perPerson * paxCount)} for {paxCount} pax</p>
                  <input value={tiers[key].description} onChange={e => setTiers(prev => ({ ...prev, [key]: { ...prev[key], description: e.target.value } }))} className="w-full text-xs text-text-muted bg-transparent border-none focus:outline-none" placeholder="Description..." onClick={e => e.stopPropagation()} />
                </div>
              ))}
            </div>
          </div>

          {/* Inclusions */}
          <div>
            <h2 className="text-xs font-bold text-gold uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <CheckCircle className="h-3.5 w-3.5" /> Inclusions
            </h2>
            <div className="glass-card rounded-xl p-3 space-y-1.5">
              {inclusions.map((item, i) => (
                <div key={i} className="flex items-center gap-2 group">
                  <CheckCircle className="h-3.5 w-3.5 text-green-400 shrink-0" />
                  <span className="text-xs text-text-muted flex-1">{item}</span>
                  <button onClick={() => setInclusions(prev => prev.filter((_, j) => j !== i))} className="h-5 w-5 text-text-dim hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"><X className="h-3 w-3" /></button>
                </div>
              ))}
              <div className="flex items-center gap-2 pt-1">
                <input value={newInclusion} onChange={e => setNewInclusion(e.target.value)} onKeyDown={e => e.key === "Enter" && addInclusion()} placeholder="Add inclusion..." className="flex-1 h-7 rounded-lg bg-surface border border-border-gold/30 px-2 text-xs text-white placeholder:text-text-dim focus:border-gold transition-colors" />
                <button onClick={addInclusion} className="h-7 px-2 rounded-lg bg-green-500/20 text-green-400 text-xs hover:bg-green-500/30 transition-colors"><Plus className="h-3 w-3" /></button>
              </div>
            </div>
          </div>

          {/* Exclusions */}
          <div>
            <h2 className="text-xs font-bold text-gold uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <XCircle className="h-3.5 w-3.5" /> Exclusions
            </h2>
            <div className="glass-card rounded-xl p-3 space-y-1.5">
              {exclusions.map((item, i) => (
                <div key={i} className="flex items-center gap-2 group">
                  <XCircle className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                  <span className="text-xs text-text-muted flex-1">{item}</span>
                  <button onClick={() => setExclusions(prev => prev.filter((_, j) => j !== i))} className="h-5 w-5 text-text-dim hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"><X className="h-3 w-3" /></button>
                </div>
              ))}
              <div className="flex items-center gap-2 pt-1">
                <input value={newExclusion} onChange={e => setNewExclusion(e.target.value)} onKeyDown={e => e.key === "Enter" && addExclusion()} placeholder="Add exclusion..." className="flex-1 h-7 rounded-lg bg-surface border border-border-gold/30 px-2 text-xs text-white placeholder:text-text-dim focus:border-gold transition-colors" />
                <button onClick={addExclusion} className="h-7 px-2 rounded-lg bg-rose-500/20 text-rose-400 text-xs hover:bg-rose-500/30 transition-colors"><Plus className="h-3 w-3" /></button>
              </div>
            </div>
          </div>

          {/* Cancellation Policy */}
          <div>
            <h2 className="text-xs font-bold text-gold uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5" /> Cancellation Policy
            </h2>
            <textarea value={cancellationPolicy} onChange={e => setCancellationPolicy(e.target.value)} rows={3} className="w-full rounded-xl bg-surface border border-border-gold px-3 py-2 text-xs text-white placeholder:text-text-dim focus:border-gold transition-colors resize-none" placeholder="Enter cancellation policy..." />
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          TAB: Preview
         ═══════════════════════════════════════════════════════ */}
      {activeTab === "preview" && (
        <div>
          <div className="flex justify-end mb-3">
            <button onClick={() => window.print()} className="flex items-center gap-1.5 rounded-lg border border-border-gold px-3 py-1.5 text-xs text-text-muted hover:text-gold hover:border-gold/50 transition-colors">
              <Printer className="h-3.5 w-3.5" /> Print / Save PDF
            </button>
          </div>

          <div id="itinerary-preview" className="bg-white rounded-xl shadow-lg max-w-3xl mx-auto overflow-hidden">
            {/* Header */}
            <div className="px-8 py-6 text-white" style={{ background: "linear-gradient(135deg, #0a1628, #1a2d4a)" }}>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold" style={{ color: "#c7a44a" }}>GoaTripPackage</h1>
                  <p className="text-xs text-gray-300 mt-0.5">Premium Goa Travel Experiences</p>
                </div>
                <div className="text-right text-xs text-gray-300">
                  <p>goatrippackage.in</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <h2 className="text-lg font-bold">{title || "Untitled Package"}</h2>
                <div className="flex items-center gap-4 mt-1 text-xs text-gray-300">
                  {travelFrom && travelTo && <span>{travelFrom} → {travelTo}</span>}
                  <span>{paxCount} Guests</span>
                  {createdBy && <span>by {createdBy}</span>}
                </div>
              </div>
            </div>

            {/* Day-wise itinerary */}
            <div className="px-8 py-6">
              {days.map((d) => (
                <div key={d.day} className="mb-6 last:mb-0">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full text-white text-xs font-bold" style={{ backgroundColor: "#c7a44a" }}>{d.day}</div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">Day {d.day}</h3>
                      <p className="text-xs text-gray-500">{d.title}</p>
                    </div>
                  </div>
                  {d.activities.length === 0 ? (
                    <p className="text-xs text-gray-400 pl-11 italic">No activities planned</p>
                  ) : (
                    <div className="space-y-2 pl-11">
                      {d.activities.map((act) => (
                        <div key={act.id} className="flex items-start gap-3 rounded-lg border border-gray-100 p-2.5">
                          <div className="text-xs text-gray-400 whitespace-nowrap w-20">{act.startTime || "--:--"}{act.endTime ? ` – ${act.endTime}` : ""}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-900">{act.title}</p>
                            {act.description && <p className="text-[11px] text-gray-500 mt-0.5">{act.description}</p>}
                            {act.pills.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {act.pills.map(p => <span key={p} className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[9px] text-gray-600">{p}</span>)}
                              </div>
                            )}
                          </div>
                          {act.cost > 0 && <span className="text-xs font-medium text-gray-700 whitespace-nowrap">{formatINR(act.cost)}</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pricing tiers */}
            <div className="px-8 py-6 bg-gray-50 border-t border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Pricing Options</h3>
              <div className="grid grid-cols-3 gap-3">
                {(["standard", "premium", "luxury"] as TierKey[]).map((key) => (
                  <div key={key} className={cn(
                    "rounded-lg p-3 text-center",
                    selectedTier === key ? "border-2" : "bg-white border border-gray-200"
                  )} style={selectedTier === key ? { backgroundColor: "rgba(199,164,74,0.08)", borderColor: "#c7a44a" } : undefined}>
                    <p className="text-xs font-bold text-gray-900">{tiers[key].label}</p>
                    <p className="text-lg font-bold mt-1" style={{ color: selectedTier === key ? "#c7a44a" : "#374151" }}>{formatINR(tiers[key].perPerson)}</p>
                    <p className="text-[10px] text-gray-500">per person</p>
                    <p className="text-[10px] text-gray-400 mt-1">{tiers[key].description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Inclusions / Exclusions */}
            <div className="px-8 py-6 grid grid-cols-2 gap-6 border-t border-gray-100">
              <div>
                <h3 className="text-xs font-bold text-green-700 uppercase mb-2">Inclusions</h3>
                <ul className="space-y-1">
                  {inclusions.map((item, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-gray-700">
                      <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 shrink-0" />{item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-bold text-rose-700 uppercase mb-2">Exclusions</h3>
                <ul className="space-y-1">
                  {exclusions.map((item, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-gray-700">
                      <XCircle className="h-3 w-3 text-rose-500 mt-0.5 shrink-0" />{item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Cancellation policy */}
            {cancellationPolicy && (
              <div className="px-8 py-4 bg-amber-50 border-t border-amber-100">
                <h3 className="text-xs font-bold text-amber-800 uppercase mb-1">Cancellation Policy</h3>
                <p className="text-xs text-amber-700">{cancellationPolicy}</p>
              </div>
            )}

            {/* Footer */}
            <div className="px-8 py-5 text-center" style={{ background: "linear-gradient(135deg, #0a1628, #1a2d4a)" }}>
              <p className="text-xs text-gray-300">Ready to book your Goa adventure?</p>
              <p className="text-sm font-bold mt-1" style={{ color: "#c7a44a" }}>goatrippackage.in</p>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          TAB: Send Quote
         ═══════════════════════════════════════════════════════ */}
      {activeTab === "send" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left — Customer + Settings */}
          <div className="space-y-4">
            <div className="glass-card rounded-xl p-4">
              <h2 className="text-xs font-bold text-gold uppercase tracking-wider mb-3 flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> Customer</h2>
              <div className="space-y-2">
                <div className="relative">
                  <User className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-dim" />
                  <input value={customer.name} onChange={e => setCustomer(c => ({ ...c, name: e.target.value }))} placeholder="Customer name *" className="w-full h-8 rounded-lg bg-surface border border-border-gold pl-8 pr-3 text-xs text-white placeholder:text-text-dim focus:border-gold transition-colors" />
                </div>
                <div className="relative">
                  <Phone className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-dim" />
                  <input value={customer.phone} onChange={e => setCustomer(c => ({ ...c, phone: e.target.value }))} placeholder="Phone (with country code) *" className="w-full h-8 rounded-lg bg-surface border border-border-gold pl-8 pr-3 text-xs text-white placeholder:text-text-dim focus:border-gold transition-colors" />
                </div>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-dim" />
                  <input value={customer.email} onChange={e => setCustomer(c => ({ ...c, email: e.target.value }))} placeholder="Email (optional)" className="w-full h-8 rounded-lg bg-surface border border-border-gold pl-8 pr-3 text-xs text-white placeholder:text-text-dim focus:border-gold transition-colors" />
                </div>
              </div>
            </div>

            <div className="glass-card rounded-xl p-4">
              <h2 className="text-xs font-bold text-gold uppercase tracking-wider mb-3 flex items-center gap-1.5"><Calculator className="h-3.5 w-3.5" /> Quote Settings</h2>
              <div className="space-y-2">
                <div>
                  <label className="text-[10px] text-text-dim uppercase tracking-wider mb-1 block">Valid Until</label>
                  <input type="date" value={validUntil} onChange={e => setValidUntil(e.target.value)} className="w-full h-8 rounded-lg bg-surface border border-border-gold px-3 text-xs text-white focus:border-gold transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-text-dim uppercase tracking-wider mb-1 block">Discount %</label>
                    <input type="number" min={0} max={100} value={discount} onChange={e => setDiscount(Math.min(100, Math.max(0, Number(e.target.value))))} className="w-full h-8 rounded-lg bg-surface border border-border-gold px-3 text-xs text-white focus:border-gold transition-colors" />
                  </div>
                  <div>
                    <label className="text-[10px] text-text-dim uppercase tracking-wider mb-1 block">Advance %</label>
                    <input type="number" min={0} max={100} value={advancePercent} onChange={e => setAdvancePercent(Math.min(100, Math.max(0, Number(e.target.value))))} className="w-full h-8 rounded-lg bg-surface border border-border-gold px-3 text-xs text-white focus:border-gold transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-text-dim uppercase tracking-wider mb-1 block">Pricing Tier</label>
                  <div className="flex gap-1">
                    {(["standard", "premium", "luxury"] as TierKey[]).map(key => (
                      <button key={key} onClick={() => setSelectedTier(key)} className={cn(
                        "flex-1 h-8 rounded-lg text-xs font-medium transition-colors",
                        selectedTier === key ? "bg-gold/20 text-gold border border-gold/40" : "bg-surface border border-border-gold text-text-muted hover:text-white"
                      )}>{tiers[key].label}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Summary + Actions */}
          <div className="space-y-4">
            <div className="glass-card rounded-xl p-4">
              <h2 className="text-xs font-bold text-gold uppercase tracking-wider mb-3 flex items-center gap-1.5"><Receipt className="h-3.5 w-3.5" /> Price Summary</h2>
              <div className="rounded-lg bg-surface border border-border-gold/30 p-3 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">{tiers[selectedTier].label} × {paxCount} pax</span>
                  <span className="text-white font-medium">{formatINR(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-xs">
                    <span className="text-green-400">Discount ({discount}%)</span>
                    <span className="text-green-400 font-medium">-{formatINR(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">GST (5%)</span>
                  <span className="text-white font-medium">+{formatINR(gstAmount)}</span>
                </div>
                <div className="border-t border-border-gold/20 pt-2 flex justify-between">
                  <span className="text-sm text-white font-bold">Total</span>
                  <span className="text-lg text-gold font-bold">{formatINR(total)}</span>
                </div>
                <div className="flex justify-between text-xs pt-1">
                  <span className="text-text-dim">Advance ({advancePercent}%)</span>
                  <span className="text-amber-400 font-medium">{formatINR(advanceAmount)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-dim">Balance due</span>
                  <span className="text-text-muted font-medium">{formatINR(total - advanceAmount)}</span>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-xl p-4 space-y-2">
              {sentQuote ? (
                <>
                  <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-3 mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Check className="h-4 w-4 text-green-400" />
                      <span className="text-xs font-bold text-green-400">Quote Published!</span>
                    </div>
                    <p className="text-xs text-text-muted">Code: <span className="font-mono text-gold">{sentQuote.code}</span></p>
                  </div>
                  <button onClick={shareWhatsApp} className="flex w-full h-9 items-center justify-center gap-2 rounded-lg bg-green-600 text-xs font-bold text-white hover:bg-green-700 transition-colors">
                    <MessageSquare className="h-3.5 w-3.5" /> Send via WhatsApp
                  </button>
                  {customer.email && (
                    <button onClick={shareEmail} className="flex w-full h-9 items-center justify-center gap-2 rounded-lg bg-blue-600 text-xs font-bold text-white hover:bg-blue-700 transition-colors">
                      <Mail className="h-3.5 w-3.5" /> Send via Email
                    </button>
                  )}
                  <button onClick={copyLink} className="flex w-full h-9 items-center justify-center gap-2 rounded-lg border border-border-gold text-xs font-medium text-text-muted hover:text-white hover:bg-surface transition-colors">
                    <Copy className="h-3.5 w-3.5" /> Copy Quote Link
                  </button>
                  <Link href="/admin/quotes" className="flex w-full h-9 items-center justify-center gap-2 rounded-lg border border-border-gold text-xs font-medium text-text-muted hover:text-gold transition-colors">
                    <ExternalLink className="h-3.5 w-3.5" /> View All Quotes
                  </Link>
                </>
              ) : (
                <>
                  <button onClick={() => saveQuote("sent")} disabled={saving} className="flex w-full h-9 items-center justify-center gap-2 rounded-lg bg-gold-gradient text-xs font-bold text-cosmic-950 transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed">
                    {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />} Publish Quote
                  </button>
                  <button onClick={() => saveQuote("draft")} disabled={saving} className="flex w-full h-9 items-center justify-center gap-2 rounded-lg border border-border-gold text-xs font-medium text-text-muted hover:text-white hover:bg-surface transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Save Draft
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          MODAL: Add / Edit Activity
         ═══════════════════════════════════════════════════════ */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setModalOpen(false)}>
          <div className="w-full max-w-lg rounded-xl bg-cosmic-900 border border-border-gold shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3 border-b border-border-gold/20">
              <h3 className="text-sm font-bold text-white">{editingId ? "Edit Activity" : "Add Activity"}</h3>
              <button onClick={() => setModalOpen(false)} className="h-6 w-6 rounded-lg text-text-dim hover:text-white hover:bg-surface flex items-center justify-center transition-colors"><X className="h-4 w-4" /></button>
            </div>

            <div className="px-5 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
              {/* Type selector */}
              <div>
                <label className="text-[10px] text-text-dim uppercase tracking-wider mb-1.5 block">Type</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {ALL_ACT_TYPES.map(t => {
                    const cfg = ACT_CONFIG[t];
                    const TypeIcon = cfg.Icon;
                    return (
                      <button key={t} onClick={() => setModalData(prev => ({ ...prev, type: t }))} className={cn(
                        "flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors border",
                        modalData.type === t ? cn(cfg.bg, cfg.color, cfg.border) : "bg-surface text-text-muted hover:text-white border-transparent"
                      )}>
                        <TypeIcon className="h-3.5 w-3.5" /> {cfg.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-[10px] text-text-dim uppercase tracking-wider mb-1 block">Title *</label>
                <input value={modalData.title} onChange={e => setModalData(prev => ({ ...prev, title: e.target.value }))} placeholder="e.g. Airport Pickup, Hotel Check-in..." className="w-full h-8 rounded-lg bg-surface border border-border-gold px-3 text-xs text-white placeholder:text-text-dim focus:border-gold transition-colors" />
              </div>

              <div>
                <label className="text-[10px] text-text-dim uppercase tracking-wider mb-1 block">Description</label>
                <textarea value={modalData.description} onChange={e => setModalData(prev => ({ ...prev, description: e.target.value }))} rows={2} placeholder="Brief description..." className="w-full rounded-lg bg-surface border border-border-gold px-3 py-2 text-xs text-white placeholder:text-text-dim focus:border-gold transition-colors resize-none" />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-text-dim uppercase tracking-wider mb-1 block">Start</label>
                  <input type="time" value={modalData.startTime} onChange={e => setModalData(prev => ({ ...prev, startTime: e.target.value }))} className="w-full h-8 rounded-lg bg-surface border border-border-gold px-2 text-xs text-white focus:border-gold transition-colors" />
                </div>
                <div>
                  <label className="text-[10px] text-text-dim uppercase tracking-wider mb-1 block">End</label>
                  <input type="time" value={modalData.endTime} onChange={e => setModalData(prev => ({ ...prev, endTime: e.target.value }))} className="w-full h-8 rounded-lg bg-surface border border-border-gold px-2 text-xs text-white focus:border-gold transition-colors" />
                </div>
                <div>
                  <label className="text-[10px] text-text-dim uppercase tracking-wider mb-1 block">Cost (₹)</label>
                  <input type="number" min={0} value={modalData.cost} onChange={e => setModalData(prev => ({ ...prev, cost: Number(e.target.value) }))} className="w-full h-8 rounded-lg bg-surface border border-border-gold px-3 text-xs text-white focus:border-gold transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-text-dim uppercase tracking-wider mb-1 block">Image URL</label>
                <input value={modalData.imageUrl} onChange={e => setModalData(prev => ({ ...prev, imageUrl: e.target.value }))} placeholder="https://..." className="w-full h-8 rounded-lg bg-surface border border-border-gold px-3 text-xs text-white placeholder:text-text-dim focus:border-gold transition-colors" />
              </div>

              <div>
                <label className="text-[10px] text-text-dim uppercase tracking-wider mb-1 block">Tags</label>
                <div className="flex flex-wrap gap-1 mb-1.5 min-h-[20px]">
                  {modalData.pills.map(p => (
                    <span key={p} className="flex items-center gap-1 rounded-full bg-gold/10 border border-gold/20 px-2 py-0.5 text-[10px] text-gold">
                      {p}
                      <button type="button" onClick={() => removePill(p)} className="hover:text-rose-400"><X className="h-2.5 w-2.5" /></button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-1.5">
                  <input value={pillInput} onChange={e => setPillInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addPill(); } }} placeholder="Add tag & press Enter" className="flex-1 h-7 rounded-lg bg-surface border border-border-gold/30 px-2 text-xs text-white placeholder:text-text-dim focus:border-gold transition-colors" />
                  <button type="button" onClick={addPill} className="h-7 px-2 rounded-lg bg-gold/10 text-gold text-xs hover:bg-gold/20 transition-colors">Add</button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-border-gold/20">
              <button onClick={() => setModalOpen(false)} className="h-8 px-4 rounded-lg border border-border-gold text-xs text-text-muted hover:text-white transition-colors">Cancel</button>
              <button onClick={saveActivity} className="h-8 px-4 rounded-lg bg-gold-gradient text-xs font-bold text-cosmic-950 transition-transform hover:scale-[1.02]">{editingId ? "Update" : "Add"} Activity</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
