# Al Mushtaq Building Material Store — Full-Stack E-Commerce Platform

A production-ready full-stack ecommerce and quotation marketplace built for **Al Mushtaq Building Material Store**, situated at Basti Manzoorabad Pull, Manthar Road, Rahim Yar Khan, Pakistan.

---

## 1. Project Overview
Al Mushtaq Building Material Store is a specialized digital platform for home builders, contractors, plumbers, electricians, tile workers, painters, and interior fabricators in and around Rahim Yar Khan. The store allows users to browse materials, inspect technical specifications, check stock availability, request bulk contractor quotations, place direct orders, track deliveries, and communicate directly through WhatsApp.

---

## 2. Key Features

- **100+ Realistic Products & 20 Categories**: Pre-seeded building materials across Ordinary Portland Cement (OPC), red clay bricks, concrete blocks, ASTM Grade 60 steel rebars, washed river sand, Margalla aggregates, porcelain and ceramic tiles, exterior/interior paints, uPVC and PPR hot/cold piping, copper cables, and hardware tools.
- **Configurable Sales Units**: Authentic construction unit handling (Bag, 1000 Pcs, Ton, Kg, 100 Cu.Ft, Box, Gallon, Drum 16L, Length, Coil, Piece, Set).
- **Price on Request & Quotations Engine**: For volatile commodities (sand, crush, steel rebars, bulk bricks), customers can request live market quotations.
- **Contractor & Bulk Procurement**: Specialized bulk order schedule submission for multistory commercial and residential projects.
- **Real-Time Order Tracking**: Human-readable order numbers (e.g. `AMS-2026-000001`) with multi-stage progress timelines from Pending to Delivered.
- **Direct WhatsApp Hotlines**: Configured with `+92 301 3242408` with pre-filled product SKU, quantity, and site inquiry payloads.
- **Full-Featured Admin Dashboard**:
  - Live revenue and volume metrics
  - Product CRUD with inline price and stock adjustment
  - Order status workflow and tracking history updates
  - Quotation request response and rate calculation
  - Category and brand taxonomy management
  - Customer contact inquiry desk
  - Store hours, delivery thresholds, and policy settings
- **Cart, Wishlist & Side-by-Side Comparison**: Multi-product specification matrices comparing up to 4 items simultaneously.

---

## 3. Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, React Router DOM, Axios, Context API, Lucide React.
- **Backend**: Node.js, Express.js, JWT Authentication, bcryptjs, CORS, centralized database layer.
- **Database**: MongoDB with Mongoose support and automated embedded persistent document store fallback for zero-dependency local execution.

---

## 4. Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Steps
```bash
# Clone the repository
git clone <repo-url>
cd al-mushtaq-building-material-store

# Install all dependencies
npm install

# Run database seed (Seeds 100+ products, 20 categories, 16 brands, and admin)
npm run seed

# Start the full-stack development server
npm run dev
```

---

## 5. Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development
APP_URL=http://localhost:3000
CLIENT_URL=http://localhost:3000

# Database Configuration (Optional MongoDB Atlas connection string)
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/al_mushtaq?retryWrites=true&w=majority

# Security
JWT_SECRET=al_mushtaq_super_secret_jwt_key_2026
ADMIN_EMAIL=admin@almushtaq.com
ADMIN_PASSWORD=admin_material_2026

# Storefront Hotlines
VITE_API_URL=
VITE_WHATSAPP_NUMBER=+923013242408
VITE_BUSINESS_PHONE=+92 301 3242408
```

---

## 6. Default Admin Access

- **Portal URL**: `/admin/login`
- **Email**: `admin@almushtaq.com`
- **Password**: `admin_material_2026`

---

## 7. Production Build & Deployment

### Build
```bash
npm run build
```

### Production Run
```bash
npm run start
```

### Deployment Targets
- **Render / Railway / Cloud Run**: Single full-stack Node container running `server.ts` with static serving of `dist`.
- **Vercel / Netlify**: Deploy client `dist` with backend server hosted on Render or Node platform.
- **MongoDB Atlas**: Supply standard connection string in `MONGO_URI`.

---

## 8. Business Location & Support
- **Store**: Al Mushtaq Building Material Store
- **Address**: Basti Manzoorabad Pull, Manthar Road, Rahim Yar Khan, Pakistan
- **Phone / WhatsApp**: +92 301 3242408
