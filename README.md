# Goa Trip Package — Booking Platform

Apple-grade Next.js 15 booking platform for **Goa Trip Package** (goatrippackage.com).

**Live:** [goa-trip-package.vercel.app](https://goa-trip-package.vercel.app)

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, TypeScript strict) |
| Styling | Tailwind CSS v4 + custom gold/cosmic design tokens |
| UI | shadcn/ui (customised) + Lucide icons |
| Typography | Inter (UI) + Fraunces (display) |
| Database | Prisma 6 + MySQL (Hostinger) |
| Auth | Auth.js v5 (Credentials provider) |
| Payment | PayU India (SHA-512 hash, production MID) |
| Email | Nodemailer (Hostinger SMTP) |
| Webhooks | n8n (WhatsApp via Interakt) |
| Search | Fuse.js (client-side fuzzy) |
| Charts | Recharts |
| Hosting | Vercel (free tier) |

## Pages (59 total)

**Customer Storefront:** Homepage, 5 category listings, 22 product detail pages, checkout, booking confirmation/failure, custom trip wizard, search, booking lookup, public quote page, about, contact, help/FAQ, 4 legal pages, 404, 500.

**Admin Dashboard:** Login, dashboard, leads kanban, quotes, bookings, customers, payments, products, coupons, calendar, reports, settings.

**API Routes:** Lead capture, PayU hash/success/failure.

## Local Development

```bash
# Clone
git clone https://github.com/aiwithshivayadav/goa-trip-package.git
cd goa-trip-package

# Install
npm install

# Environment
cp .env.example .env.local
# Fill in DATABASE_URL, PAYU_SALT, SMTP_PASS

# Generate Prisma client
npx prisma generate

# Run
npm run dev
# Open http://localhost:3000
```

## Deploy to Vercel

1. Push to GitHub
2. Import at [vercel.com/new](https://vercel.com/new)
3. Add environment variables (DATABASE_URL, PAYU_SALT, SMTP_PASS)
4. Deploy

## Environment Variables

See `.env.example` for the full list. Required for production:

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | MySQL connection string |
| `PAYU_KEY` | Yes | PayU merchant key (default: zide1p) |
| `PAYU_SALT` | Yes | PayU merchant salt (SECRET) |
| `PAYU_MODE` | Yes | `test` or `production` |
| `SMTP_PASS` | For email | Hostinger SMTP password |
| `N8N_WEBHOOK_URL` | For WhatsApp | n8n webhook endpoint |
| `NEXT_PUBLIC_SITE_URL` | Yes | Production URL |

## PayU Salt Rotation

PayU rotates the salt every 14 days. Update via:
1. Vercel Dashboard > Settings > Environment Variables > `PAYU_SALT`
2. Or Admin > Settings > PayU Configuration (once DB-connected)

## Database Schema

14 Prisma models: Booking, Customer, Lead, Quote, Product, ProductAvailability, Coupon, Payment, Invoice, SalesUser, ActivityLog, CommLog, Review, Settings.

Run migrations:
```bash
npx prisma migrate dev --name init
```

---

Built by Sam (AI Co-founder) for Shiva, Founder of Goa Trip Package.
