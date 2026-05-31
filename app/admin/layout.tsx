import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

/**
 * Admin layout — wraps all /admin/* pages
 * Children are rendered inside the AppShell (sidebar + topbar) once built
 * For now, just passes through
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cosmic-950">
      {children}
    </div>
  );
}
