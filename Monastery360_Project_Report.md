---
title: "Monastery360 — Detailed Project Report"
subtitle: "Digital Heritage Platform for Sikkim's Monasteries"
author: "SIH Internal Hackathon 2026 | SRM Ramapuram"
date: "August 2026"
---

<div style="text-align: center; padding: 60px 0;">

# 🏔️ Monastery360

## Digital Heritage Platform for Sikkim's Monasteries

**SIH Internal Hackathon 2026 — SRM Ramapuram**

*Problem Statement: SIH25061 — "Digitize and Showcase Monasteries of Sikkim for Tourism and Cultural Preservation"*

*Department: Government of Sikkim | Theme: Travel & Tourism (Software)*

---

**Team Project Report**

**August 2026**

</div>

---

<div style="page-break-after: always;"></div>

# Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement & Pain Points](#2-problem-statement--pain-points)
3. [Solution Overview](#3-solution-overview)
4. [Key Features](#4-key-features)
5. [Technology Stack](#5-technology-stack)
6. [System Architecture](#6-system-architecture)
7. [Database Schema & Security](#7-database-schema--security)
8. [AI & Machine Learning Pipeline](#8-ai--machine-learning-pipeline)
9. [The Four Monasteries — Content & Data](#9-the-four-monasteries--content--data)
10. [Application Routes & Navigation](#10-application-routes--navigation)
11. [Project Structure](#11-project-structure)
12. [Edge Functions (Serverless Backend)](#12-edge-functions-serverless-backend)
13. [Security Architecture](#13-security-architecture)
14. [UI/UX Design Philosophy](#14-uiux-design-philosophy)
15. [Deployment & Infrastructure](#15-deployment--infrastructure)
16. [Future Scope](#16-future-scope)
17. [Credits & Attribution](#17-credits--attribution)

---

<div style="page-break-after: always;"></div>

# 1. Executive Summary

**Monastery360** is a digital heritage platform purpose-built to digitize, showcase, and help preserve the monasteries of Sikkim. It addresses the Government of Sikkim's SIH25061 problem statement, which calls for a technology solution to promote Sikkim's monastic heritage for tourism while simultaneously supporting cultural preservation.

The platform goes beyond a standard tourism website. Its **centerpiece feature** is a **crowdsourced condition-reporting system**: any visitor or local can submit a photographic report on a monastery's physical condition — damage, erosion, overcrowding — and an AI model classifies the report's urgency in real time. These reports feed a severity-ranked **Conservation Priority Dashboard** that heritage authorities can use to prioritize restoration work.

Alongside this, the platform provides:
- **360° Virtual Tours** of four flagship monasteries powered by Three.js
- **Kora — an AI Monastery Guide** (LLM-powered conversational assistant)
- **Heritage Explorer** with an interactive map and gamified quizzes
- **Community Feed** for sharing experiences
- **Emergency Services** directory with real Sikkim contacts
- **Weather Module** for trip planning
- **Digital Archive** of 87 openly-licensed monastery photographs from Wikimedia Commons

The platform is built on a modern stack: **React 18 + TypeScript + Vite** on the frontend, **Supabase** (PostgreSQL + Auth + Edge Functions + Storage) on the backend, **Hugging Face Inference API** for AI capabilities, and **Three.js** for immersive 3D experiences.

---

<div style="page-break-after: always;"></div>

# 2. Problem Statement & Pain Points

## 2.1 The Official Problem Statement

> **SIH25061** — *"Digitize and Showcase Monasteries of Sikkim for Tourism and Cultural Preservation"*
>
> — Government of Sikkim, Travel & Tourism theme

## 2.2 Real-World Pain Points

Sikkim's monasteries face several concrete, verifiable challenges:

| Pain Point | Details |
|---|---|
| **Overtourism pressure** | Sites like Rumtek Monastery and Tsomgo Lake experience high foot traffic that strains fragile heritage structures. |
| **Remote, hard-to-monitor locations** | Most monasteries sit in mountainous terrain at 1,500–2,100m elevation, making physical inspection difficult and infrequent. |
| **Shortage of trained conservators** | Specialized heritage conservators are scarce in the region. |
| **Environmental damage** | Humidity, monsoon rains, and seismic activity cause water damage to centuries-old murals, manuscripts, and thangka paintings. |
| **Manual digitization efforts** | Sikkim's Department of Cultural Affairs & Heritage is already digitizing old photographs by hand in collaboration with ASI and INTACH — our platform scales up that work. |

## 2.3 Why This Matters

The monasteries of Sikkim are not museum exhibits — they are **living religious institutions**, some dating back to the 17th century. Rumtek serves as the principal seat of the Karma Kagyu lineage outside Tibet. Tashiding is considered the holiest monastery in all of Sikkim. Pemayangtse once held authority over every Nyingma monastery in the state. Preserving these sites preserves a living Buddhist heritage.

---

<div style="page-break-after: always;"></div>

# 3. Solution Overview

Monastery360 addresses the problem statement through three pillars:

## Pillar 1: Digitize — Virtual Access to Inaccessible Heritage
- **360° virtual tours** allow anyone worldwide to explore these monasteries without physical travel
- A **digital archive** of 87 openly-licensed photographs preserves visual records
- Historically-sourced educational content for each monastery

## Pillar 2: Showcase — AI-Powered Tourism Experience
- **Kora (AI Monastery Guide)** helps visitors plan a self-guided Buddhist Circuit
- **Heritage Explorer** with interactive Sikkim map and gamified quizzes
- **Weather, transport, and emergency** modules for practical trip planning

## Pillar 3: Preserve — Crowdsourced Conservation Intelligence
- **Condition Reporting** — visitors submit photo + geotag + description of issues
- **AI Severity Classification** — zero-shot NLP model (facebook/bart-large-mnli) classifies each report as "urgent structural damage", "moderate wear", "minor issue", or "no concern"
- **Conservation Priority Dashboard** — admin-only view ranking all reports by severity, enabling data-driven restoration prioritization

### What Makes This Different

The crowdsourced condition-reporting system transforms every monastery visitor into a **volunteer surveyor**. Instead of relying solely on infrequent professional inspections, heritage authorities gain a continuous stream of on-the-ground observations, triaged by AI in real time. This is the feature that turns a tourism platform into a **preservation tool**.

---

<div style="page-break-after: always;"></div>

# 4. Key Features

## 4.1 🚨 Crowdsourced Condition Reporting (Centerpiece Feature)

| Aspect | Implementation |
|---|---|
| **User Input** | Monastery selection, free-text description (min 10 chars), optional photo upload, optional GPS geotag |
| **Photo Storage** | Supabase Storage bucket (condition-reports), public-read, authenticated-upload |
| **AI Classification** | Supabase Edge Function classify-condition calls Hugging Face zero-shot (facebook/bart-large-mnli) |
| **Severity Labels** | urgent structural damage · moderate wear · minor issue · no concern |
| **Confidence Score** | Displayed as a percentage alongside the severity label |
| **Persistence** | PostgreSQL condition_reports table with RLS (public read, authenticated insert, admin update) |
| **Admin View** | Conservation Priority Dashboard at /dashboard — reports ranked by severity, with charts |
| **Access Control** | Floating "Report" button visible on every page; submission requires authentication |

### Flow:
1. Visitor spots damage → taps persistent floating button → fills in form
2. Photo uploaded to Supabase Storage → report inserted into condition_reports
3. Edge Function classify-condition invoked → Hugging Face classifies severity
4. Result persisted back to the database → appears on admin dashboard immediately

## 4.2 🕶️ Virtual Monastery Tours

- **Engine**: Three.js rendering panoramic images onto a sphere with drag-to-look
- **Alternate Mode**: Blockade Labs AI-generated skyboxes embedded via iframe (labeled as "artistic impressions", never presented as photographs)
- **Monasteries**: Rumtek, Pemayangtse, Tashiding, Enchey
- **Content**: Interactive hotspots with historical facts, cultural details, best visit times
- **Audio Tracks**: Curated audio guide entries per monastery (intro, history, culture)

## 4.3 🤖 Kora — AI Monastery Guide

- **Model**: Meta Llama-3.3-70B-Instruct via Hugging Face router endpoint
- **Architecture**: Conversational AI called server-side via Supabase Edge Function (trip-genie-chat) — API key never reaches the browser
- **Capabilities**:
  - Plans a self-guided Buddhist Circuit based on budget, duration, and interests
  - Answers questions about monastery history, architecture, festivals, etiquette
  - Grounded in real, sourced facts about each site
  - Explicitly declines to fabricate details it isn't confident about
- **Streaming**: Token-by-token streaming via SSE-to-plaintext passthrough, with fallback to JSON mode
- **Preferences Panel**: Budget range, duration, interests (selectable tags), preferred area

## 4.4 🏛️ Heritage Explorer

- **Interactive Map**: Hover-enabled map of Sikkim with monastery markers computed from real coordinates
- **Map Source**: Wikimedia Commons Sikkim location map (CC BY-SA 4.0)
- **Coordinate Math**: Markers positioned using left% = (lon - 87.95) / (88.93 - 87.95) x 100 and top% = (28.14 - lat) / (28.14 - 27.03) x 100
- **Gamified Quizzes**: Bronze/Silver/Gold badge mechanic per monastery (2 questions each)
- **Content**: Historical significance, best visit times, Wikipedia references

## 4.5 🆘 Emergency Services

- **Real contacts**: STNM Hospital (Gangtok), Sikkim Police Control Room, Pakyong Airport, Sikkim Tourist Information Centre
- **Leaflet-ready** map integration
- **Persistent SOS button**: Floating icon visible on every page except /emergency

## 4.6 🌐 Community & Social

- Post-based social feed: share experiences, photos, and location tags
- Like and comment system
- Powered by Supabase community_posts table with RLS

## 4.7 🌤️ Weather Module

- Live weather conditions and forecasts via OpenWeatherMap API
- Trip timing recommendations based on seasonal data

## 4.8 📚 Digital Archive

- **87 photographs** from Wikimedia Commons (Enchey: 38, Tashiding: 28, Pemayangtse: 16, Rumtek: 5)
- All openly licensed (CC BY, CC BY-SA, CC0)
- Author and licence metadata displayed on every card
- Links back to source pages on Commons
- Generated via gen-archive.mjs from live Commons metadata — regeneratable as new material is released

## 4.9 📊 Conservation Priority Dashboard (Admin)

- Protected route (/dashboard), admin-only access
- **KPIs**: Total reports, urgent count, monasteries reported, awaiting classification
- **Charts**: Pie chart by severity, bar chart by monastery (Recharts)
- **Table**: All reports ranked by restoration priority (severity-first, then recency)
- **Real data only**: No mock data — all content comes from actual submitted reports

## 4.10 🔐 Authentication & Internationalization

- **Auth**: Supabase Auth with email/password + Google OAuth
- **Roles**: Tourist, local guide, agency, admin
- **Admin gating**: AdminRoute component; admin role currently determined by hardcoded email allowlist in useAuth.ts
- **i18n**: English/Hindi via i18next with browser language detection
- **Theming**: Dark mode (default "Lamplight" art direction), light mode (warm parchment)
- **Accessibility**: Font size scaling

## 4.11 🎮 Additional Features

| Feature | Route | Status |
|---|---|---|
| Sentiment Analysis | /sentiment-analysis | Admin-only, server-side NLP on tourist reviews |
| Cultural Calendar | /calendar | Festival and event calendar |
| Transport & Navigation | /transport | Local transport options with Leaflet maps |
| Games (Funscapes) | /games | From original build; exists as deprioritized feature |

---

<div style="page-break-after: always;"></div>

# 5. Technology Stack

## 5.1 Frontend

| Category | Technology | Version | Purpose |
|---|---|---|---|
| Core Framework | React | ^18.3.1 | Component-based UI |
| Language | TypeScript | ^5.8.3 | Type safety |
| Build Tool | Vite + SWC | ^5.4.20 | Fast HMR, optimized builds |
| Routing | React Router DOM | ^6.30.1 | Client-side routing with lazy loading |
| State & Data | TanStack React Query | ^5.83.0 | Server state management, caching |
| Forms | React Hook Form + Zod | ^7.61.1 / ^3.25.76 | Form state + schema validation |

## 5.2 Styling & UI

| Category | Technology | Purpose |
|---|---|---|
| CSS Framework | Tailwind CSS v3 | Utility-first styling |
| Component Library | Shadcn UI (Radix Primitives) | Accessible, composable UI components |
| Animations | Framer Motion + GSAP | Page transitions, scroll reveals, micro-animations |
| Icons | Lucide React | Consistent icon set |
| Charts | Recharts | Dashboard visualizations (pie, bar) |

## 5.3 Backend & Infrastructure

| Category | Technology | Purpose |
|---|---|---|
| Database | Supabase (PostgreSQL) | Relational data, RLS policies |
| Authentication | Supabase Auth | Email + Google OAuth, JWT sessions |
| Row Level Security | Supabase RLS | Per-table access control |
| Edge Functions | Supabase Functions (Deno) | Serverless backend (3 functions + 1 archive search) |
| Storage | Supabase Storage | Photo uploads for condition reports |

## 5.4 AI & External APIs

| Category | Technology | Purpose |
|---|---|---|
| LLM (Chat) | Llama-3.3-70B-Instruct (via HF) | Kora AI guide — conversational monastery Q&A |
| NLP (Classification) | facebook/bart-large-mnli (via HF) | Zero-shot severity classification of condition reports |
| NLP (Sentiment) | Hugging Face Inference | Tourist review sentiment analysis |
| Mapping | Leaflet | Emergency and transport maps |
| Weather | OpenWeatherMap API | Live weather and forecasts |

## 5.5 3D & Immersive

| Category | Technology | Purpose |
|---|---|---|
| 3D Rendering | Three.js | Panoramic 360 degree sphere rendering with drag-to-look |
| Skyboxes | Blockade Labs Skybox AI | AI-generated artistic impressions (labeled as such) |

---

<div style="page-break-after: always;"></div>

# 6. System Architecture

```
+-------------------------------------------------------------+
|                        BROWSER (Client)                     |
|  +-------------+  +-------------+  +---------------------+ |
|  |  React 18   |  |  Three.js   |  |  Supabase Client    | |
|  |  + Router   |  |  VR Engine  |  |  (Auth + Realtime)  | |
|  +------+------+  +------+------+  +----------+----------+ |
+---------+----------------+---------------------+------------+
          |                |                     |
          |                |    +----------------+
          |                |    |                |
+---------+----------------+----+----------------+------------+
|         |     SUPABASE   |    |                |            |
|  +------v------+  +------v----v-+  +-----------v----------+ |
|  |  PostgreSQL |  |  Edge       |  |  Supabase Auth       | |
|  |  + RLS      |  |  Functions  |  |  (Email + Google)    | |
|  |             |  |             |  |                      | |
|  | - profiles  |  | - classify  |  |  JWT Token           | |
|  | - condition |  |   condition |  |  |                   | |
|  |   _reports  |  | - trip-     |  |  RLS Policy Check    | |
|  | - community |  |   genie-   |  +----------------------+ |
|  |   _posts    |  |   chat     |                           |
|  | - heritage  |  | - sentiment|  +----------------------+ |
|  |   _sites    |  |   analysis |  |  Supabase Storage    | |
|  |             |  | - archive- |  |  (condition-reports  | |
|  |             |  |   search   |  |   bucket)            | |
|  +-------------+  +------+-----+  +----------------------+ |
+---------------------------+----------------------------------+
                            |
               +------------+------------+
               |            |            |
      +--------v---+ +------v-----+ +---v----------+
      | Hugging    | | OpenWeather| | Wikimedia    |
      | Face API   | | Map API    | | Commons API  |
      |            | |            | |              |
      | - Llama-3.3| | - Weather  | | - Archive    |
      | - BART-MNLI| | - Forecast | |   metadata   |
      +------------+ +------------+ +--------------+
```

### Key Architectural Decisions

1. **AI calls are server-side only**: Both classify-condition and trip-genie-chat Edge Functions call Hugging Face using a secret stored in Supabase — the API key never appears in the client bundle. This was a security fix over the original build.

2. **Lazy-loaded routes**: All pages except the landing page are code-split via React.lazy(), keeping the initial bundle small.

3. **Streaming AI responses**: Kora streams token-by-token via a custom SSE-to-plaintext passthrough in the Edge Function, with automatic fallback to JSON mode.

4. **Row Level Security everywhere**: Every database table has RLS policies. The classify-condition function uses a two-client pattern to verify the caller's identity before persisting results.

---

<div style="page-break-after: always;"></div>

# 7. Database Schema & Security

## 7.1 Tables

| Table | Description | Status |
|---|---|---|
| profiles | Extended user data, roles, preferences. Auto-created on signup via trigger. | **Active** |
| condition_reports | Crowdsourced monastery condition reports with AI severity classification. | **Active — Centerpiece** |
| community_posts | User-generated posts with geo-tagging and social counters. | **Active** |
| heritage_sites | Original Jharkhand-era seed data. | Legacy (unused by current UI) |
| travel_packages | Travel package listings. | Legacy |
| bookings | Booking records. | Legacy (feature cut) |
| heritage_badges | Quiz badge records. | Schema exists; writes not yet implemented |
| reviews | Tourist reviews. | Legacy |

## 7.2 condition_reports Table (Core Schema)

```sql
CREATE TABLE condition_reports (
    id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    monastery_id  TEXT NOT NULL,
    monastery_name TEXT NOT NULL,
    description   TEXT NOT NULL,
    photo_url     TEXT,
    lat           DOUBLE PRECISION,
    lon           DOUBLE PRECISION,
    severity      TEXT,                    -- AI-classified
    severity_confidence DOUBLE PRECISION,  -- 0.0 to 1.0
    reporter_id   UUID NOT NULL REFERENCES auth.users(id),
    status        TEXT DEFAULT 'pending',
    created_at    TIMESTAMPTZ DEFAULT now()
);
```

## 7.3 Row Level Security Policies

### condition_reports

| Policy | Effect | Rule |
|---|---|---|
| Public read | SELECT for all | true |
| Authenticated insert | INSERT for authenticated users | reporter_id = auth.uid() (prevents impersonation) |
| Admin-only update | UPDATE for admin role | Role-checked |

### condition-reports Storage Bucket

| Access | Rule |
|---|---|
| Public read | Anyone can view uploaded photos |
| Authenticated upload | Only logged-in users can upload |

---

<div style="page-break-after: always;"></div>

# 8. AI & Machine Learning Pipeline

## 8.1 Condition Report Classification

```
User submits report
       |
       v
+------------------+
| classify-condition| (Supabase Edge Function, Deno runtime)
|                  |
|  1. Validate input (description required, max 1000 chars)
|  2. Call Hugging Face zero-shot classification:
|     Model:  facebook/bart-large-mnli
|     URL:    router.huggingface.co/hf-inference/models/facebook/bart-large-mnli
|     Labels: ["urgent structural damage", "moderate wear",
|              "minor issue", "no concern"]
|  3. Extract top-scoring label + confidence
|  4. Verify caller identity (JWT -> auth.getUser())
|  5. Persist severity to condition_reports
|     (scoped to reporter_id = caller's user.id)
|  6. Return { severity, confidence } to client
+------------------+
```

### Security Model for Persistence
The Edge Function uses **two Supabase clients**:
1. **Caller client** (anon key + caller's JWT): Verifies the authenticated user
2. **Service-role client** (bypasses RLS): Performs the update, but scoped to reporter_id = user.id

This prevents any client from overwriting another user's report severity.

## 8.2 Kora — AI Monastery Guide

```
User sends message
       |
       v
+------------------+
| trip-genie-chat   | (Supabase Edge Function, Deno runtime)
|                  |
|  1. Validate input (message required, max 2000 chars)
|  2. Build system prompt with:
|     - Monastery knowledge base (4 sites)
|     - User's travel preferences
|     - Behavioral guidelines (grounded, honest, respectful)
|  3. Assemble message history (max 12 prior messages)
|  4. Call Hugging Face chat completions:
|     Model:  meta-llama/Llama-3.3-70B-Instruct
|     URL:    router.huggingface.co/v1/chat/completions
|  5. Stream or return response:
|     - Stream mode: SSE -> plaintext passthrough
|     - JSON mode: { success: true, reply: "..." }
+------------------+
```

## 8.3 Sentiment Analysis

- **Function**: sentiment-analysis
- **Purpose**: Classifies tourist reviews as positive/negative/neutral
- **Access**: Admin-only page at /sentiment-analysis
- **Pattern**: Same server-side Hugging Face call pattern as condition classification

---

<div style="page-break-after: always;"></div>

# 9. The Four Monasteries — Content & Data

All monastery content is sourced from Wikipedia, Incredible India, and Sikkim tourism references. See CREDITS.md for full attribution.

## 9.1 Rumtek Monastery (Dharma Chakra Centre)

| Attribute | Details |
|---|---|
| **Order** | Karma Kagyu |
| **Founded** | Originally 1734 (9th Karmapa); rebuilt 1959-1966 (16th Karmapa) |
| **Location** | East Sikkim, ~24 km from Gangtok, ~1,550m elevation |
| **Significance** | Principal seat of the Karma Kagyu lineage outside Tibet |
| **Key Features** | Golden Stupa (16th Karmapa's relics), Cham dance courtyard |
| **Best Time** | February-March (Losar festival) |
| **Coordinates** | 27.28861 N, 88.56139 E |

## 9.2 Pemayangtse Monastery

| Attribute | Details |
|---|---|
| **Order** | Nyingma (oldest school of Tibetan Buddhism) |
| **Founded** | ~1650 (as shrine); 1705 (formal establishment) |
| **Location** | West Sikkim, near Pelling, ~2,085m elevation |
| **Significance** | Head of all Nyingma monasteries in Sikkim |
| **Key Features** | Zangdok Palri (seven-tiered wooden celestial palace), Rabdentse ruins viewpoint |
| **Best Time** | Early morning for Kanchenjunga views |
| **Coordinates** | 27.30444 N, 88.25278 E |

## 9.3 Tashiding Monastery

| Attribute | Details |
|---|---|
| **Order** | Nyingma |
| **Founded** | 1641 |
| **Location** | West Sikkim, at confluence of Rathong and Rangeet rivers |
| **Significance** | Widely held as the holiest monastery in Sikkim |
| **Key Features** | Thongwa Rangdrol chorten ("saviour by mere sight"), Bumchu festival, mani stone slabs |
| **Best Time** | Post-monsoon; Bumchu festival (Tibetan 1st month, 14th-15th day) |
| **Coordinates** | 27.30833 N, 88.29806 E |

## 9.4 Enchey Monastery

| Attribute | Details |
|---|---|
| **Order** | Nyingma |
| **Founded** | 1909 (present building; hermitage by Lama Druptob Karpo predates) |
| **Location** | East Sikkim, ~3 km NE of Gangtok, ~1,800m elevation |
| **Significance** | Known for Cham dances and Pang Lhabsol (honouring Kanchenjunga) |
| **Key Features** | Chinese pagoda-style architecture, pine forest ridge setting |
| **Best Time** | October-December for clear views; Dec-Jan for Cham festival |
| **Coordinates** | 27.33583 N, 88.61917 E |

---

<div style="page-break-after: always;"></div>

# 10. Application Routes & Navigation

| Route | Page | Auth | Description |
|---|---|---|---|
| / | Landing Page | No | Hero carousel, features, monastery showcase, Kora preview |
| /auth | Login / Register | No | Email/password + Google OAuth |
| /trip-genie | Kora — AI Guide | No | Conversational AI monastery guide |
| /heritage | Heritage Explorer | No | Interactive map, monastery details, quizzes |
| /report-condition | Condition Report | Yes | Submit crowdsourced reports |
| /community | Community Feed | Yes | User posts, likes, comments |
| /vr-experience | Virtual Tours | No | 360 degree panoramic monastery tours |
| /emergency | Emergency Services | No | Real Sikkim emergency contacts |
| /weather | Weather Module | No | Live weather + forecasts |
| /explore | Monastery Deep-Dives | No | Detailed monastery pages |
| /archive | Digital Archive | No | 87 photographs from Wikimedia Commons |
| /calendar | Cultural Calendar | No | Festival and event calendar |
| /games | Games (Funscapes) | No | Gamified learning |
| /dashboard | Conservation Dashboard | Admin | Priority-ranked condition reports |
| /sentiment-analysis | Feedback Analysis | Admin | AI sentiment analysis on reviews |
| /profile | User Profile | Yes | Account settings |
| /privacy, /terms, /cookies | Legal Pages | No | Policy documents |

### Persistent Floating Buttons
Two floating action buttons render at the layout level in App.tsx:
1. **SOS** (bottom-right) — links to /emergency, hidden only on that page
2. **Report Condition** (bottom-right, offset) — links to /report-condition, hidden on its own page and /emergency

---

<div style="page-break-after: always;"></div>

# 11. Project Structure

```
sih2026/
├── public/
│   ├── vr-assets/               # Monastery photography + video (CC-licensed)
│   ├── images/sikkim-map.svg    # Location map for Heritage page
│   └── locales/                 # i18next translation JSON (en, hi)
│
├── src/
│   ├── assets/                  # Site-wide static media (hero image, SOS icon)
│   ├── components/
│   │   ├── ui/                  # Shadcn UI primitives (30+ components)
│   │   ├── vr/                  # Three.js VR panorama engine
│   │   ├── games/               # Funscapes mini-games
│   │   ├── AdminRoute.tsx       # Protected route wrapper for admin pages
│   │   ├── AuthProvider.tsx     # Supabase auth context
│   │   ├── Navigation.tsx       # Top navigation bar
│   │   ├── HeroSection.tsx      # Landing page hero
│   │   ├── FeaturesSection.tsx  # Features grid
│   │   ├── MonasteryShowcase.tsx # Monastery cards
│   │   ├── ScrollReveal.tsx     # Intersection-based reveal animation
│   │   ├── SmoothScroll.tsx     # Lenis smooth scroll wrapper
│   │   └── ...
│   ├── data/
│   │   └── monasteries.ts      # Single source of truth for all 4 monasteries
│   ├── hooks/
│   │   ├── useAuth.ts           # Auth state + admin email allowlist
│   │   └── useWeather.ts        # Weather API hook
│   ├── integrations/supabase/   # Supabase client + generated types
│   ├── pages/                   # 20 page components
│   ├── i18n.ts                  # i18next configuration
│   └── App.tsx                  # Root component, routing, layout
│
├── supabase/
│   ├── config.toml
│   ├── functions/
│   │   ├── classify-condition/  # AI severity classification
│   │   ├── trip-genie-chat/     # Kora AI guide
│   │   ├── sentiment-analysis/  # Review sentiment
│   │   └── archive-search/     # Archive search functionality
│   └── migrations/
│       ├── 20250908..._initial.sql
│       ├── 20260806..._condition_reports.sql
│       └── 20260806..._storage_retry.sql
│
├── CREDITS.md                   # Image attribution + source citations
├── PRD.md                       # Product Requirements Document
├── SIH2026_HANDOFF_BRIEF.md     # Handoff brief with strategic decisions
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── .env.example                 # Environment variable template
```

---

<div style="page-break-after: always;"></div>

# 12. Edge Functions (Serverless Backend)

All AI calls are routed through Supabase Edge Functions (Deno runtime) to keep API keys out of the client bundle.

## 12.1 classify-condition
- **Purpose**: Zero-shot severity classification of condition reports
- **Model**: facebook/bart-large-mnli via Hugging Face router endpoint
- **Input**: { reportId: string, description: string }
- **Output**: { success: true, result: { severity, confidence } }
- **Security**: Two-client pattern — verifies caller identity, scopes updates to owned reports

## 12.2 trip-genie-chat
- **Purpose**: Conversational AI monastery guide (Kora)
- **Model**: meta-llama/Llama-3.3-70B-Instruct via Hugging Face chat completions
- **Input**: { message, history, preferences, stream? }
- **Output**: Streaming plaintext or { success: true, reply }
- **Features**: System prompt with monastery knowledge base, 12-message history window, SSE passthrough streaming

## 12.3 sentiment-analysis
- **Purpose**: Sentiment classification of tourist reviews
- **Access**: Admin-only

## 12.4 archive-search
- **Purpose**: Search functionality for the digital archive

---

<div style="page-break-after: always;"></div>

# 13. Security Architecture

## 13.1 API Key Protection

| Key | Exposure | Method |
|---|---|---|
| Supabase Anon Key | Client-side (safe — protected by RLS) | VITE_SUPABASE_PUBLISHABLE_KEY |
| Supabase Service Role Key | Server-only | Edge Function env |
| Hugging Face API Key | Server-only | Supabase Edge Function secret |
| OpenWeatherMap Key | Client-side (domain-restricted) | VITE_WEATHER_API_KEY |

### Key Security Fix
The original build exposed VITE_HUGGINGFACE_API_KEY in the client bundle — extractable by anyone via browser dev tools. This was fixed by moving all Hugging Face calls to Edge Functions. Verified by confirming the token string is absent from the built dist/ bundle.

## 13.2 Authentication & Authorization

- **Supabase Auth**: Email/password + Google OAuth
- **JWT Sessions**: All authenticated requests carry a JWT
- **Admin Access**: AdminRoute component wraps /dashboard and /sentiment-analysis
- **Admin Detection**: Currently a hardcoded email allowlist in useAuth.ts (documented as demo-only — production would use profiles.user_type)

## 13.3 Row Level Security

Every database table has RLS enabled. Key policies:
- **condition_reports**: Public read, authenticated insert (reporter_id must match auth.uid()), admin-only status updates
- **community_posts**: Authenticated CRUD
- **profiles**: Users can read/update their own profile

## 13.4 Edge Function Security (classify-condition)

The classify-condition function implements a **two-client security pattern**:
1. **Anon client** with caller's JWT -> auth.getUser() -> establishes caller identity
2. **Service-role client** -> performs update -> scoped to reporter_id = user.id

This prevents any client from overwriting another user's severity classification.

---

<div style="page-break-after: always;"></div>

# 14. UI/UX Design Philosophy

## 14.1 Visual Design

- **Theme**: "Lamplight" — a warm, dark-by-default palette inspired by monastery lamplight and aged parchment
- **Light mode**: Warm parchment tones (not plain white)
- **Typography**: Custom font stack with display and body typefaces
- **Color System**: Heritage gold accent (--heritage), muted earth tones
- **Prayer Flags Motif**: Decorative prayer flag elements used as section markers

## 14.2 Animations & Interactions

- **Scroll Reveals**: Intersection Observer-based — content rises into place as it enters the viewport (per-section, not whole-page parallax)
- **Page Transitions**: Framer Motion PageFade wrapper on all routes
- **Smooth Scrolling**: Lenis library for native-feeling scroll behavior
- **Scroll Progress**: Top-of-page progress bar
- **Hero Carousel**: Ken Burns pan/zoom effect on static images; real video for Enchey
- **Streaming Text**: Kora's responses appear token-by-token with a blinking cursor

## 14.3 Responsive Design

- Mobile-first layout with Tailwind CSS responsive utilities
- Adaptive grid layouts (1-col -> 2-col -> 4-col)
- Touch-friendly controls for VR tours

## 14.4 Accessibility

- Font size scaling (FontSizeProvider)
- Semantic HTML with proper heading hierarchy
- ARIA labels on interactive elements
- High-contrast text on all backgrounds
- Keyboard-navigable components (Radix UI primitives)

---

<div style="page-break-after: always;"></div>

# 15. Deployment & Infrastructure

## 15.1 Development

```bash
npm install          # Install dependencies
npm run dev          # Start Vite dev server (http://localhost:8080)
npm run build        # Production build
npm run preview      # Preview production build locally
npm run lint         # ESLint
```

## 15.2 Environment Setup

Copy .env.example to .env and fill in:
- VITE_SUPABASE_URL — Supabase project URL
- VITE_SUPABASE_PROJECT_ID — Project reference
- VITE_SUPABASE_PUBLISHABLE_KEY — Anon/public key
- VITE_WEATHER_API_KEY — OpenWeatherMap key

Server-side only (Supabase secrets):
- SUPABASE_SERVICE_ROLE_KEY
- HUGGINGFACE_API_KEY

## 15.3 Database Migrations

Run SQL files from supabase/migrations/ in order via Supabase Dashboard SQL Editor.

## 15.4 Edge Function Deployment

```bash
npx supabase functions deploy classify-condition --project-ref <ref>
npx supabase functions deploy trip-genie-chat --project-ref <ref>
npx supabase functions deploy sentiment-analysis --project-ref <ref>
```

---

<div style="page-break-after: always;"></div>

# 16. Future Scope

| Feature | Description | Effort |
|---|---|---|
| **Heritage badge persistence** | Bronze/Silver/Gold quiz badges currently local state only — heritage_badges table exists but nothing writes to it | Low |
| **Bookings-as-RSVP** | Festival/event RSVP feature instead of full booking system | Medium |
| **Digital archive + AI search** | Manuscript/mural archive with Hugging Face-powered semantic search | Medium |
| **Additional languages** | Nepali, Bhutia, Lepcha via i18next (infrastructure is ready) | Low |
| **True 360 panoramic capture** | Real panoramic photography of the four monasteries under open license | External |
| **Payment integration** | Direct travel/transport bookings with payment gateway | High |
| **Expanded AR/VR** | Spatial computing APIs for richer immersive experiences | High |
| **Real-time cost optimization** | Dynamic pricing and cost tracking for trip planning | Medium |

---

<div style="page-break-after: always;"></div>

# 17. Credits & Attribution

## 17.1 Photography & Media

All monastery photography is sourced from **Wikimedia Commons** under Creative Commons licences:

| Media | Monastery | Author | Licence |
|---|---|---|---|
| Rumtek exterior | Rumtek | Anjan Kumar Kundu | CC BY 4.0 |
| Pemayangtse with prayer flags | Pemayangtse | Kothanda Srinivasan | CC BY 2.0 |
| Tashiding mani stones | Tashiding | walter callens | CC BY 2.0 |
| Enchey exterior | Enchey | Amitabha Gupta | CC BY 4.0 |
| Enchey prayer flags video | Enchey | Rajani Gairshail | CC BY-SA 4.0 |
| Enchey prayer wheels video | Enchey | Rajani Gairshail | CC BY-SA 4.0 |
| Sikkim location map | — | Based on Philg88 | CC BY-SA 4.0 |

## 17.2 Historical & Cultural Sources

- Rumtek Monastery — Wikipedia (https://en.wikipedia.org/wiki/Rumtek_Monastery)
- Pemayangtse Monastery — Incredible India (https://www.incredibleindia.gov.in/en/sikkim/pelling/pemayangtse-monastery)
- Tashiding Monastery — Wikipedia (https://en.wikipedia.org/wiki/Tashiding_Monastery)
- Enchey Monastery — Wikipedia (https://en.wikipedia.org/wiki/Enchey_Monastery)

## 17.3 AI-Generated Content

360 degree panoramic skyboxes are generated using **Blockade Labs Skybox AI** and are labeled as "artistic impressions" in the viewer — never presented as photographs or documentation of the real buildings.

## 17.4 Digital Archive

87 images sourced via Wikimedia Commons public API. Attribution (author + licence) displayed on every card.

---

<div style="text-align: center; padding: 40px 0; color: #888;">

**Monastery360** — Built for SIH Internal Hackathon 2026

Powered by React · Supabase · Hugging Face · Three.js

</div>
