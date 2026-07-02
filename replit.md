# Cosmic Age

A premium astronomy mobile app that helps users understand their life in the context of the universe. Enter your date of birth and explore detailed statistics across Earth time, planetary ages, cosmic distances, and the 13.8-billion-year timeline of the universe.

## Run & Operate

- `pnpm --filter @workspace/cosmic-age run dev` — run the Expo dev server (scanned via QR code in Expo Go)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Mobile: Expo SDK 54 + Expo Router (file-based routing)
- UI: React Native + expo-linear-gradient + expo-blur
- State: React Context + AsyncStorage (offline-first, no backend needed)
- Icons: @expo/vector-icons (Feather + MaterialCommunityIcons)
- API: Express 5 (shared backend, not used by Cosmic Age)

## Where things live

- `artifacts/cosmic-age/` — Expo mobile app (the main product)
  - `app/onboarding.tsx` — First-launch user setup (name, DOB)
  - `app/(tabs)/` — 5-tab navigation: Home, Planets, Journey, Timeline, Profile
  - `context/UserContext.tsx` — User profile + 1-second tick for live counter
  - `utils/calculations.ts` — All astronomical calculation engine
  - `constants/cosmic.ts` — Scientific constants (NASA/IAU standards), planet data, space events
  - `components/SpaceBackground.tsx` — Animated twinkling star field
  - `components/CosmicCard.tsx` — Glassmorphism card component
- `artifacts/api-server/` — Express API server (not used in current Cosmic Age build)

## Architecture decisions

- **Offline-first, no backend:** All calculations run client-side using scientific constants. No server required for any feature. Data stored in AsyncStorage.
- **Navigation guard:** `_layout.tsx` uses a `NavigationGuard` component to redirect unauthenticated users to onboarding without a flash.
- **1-second tick in context:** `UserContext` runs a `setInterval` at 1s to update `now`, feeding the live counter. All time-dependent calculations receive `now` as a parameter so they're purely functional and testable.
- **Dark theme only:** Both `light` and `dark` palettes in `constants/colors.ts` use identical space-dark colors since this is always a dark app.
- **DOB validation:** Onboarding uses strict round-trip validation (Date re-parse check) to catch impossible dates like Feb 31.

## Product

- Live age counter updating every second (years, months, days, hours, minutes, seconds)
- Planetary ages on all 9 planets/dwarf planets with next birthday countdown
- Space distance traveled: Earth orbit, galactic journey, light travel stats
- Big Bang timeline + Carl Sagan Cosmic Calendar position
- Chronological space events history with user's age at each event
- Human body statistics (heartbeats, breaths, sleep, meals)
- Cosmic comparisons and daily rotating facts
- Profile screen with shareable cosmic identity card

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Do NOT run `npx expo start` directly — use the workflow restart tool
- Do NOT create `app.config.ts` — must use static `app.json` for Expo Launch compatibility
- Hot module reloading is enabled; restart the workflow only for dependency changes or Metro crashes
