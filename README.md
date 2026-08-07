# MG Jewelry — Modern Gold Jewelry

Luxury jewelry platform for **Modern Gold Jewelry (MG Jewelry)**  
Showroom: **Namangan, Uzbekistan** · Audience: **worldwide**

Languages: **English · O‘zbek · Russian · Turkish**

## Stack

- `apps/web` — Next.js App Router, Tailwind, next-intl, Zustand
- `apps/api` — NestJS, Prisma, JWT auth, RBAC
- `packages/shared` — Zod schemas, roles, locales, money helpers
- Database: **PostgreSQL** (Railway in production; `docker-compose` locally)
- Payments: Stripe · Payme · Click · showroom pay (mock pay when `ALLOW_MOCK_PAYMENTS=1`, or by default outside production)
- Redis: not used (ignore `REDIS_URL` in `.env.example`)

## Live URLs

- Web (Vercel): https://mg-jewelry.vercel.app
- Web (Railway): https://web-production-e5029.up.railway.app/en
- API: https://api-production-60ae.up.railway.app/api/health
- GitHub: https://github.com/loopcstrategies-star/mg-jewelry (private)

## Quick start

```bash
npm install
copy .env.example .env

cd apps/api
npx prisma generate
npx prisma migrate deploy
npm run prisma:seed
cd ../..

npm run dev:api
npm run dev:web
```

- Web: http://localhost:3000/en  
- API: http://localhost:4000/api/health  
- Locales: `/en` `/uz` `/ru` `/tr`

### Demo accounts (local / when `NEXT_PUBLIC_SHOW_DEMO_LOGIN=1`)

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@mgjewelry.uz | Admin123! |
| Customer | customer@example.com | Customer123! |

## Production checklist

1. Set a strong `JWT_SECRET` (required in production — no default).
2. Mock payments: set `ALLOW_MOCK_PAYMENTS=1` only for controlled demos; in production leave unset/`0`. Outside production, mock pay may default on when unset.
3. Configure Stripe (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`) and/or Payme/Click secrets.
4. Optional: Cloudinary (`REQUIRE_CLOUDINARY=1` to fail uploads without Cloudinary), Resend (`RESEND_API_KEY`), Telegram bot. Health exposes `alertsConfigured` when Telegram or Resend is set.
5. Set `NEXT_PUBLIC_SHOW_DEMO_LOGIN=0` (or unset) to hide demo login buttons.
6. Deploy web to Vercel; API + Postgres on Railway. `REDIS_URL` is unused.

### API tests

```bash
npm test -w @mg/api
```

## Features

- Multilingual storefront (shop, collections, wholesale page, appointments, account)
- Admin CMS: products, catalog, orders, customers, coupons, reviews, settings, uploads
- International shipping quotes, returns/RMA, inquiries, support tickets
