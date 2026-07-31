# MG Jewelry — Modern Gold Jewelry

Luxury jewelry platform for **Modern Gold Jewelry (MG Jewelry)**  
Showroom: **Namangan, Uzbekistan** · Audience: **worldwide**

Languages: **English · O‘zbek · Russian · Turkish**

## Stack (Phase 1)

- `apps/web` — Next.js App Router, Tailwind, Framer Motion-ready, next-intl
- `apps/api` — NestJS, Prisma, JWT auth, RBAC
- `packages/shared` — Zod schemas, roles, locales, money helpers
- Payments: Stripe (global) · Payme / Click (Uzbekistan) · Namangan showroom pay
- Local DB default: SQLite (`file:./dev.db`) — switch to PostgreSQL for production

## Deployed (Railway)

- Web: https://web-production-e5029.up.railway.app/en
- API: https://api-production-60ae.up.railway.app/api/health
- GitHub: https://github.com/loopcstrategies-star/mg-jewelry (private)
- Database: Railway PostgreSQL (local `.env` uses `DATABASE_PUBLIC_URL`)

## Quick start


```bash
npm install
copy .env.example .env

cd apps/api
npx prisma generate
npx prisma db push
npm run prisma:seed
cd ../..

# terminal 1
npm run dev:api

# terminal 2
npm run dev:web
```

- Web: http://localhost:3000/en  
- API: http://localhost:4000/api/health  
- Locales: `/en` `/uz` `/ru` `/tr`  


### Demo accounts

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@mgjewelry.uz | Admin123! |
| Customer | customer@example.com | Customer123! |

## Production notes

1. Set `DATABASE_URL` to PostgreSQL and change Prisma `provider` to `postgresql`.
2. Configure Stripe, Payme, Click, Cloudinary, Sanity keys from `.env.example`.
3. Deploy `apps/web` to Vercel, `apps/api` + Postgres + Redis to Railway.
4. Point DNS through Cloudflare.

## Phase 2+ (later)

Appointments, full AI suite, Algolia, Uzum, international shipping rate tables, WhatsApp, rewards.
