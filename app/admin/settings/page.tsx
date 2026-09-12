"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  CreditCard, Mail, MessageSquare, Receipt, Palette, Users, Shield,
  Info, Loader2, CheckCircle2, XCircle, RefreshCw,
} from "lucide-react";

interface EnvStatus {
  payu_key: boolean;
  payu_salt: boolean;
  payu_mode: string;
  smtp_host: string;
  smtp_port: string;
  smtp_user: string;
  smtp_pass_set: boolean;
  database_connected: boolean;
}

const defaultSettings: Record<string, string> = {
  business_name: "",
  business_tagline: "",
  support_phone: "",
  support_email: "",
  gstin: "",
  gst_rate_default: "5",
  gst_rate_hotel_low: "12",
  gst_rate_hotel_high: "18",
  whatsapp_provider: "Interakt",
  whatsapp_template_booking: "",
  whatsapp_template_quote: "",
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>(defaultSettings);
  const [envStatus, setEnvStatus] = useState<EnvStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [dirty, setDirty] = useState<Set<string>>(new Set());

  const loadSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/settings");
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setSettings((prev) => ({ ...prev, ...data.settings }));
      setEnvStatus(data.envStatus);
      setDirty(new Set());
    } catch {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadSettings(); }, [loadSettings]);

  const updateField = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setDirty((prev) => new Set(prev).add(key));
  };

  const saveSection = async (sectionId: string, keys: string[]) => {
    setSaving(sectionId);
    try {
      const payload: Record<string, string> = {};
      for (const k of keys) {
        if (settings[k] !== undefined) payload[k] = settings[k];
      }
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: payload }),
      });
      if (!res.ok) throw new Error("Save failed");
      toast.success("Settings saved");
      setDirty((prev) => {
        const next = new Set(prev);
        keys.forEach((k) => next.delete(k));
        return next;
      });
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(null);
    }
  };

  const sectionDirty = (keys: string[]) => keys.some((k) => dirty.has(k));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-gold" />
        <span className="ml-3 text-sm text-text-muted">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Settings</h2>
          <p className="text-sm text-text-muted mt-0.5">Configure payment gateways, notifications, and business details</p>
        </div>
        <button
          onClick={loadSettings}
          className="flex h-8 items-center gap-1.5 rounded-lg border border-border-gold px-3 text-xs text-text-muted hover:text-white hover:bg-surface transition-colors"
        >
          <RefreshCw className="h-3 w-3" /> Refresh
        </button>
      </div>

      {/* ── PayU (read-only from env) ── */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-start gap-4 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 shrink-0">
            <CreditCard className="h-5 w-5 text-gold" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-white">PayU Configuration</h3>
            <p className="text-xs text-text-muted mt-0.5">Payment gateway — configured via server environment variables</p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-gold/10 border border-gold/30 px-2.5 py-1">
            <div className={`h-1.5 w-1.5 rounded-full ${envStatus?.payu_mode === "live" ? "bg-green-400" : "bg-gold"} animate-pulse`} />
            <span className="text-[10px] font-bold text-gold uppercase tracking-wider">
              {envStatus?.payu_mode === "live" ? "Live" : "Test"} Mode
            </span>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3 ml-14">
          <EnvField label="Merchant Key" set={envStatus?.payu_key ?? false} />
          <EnvField label="Merchant Salt" set={envStatus?.payu_salt ?? false} />
          <EnvField label="Mode" value={envStatus?.payu_mode || "test"} set={true} />
        </div>
      </div>

      {/* ── SMTP (read-only from env) ── */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-start gap-4 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 shrink-0">
            <Mail className="h-5 w-5 text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-white">SMTP Email</h3>
            <p className="text-xs text-text-muted mt-0.5">Outbound email — configured via server environment variables</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 ml-14">
          <EnvField label="SMTP Host" value={envStatus?.smtp_host || "—"} set={!!envStatus?.smtp_host} />
          <EnvField label="Port" value={envStatus?.smtp_port || "—"} set={!!envStatus?.smtp_port} />
          <EnvField label="Username" value={envStatus?.smtp_user || "—"} set={!!envStatus?.smtp_user} />
          <EnvField label="Password" set={envStatus?.smtp_pass_set ?? false} />
        </div>
      </div>

      {/* ── WhatsApp Templates (DB-stored) ── */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-start gap-4 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 shrink-0">
            <MessageSquare className="h-5 w-5 text-green-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-white">WhatsApp Templates</h3>
            <p className="text-xs text-text-muted mt-0.5">Pre-approved WhatsApp Business API message templates</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 ml-14">
          <div>
            <label className="block text-[11px] font-medium text-text-muted mb-1.5">API Provider</label>
            <div className="relative">
              <select
                className="w-full h-9 rounded-lg bg-surface border border-border-gold px-3 text-sm text-white appearance-none focus:border-gold transition-colors"
                value={settings.whatsapp_provider || "Interakt"}
                onChange={(e) => updateField("whatsapp_provider", e.target.value)}
              >
                {["Interakt", "WATI", "Twilio", "Gupshup", "Meta Cloud API"].map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-dim">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>
          <SettingsInput label="Booking Confirmation Template" settingsKey="whatsapp_template_booking" placeholder="template_booking_confirm" value={settings.whatsapp_template_booking} onChange={updateField} />
          <SettingsInput label="Quote Share Template" settingsKey="whatsapp_template_quote" placeholder="template_quote_share" value={settings.whatsapp_template_quote} onChange={updateField} />
        </div>
        <div className="flex justify-end mt-5 ml-14">
          <SaveButton
            onClick={() => saveSection("whatsapp", ["whatsapp_provider", "whatsapp_template_booking", "whatsapp_template_quote"])}
            saving={saving === "whatsapp"}
            dirty={sectionDirty(["whatsapp_provider", "whatsapp_template_booking", "whatsapp_template_quote"])}
          />
        </div>
      </div>

      {/* ── GST Rates (DB-stored) ── */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-start gap-4 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 shrink-0">
            <Receipt className="h-5 w-5 text-violet-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-white">GST Configuration</h3>
            <p className="text-xs text-text-muted mt-0.5">Goods and Services Tax rates for invoicing</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 ml-14">
          <SettingsInput label="GSTIN" settingsKey="gstin" placeholder="22AAAAA0000A1Z5" value={settings.gstin} onChange={updateField} />
          <SettingsInput label="Default GST Rate (%)" settingsKey="gst_rate_default" placeholder="5" value={settings.gst_rate_default} onChange={updateField} type="number" />
          <SettingsInput label="Hotel GST (rooms < ₹7,500)" settingsKey="gst_rate_hotel_low" placeholder="12" value={settings.gst_rate_hotel_low} onChange={updateField} type="number" />
          <SettingsInput label="Hotel GST (rooms ≥ ₹7,500)" settingsKey="gst_rate_hotel_high" placeholder="18" value={settings.gst_rate_hotel_high} onChange={updateField} type="number" />
        </div>
        <div className="flex justify-end mt-5 ml-14">
          <SaveButton
            onClick={() => saveSection("gst", ["gstin", "gst_rate_default", "gst_rate_hotel_low", "gst_rate_hotel_high"])}
            saving={saving === "gst"}
            dirty={sectionDirty(["gstin", "gst_rate_default", "gst_rate_hotel_low", "gst_rate_hotel_high"])}
          />
        </div>
      </div>

      {/* ── Branding (DB-stored) ── */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-start gap-4 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 shrink-0">
            <Palette className="h-5 w-5 text-orange-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-white">Branding</h3>
            <p className="text-xs text-text-muted mt-0.5">Business identity used across quotes, invoices, and emails</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 ml-14">
          <SettingsInput label="Business Name" settingsKey="business_name" placeholder="Goa Trip Package" value={settings.business_name} onChange={updateField} />
          <SettingsInput label="Tagline" settingsKey="business_tagline" placeholder="Premium Goa Experiences" value={settings.business_tagline} onChange={updateField} />
          <SettingsInput label="Support Phone" settingsKey="support_phone" placeholder="+91 98908 30249" value={settings.support_phone} onChange={updateField} />
          <SettingsInput label="Support Email" settingsKey="support_email" placeholder="support@goatrippackage.com" value={settings.support_email} onChange={updateField} />
        </div>
        <div className="flex justify-end mt-5 ml-14">
          <SaveButton
            onClick={() => saveSection("branding", ["business_name", "business_tagline", "support_phone", "support_email"])}
            saving={saving === "branding"}
            dirty={sectionDirty(["business_name", "business_tagline", "support_phone", "support_email"])}
          />
        </div>
      </div>

      {/* ── User Management (read-only, shows DB users) ── */}
      <UserManagementSection />

      {/* Environment info */}
      <div className="flex items-start gap-3 rounded-lg bg-gold/5 border border-gold/20 p-4">
        <Info className="h-4 w-4 text-gold shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-medium text-gold">Environment Notice</p>
          <p className="text-xs text-text-muted mt-0.5">
            PayU keys and SMTP passwords are stored as environment variables on the server and cannot be changed from this panel.
            Branding, GST, and WhatsApp template settings are saved to the database.
          </p>
        </div>
      </div>
    </div>
  );
}

function EnvField({ label, set, value }: { label: string; set: boolean; value?: string }) {
  return (
    <div>
      <label className="block text-[11px] font-medium text-text-muted mb-1.5">{label}</label>
      <div className="flex h-9 items-center gap-2 rounded-lg bg-surface/50 border border-border-gold/30 px-3">
        {set ? (
          <CheckCircle2 className="h-3.5 w-3.5 text-green-400 shrink-0" />
        ) : (
          <XCircle className="h-3.5 w-3.5 text-rose shrink-0" />
        )}
        <span className="text-sm text-text-dim truncate">
          {value || (set ? "Configured" : "Not set")}
        </span>
      </div>
    </div>
  );
}

function SettingsInput({
  label, settingsKey, placeholder, value, onChange, type = "text",
}: {
  label: string; settingsKey: string; placeholder: string;
  value: string | undefined; onChange: (key: string, val: string) => void; type?: string;
}) {
  return (
    <div>
      <label className="block text-[11px] font-medium text-text-muted mb-1.5">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value || ""}
        onChange={(e) => onChange(settingsKey, e.target.value)}
        className="w-full h-9 rounded-lg bg-surface border border-border-gold px-3 text-sm text-white placeholder:text-text-dim focus:border-gold transition-colors"
      />
    </div>
  );
}

function SaveButton({ onClick, saving, dirty }: { onClick: () => void; saving: boolean; dirty: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={saving || !dirty}
      className="flex h-8 items-center gap-1.5 rounded-lg bg-gold-gradient px-4 text-[11px] font-bold text-cosmic-950 transition-all hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100"
    >
      {saving ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : (
        <Shield className="h-3 w-3" />
      )}
      {saving ? "Saving..." : "Save Changes"}
    </button>
  );
}

function UserManagementSection() {
  const [users, setUsers] = useState<Array<{
    id: number; name: string; email?: string; role: string; isActive: boolean;
  }>>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    fetch("/api/settings/users")
      .then((r) => r.ok ? r.json() : { users: [] })
      .then((d) => setUsers(d.users || []))
      .catch(() => setUsers([]))
      .finally(() => setLoadingUsers(false));
  }, []);

  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-start gap-4 mb-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 shrink-0">
          <Users className="h-5 w-5 text-cyan-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-white">User Management</h3>
          <p className="text-xs text-text-muted mt-0.5">Admin and staff accounts</p>
        </div>
      </div>
      <div className="ml-14">
        {loadingUsers ? (
          <div className="flex items-center gap-2 py-4 text-text-dim text-xs">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading users...
          </div>
        ) : users.length === 0 ? (
          <p className="text-xs text-text-dim py-4">No additional users configured.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-gold/20">
                  <th className="text-left text-[10px] font-medium text-text-dim uppercase tracking-wider py-2 pr-4">User</th>
                  <th className="text-left text-[10px] font-medium text-text-dim uppercase tracking-wider py-2 pr-4">Role</th>
                  <th className="text-center text-[10px] font-medium text-text-dim uppercase tracking-wider py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-border-gold/10">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-gold">{u.name[0]}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{u.name}</p>
                          <p className="text-[10px] text-text-dim">{u.email || "—"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        u.role === "admin" ? "bg-gold/20 text-gold" :
                        u.role === "sales" ? "bg-violet-500/20 text-violet-400" :
                        "bg-surface text-text-muted"
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        u.isActive ? "bg-green-500/20 text-green-400" : "bg-surface text-text-dim"
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${u.isActive ? "bg-green-400" : "bg-text-dim"}`} />
                        {u.isActive ? "active" : "inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
