"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

/**
 * Admin Login — Premium dark split-screen design
 * Uses Auth.js Credentials provider → bcrypt verification
 */
export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid credentials. Please try again.");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-cosmic-scene relative items-center justify-center">
        <div className="bg-stars absolute inset-0" />
        <div className="relative z-10 text-center px-12">
          <h1 className="font-display text-5xl font-bold text-white mb-4">
            Goa Trip
            <span className="text-gold-gradient block">Package</span>
          </h1>
          <p className="text-text-muted text-lg">Admin Dashboard</p>
          <div className="gold-divider mx-auto mt-8 w-32" />
        </div>
      </div>

      {/* Right side — login form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-cosmic-950 px-6">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-12 text-center">
            <h1 className="font-display text-3xl font-bold text-white">
              Goa Trip <span className="text-gold">Package</span>
            </h1>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
          <p className="text-text-muted mb-8">Sign in to your admin dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-text-muted mb-2">Username</label>
              <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="gtpadmin" required className="w-full h-12 rounded-lg bg-surface border border-border-gold px-4 text-white placeholder:text-text-dim focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-muted mb-2">Password</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••••" required className="w-full h-12 rounded-lg bg-surface border border-border-gold px-4 text-white placeholder:text-text-dim focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors" />
            </div>

            {error && <p className="text-sm text-rose">{error}</p>}

            <button type="submit" disabled={loading} className="w-full h-12 rounded-lg bg-gold-gradient text-cosmic-950 font-bold text-sm transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-text-dim">
            Need help?{" "}
            <a href="https://wa.me/919890830249" className="text-gold hover:text-gold-200 transition-colors">WhatsApp support</a>
          </p>
        </div>
      </div>
    </div>
  );
}
