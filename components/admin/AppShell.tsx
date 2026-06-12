"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, Users, FileText, CalendarDays, Package,
  CreditCard, Tag, BarChart3, Settings, LogOut, Menu, X,
  ChevronRight, Inbox,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Leads", icon: Inbox, badge: "12" },
  { href: "/admin/quotes", label: "Quotes", icon: FileText },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarDays },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/coupons", label: "Coupons", icon: Tag },
  { href: "/admin/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

/**
 * Admin AppShell — sidebar + topbar that wraps all /admin/* pages
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleLogout() {
    await signOut({ redirect: false });
    router.push("/admin/login");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-cosmic-950">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border-gold/30 bg-cosmic-900 transition-transform lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-border-gold/20">
          <Link href="/admin" className="flex items-center gap-2.5">
            <Image
              src="/logo-mark.svg"
              alt="GTP Admin"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span className="font-display text-base font-bold text-white">
              GTP <span className="text-gold">Admin</span>
            </span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-text-muted hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    isActive
                      ? "bg-gold/15 text-gold border border-gold/20"
                      : "text-text-muted hover:text-white hover:bg-surface"
                  )}
                >
                  <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-gold" : "")} />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gold/20 px-1.5 text-[10px] font-bold text-gold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom section */}
        <div className="border-t border-border-gold/20 p-3">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text-muted hover:text-white hover:bg-surface transition-colors"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
            View Live Site
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text-muted hover:text-rose hover:bg-surface transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-16 items-center justify-between border-b border-border-gold/20 bg-cosmic-900/50 px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-text-muted hover:text-white hover:bg-surface lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-sm font-bold text-white lg:text-base">
              {navItems.find((i) => i.href === pathname || (i.href !== "/admin" && pathname.startsWith(i.href)))?.label || "Admin"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick actions */}
            <a
              href="https://wa.me/919890830249"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 rounded-lg border border-border-gold px-3 py-1.5 text-xs text-text-muted hover:text-gold transition-colors"
            >
              <span className="h-2 w-2 rounded-full bg-green-400" />
              WhatsApp
            </a>

            {/* User */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gold/20 flex items-center justify-center">
                <span className="text-xs font-bold text-gold">S</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-medium text-white">Shiva</p>
                <p className="text-[10px] text-text-dim">Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
