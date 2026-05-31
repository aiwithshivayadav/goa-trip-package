import NextAuth from "next-auth";
import type { DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "./db";

// Extend the session types
declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      role?: string;
      userId?: string;
    };
  }
}

/**
 * Auth.js v5 — Credentials provider for admin login
 * Verifies username + bcrypt-hashed password against sales_users table
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Admin Login",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        try {
          const user = await db.salesUser.findUnique({
            where: { username: credentials.username as string },
          });

          if (!user || !user.isActive) return null;

          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.passwordHash
          );

          if (!isValid) return null;

          // Update last login
          await db.salesUser.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
          });

          return {
            id: String(user.id),
            name: user.name,
            email: user.email || undefined,
            role: user.role,
          };
        } catch (error) {
          console.error("[Auth] Login error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as Record<string, unknown>).role;
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string | undefined;
        session.user.userId = token.userId as string | undefined;
      }
      return session;
    },
  },
  trustHost: true,
});
