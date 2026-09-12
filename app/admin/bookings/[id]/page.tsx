"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Calendar,
  Phone,
  Mail,
  CreditCard,
  Users,
  FileText,
  MessageSquare,
  ExternalLink,
  Loader2,
  Hash,
  MapPin,
  Clock,
  IndianRupee,
  Send,
  Receipt,
} from "lucide-react";
import { toast } from "sonner";
import { formatINR } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface Payment {
  id: number;
  milestone: string;
  amount: number;
  method: string;
  status: string;
  payuTxnid: string | null;
  payuMihpayid: string | null;
  createdAt: string;
  completedAt: string | null;
}

interface BookingDetail {
  id: number;
  bookingId: string;
  createdAt: string;
  updatedAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerPhoneRaw: string;
  packageName: string;
  packageCategory: string;
  travelDate: string;
  adults: number;
  children: number;
  pickupLocation: string;
  basePrice: number;
  discount: number;
  gstAmount: number;
  totalAmount: number;
  advancePaid: number;
  balanceDue: number;
  paymentStatus: string;
  payuTxnid: string;
  payuMihpayid: string;
  payuStatus: string;
  status: string;
  specialRequests: string | null;
  notes: string | null;
  createdBy: string;
  couponCode: string | null;
  couponDiscount: number | null;
  payments: Payment[];
}

const statusColors: Record<string, string> = {
  confirmed: "bg-green-500/20 text-green-400 border-green-500/30",
  completed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
  draft: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
};

const paymentStatusColors: Record<string, string> = {
  paid: "bg-green-500/20 text-green-400",
  partial: "bg-gold/20 text-gold",
  pending: "bg-rose/20 text-rose",
  failed: "bg-red-500/20 text-red-400",
  refunded: "bg-violet-500/20 text-violet-400",
};

const paymentMethodLabels: Record<string, string> = {
  payu: "PayU",
  cash: "Cash",
  bank_transfer: "Bank Transfer",
  upi_qr: "UPI / QR",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function toInputDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toISOString().split("T")[0] ?? "";
}

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Editable fields
  const [editStatus, setEditStatus] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editSpecialRequests, setEditSpecialRequests] = useState("");
  const [editTravelDate, setEditTravelDate] = useState("");

  useEffect(() => {
    fetch(`/api/bookings/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.booking) {
          const b = data.booking;
          setBooking({
            ...b,
            basePrice: Number(b.basePrice),
            discount: Number(b.discount),
            gstAmount: Number(b.gstAmount),
            totalAmount: Number(b.totalAmount),
            advancePaid: Number(b.advancePaid),
            balanceDue: Number(b.balanceDue),
            couponDiscount: b.couponDiscount ? Number(b.couponDiscount) : null,
            payments: (b.payments || []).map((p: Record<string, unknown>) => ({
              ...p,
              amount: Number(p.amount),
            })),
          });
          setEditStatus(b.status);
          setEditNotes(b.notes || "");
          setEditSpecialRequests(b.specialRequests || "");
          setEditTravelDate(b.travelDate ? toInputDate(b.travelDate) : "");
        } else {
          toast.error("Booking not found");
          router.push("/admin/bookings");
        }
      })
      .catch(() => {
        toast.error("Failed to load booking");
        router.push("/admin/bookings");
      })
      .finally(() => setLoading(false));
  }, [params.id, router]);

  async function handleSave() {
    if (!booking) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: editStatus,
          notes: editNotes,
          specialRequests: editSpecialRequests,
          travelDate: editTravelDate,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Update failed");
      }

      const data = await res.json();
      if (data.booking) {
        const b = data.booking;
        setBooking({
          ...b,
          basePrice: Number(b.basePrice),
          discount: Number(b.discount),
          gstAmount: Number(b.gstAmount),
          totalAmount: Number(b.totalAmount),
          advancePaid: Number(b.advancePaid),
          balanceDue: Number(b.balanceDue),
          couponDiscount: b.couponDiscount ? Number(b.couponDiscount) : null,
          payments: (b.payments || []).map((p: Record<string, unknown>) => ({
            ...p,
            amount: Number(p.amount),
          })),
        });
      }
      toast.success("Booking updated");
    } catch {
      toast.error("Failed to update booking");
    } finally {
      setSaving(false);
    }
  }

  function openWhatsApp() {
    if (!booking) return;
    const phone = booking.customerPhoneRaw || booking.customerPhone.replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${phone}`, "_blank");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  if (!booking) return null;

  const hasChanges =
    editStatus !== booking.status ||
    editNotes !== (booking.notes || "") ||
    editSpecialRequests !== (booking.specialRequests || "") ||
    editTravelDate !== (booking.travelDate ? toInputDate(booking.travelDate) : "");

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/bookings"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:text-white hover:bg-surface transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white">
                Booking {booking.bookingId}
              </h1>
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusColors[booking.status] || "bg-surface text-text-muted border-border-gold"}`}
              >
                {booking.status}
              </span>
            </div>
            <p className="text-xs text-text-dim mt-0.5">
              Created {formatDateTime(booking.createdAt)} by {booking.createdBy}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className="flex h-9 items-center gap-1.5 rounded-lg bg-gold-gradient px-4 text-xs font-bold text-cosmic-950 transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
          >
            {saving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content — 2 cols */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info */}
          <div className="glass-card rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="h-4 w-4 text-gold" /> Customer Information
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-[10px] text-text-dim uppercase tracking-wider">
                  Name
                </p>
                <p className="text-sm font-medium text-white">
                  {booking.customerName}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-text-dim uppercase tracking-wider">
                  Phone
                </p>
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-text-dim" />
                  <p className="text-sm text-text-muted font-mono">
                    {booking.customerPhone}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-text-dim uppercase tracking-wider">
                  Email
                </p>
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-text-dim" />
                  <p className="text-sm text-text-muted">
                    {booking.customerEmail || "Not provided"}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-text-dim uppercase tracking-wider">
                  Guests
                </p>
                <p className="text-sm text-text-muted">
                  {booking.adults} Adult{booking.adults !== 1 ? "s" : ""}
                  {booking.children > 0 &&
                    `, ${booking.children} Child${booking.children !== 1 ? "ren" : ""}`}
                </p>
              </div>
            </div>
            {booking.pickupLocation && (
              <div className="space-y-1">
                <p className="text-[10px] text-text-dim uppercase tracking-wider">
                  Pickup Location
                </p>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-text-dim" />
                  <p className="text-sm text-text-muted">
                    {booking.pickupLocation}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Package & Travel */}
          <div className="glass-card rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gold" /> Package & Travel
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-[10px] text-text-dim uppercase tracking-wider">
                  Package
                </p>
                <p className="text-sm font-medium text-white">
                  {booking.packageName}
                </p>
                <p className="text-[10px] text-text-dim capitalize">
                  {booking.packageCategory.replace("_", " ")}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-text-dim uppercase tracking-wider">
                  Travel Date
                </p>
                <input
                  type="date"
                  value={editTravelDate}
                  onChange={(e) => setEditTravelDate(e.target.value)}
                  className="w-full h-9 rounded-lg bg-surface border border-border-gold px-3 text-sm text-white focus:border-gold transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="glass-card rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <IndianRupee className="h-4 w-4 text-gold" /> Pricing & Payment
            </h2>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-surface border border-border-gold/30 p-3 space-y-1">
                <p className="text-[10px] text-text-dim uppercase tracking-wider">
                  Base Price
                </p>
                <p className="text-lg font-bold text-white">
                  {formatINR(booking.basePrice)}
                </p>
              </div>
              {booking.discount > 0 && (
                <div className="rounded-lg bg-surface border border-border-gold/30 p-3 space-y-1">
                  <p className="text-[10px] text-text-dim uppercase tracking-wider">
                    Discount
                  </p>
                  <p className="text-lg font-bold text-green-400">
                    -{formatINR(booking.discount)}
                  </p>
                </div>
              )}
              {booking.gstAmount > 0 && (
                <div className="rounded-lg bg-surface border border-border-gold/30 p-3 space-y-1">
                  <p className="text-[10px] text-text-dim uppercase tracking-wider">
                    GST
                  </p>
                  <p className="text-lg font-bold text-text-muted">
                    {formatINR(booking.gstAmount)}
                  </p>
                </div>
              )}
              <div className="rounded-lg bg-surface border border-gold/30 p-3 space-y-1">
                <p className="text-[10px] text-gold uppercase tracking-wider font-medium">
                  Total Amount
                </p>
                <p className="text-lg font-bold text-gold">
                  {formatINR(booking.totalAmount)}
                </p>
              </div>
              <div className="rounded-lg bg-surface border border-border-gold/30 p-3 space-y-1">
                <p className="text-[10px] text-text-dim uppercase tracking-wider">
                  Advance Paid
                </p>
                <p className="text-lg font-bold text-green-400">
                  {formatINR(booking.advancePaid)}
                </p>
              </div>
              <div className="rounded-lg bg-surface border border-border-gold/30 p-3 space-y-1">
                <p className="text-[10px] text-text-dim uppercase tracking-wider">
                  Balance Due
                </p>
                <p
                  className={`text-lg font-bold ${booking.balanceDue > 0 ? "text-rose" : "text-green-400"}`}
                >
                  {booking.balanceDue > 0
                    ? formatINR(booking.balanceDue)
                    : "Nil"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <span className="text-[10px] text-text-dim uppercase tracking-wider">
                Payment Status:
              </span>
              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold ${paymentStatusColors[booking.paymentStatus] || "bg-surface text-text-muted"}`}
              >
                {booking.paymentStatus}
              </span>
              {booking.couponCode && (
                <>
                  <span className="text-[10px] text-text-dim">|</span>
                  <span className="text-[10px] text-text-dim">
                    Coupon:{" "}
                    <span className="font-mono text-gold">
                      {booking.couponCode}
                    </span>
                    {booking.couponDiscount
                      ? ` (-${formatINR(booking.couponDiscount)})`
                      : ""}
                  </span>
                </>
              )}
            </div>
            {/* PayU details */}
            {booking.payuTxnid && (
              <div className="border-t border-border-gold/20 pt-3 space-y-1">
                <p className="text-[10px] text-text-dim uppercase tracking-wider">
                  PayU Transaction
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-muted font-mono">
                  {booking.payuTxnid && (
                    <span>TXN: {booking.payuTxnid}</span>
                  )}
                  {booking.payuMihpayid && (
                    <span>MihPayID: {booking.payuMihpayid}</span>
                  )}
                  {booking.payuStatus && (
                    <span>Status: {booking.payuStatus}</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Payment History */}
          {booking.payments.length > 0 && (
            <div className="glass-card rounded-xl p-5 space-y-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-gold" /> Payment History
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border-gold/30">
                      <th className="text-left text-[10px] font-medium text-text-dim uppercase tracking-wider px-3 py-2">
                        Date
                      </th>
                      <th className="text-left text-[10px] font-medium text-text-dim uppercase tracking-wider px-3 py-2">
                        Milestone
                      </th>
                      <th className="text-left text-[10px] font-medium text-text-dim uppercase tracking-wider px-3 py-2">
                        Method
                      </th>
                      <th className="text-right text-[10px] font-medium text-text-dim uppercase tracking-wider px-3 py-2">
                        Amount
                      </th>
                      <th className="text-center text-[10px] font-medium text-text-dim uppercase tracking-wider px-3 py-2">
                        Status
                      </th>
                      <th className="text-left text-[10px] font-medium text-text-dim uppercase tracking-wider px-3 py-2">
                        TXN ID
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {booking.payments.map((p) => (
                      <tr
                        key={p.id}
                        className="border-b border-border-gold/10"
                      >
                        <td className="px-3 py-2.5 text-text-muted whitespace-nowrap">
                          {formatDateTime(p.createdAt)}
                        </td>
                        <td className="px-3 py-2.5 text-white capitalize">
                          {p.milestone}
                        </td>
                        <td className="px-3 py-2.5 text-text-muted">
                          {paymentMethodLabels[p.method] || p.method}
                        </td>
                        <td className="px-3 py-2.5 text-right text-white font-medium">
                          {formatINR(p.amount)}
                        </td>
                        <td className="px-3 py-2.5 text-center">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${paymentStatusColors[p.status] || "bg-surface text-text-muted"}`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-text-dim font-mono text-xs">
                          {p.payuTxnid || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Edit: Special Requests & Notes */}
          <div className="glass-card rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="h-4 w-4 text-gold" /> Notes & Special
              Requests
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-text-muted mb-1.5">
                  Special Requests
                </label>
                <textarea
                  value={editSpecialRequests}
                  onChange={(e) => setEditSpecialRequests(e.target.value)}
                  placeholder="Customer special requests..."
                  rows={3}
                  className="w-full rounded-lg bg-surface border border-border-gold px-3 py-2 text-sm text-white placeholder:text-text-dim focus:border-gold transition-colors resize-none"
                />
              </div>
              <div>
                <label className="block text-xs text-text-muted mb-1.5">
                  Internal Notes
                </label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Internal notes (not visible to customer)..."
                  rows={3}
                  className="w-full rounded-lg bg-surface border border-border-gold px-3 py-2 text-sm text-white placeholder:text-text-dim focus:border-gold transition-colors resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar — 1 col */}
        <div className="space-y-6">
          {/* Status */}
          <div className="glass-card rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Hash className="h-4 w-4 text-gold" /> Status
            </h2>
            <div>
              <label className="block text-xs text-text-muted mb-1.5">
                Booking Status
              </label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="w-full h-10 rounded-lg bg-surface border border-border-gold px-3 text-sm text-white focus:border-gold transition-colors"
              >
                <option value="draft">Draft</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="border-t border-border-gold/20 pt-3 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-text-dim">Created</span>
                <span className="text-text-muted">
                  {formatDateTime(booking.createdAt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-dim">Updated</span>
                <span className="text-text-muted">
                  {formatDateTime(booking.updatedAt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-dim">Created by</span>
                <span className="text-text-muted capitalize">
                  {booking.createdBy}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card rounded-xl p-5 space-y-3">
            <h2 className="text-sm font-bold text-white">Quick Actions</h2>
            <button
              onClick={openWhatsApp}
              className="w-full flex items-center gap-2 h-10 rounded-lg border border-green-500/30 bg-green-500/10 px-3 text-sm text-green-400 hover:bg-green-500/20 transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              WhatsApp Customer
              <ExternalLink className="h-3 w-3 ml-auto opacity-50" />
            </button>
            <button
              onClick={() => toast.info("Send Payment Link — coming soon")}
              className="w-full flex items-center gap-2 h-10 rounded-lg border border-border-gold bg-surface px-3 text-sm text-text-muted hover:text-white hover:bg-surface/80 transition-colors"
            >
              <Send className="h-4 w-4" />
              Send Payment Link
            </button>
            <button
              onClick={() => toast.info("Create Invoice — coming soon")}
              className="w-full flex items-center gap-2 h-10 rounded-lg border border-border-gold bg-surface px-3 text-sm text-text-muted hover:text-white hover:bg-surface/80 transition-colors"
            >
              <Receipt className="h-4 w-4" />
              Create Invoice
            </button>
          </div>

          {/* Booking Summary Card */}
          <div className="glass-card rounded-xl p-5 space-y-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-gold" /> Summary
            </h2>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-text-dim">Booking ID</span>
                <span className="text-gold font-mono font-medium">
                  {booking.bookingId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-dim">Travel Date</span>
                <span className="text-text-muted">
                  {booking.travelDate
                    ? formatDate(booking.travelDate)
                    : "Not set"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-dim">Guests</span>
                <span className="text-text-muted">
                  {booking.adults}A
                  {booking.children > 0 ? `+${booking.children}C` : ""}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-dim">Total</span>
                <span className="text-white font-medium">
                  {formatINR(booking.totalAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-dim">Balance</span>
                <span
                  className={
                    booking.balanceDue > 0
                      ? "text-rose font-medium"
                      : "text-green-400"
                  }
                >
                  {booking.balanceDue > 0
                    ? formatINR(booking.balanceDue)
                    : "Paid"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom save */}
      <div className="flex justify-between items-center pt-4 border-t border-border-gold/20">
        <Link
          href="/admin/bookings"
          className="flex h-10 items-center px-4 rounded-lg border border-border-gold text-sm text-text-muted hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Bookings
        </Link>
        <button
          onClick={handleSave}
          disabled={saving || !hasChanges}
          className="flex h-10 items-center gap-1.5 rounded-lg bg-gold-gradient px-6 text-sm font-bold text-cosmic-950 transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
