# Modern Gold Jewelry — International Jewelry Manufacturing Platform

Full-stack e-commerce and wholesale platform for **Modern Gold Jewelry Manufacturing FE LLC**, based in Namangan, Uzbekistan.

- **Frontend:** React + Vite + Tailwind CSS (`client/`)
- **Backend:** Express + MongoDB (`server/`)
- **Live:** https://mg-jewelry.vercel.app

## Features

- B2C shop, cart, checkout, wishlist, search
- B2B wholesale registration, bulk pricing, partner dashboard
- Admin panel (products, orders, customers, blog, settings)
- International manufacturer homepage with global markets section
- Guaranteed product image fallback system

## Local Development

```bash
npm install
cd client && npm install
cd ../server && npm install
```

Create `.env` from `.env.example` at project root.

```bash
npm run dev
```

- Client: http://localhost:5173
- API: http://localhost:4000

## Seed Database

```bash
npm run seed
```

Admin login (default): see `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env`

## Production

**Vercel (client):** Root directory `client`, env `VITE_API_URL=https://<railway-api>/api`

**Railway (server):** Root directory `server`, MongoDB linked, `USE_MEMORY_DB=false`

## Company

**Modern Gold Jewelry Manufacturing FE LLC**  
242 Girvonbulok Street, Namangan Davlatabad, Namangan – Uzbekistan
