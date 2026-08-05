# 🇮🇳 SIH 2025 — AI-Powered India Tourism Platform

<div align="center">

![SIH 2025 Tourism](https://img.shields.io/badge/SIH-2025-orange?style=for-the-badge&logo=india)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=for-the-badge&logo=tailwindcss)

**An AI-powered, scalable, and highly interactive tourism & travel platform aimed at enhancing the tourist experience across India.**

[Features](#-features) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [Project Structure](#-project-structure) · [Database Schema](#-database-schema) · [Environment Variables](#-environment-variables) · [Contributing](#-contributing)

</div>

---

## 📋 Overview

The **SIH 2025 Tourism Platform** is a full-stack web application built for Smart India Hackathon 2025. It targets tourists of all demographics (including Gen-Z), government tourism boards, and local communities with the goal of revolutionizing how people explore India.

The platform combines **Artificial Intelligence**, **Augmented/Virtual Reality**, **real-time mapping**, **community engagement**, and **emergency services** into a single unified experience — all powered by a modern React + Supabase architecture.

---

## ✨ Features

### 🔐 Authentication & User Management
- Secure authentication via **Supabase Auth** (email/password + Google OAuth)
- Role-based user types: `tourist`, `local_guide`, `agency`, `admin`
- Auto-provisioned user profiles on signup via database trigger
- Profile management: avatar, bio, travel preferences, location

### 🤖 TripGenie — AI Trip Planner
- Conversational AI powered by **Hugging Face Inference API**
- Generates personalized day-by-day itineraries based on destination, budget, duration, and interests
- Recommends places, activities, transport, and accommodations

### 📅 Journey Hub (Bookings)
- Centralized booking management dashboard for hotels, flights, and tours
- Real-time booking status tracking: `pending` → `confirmed` → `completed` / `cancelled`
- Manage participants, special requests, and total trip costs
- Integrated with the `travel_packages` and `bookings` database tables

### 🧠 Feedback Analysis (Sentiment Analysis)
- AI-driven sentiment analysis on tourist reviews using **Hugging Face NLP models**
- Flags negative experiences and generates actionable insights for hosts and tourism authorities
- Visual sentiment score dashboard with categorized feedback

### 🏛️ Heritage Exploration
- Interactive catalogue of Indian heritage sites with rich multimedia content
- Historical significance, best visit times, entry fees, and multilingual audio stories
- Gamified **Heritage Badges** system (Bronze / Silver / Gold) awarded after quiz completion
- Seeded with initial Jharkhand heritage data (Jagannath Temple, Hundru Falls, Betla National Park, etc.)

### 🥽 AR / VR Experiences
- Immersive **Three.js**-powered 3D virtual tours of heritage sites
- Panoramic walk-throughs for prospective travelers to preview destinations
- Dedicated VR Experience page (`/vr-experience`) with full-screen WebGL rendering

### 🎮 Funscapes — GenZ Games Hub
An interactive gamification layer (accessible at `/funscapes`) featuring 8 culturally themed mini-games:

| Game | Description |
|------|-------------|
| 🦁 Hidden Animal | Spot wildlife camouflaged in Indian forest imagery |
| 🏺 Tribal Artifact Hunt | Identify authentic tribal artifacts from a curated gallery |
| 💃 Festival Dance-Off | Match classic Indian festival dance moves |
| 🦚 Wildlife Trivia | Answer questions about India's biodiversity |
| 🌿 Eco Explorer | Learn about eco-tourism destinations through interactive challenges |
| ⏳ Time Traveler | Navigate historical events across ancient India |
| 🍛 Food Explorer | Identify regional Indian cuisines and their origins |
| 🖼️ Cave Painting | Recognize famous prehistoric cave art from across India |

### 🎯 GenZ Corner
- Gamified trend-focused content tailored for Gen-Z tourists
- Viral challenges, vlogs, short-form travel content
- Community-driven travel stories and social sharing

### 🗺️ Transport & Navigation
- Local transport options (road, rail, metro) with route planning
- Integration-ready with real-time transit APIs
- Leaflet-powered interactive maps for route visualization

### 🌤️ Weather Module
- Live weather conditions and 7-day forecasts via an external Weather API
- Trip timing recommendations based on seasonal forecasts
- Location-aware weather lookup

### 🆘 Emergency Services
- Instant access to local emergency contacts (police, hospitals, fire, embassies) based on geolocation
- **Leaflet** map integration for nearest service navigation
- Persistent **floating SOS button** visible on every page (except the emergency page itself)

### 🌐 Community & Social
- Post-based social feed: create posts with images, location tags, and travel hashtags
- Like and comment system
- Featured posts curated by admins

### 📊 Admin Dashboard
- Protected route (`/dashboard`) accessible only to users with `admin` role
- Summary of platform metrics: trips, bookings, community activity, and user growth
- Quick-action links and customized recommendation feeds

### 🌍 Internationalization
- Full multi-language support via **i18next** with browser language auto-detection
- HTTP backend for lazy-loading language bundles

### 🌙 Dark Mode
- System-aware dark/light theme via `next-themes`
- Persisted in `localStorage` under key `vite-ui-theme`

### ♿ Accessibility
- Adjustable font sizes via `FontSizeProvider` context
- Semantic HTML throughout all pages
- WCAG-aligned color contrast in both themes

### 🔏 Privacy & Legal
- Dedicated **Privacy Policy** (`/privacy`), **Terms of Service** (`/terms`), and **Cookie Policy** (`/cookies`) pages
- GDPR-aligned data handling practices

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
| Icons | Lucide React + React Icons |
| Typography | Geist Font |
| Charts | Recharts |
| Carousel | Embla Carousel |

### Backend & Infrastructure

| Category | Technology |
|----------|-----------|
| Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth (Email + Google OAuth) |
| Row Level Security | Supabase RLS Policies |
| Edge Functions | Supabase Functions |
| Analytics | Vercel Analytics |

### AI & External APIs

| Category | Technology |
|----------|-----------|
| LLM / NLP | Hugging Face Inference API |
| Mapping | Leaflet + React-Leaflet |
| Weather | External Weather REST API |
| Web3 (future) | Ethers.js |

### 3D & Immersive

| Category | Technology |
|----------|-----------|
| 3D Rendering | Three.js |
| Type Definitions | @types/three |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** or **bun**
- A [Supabase](https://supabase.com) project
- A [Hugging Face](https://huggingface.co) API token
- A weather API key (e.g., [OpenWeatherMap](https://openweathermap.org/api))

### 1. Clone the Repository

```bash
git clone https://github.com/Pranav-0710/SIH-2025-TOURISM-.git
cd SIH-2025-TOURISM-
```

### 2. Install Dependencies

```bash
npm install
# or
bun install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory (copy from `.env.example` if available):

```env
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
VITE_HUGGINGFACE_API_KEY=<your-huggingface-token>
VITE_WEATHER_API_KEY=<your-weather-api-key>
```

> ⚠️ **Never commit your `.env` file.** It is already listed in `.gitignore`.

### 4. Apply Database Migrations

Link your local project to your Supabase project and push the schema:

```bash
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

Or manually run the SQL in `supabase/migrations/` from the Supabase SQL Editor.

### 5. Configure Google OAuth (Optional)

Follow the steps in `GOOGLE SIGN-IN.txt` to set up Google OAuth in your Supabase Auth settings.

### 6. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 7. Build for Production

```bash
npm run build
```

The output will be in the `dist/` folder, ready for deployment on Vercel, Netlify, or any static host.

---

## 📁 Project Structure

```
new-sih/
├── public/                        # Static assets served at root
├── src/
│   ├── assets/                    # Images & static media (e.g., sos.png)
│   ├── components/                # Reusable UI components
│   │   ├── ui/                    # Shadcn UI primitives (Button, Dialog, etc.)
│   │   ├── vr/                    # Three.js VR scene components
│   │   ├── funscapes/             # Mini-game UI components
│   │   ├── AdminRoute.tsx         # Protected route wrapper for admin pages
│   │   ├── AuthProvider.tsx       # Supabase auth context provider
│   │   ├── FontSizeProvider.tsx   # Accessibility font-size context
│   │   ├── Navigation.tsx         # Top navigation bar
│   │   ├── HeroSection.tsx        # Landing page hero
│   │   ├── FeaturesSection.tsx    # Landing page features grid
│   │   ├── TripGeniePreview.tsx   # TripGenie teaser widget
│   │   ├── PopularDestinations.tsx# Destinations carousel
│   │   ├── Footer.tsx             # Site-wide footer
│   │   ├── TypeWriter.tsx         # Typewriter text animation
│   │   ├── WaveDivider.tsx        # SVG wave section divider
│   │   ├── mode-toggle.tsx        # Dark/Light mode toggle button
│   │   └── theme-provider.tsx     # next-themes wrapper component
│   ├── data/                      # Static data / seed data files
│   ├── hooks/                     # Custom React hooks
│   │   ├── useAuth.ts             # Authentication state & actions
│   │   ├── useWeather.ts          # Weather API data fetching hook
│   │   ├── use-toast.ts           # Toast notification hook
│   │   └── use-mobile.tsx         # Mobile viewport detection hook
│   ├── integrations/
│   │   └── supabase/              # Supabase client initialization & types
│   ├── lib/                       # Utility functions (cn, etc.)
│   ├── pages/                     # Top-level route pages
│   │   ├── Index.tsx              # Landing page (/)
│   │   ├── Auth.tsx               # Login & Registration (/auth)
│   │   ├── Dashboard.tsx          # Admin Dashboard (/dashboard) [Protected]
│   │   ├── Profile.tsx            # User Profile (/profile)
│   │   ├── TripGenie.tsx          # AI Trip Planner (/trip-genie)
│   │   ├── Bookings.tsx           # Journey Hub — Bookings (/bookings)
│   │   ├── Heritage.tsx           # Heritage Sites Explorer (/heritage)
│   │   ├── Community.tsx          # Community Feed (/community)
│   │   ├── GenzCorner.tsx         # GenZ Corner (/genzcorner)
│   │   ├── SentimentAnalysis.tsx  # Feedback Analysis (/sentiment-analysis) [Admin]
│   │   ├── Emergency.tsx          # Emergency Services (/emergency)
│   │   ├── Transport.tsx          # Transport & Navigation (/transport)
│   │   ├── Weather.tsx            # Weather Module (/weather)
│   │   ├── VRExperience.tsx       # VR Tour (/vr-experience)
│   │   ├── ArVrExperience.tsx     # Funscapes Hub (/funscapes)
│   │   ├── Explore.tsx            # Explore Destinations (/explore)
│   │   ├── Privacy.tsx            # Privacy Policy (/privacy)
│   │   ├── Terms.tsx              # Terms of Service (/terms)
│   │   ├── Cookies.tsx            # Cookie Policy (/cookies)
│   │   ├── NotFound.tsx           # 404 Page (*)
│   │   └── funscapes/             # Individual game pages
│   │       ├── HiddenAnimalPage.tsx
│   │       ├── TribalArtifactHuntPage.tsx
│   │       ├── FestivalDanceOffPage.tsx
│   │       ├── WildlifeTriviaPage.tsx
│   │       ├── EcoExplorerPage.tsx
│   │       ├── TimeTravelerPage.tsx
│   │       ├── FoodExplorerPage.tsx
│   │       └── CavePaintingPage.tsx
│   ├── styles/                    # Additional CSS modules
│   ├── i18n.ts                    # i18next configuration
│   ├── index.css                  # Global Tailwind + custom CSS
│   ├── main.tsx                   # React DOM render entry point
│   └── App.tsx                    # Root component with routing
├── supabase/
│   ├── config.toml                # Supabase local dev config
│   ├── functions/                 # Supabase Edge Functions
│   └── migrations/
│       └── 20250908161514_*.sql   # Initial database schema migration
├── .env                           # Local environment variables (gitignored)
├── .gitignore
├── index.html                     # Vite HTML entry point
├── package.json
├── tailwind.config.ts             # Tailwind CSS configuration
├── tsconfig.json                  # TypeScript configuration
├── vite.config.ts                 # Vite build configuration
├── PRD.md                         # Product Requirements Document
└── TYPEWRITER_IMPLEMENTATION.md   # Typewriter component docs
```

---

## 🗄️ Database Schema

The Supabase PostgreSQL database consists of **7 core tables** with full Row Level Security (RLS) enabled.

```
auth.users (Supabase managed)
    │
    ▼ (trigger: on_auth_user_created)
profiles ──────────────────────────────────┐
    │                                       │
    ├──► bookings ◄──── travel_packages     │
    │                                       │
    ├──► heritage_badges ◄── heritage_sites │
    │                                       │
    ├──► community_posts                    │
    │                                       │
    └──► reviews ◄──── travel_packages      │
                └──── heritage_sites ───────┘
```

### Tables

| Table | Description |
|-------|-------------|
| `profiles` | Extended user data, roles, preferences. Auto-created on signup. |
| `heritage_sites` | Catalogue of Indian heritage & nature sites with geolocation data |
| `travel_packages` | Agency-listed travel packages with itineraries, pricing, and availability |
| `bookings` | Tourist bookings linking users to travel packages |
| `heritage_badges` | User-earned gamification badges (Bronze/Silver/Gold) per heritage site |
| `community_posts` | User-generated travel posts with geo-tagging and social counters |
| `reviews` | Star-rated reviews for packages and heritage sites |

### Enum Types

```sql
user_type      → tourist | local_guide | agency | admin
package_category → culture | adventure | nature | pilgrimage | heritage
badge_level    → bronze | silver | gold
booking_status → pending | confirmed | completed | cancelled
```

### Security Model

All tables use **Row Level Security (RLS)**:
- **Public read** for heritage sites, packages, badges, community posts, and reviews
- **Private write** — users can only modify their own data
- **Admin-only** modification of heritage sites
- **Agency-scoped** management of travel packages

---

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | ✅ |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous public key | ✅ |
| `VITE_HUGGINGFACE_API_KEY` | Hugging Face API token for TripGenie & Sentiment Analysis | ✅ |
| `VITE_WEATHER_API_KEY` | Weather API key for live forecasts | ✅ |

> All variables are prefixed with `VITE_` so Vite exposes them to the browser bundle. **Do not store secrets intended only for a server in `VITE_` variables in a production environment.**

---

## 🌐 Application Routes

| Route | Page | Auth Required |
|-------|------|:---:|
| `/` | Landing Page | ❌ |
| `/auth` | Login / Register | ❌ |
| `/trip-genie` | AI Trip Planner | ✅ |
| `/bookings` | Journey Hub (Bookings) | ✅ |
| `/heritage` | Heritage Explorer | ❌ |
| `/community` | Community Feed | ✅ |
| `/genzcorner` | GenZ Corner | ❌ |
| `/explore` | Explore Destinations | ❌ |
| `/weather` | Weather Module | ❌ |
| `/transport` | Transport & Navigation | ❌ |
| `/emergency` | Emergency Services | ❌ |
| `/vr-experience` | VR Tour | ❌ |
| `/funscapes` | Funscapes Games Hub | ❌ |
| `/sentiment-analysis` | Feedback Analysis | 🔒 Admin |
| `/dashboard` | Admin Dashboard | 🔒 Admin |
| `/profile` | User Profile | ✅ |
| `/privacy` | Privacy Policy | ❌ |
| `/terms` | Terms of Service | ❌ |
| `/cookies` | Cookie Policy | ❌ |

---

## 🧩 Key Architectural Decisions

### Context Providers Stack
The app wraps the entire tree with layered providers for clean separation of concerns:
```
QueryClientProvider        ← TanStack React Query cache
  └── AuthProvider         ← Supabase session management
        └── FontSizeProvider  ← Accessibility font scaling
              └── ThemeProvider  ← Dark/Light mode (next-themes)
                    └── TooltipProvider  ← Radix UI tooltips
                          └── BrowserRouter  ← React Router
```

### Admin Route Guard
The `/dashboard` and sensitive pages are wrapped in `<AdminRoute />` which checks the `user_type === 'admin'` flag from the `profiles` table before rendering the child route.

### Floating SOS Button
A persistent emergency SOS button is rendered at the layout level (not inside any individual page) and conditionally hidden only on the `/emergency` page itself, ensuring tourist safety at all times.

### AI Integration Pattern
Both **TripGenie** (trip planning) and **SentimentAnalysis** (feedback analysis) use the `@huggingface/inference` SDK to call Hugging Face Inference API endpoints directly from the browser, with the API key sourced from `VITE_HUGGINGFACE_API_KEY`.

---

## 🧪 Available Scripts

```bash
# Start development server (hot module replacement)
npm run dev

# Type-check and build for production
npm run build

# Build in development mode (no minification)
npm run build:dev

# Preview production build locally
npm run preview

# Run ESLint
npm run lint
```

---

## 🔮 Future Scope

- [ ] **Payment Gateway Integration** — Direct booking payments via Razorpay / Stripe
- [ ] **Expanded AR/VR** — Spatial computing APIs for device-native AR overlays
- [ ] **TripGenie v2** — Real-time dynamic cost optimization and availability tracking
- [ ] **Offline Support** — PWA with service worker caching for travel in low-connectivity areas
- [ ] **Web3 Integration** — NFT-based heritage badges and loyalty rewards using Ethers.js
- [ ] **Real-time Transit** — Live train, bus, and metro tracking via government transit APIs
- [ ] **Push Notifications** — Booking reminders and travel alerts

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. **Fork** the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to your fork: `git push origin feature/your-feature-name`
5. Open a **Pull Request** against the `main` branch

Please follow the existing code style (TypeScript strict mode, ESLint rules, and Tailwind utility-first CSS).

---

## 📄 License

This project was built for **Smart India Hackathon 2025** and is intended for educational and demonstration purposes.

---

## 👨‍💻 Team

Built with ❤️ for SIH 2025 — empowering India's tourism through technology.

---

<div align="center">
  <sub>Made for Smart India Hackathon 2025 | Powered by React · Supabase · Hugging Face · Three.js</sub>
</div>