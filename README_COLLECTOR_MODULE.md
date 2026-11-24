# MilkLink — Collector Module (5 Pages)

Implemented on top of the supplied `frontend(3).zip` React + TypeScript PWA.
The existing Common and Farmer pages have been preserved.

## Collector Screens

| Screen | Route | Functionality |
|---|---|---|
| Collector Dashboard | `/collector` | Greeting, pickup metrics, scheduled pickups, action to view assignments |
| Assigned Pickups | `/collector/pickups` | Search by farmer, buyer, area, district; filter All / Pending / Completed |
| Pickup Details | `/collector/pickups/:pickupId` | Farmer and buyer, amount, date, contact, status, record action |
| Record Collection | `/collector/collect/:pickupId` | Enter actual litres, add notes, calculate final amount, confirm |
| Collection History | `/collector/history` | Completed pickups, collected litres, cash amounts and totals |

Additional route `/collector/collect` opens the next pending pickup when one is available.

## Images

Five individually generated images, all optimized to WebP:

- `public/images/collector-dashboard-hero.webp`
- `public/images/collector-assigned-pickups.webp`
- `public/images/collector-pickup-details.webp`
- `public/images/collector-record-collection.webp`
- `public/images/collector-history.webp`

The static visual preview `COLLECTOR_UI_REFERENCE.html` is included. It is **not** the live React app.

## Mock interaction

- Collector sign-in: `collector@milklink.demo` / `Demo@123`
- Open Assigned Pickups, choose a pending order, then Record Collection.
- Enter the collected quantity; the final amount uses `actual collected litres × price per litre`.
- Confirm Collection: the pickup updates to Completed, the history totals update, and a `pending` collection operation is added to the shared Sync Center.
- Data is stored in browser `localStorage` for prototype purposes.

## Important limitation

This is an interactive **frontend prototype with mock data**, not a live collection system.
The Sync Center provides a local queue UI simulation. It does not transmit to a backend or implement the proposal's full IndexedDB/service-worker synchronization pipeline. The prototype does not perform live route optimization or GPS vehicle tracking.

## Run

```bash
npm install
npm run dev
```

Open the Vite URL. On mobile, the Collector screens use the purple theme and fixed bottom navigation. On desktop, they use a responsive split layout.

## Verification performed

- Checked source files for TypeScript/TSX syntax errors.
- Checked 143 relative imports for path resolution.
- Tested mock pickup completion and recalculation of History totals.
- Verified that all five generated collector images are present and uniquely named.
- Full `npm run build` was not verified because the environment could not download required npm packages.
