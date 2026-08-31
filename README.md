# Aurum Grove — Premium Jewellery E-Commerce + Wholesale Platform

A full-stack premium jewellery e-commerce website with B2C shopping and B2B wholesale functionality.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, React Router
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT

## Prerequisites

- Node.js 18+
- MongoDB (local or MongoDB Atlas)

## Setup

1. **Clone and install dependencies:**

```bash
cd client && npm install
cd ../server && npm install
```

2. **Configure environment:**

Copy `.env.example` to `.env` in the project root and update:

```
MONGODB_URI=mongodb://localhost:27017/aurum-grove
JWT_SECRET=your_secret
PORT=4000
CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=admin@aurumgrove.com
ADMIN_PASSWORD=changeme
```

3. **Seed the database:**

```bash
cd server && npm run seed
```

4. **Start development servers:**

```bash
# Option A — run both from project root
npm run dev

# Option B — run separately
cd server && npm run dev
cd client && npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:4000

## Admin Access

After seeding:
- Email: `admin@aurumgrove.com`
- Password: `changeme`
- Admin panel: http://localhost:5173/admin

## Features

### B2C E-Commerce
- Premium homepage with 17 sections
- Shop with filters, sorting, pagination
- 11 category pages with SEO content
- Product detail with gallery, zoom, specs
- Cart, checkout (UPI/card/COD UI)
- Auth, profile, wishlist, search

### B2B Wholesale
- Separate wholesale landing page
- Business registration with approval workflow
- Wholesale shop with MOQ and bulk pricing
- Bulk cart with tier discounts
- Wholesale dashboard

### Admin Panel
- Dashboard with sales metrics
- Product, order, wholesale management
- Bulk pricing configuration
- Customer and blog management

## Project Structure

```
client/          React frontend
server/          Express API
.env.example     Environment template
```

## Deployment

### GitHub
Repo: `loopc-business-strategies/mg-jewelry`  
Branch: `aurum-grove` (preview) → merge to `main` for production

### Vercel (frontend)
- **Root Directory:** `client`
- **Framework:** Vite
- **Env:** `VITE_API_URL=https://<railway-api-url>/api`
- **Live URL:** https://mg-jewelry.vercel.app

### Railway (backend)
- **Root Directory:** `server`
- **Add MongoDB** service in MG Jewelry project
- **Env:** `MONGODB_URI`, `USE_MEMORY_DB=false`, `JWT_SECRET`, `CLIENT_URL`, `CORS_ORIGINS`
- Run seed once: `railway run npm run seed`

## Production Notes

- Replace placeholder Unsplash images via `client/src/utils/imageConfig.js`
- Configure MongoDB Atlas for production
- Set strong JWT_SECRET
- Integrate Razorpay/Stripe for payments
- Configure Cloudinary/S3 for image uploads
