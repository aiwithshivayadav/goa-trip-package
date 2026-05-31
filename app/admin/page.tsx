import Link from "next/link";

/**
 * Admin Dashboard — placeholder until Phase D (Week 5)
 * Will have: Today KPIs, revenue chart, top sources, pending actions, leaderboard
 */
export default function AdminDashboardPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h1 className="font-display text-4xl font-bold text-white mb-4">
          Admin <span className="text-gold">Dashboard</span>
        </h1>
        <p className="text-text-muted mb-8">
          Dashboard with KPIs, revenue charts, and quick actions coming in Phase D (Week 5).
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link href="/admin/leads" className="glass-card rounded-lg px-4 py-3 text-sm text-gold hover:text-white transition-colors">
            Leads
          </Link>
          <Link href="/admin/quotes" className="glass-card rounded-lg px-4 py-3 text-sm text-gold hover:text-white transition-colors">
            Quotes
          </Link>
          <Link href="/admin/bookings" className="glass-card rounded-lg px-4 py-3 text-sm text-gold hover:text-white transition-colors">
            Bookings
          </Link>
          <Link href="/admin/products" className="glass-card rounded-lg px-4 py-3 text-sm text-gold hover:text-white transition-colors">
            Products
          </Link>
        </div>
        <div className="gold-divider mx-auto mt-8 w-24" />
      </div>
    </div>
  );
}
