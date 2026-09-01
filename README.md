# Modern Gold — Gold Industry Platform

Full-stack platform for **Modern Gold Jewelry Manufacturing FE LLC**, based in Namangan, Uzbekistan.

- **Frontend:** React + Vite + Tailwind CSS (`client/`)
- **Backend:** Express + MongoDB (`server/`)

## Business Model

- **Local sellers:** Sell gold via `/gold-buying` valuation requests
- **International buyers:** B2B registration, product catalogue, RFQ/quote workflow
- **Manufacturing:** Chains and bangles in 14K, 18K, 22K

## Local Development

```bash
npm install
cd client && npm install
cd ../server && npm install
npm run dev
```

- Client: http://localhost:5173
- API: http://localhost:4000

## Seed Database

```bash
npm run seed
```

Set `FORCE_RESEED=true` to reseed with chains/bangles catalogue.

## Key Routes

| Public | Admin |
|--------|-------|
| `/` Homepage | `/admin` Dashboard |
| `/gold-buying` Sell gold | `/admin/gold-buying` Leads |
| `/buyers` International buyers | `/admin/buyers` Applications |
| `/products` B2B catalogue | `/admin/rfqs` RFQs |
| `/manufacturing` Factory | `/admin/quotes` Quotes |
| `/markets` Regional presence | |

## Company

**Modern Gold Jewelry Manufacturing FE LLC**  
242 Girvonbulok Street, Namangan Davlatabad, Namangan – Uzbekistan
