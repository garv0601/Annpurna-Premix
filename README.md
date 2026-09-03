# ANNPURNA — Fullstack Web Application

## Supabase Configuration

Authentication is powered by [Supabase](https://supabase.com). The frontend uses the **public anon key** — never the service-role secret.

### Setup

1. Create a project at [supabase.com](https://supabase.com).
2. Copy `frontend/.env` to `frontend/.env.local` and fill in your values:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Restart the Vite dev server after editing `.env.local` — environment variables are baked in at startup.

### What each key is

| Variable | Where to find it | Safe to expose? |
|---|---|---|
| `VITE_SUPABASE_URL` | Project Settings → API → Project URL | ✅ Yes (public) |
| `VITE_SUPABASE_ANON_KEY` | Project Settings → API → anon / public | ✅ Yes (public) |

> ⚠️ **Never** put the `service_role` key into the frontend `.env`. It must remain server-side only.

### Without credentials

The app will still load and render correctly. A developer warning will appear in the browser console:

```
[Supabase] Credentials are not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY...
```

Authentication features will be unavailable until credentials are provided.

### Providers to enable (in Supabase dashboard → Authentication → Providers)

- Email (for email/password and future OTP)
- Google OAuth
- Facebook OAuth

---


A modern, high-performance fullstack web application featuring luxury electronics, audio equipment, and custom peripherals. Built with React + Vite on the frontend and Node.js + Express REST API on the backend.

---

## 📁 Directory Structure

```
web-application/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/         # Header, Footer, Layout container
│   │   │   ├── navbar/         # Navbar with live search & cart counter
│   │   │   ├── hero/           # HeroBanner showcase & metrics
│   │   │   ├── product/        # ProductCard, ProductGrid, ProductFilter, ProductDetailModal
│   │   │   ├── reviews/        # ReviewCard, ReviewList, ReviewForm
│   │   │   └── common/         # Button, RatingStars, Badge, Modal, CartDrawer
│   │   │
│   │   ├── pages/
│   │   │   └── Home/           # HomePage layout
│   │   │
│   │   ├── assets/             # Brand logos & icons
│   │   ├── hooks/              # useProducts, useReviews, useCart
│   │   ├── services/           # REST API client
│   │   ├── utils/              # Currency & date formatters
│   │   ├── styles/             # Glassmorphism & dark theme global CSS
│   │   └── App.jsx             # Main React entry component
│   │
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── controllers/        # Product and Review REST controllers
│   │   ├── routes/             # Express API routes (/api/products, /api/reviews)
│   │   ├── models/             # Product and Review store models
│   │   ├── middleware/         # Custom logger & error handler
│   │   ├── services/           # Business logic & rating aggregations
│   │   ├── config/             # Environment configuration
│   │   ├── utils/              # Seed data for products & customer reviews
│   │   └── server.js           # Express app entry point
│   │
│   └── package.json
│
└── README.md
```

---

## ⚡ Quick Start

### 1. Start Backend API Server

```bash
cd backend
npm install
npm start
```
> The REST API server will run on `http://localhost:5000`.

### 2. Start Frontend Development Server

```bash
cd frontend
npm install
npm run dev
```
> The React dev server will run on `http://localhost:3000` with automated proxying to the API server at `http://localhost:5000`.

---

## 🌟 Key Features

- **Full REST API Integration**: Custom Express controllers, models, and routes serving `/api/products` and `/api/reviews`.
- **Live Review Submissions**: Real-time customer review posting with automatic rating recalculation.
- **Interactive Cart & Quick View**: Persistent cart drawer, quantity adjustment, subtotal calculations, and product detail modal.
- **Advanced Filtering & Search**: Instant query search, category tabs, max price sliders, and rating sorts.
- **Glassmorphism Dark Theme**: Custom CSS design system built with vibrant cyan/purple gradients, smooth micro-animations, and clean typography.
