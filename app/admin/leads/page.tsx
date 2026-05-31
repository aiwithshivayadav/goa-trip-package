"use client";

import { useState } from "react";
import { Phone, Mail, Clock, MapPin, Tag, Plus, Search, Filter } from "lucide-react";

type LeadStatus = "new" | "contacted" | "quoted" | "negotiating" | "won" | "lost";

interface Lead {
  id: number;
  name: string;
  phone: string;
  email?: string;
  product: string;
  source: string;
  status: LeadStatus;
  createdAt: string;
  assignedTo?: string;
}

// Mock data
const mockLeads: Lead[] = [
  { id: 1, name: "Priya Sharma", phone: "+91 98765 43210", email: "priya@gmail.com", product: "Honeymoon Classic 3N/4D", source: "Google Ads", status: "new", createdAt: "30 min ago" },
  { id: 2, name: "Vikram Patel", phone: "+91 87654 32109", product: "Corporate Offsite 2N/3D", source: "Website Form", status: "new", createdAt: "1 hr ago" },
  { id: 3, name: "Sneha Rao", phone: "+91 76543 21098", email: "sneha@outlook.com", product: "Royal Cruise Night Party", source: "Instagram", status: "new", createdAt: "2 hrs ago" },
  { id: 4, name: "Arjun Mehta", phone: "+91 65432 10987", product: "Bachelor Group 3N/4D", source: "WhatsApp", status: "contacted", createdAt: "1 day ago", assignedTo: "Riya" },
  { id: 5, name: "Divya & Karan", phone: "+91 54321 09876", email: "divya@yahoo.com", product: "Premium Honeymoon 4N/5D", source: "Google Organic", status: "contacted", createdAt: "1 day ago", assignedTo: "Shiva" },
  { id: 6, name: "Rohan's Group (15 pax)", phone: "+91 43210 98765", product: "Group Special 10-20 pax", source: "Referral", status: "quoted", createdAt: "3 days ago", assignedTo: "Riya" },
  { id: 7, name: "Anita Desai", phone: "+91 32109 87654", email: "anita@gmail.com", product: "Yacht Charter — Polaris", source: "Website", status: "quoted", createdAt: "4 days ago", assignedTo: "Shiva" },
  { id: 8, name: "Suresh Kumar", phone: "+91 21098 76543", product: "Family Fun 3N/4D", source: "Google Ads", status: "negotiating", createdAt: "5 days ago", assignedTo: "Shiva" },
  { id: 9, name: "Neha & Friends (8 pax)", phone: "+91 10987 65432", product: "Bachelorette Yacht Party", source: "Instagram", status: "won", createdAt: "1 week ago", assignedTo: "Riya" },
  { id: 10, name: "Amit Joshi", phone: "+91 09876 54321", product: "Budget Backpacker 2N/3D", source: "Google Ads", status: "lost", createdAt: "2 weeks ago" },
];

const columns: { key: LeadStatus; label: string; color: string }[] = [
  { key: "new", label: "New", color: "bg-blue-500" },
  { key: "contacted", label: "Contacted", color: "bg-yellow-500" },
  { key: "quoted", label: "Quoted", color: "bg-violet-500" },
  { key: "negotiating", label: "Negotiating", color: "bg-orange-500" },
  { key: "won", label: "Won", color: "bg-green-500" },
  { key: "lost", label: "Lost", color: "bg-red-500" },
];

export default function LeadsPage() {
  const [leads] = useState(mockLeads);
  const [search, setSearch] = useState("");

  const filtered = search
    ? leads.filter((l) => l.name.toLowerCase().includes(search.toLowerCase()) || l.product.toLowerCase().includes(search.toLowerCase()))
    : leads;

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-dim" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search leads..."
              className="w-full h-9 rounded-lg bg-surface border border-border-gold pl-9 pr-3 text-sm text-white placeholder:text-text-dim focus:border-gold transition-colors"
            />
          </div>
          <button className="flex h-9 items-center gap-1.5 rounded-lg border border-border-gold px-3 text-xs text-text-muted hover:text-white hover:bg-surface transition-colors">
            <Filter className="h-3.5 w-3.5" /> Filters
          </button>
        </div>
        <button className="flex h-9 items-center gap-1.5 rounded-lg bg-gold-gradient px-4 text-xs font-bold text-cosmic-950 transition-transform hover:scale-[1.02]">
          <Plus className="h-3.5 w-3.5" /> Add Lead
        </button>
      </div>

      {/* Kanban board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((col) => {
          const colLeads = filtered.filter((l) => l.status === col.key);
          return (
            <div key={col.key} className="flex-shrink-0 w-72">
              {/* Column header */}
              <div className="flex items-center gap-2 mb-3 px-1">
                <div className={`h-2.5 w-2.5 rounded-full ${col.color}`} />
                <span className="text-xs font-bold text-white uppercase tracking-wider">{col.label}</span>
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-surface text-[10px] font-bold text-text-muted">
                  {colLeads.length}
                </span>
              </div>

              {/* Cards */}
              <div className="space-y-2">
                {colLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="glass-card rounded-lg p-3.5 cursor-pointer transition-all hover:border-gold/50 hover:-translate-y-0.5"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-medium text-white leading-snug">{lead.name}</h4>
                      <span className="text-[10px] text-text-dim whitespace-nowrap ml-2">{lead.createdAt}</span>
                    </div>

                    <p className="text-xs text-gold mb-2 line-clamp-1">{lead.product}</p>

                    <div className="flex flex-wrap items-center gap-2 text-[10px] text-text-dim">
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {lead.phone.slice(-5)}
                      </span>
                      {lead.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {lead.email.split("@")[0]}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Tag className="h-3 w-3" /> {lead.source}
                      </span>
                    </div>

                    {lead.assignedTo && (
                      <div className="mt-2 flex items-center gap-1.5">
                        <div className="h-5 w-5 rounded-full bg-gold/20 flex items-center justify-center">
                          <span className="text-[9px] font-bold text-gold">{lead.assignedTo[0]}</span>
                        </div>
                        <span className="text-[10px] text-text-muted">{lead.assignedTo}</span>
                      </div>
                    )}
                  </div>
                ))}

                {colLeads.length === 0 && (
                  <div className="rounded-lg border border-dashed border-border-gold/30 p-4 text-center">
                    <p className="text-xs text-text-dim">No leads</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
