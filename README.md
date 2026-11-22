# MilkLink Frontend

React + TypeScript + Vite scaffold matching the supplied project structure.

## Run

```sh
npm install
npm run dev
```

## Verify

```sh
npm run build
npm run lint
```

The app opens the reference-inspired MilkLink login page, with a generated farm illustration, responsive layout, role selection, password visibility toggle, and native required-field validation. Login, recovery, and account creation display informational messages until their services/pages are connected. Other page files, shared modules, and tests remain placeholders. Authentication, API calls, offline sync, and PWA functionality are not implemented.

The generated illustration is saved at `public/images/login-farm.png`. See `public/images/login-farm.prompt.txt` for its generation prompt. It was generated with the built-in image generation tool.

## First six common screens (UI prototype)

The six pages below have been implemented with responsive layouts, independently generated dairy imagery, client-side navigation and sample/demo registration and login.

| Screen | Route |
|---|---|
| Welcome | `/` |
| Login | `/login` |
| Select role | `/register` |
| Farmer registration | `/register/farmer` |
| Buyer registration | `/register/buyer` |
| Collector registration | `/register/collector` |

**Run:** `npm install` then `npm run dev` (Vite dev server). **Build:** `npm run build`.

**Demo accounts:** `farmer@milklink.demo`, `buyer@milklink.demo`, `collector@milklink.demo`, `admin@milklink.demo` with password `Demo@123`. Click the corresponding role button on the login page to autofill. Demo accounts are fictitious.

**Functional demonstration:** Registration validates role-specific fields, Sri Lankan phone numbers, password length/match, and required checkboxes. New demo profiles are saved in browser `localStorage` with a per-account salted SHA-256 password digest for this UI demo only (NOT production authentication); the current demo session is saved in `sessionStorage`. Login navigates to a clearly labelled dashboard placeholder for its role. No real backend, OTP/SMS, push notifications, online payments, or production authentication is connected. Replace `src/features/auth/components/mockAuth.ts` with a secure REST/JWT server-side implementation before production.

**Assets:** `public/images/{welcome-pasture,login-milk,roles-smartphone,farmer-registration,buyer-registration,collector-registration}.webp` are individually cropped from a newly generated six-scene montage; different pages display different visuals.

Other project modules from the source ZIP are retained as provided, but their existing placeholder pages have not been implemented in this six-page phase.

## Phase 2 — Screens 07–12 (implemented)

The next six screens have been added to the original first-six project without replacing the existing authentication screens. All use the MilkLink mobile-first rounded-card design language, with **six different image-generation assets**.

| # | Screen | Route | Implemented behavior |
|---|---|---|---|
| 07 | My Profile | `/app/profile` | View/edit name, contact, district and farm/business details; browser-local persistence; links to shared tools |
| 08 | Location Setup | `/app/location` | GPS permission request, manual district fallback, location privacy explanation, local save |
| 09 | Offline Sync Center | `/app/sync` | Mock queue, online/offline indicator, retry / simulate sync, locally persisted statuses |
| 10 | Sync Conflict Detail | `/app/sync/conflicts/sync-102` | Side-by-side local/server sample values; local demo conflict choice |
| 11 | Install PWA | `/install` | Install instructions, browser `beforeinstallprompt` handling, a PWA manifest and static app-shell service worker |
| 12 | Farmer Dashboard | `/farmer` | Dashboard metrics, activity lists, mock incoming orders, local demo Add Listing form, shared page links |

### Getting to the new pages

1. Run `npm install` and `npm run dev`.
2. Login with `farmer@milklink.demo` and `Demo@123`.
3. The farmer dashboard opens automatically. From there, open Profile, GPS Location, Sync Center and Install PWA. Conflict Detail is reachable from the Sync Center's **Review** action.
4. Other demo roles can access shared screens from their dashboard quick links.

### Demo limitations

- This is a **frontend-only prototype**. Accounts, profiles, locations, listings and the sync queue are simulated with browser storage. No real server orders, cash payments or farmer–buyer matching yet.
- **Sync Now / Retry / Conflict resolution** buttons update **local demo records only**. They do not transmit data to a backend or resolve a real remote conflict. Real IndexedDB outbox, REST sync and server-side validation remain to be integrated.
- The Location Setup page requests real browser geolocation when permission is granted, but its visual image is illustrative, **not a live map**. Exact location visibility must ultimately be enforced by backend authorization.
- The PWA installation helper uses the actual supported browser install prompt where available; a minimal static app-shell service worker and icon manifest are included. This does not yet make offline order actions work.
- `design-preview-next-six/index.html` is an **offline-viewable static visual preview**. The React screens are implemented in the source modules listed above.

### Generated assets

`public/images/profile-farmer.webp`, `location-landscape.webp`, `offline-sync.webp`, `sync-conflict.webp`, `install-pwa.webp`, `farmer-dashboard.webp` are individually cropped from six different scenes of an AI-generated collage. Each screen has its own image.
