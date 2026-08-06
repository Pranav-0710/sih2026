# 🏔️ Monastery360 — Digital Heritage Platform for Sikkim's Monasteries

<div align="center">

![SIH 2026](https://img.shields.io/badge/SIH_Internal_2026-orange?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=for-the-badge&logo=tailwindcss)

**A digital heritage platform for Sikkim's monasteries — 360° virtual tours, an AI monastery guide, and a crowdsourced conservation-reporting system that helps prioritize restoration.**

[Features](#-features) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [Project Structure](#-project-structure) · [Database Schema](#-database-schema) · [Environment Variables](#-environment-variables)

</div>

---

## 📋 Overview

**Monastery360** digitizes and showcases the monasteries of Sikkim for tourism and cultural preservation (SIH25061). It's built on a proven tourism-platform architecture (originally developed for SIH 2025's Jharkhand tourism problem statement) and repurposed toward a preservation-first pitch: real, verifiable pain points exist for Sikkim's monasteries — overtourism pressure on sites like Rumtek, remote and hard-to-monitor mountain locations, a shortage of trained conservators, and humidity damage to manuscripts and thangkas. Sikkim's own Department of Cultural Affairs & Heritage is already digitizing old photographs by hand in collaboration with ASI and INTACH — this platform scales up that work.

The centerpiece feature isn't the virtual tours — it's **crowdsourced condition reporting**: any visitor or local can submit a photo, geotag, and description of a monastery's condition, an AI model classifies its urgency in real time, and reports feed a severity-ranked dashboard for heritage authorities.

---

## ✨ Features

### 🕶️ Virtual Monastery Tours
- Immersive **Three.js**-powered 360° virtual tours of four flagship monasteries: **Rumtek** (Dharma Chakra Centre, Karma Kagyu seat), **Pemayangtse** (Nyingma, home to the Zangdok Palri), **Tashiding** (Sikkim's holiest monastery, Bumchu festival), and **Enchey** (Cham dances, Pang Lhabsol)
- Historically-sourced content (history, culture, geography, hotspots) for each site — see [`CREDITS.md`](./CREDITS.md) for sources and image attribution
- Interactive hotspots with facts and best-visit-time guidance

### 🚨 Crowdsourced Condition Reporting (centerpiece feature)
- Visitors and locals submit reports on monastery condition — photo, geotag, and description of damage, erosion, or overcrowding
- A Supabase Edge Function runs **AI zero-shot severity classification** (Hugging Face, `facebook/bart-large-mnli`) on submission, tagging each report `urgent structural damage` / `moderate wear` / `minor issue` / `no concern`
- Reports feed a live, severity-ranked **Conservation Priority Dashboard** for admins
- Persistent floating "Report a Condition Issue" button, accessible from every page

### 🤖 Kora — AI Monastery Guide
- Conversational AI (Hugging Face `Llama-3.3-70B-Instruct`, called server-side via a Supabase Edge Function — the API key never reaches the browser)
- Helps plan a self-guided Buddhist Circuit across the four monasteries based on budget, duration, and interests
- Grounded in real sourced facts about each site; explicitly declines to fabricate details it isn't confident about (e.g. current entry fees)

### 🏛️ Heritage Explorer
- Interactive hover-map of the four monasteries plotted on a real Sikkim location map, with marker positions computed from actual coordinates (see [`CREDITS.md`](./CREDITS.md) for the math)
- Historical significance, best visit times, and Wikipedia references per site
- Gamified quiz per monastery (Bronze/Silver/Gold badge mechanic; badge persistence is a known future-scope item — see below)

### 🆘 Emergency Services
- Real Gangtok/Sikkim emergency contacts: STNM Hospital, Sikkim Police Control Room, Pakyong Airport, Sikkim Tourist Information Centre
- **Leaflet**-ready map integration
- Persistent floating **SOS button** visible on every page except `/emergency`

### 🌐 Community & Social
- Post-based social feed: share experiences, photos, and location tags
- Like and comment system

### 🌤️ Weather Module
- Live weather conditions and forecasts via OpenWeatherMap
- Trip timing recommendations based on seasonal forecasts

### 🗺️ Transport & Navigation
- Local transport options with route planning, Leaflet-powered maps

### 📊 Conservation Priority Dashboard (Admin)
- Protected route (`/dashboard`), admin-only
- Live query against `condition_reports` — total reports, urgent count, severity breakdown, reports ranked by restoration priority
- No mock data — this is real, submitted-report data

### 🔐 Authentication & Internationalization
- Supabase Auth (email/password + Google OAuth), role-based access
- Multi-language support via **i18next** (English/Hindi), dark mode, accessibility font scaling

---

## 🚫 Explicitly Cut

The following features existed in the original Jharkhand-themed build and have been removed as out of scope for the preservation-focused pitch: **Bookings/Journey Hub** (hotel/tour booking — a tourism-transaction feature, not a preservation one), **GenZ Corner**, and **Funscapes** (8 mini-games — all deeply Jharkhand-content-specific; re-theming them was assessed as more work than the timeline allowed). Component code for these still exists in the repo as unrouted dead code rather than being deleted outright, so it can be revisited later.

---

## 🛠️ Tech Stack

### Frontend

| Category | Technology | Version |
|----------|-----------|---------|
| Core Framework | React | ^18.3.1 |
| Language | TypeScript | ^5.8.3 |
| Build Tool | Vite + SWC | ^5.4.20 |
| Routing | React Router DOM | ^6.30.1 |
| State & Data | TanStack React Query | ^5.83.0 |
| Forms | React Hook Form + Zod | ^7.61.1 / ^3.25.76 |

### Styling & UI

| Category | Technology |
|----------|-----------|
| CSS Framework | Tailwind CSS v3 |
| Component Library | Shadcn UI (Radix UI primitives) |
| Animations | Framer Motion + GSAP |
| Icons | Lucide React |
| Charts | Recharts |

### Backend & Infrastructure

| Category | Technology |
|----------|-----------|
| Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth (Email + Google OAuth) |
| Row Level Security | Supabase RLS Policies |
| Edge Functions | Supabase Functions (Deno) — `sentiment-analysis`, `classify-condition`, `trip-genie-chat` |
| Storage | Supabase Storage (`condition-reports` bucket for photo uploads) |

### AI & External APIs

| Category | Technology |
|----------|-----------|
| LLM / NLP | Hugging Face Inference API (chat completions + zero-shot classification), called server-side only |
| Mapping | Leaflet + React-Leaflet |
| Weather | OpenWeatherMap API |

### 3D & Immersive

| Category | Technology |
|----------|-----------|
| 3D Rendering | Three.js |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm**
- A [Supabase](https://supabase.com) project
- A [Hugging Face](https://huggingface.co) API token
- A weather API key (e.g., [OpenWeatherMap](https://openweathermap.org/api))

### 1. Clone the Repository

```bash
git clone https://github.com/Pranav-0710/sih2026.git
cd sih2026
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy `.env.example` to `.env` and fill in your own values. See that file for a full explanation of each variable, including which ones are safe to expose client-side and which must stay server-only.

> ⚠️ **Never commit your `.env` file.** It is already listed in `.gitignore`.

### 4. Apply Database Migrations

Run the SQL in `supabase/migrations/` from the Supabase Dashboard → SQL Editor (in order, by filename timestamp). The CLI's `supabase db push` requires a direct Postgres connection, which some networks block — the Dashboard SQL Editor is the more reliable path.

### 5. Deploy Edge Functions

```bash
npx supabase functions deploy sentiment-analysis --project-ref <your-project-ref>
npx supabase functions deploy classify-condition --project-ref <your-project-ref>
npx supabase functions deploy trip-genie-chat --project-ref <your-project-ref>
```

Set the `HUGGINGFACE_API_KEY` secret in Supabase (Dashboard → Edge Functions → Secrets) — this is separate from the deprecated `VITE_HUGGINGFACE_API_KEY` client variable.

### 6. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 7. Build for Production

```bash
npm run build
```

---

## 📁 Project Structure

```
new-sih/
├── public/
│   ├── vr-assets/                 # Monastery photography (see CREDITS.md)
│   ├── images/sikkim-map.svg      # Location map used by Heritage.tsx
│   └── locales/                   # i18next translation JSON (en, hi)
├── src/
│   ├── assets/                    # Site-wide static media (hero image, SOS icon)
│   ├── components/
│   │   ├── ui/                    # Shadcn UI primitives
│   │   ├── vr/                    # Three.js VR panorama engine (live tree — see note below)
│   │   ├── AdminRoute.tsx         # Protected route wrapper for admin pages
│   │   ├── AuthProvider.tsx       # Supabase auth context provider
│   │   ├── Navigation.tsx         # Top navigation bar
│   │   └── ...
│   ├── data/
│   │   └── monasteries.ts         # Sourced content for the 4 monasteries — single source of truth
│   ├── hooks/
│   │   ├── useAuth.ts             # Auth state; admin role is a hardcoded email allowlist (see file)
│   │   └── useWeather.ts
│   ├── integrations/supabase/     # Supabase client + generated types
│   ├── pages/
│   │   ├── Index.tsx              # Landing page (/)
│   │   ├── TripGenie.tsx          # Kora, AI Monastery Guide (/trip-genie)
│   │   ├── Heritage.tsx           # Heritage map explorer (/heritage)
│   │   ├── ReportCondition.tsx    # Condition report submission (/report-condition)
│   │   ├── Dashboard.tsx          # Conservation Priority Dashboard (/dashboard) [Admin]
│   │   ├── Community.tsx          # Community Feed (/community)
│   │   ├── Emergency.tsx          # Emergency Services (/emergency)
│   │   ├── VRExperience.tsx       # VR Tour (/vr-experience)
│   │   └── ...
│   ├── i18n.ts
│   └── App.tsx
├── supabase/
│   ├── config.toml
│   ├── functions/
│   │   ├── sentiment-analysis/    # Tourist review sentiment (positive/negative/neutral)
│   │   ├── classify-condition/    # Condition-report severity triage (zero-shot)
│   │   └── trip-genie-chat/       # AI monastery guide chat completions
│   └── migrations/
│       ├── 20250908161514_*.sql          # Original schema (profiles, heritage_sites, bookings, etc.)
│       ├── 20260806052334_condition_reports.sql
│       └── 20260806090000_condition_reports_storage_retry.sql
├── CREDITS.md                     # Image attribution + source citations
└── .env.example
```

> **Note on `src/components/vr/`**: there is a duplicated, dead sibling tree at `src/components/vr/components/` from earlier development. The live VR engine is `src/components/vr/` (imported by `VRExperience.tsx`) — the nested `components/` copy is unused and safe to delete as cleanup.

---

## 🗄️ Database Schema

### Tables

| Table | Description |
|-------|-------------|
| `profiles` | Extended user data, roles, preferences. Auto-created on signup. |
| `heritage_sites` | Original Jharkhand-era seed data (unused by current UI, left in place) |
| `condition_reports` | **Active** — crowdsourced monastery condition reports with AI severity classification |
| `community_posts` | User-generated posts with geo-tagging and social counters |
| `travel_packages`, `bookings`, `heritage_badges`, `reviews` | From the original schema; not currently queried by the live UI (Bookings feature is cut; badge persistence is future scope) |

### Security Model

All tables use **Row Level Security (RLS)**. For `condition_reports` specifically: public read, authenticated-only insert (with `reporter_id` required to match `auth.uid()` — verified to reject impersonation), admin-only status updates. The `condition-reports` storage bucket is public-read with authenticated-only upload.

---

## 🔐 Environment Variables

See [`.env.example`](./.env.example) for the full list with explanations. Key point: `VITE_`-prefixed variables are compiled into the client bundle and are extractable by anyone — only the Supabase anon key is safe there. The Hugging Face API key must be set as a Supabase Edge Function secret (`HUGGINGFACE_API_KEY`), **not** as a `VITE_` variable — both Kora and condition-report classification now call Hugging Face server-side for exactly this reason.

---

## 🌐 Application Routes

| Route | Page | Auth Required |
|-------|------|:---:|
| `/` | Landing Page | ❌ |
| `/auth` | Login / Register | ❌ |
| `/trip-genie` | AI Monastery Guide | ❌ |
| `/heritage` | Heritage Map Explorer | ❌ |
| `/report-condition` | Submit a Condition Report | ✅ |
| `/community` | Community Feed | ✅ |
| `/vr-experience` | 360° Virtual Tours | ❌ |
| `/emergency` | Emergency Services | ❌ |
| `/transport` | Transport & Navigation | ❌ |
| `/weather` | Weather Module | ❌ |
| `/explore` | Monastery Deep-Dives | ❌ |
| `/sentiment-analysis` | Feedback Analysis | 🔒 Admin |
| `/dashboard` | Conservation Priority Dashboard | 🔒 Admin |
| `/profile` | User Profile | ✅ |
| `/privacy`, `/terms`, `/cookies` | Legal pages | ❌ |

---

## 🧩 Key Architectural Decisions

### AI calls are server-side only
Both `classify-condition` and `trip-genie-chat` Edge Functions follow the same pattern established by `sentiment-analysis`: the Hugging Face API key lives in Supabase secrets, never in client code. This was a real vulnerability in the original build (Kora, then called TripGenie, called Hugging Face directly from the browser) — fixed and verified by confirming the token string is absent from the built `dist/` bundle.

### Admin access
`AdminRoute` gates `/dashboard`. Admin role is currently determined by a **hardcoded email allowlist** in `useAuth.ts` (documented in-file as a demo-only shortcut, not a production pattern) rather than the `profiles.user_type` database column.

### Floating action buttons
Two persistent floating buttons render at the layout level in `App.tsx`: SOS (links to `/emergency`) and Report Condition (links to `/report-condition`), each conditionally hidden only on its own destination page.

---

## 🧪 Available Scripts

```bash
npm run dev        # Start development server
npm run build       # Production build (does not run tsc — see note)
npm run build:dev   # Build in development mode (no minification)
npm run preview     # Preview production build locally
npm run lint        # Run ESLint
```

> `npm run build` does not run TypeScript's type checker — run `npx tsc --noEmit -p tsconfig.app.json` separately if you want type errors surfaced before shipping.

---

## 🔮 Future Scope

- [ ] **Heritage badge persistence** — the Bronze/Silver/Gold quiz mechanic currently exists as local component state only; `heritage_badges` table exists but nothing writes to it
- [ ] **Bookings-as-RSVP** — the problem statement's "Cultural Calendar: booking and participation options" bullet is better served by a trimmed festival/event RSVP feature than a full re-theme of the cut Bookings module
- [ ] **Digital archive + AI search** — a manuscript/mural archive with Hugging Face-powered search, extending the pattern already used for severity classification
- [ ] **Additional regional languages** — Nepali, Bhutia, Lepcha (technically cheap to add — i18next config is a shallow change)
- [ ] **True 360° panoramic capture** — current virtual tours use high-quality static photography; real panoramic capture of these specific monasteries wasn't available under an open license within the build timeline

---

## 📄 License

Built for an SRM internal hackathon reusing the SIH 2025 problem statement list (SIH25061), for educational and demonstration purposes.

---

<div align="center">
  <sub>Powered by React · Supabase · Hugging Face · Three.js</sub>
</div>
