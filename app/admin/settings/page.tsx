import { CreditCard, Mail, MessageSquare, Receipt, Palette, Users, Shield, ExternalLink, Info } from "lucide-react";

interface SettingsSection {
  id: string;
  title: string;
  description: string;
  icon: typeof CreditCard;
  color: string;
  bgColor: string;
  fields: { label: string; type: "text" | "password" | "toggle" | "select"; placeholder?: string; value?: string; options?: string[] }[];
}

const sections: SettingsSection[] = [
  {
    id: "payu",
    title: "PayU Configuration",
    description: "Payment gateway credentials and mode. Test mode uses sandbox keys.",
    icon: CreditCard,
    color: "text-gold",
    bgColor: "bg-gold/10",
    fields: [
      { label: "Merchant Key", type: "password", placeholder: "PayU merchant key", value: "••••••••••••gT4x" },
      { label: "Merchant Salt", type: "password", placeholder: "PayU merchant salt", value: "••••••••••••kR8m" },
      { label: "Mode", type: "toggle", value: "test" },
    ],
  },
  {
    id: "smtp",
    title: "SMTP Email",
    description: "Outbound email configuration for booking confirmations, quote PDFs, and notifications.",
    icon: Mail,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    fields: [
      { label: "SMTP Host", type: "text", placeholder: "smtp.gmail.com", value: "smtp.gmail.com" },
      { label: "Port", type: "text", placeholder: "587", value: "587" },
      { label: "Username", type: "text", placeholder: "bookings@goatrippackage.com", value: "bookings@goatrippackage.com" },
      { label: "Password", type: "password", placeholder: "App password", value: "••••••••••" },
    ],
  },
  {
    id: "whatsapp",
    title: "WhatsApp Templates",
    description: "Pre-approved WhatsApp Business API message templates for automated notifications.",
    icon: MessageSquare,
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    fields: [
      { label: "API Provider", type: "select", options: ["Interakt", "WATI", "Twilio", "Gupshup"], value: "Interakt" },
      { label: "API Key", type: "password", placeholder: "WhatsApp API key", value: "••••••••••••wP2q" },
      { label: "Booking Confirmation Template", type: "text", placeholder: "template_booking_confirm", value: "gtp_booking_confirmed_v2" },
      { label: "Quote Share Template", type: "text", placeholder: "template_quote_share", value: "gtp_quote_share_v1" },
    ],
  },
  {
    id: "gst",
    title: "GST Rates",
    description: "Goods and Services Tax configuration. Applied automatically to invoices.",
    icon: Receipt,
    color: "text-violet-400",
    bgColor: "bg-violet-500/10",
    fields: [
      { label: "GSTIN", type: "text", placeholder: "22AAAAA0000A1Z5", value: "30AABCG1234M1ZP" },
      { label: "Default GST Rate (%)", type: "text", placeholder: "5", value: "5" },
      { label: "Hotel GST (rooms < ₹7,500)", type: "text", placeholder: "12", value: "12" },
      { label: "Hotel GST (rooms ≥ ₹7,500)", type: "text", placeholder: "18", value: "18" },
    ],
  },
  {
    id: "branding",
    title: "Branding",
    description: "Business identity used across quotes, invoices, emails, and the public website.",
    icon: Palette,
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    fields: [
      { label: "Business Name", type: "text", placeholder: "Goa Trip Package", value: "Goa Trip Package" },
      { label: "Tagline", type: "text", placeholder: "Your slogan", value: "Premium Goa Experiences Since 2019" },
      { label: "Support Phone", type: "text", placeholder: "+91 ...", value: "+91 98765 43210" },
      { label: "Support Email", type: "text", placeholder: "support@...", value: "support@goatrippackage.com" },
    ],
  },
  {
    id: "users",
    title: "User Management",
    description: "Admin and staff accounts with role-based access control.",
    icon: Users,
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    fields: [],
  },
];

const teamMembers = [
  { name: "Shiva", email: "shiva@goatrippackage.com", role: "Owner", status: "active" },
  { name: "Riya", email: "riya@goatrippackage.com", role: "Sales Manager", status: "active" },
  { name: "Amit", email: "amit@goatrippackage.com", role: "Ops Staff", status: "active" },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white">Settings</h2>
        <p className="text-sm text-text-muted mt-0.5">Configure payment gateways, notifications, and business details</p>
      </div>

      {/* Sections */}
      {sections.map((section) => {
        const Icon = section.icon;
        return (
          <div key={section.id} className="glass-card rounded-xl p-5">
            {/* Section header */}
            <div className="flex items-start gap-4 mb-5">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${section.bgColor} shrink-0`}>
                <Icon className={`h-5 w-5 ${section.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-white">{section.title}</h3>
                <p className="text-xs text-text-muted mt-0.5">{section.description}</p>
              </div>
              {section.id === "payu" && (
                <div className="flex items-center gap-1.5 rounded-full bg-gold/10 border border-gold/30 px-2.5 py-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
                  <span className="text-[10px] font-bold text-gold uppercase tracking-wider">Test Mode</span>
                </div>
              )}
            </div>

            {/* Form fields */}
            {section.fields.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2 ml-14">
                {section.fields.map((field) => (
                  <div key={field.label}>
                    <label className="block text-[11px] font-medium text-text-muted mb-1.5">{field.label}</label>
                    {field.type === "toggle" ? (
                      <div className="flex items-center gap-3">
                        <div className="relative inline-flex h-5 w-9 items-center rounded-full bg-gold/30">
                          <span className="inline-block h-3.5 w-3.5 translate-x-1 rounded-full bg-gold" />
                        </div>
                        <span className="text-xs text-gold font-medium">Test Mode</span>
                        <span className="text-[10px] text-text-dim">(switch to Live for production)</span>
                      </div>
                    ) : field.type === "select" ? (
                      <div className="relative">
                        <select
                          className="w-full h-9 rounded-lg bg-surface border border-border-gold px-3 text-sm text-white appearance-none focus:border-gold transition-colors"
                          defaultValue={field.value}
                        >
                          {field.options?.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-dim">
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </div>
                    ) : (
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        defaultValue={field.value}
                        className="w-full h-9 rounded-lg bg-surface border border-border-gold px-3 text-sm text-white placeholder:text-text-dim focus:border-gold transition-colors"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* User management special section */}
            {section.id === "users" && (
              <div className="ml-14">
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
                      {teamMembers.map((m) => (
                        <tr key={m.email} className="border-b border-border-gold/10">
                          <td className="py-3 pr-4">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                                <span className="text-xs font-bold text-gold">{m.name[0]}</span>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-white">{m.name}</p>
                                <p className="text-[10px] text-text-dim">{m.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 pr-4">
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              m.role === "Owner" ? "bg-gold/20 text-gold" :
                              m.role === "Sales Manager" ? "bg-violet-500/20 text-violet-400" :
                              "bg-surface text-text-muted"
                            }`}>
                              {m.role}
                            </span>
                          </td>
                          <td className="py-3 text-center">
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-500/20 px-2 py-0.5 text-[10px] font-bold text-green-400">
                              <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                              {m.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button className="mt-3 flex h-8 items-center gap-1.5 rounded-lg border border-border-gold px-3 text-[11px] text-text-muted hover:text-white hover:bg-surface transition-colors">
                  <Users className="h-3 w-3" /> Invite Team Member
                </button>
              </div>
            )}

            {/* Save button for form sections */}
            {section.fields.length > 0 && (
              <div className="flex justify-end mt-5 ml-14">
                <button className="flex h-8 items-center gap-1.5 rounded-lg bg-gold-gradient px-4 text-[11px] font-bold text-cosmic-950 transition-transform hover:scale-[1.02]">
                  <Shield className="h-3 w-3" /> Save Changes
                </button>
              </div>
            )}
          </div>
        );
      })}

      {/* Environment info */}
      <div className="flex items-start gap-3 rounded-lg bg-gold/5 border border-gold/20 p-4">
        <Info className="h-4 w-4 text-gold shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-medium text-gold">Environment Notice</p>
          <p className="text-xs text-text-muted mt-0.5">
            Sensitive values (API keys, passwords) are stored as environment variables on the server and never exposed in the browser.
            The fields above show masked previews for reference only.
          </p>
        </div>
      </div>
    </div>
  );
}
