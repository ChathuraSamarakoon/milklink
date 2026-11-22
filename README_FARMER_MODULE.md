# MilkLink — Farmer Frontend Module (UI Prototype)

This update preserves the existing MilkLink React + TypeScript + Vite project and implements the full Farmer page sequence using a consistent green mobile-first PWA design.

## Pages and routes

| Page | Route |
|---|---|
| Farmer Dashboard | `/farmer` |
| My Milk Listings | `/farmer/listings` |
| Add Milk Listing | `/farmer/listings/new` |
| Milk Listing Details | `/farmer/listings/:id` |
| Edit Milk Listing | `/farmer/listings/:id/edit` |
| Incoming Orders | `/farmer/orders` |
| Farmer Order Detail | `/farmer/orders/:id` |
| Order History | `/farmer/history` |

The original 11 common/shared pages and the existing authentication UI are preserved.

## Run

```bash
npm install
npm run dev
```

Demo account:

- Email: `farmer@milklink.demo`
- Password: `Demo@123`

The role-based mock sign-in redirects to the farmer dashboard.

## Features implemented (frontend demo)

- Dashboard with live-calculated mock listing metrics and recent orders.
- Active/expired listing tabs and listing details.
- Create and edit listing forms with positive quantity/price and date range validation.
- Quantity, reserved amount, available balance and estimated price summaries.
- Order list and order details; accept/decline actions and local quantity checks.
- Completed order history with working month filters and calculated totals.
- Persistent demo records per account in browser `localStorage`.
- New/edited listings and order decisions added to the existing browser-local demo sync queue.
- Eight distinct optimized dairy-themed WebP images, one for each Farmer page.
- Responsive mobile and desktop layouts, unified Farmer bottom navigation.

## Prototype limitations

This is a **frontend UI prototype**. It is not connected to a live backend. Demo data is stored in browser `localStorage` and is not a production database. The sync queue is illustrative: real offline operation needs IndexedDB, operation idempotency, server-side conflict resolution and REST APIs. User authentication is mock-only and must be replaced by backend authentication before deployment. Stock reservation must ultimately be atomic on the backend. Sample figures and names are illustrative.

## Changed/new files

- `src/app/App.tsx` — Farmer routes
- `src/features/farmer/data.ts` — Farmer-specific mock types and sample records
- `src/features/farmer/pages/` — All eight Farmer screens
- `src/features/shared/components/NextUI.tsx` — Correct Farmer bottom navigation and submit support
- `src/features/shared/components/NextUI.css` — Farmer cards/forms/detail/timeline styles
- `public/images/farmer-*.webp` — Page-specific optimized visuals

## Validation performed

All TypeScript/TSX source files were parsed/transpiled with the system TypeScript compiler without syntax errors. The full `npm run build` could not be performed in the artifact environment because npm dependencies were not available there; run `npm install && npm run build` locally for a full typecheck and production bundling.
