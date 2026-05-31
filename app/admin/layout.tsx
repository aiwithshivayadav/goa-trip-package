import type { Metadata } from "next";
import { AppShell } from "@/components/admin/AppShell";

export const metadata: Metadata = {
  title: { default: "Admin Dashboard", template: "%s | GTP Admin" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
