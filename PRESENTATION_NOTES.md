# Monastery360 — Presentation Notes

---

## SLIDE 1: Title

- **Project Name**: Monastery360
- **Tagline**: Digital Heritage Platform for Sikkim's Monasteries
- **Problem Statement**: SIH25061 — "Digitize and Showcase Monasteries of Sikkim for Tourism and Cultural Preservation"
- **Department**: Government of Sikkim
- **Theme**: Travel & Tourism (Software)
- **Hackathon**: SIH Internal 2026, SRM Ramapuram

---

## SLIDE 2: The Problem

**Sikkim's monasteries are deteriorating and hard to monitor.**

- **Overtourism** — Rumtek and other popular sites face heavy foot traffic damaging fragile structures
- **Remote locations** — Monasteries sit at 1,500–2,100m elevation in mountains, making regular inspection nearly impossible
- **No trained conservators** — Severe shortage of heritage specialists in the region
- **Climate damage** — Humidity, monsoons, and earthquakes damage centuries-old murals, manuscripts, and thangka paintings
- **Manual digitization** — Sikkim's Dept. of Cultural Affairs is digitizing old photos *by hand* with ASI and INTACH — slow and doesn't scale

**Bottom line**: These are *living religious institutions* dating back to the 1600s, not museum exhibits. Without technology intervention, irreversible heritage loss is happening right now.

---

## SLIDE 3: Our Solution — Three Pillars

### Pillar 1: DIGITIZE
- 360° virtual tours of 4 monasteries (Three.js)
- Digital archive of 87 openly-licensed photographs
- Historically-sourced educational content

### Pillar 2: SHOWCASE
- Kora — AI monastery guide (Llama-3.3-70B LLM)
- Interactive heritage map with gamified quizzes
- Weather, transport, emergency modules for practical planning

### Pillar 3: PRESERVE (Centerpiece)
- Crowdsourced condition reporting — visitors submit photos + geotags of damage
- AI severity classification in real time
- Conservation Priority Dashboard for heritage authorities

---

## SLIDE 4: Centerpiece Feature — Crowdsourced Condition Reporting

**Every visitor becomes a volunteer surveyor.**

### How it works:
1. Visitor spots damage (cracked wall, water-damaged mural, overcrowding)
2. Taps the persistent floating "Report" button (visible on every page)
3. Fills in: monastery name, description, optional photo, optional GPS location
4. Photo uploads to Supabase Storage
5. Report saved to PostgreSQL database
6. AI model (facebook/bart-large-mnli) classifies severity instantly:
   - 🔴 **Urgent structural damage**
   - 🟠 **Moderate wear**
   - 🟡 **Minor issue**
   - 🟢 **No concern**
7. Confidence score shown (e.g., "urgent structural damage — 87% confidence")
8. Report appears immediately on the admin Conservation Priority Dashboard

### Why it matters:
- Replaces infrequent professional inspections with continuous crowdsourced monitoring
- AI triage means authorities see the most critical issues first
- Zero extra cost — tourists are already visiting these sites

---

## SLIDE 5: Conservation Priority Dashboard (Admin)

- **Admin-only** protected route
- **Real data** — no mock data, only actual submitted reports
- **KPI cards**: Total reports, Urgent count, Monasteries reported, Awaiting classification
- **Pie chart**: Reports broken down by severity level
- **Bar chart**: Reports broken down by monastery
- **Priority table**: All reports ranked — most urgent first, then by date
- Each row shows: Monastery, Description, Severity badge, Confidence %, Date

---

## SLIDE 6: Virtual Monastery Tours (360°)

### Four flagship monasteries:
1. **Rumtek** — Karma Kagyu seat, largest in Sikkim, Golden Stupa
2. **Pemayangtse** — Nyingma, 7-tiered Zangdok Palri wood sculpture
3. **Tashiding** — Holiest in Sikkim, Bumchu festival, Thongwa Rangdrol chorten
4. **Enchey** — Chinese pagoda style, Cham dances, Pang Lhabsol festival

### Tech:
- Three.js renders panoramic images on a 3D sphere with drag-to-look
- Also supports Blockade Labs AI skyboxes (clearly labeled "artistic impression" — honesty matters on a heritage project)
- Interactive hotspots with facts, history, best visit times
- Audio guide tracks per monastery

---

## SLIDE 7: Kora — AI Monastery Guide

- **Named after "kora"** — the ritual clockwise circuit walked around monasteries
- **Model**: Meta Llama-3.3-70B-Instruct (via Hugging Face)
- **Runs server-side** — API key never touches the browser (security fix from original build)
- **Streams responses** token-by-token (like ChatGPT)

### What it does:
- Plans a self-guided Buddhist Circuit across all 4 monasteries
- Considers your budget, duration, interests, and location
- Answers questions about history, architecture, festivals, etiquette
- Grounded in real sourced facts — refuses to make things up
- Suggests sensible route order based on geography (Rumtek + Enchey near Gangtok; Pemayangtse + Tashiding in West Sikkim)

### Preferences panel:
- Budget: Under ₹5K / ₹5K–15K / ₹15K–30K / Above ₹30K
- Duration: 1 Day / 2–3 Days / 4–7 Days / 1 Week+
- Interests: Heritage Sites, Monastic Architecture, Spiritual, Photography, Festivals, Trekking, Cuisine, History
- Preferred area (e.g., Gangtok, Pelling)

---

## SLIDE 8: Heritage Explorer

- **Interactive Sikkim map** with hover-enabled monastery markers
- Markers positioned from **real GPS coordinates** (math in CREDITS.md)
- Click a monastery → history, significance, best visit time, Wikipedia links
- **Gamified quizzes**: 2 questions per monastery, Bronze/Silver/Gold badges
- Example quiz: "What does Thongwa Rangdrol mean?" → "The saviour by mere sight"

---

## SLIDE 9: Digital Archive

- **87 real photographs** from Wikimedia Commons
- Breakdown: Enchey (38), Tashiding (28), Pemayangtse (16), Rumtek (5)
- All openly licensed (CC BY, CC BY-SA, CC0)
- Every card shows: image, author credit, licence
- Links back to original Commons page
- Generated via a script (`gen-archive.mjs`) from live Commons metadata — can be regenerated as more images are released
- **Nothing is AI-generated or fabricated**

---

## SLIDE 10: Other Features

### 🆘 Emergency Services
- Real Sikkim contacts: STNM Hospital, Police Control Room, Pakyong Airport, Tourist Info Centre
- Map integration (Leaflet)
- Persistent floating SOS button on every page

### 🌤️ Weather Module
- Live weather via OpenWeatherMap API
- Trip timing recommendations

### 🌐 Community Feed
- Post experiences, photos, location tags
- Like and comment system

### 📅 Cultural Calendar
- Festival and event schedule

### 🚌 Transport & Navigation
- Local transport options with route maps

### 🎮 Games (Funscapes)
- Gamified heritage learning

### 📊 Sentiment Analysis (Admin)
- AI-powered sentiment classification on tourist reviews

---

## SLIDE 11: Tech Stack

### Frontend
- **React 18** + **TypeScript** + **Vite** (fast builds with SWC)
- **Tailwind CSS** + **Shadcn UI** (Radix primitives) for styling
- **Framer Motion** + **GSAP** for animations
- **Three.js** for 3D VR tours
- **React Router** with lazy-loaded routes (code splitting)
- **TanStack React Query** for server state
- **React Hook Form + Zod** for form validation
- **i18next** for English/Hindi support
- **Recharts** for dashboard charts

### Backend
- **Supabase** — PostgreSQL database + Auth + Edge Functions + Storage
- **Row Level Security** on every table
- **4 Edge Functions** (Deno runtime):
  - `classify-condition` — AI severity classification
  - `trip-genie-chat` — Kora AI guide
  - `sentiment-analysis` — Review sentiment
  - `archive-search` — Archive search

### AI / ML
- **Llama-3.3-70B-Instruct** — Kora conversational AI
- **facebook/bart-large-mnli** — Zero-shot severity classification
- All called **server-side only** via Supabase Edge Functions

### External APIs
- **OpenWeatherMap** — Weather data
- **Wikimedia Commons** — Archive images
- **Leaflet** — Maps

---

## SLIDE 12: Architecture (Simplified)

```
Browser (React + Three.js)
    |
    ├── Supabase Auth (Email + Google OAuth)
    ├── Supabase PostgreSQL (RLS-protected tables)
    ├── Supabase Storage (condition report photos)
    └── Supabase Edge Functions
            |
            ├── classify-condition → Hugging Face (BART-MNLI)
            ├── trip-genie-chat → Hugging Face (Llama-3.3-70B)
            ├── sentiment-analysis → Hugging Face
            └── archive-search
```

**Key point**: AI API keys are NEVER in the browser. All AI calls go through Edge Functions.

---

## SLIDE 13: Database

### Active Tables
| Table | Purpose |
|---|---|
| `condition_reports` | Crowdsourced reports with AI severity (CENTERPIECE) |
| `profiles` | User data, roles, preferences |
| `community_posts` | Social feed posts |

### Security (Row Level Security)
- `condition_reports`: Anyone can read, only logged-in users can submit (must match their own user ID), only admins can update status
- Photo uploads: Public read, authenticated upload only
- Reporter ID verified server-side — no impersonation possible

---

## SLIDE 14: Security Highlights

| What | How |
|---|---|
| Hugging Face API key | Stored in Supabase secrets, accessed only by Edge Functions — **never in browser** |
| Supabase anon key | Client-side but protected by Row Level Security |
| Condition report integrity | Two-client pattern: Edge Function verifies caller JWT before persisting AI results |
| Admin access | Protected routes with AdminRoute component |
| Auth | Supabase Auth with email/password + Google OAuth |

**Security fix from original build**: The old version exposed `VITE_HUGGINGFACE_API_KEY` in the client bundle — anyone could extract it from browser dev tools. Fixed by moving all AI calls server-side.

---

## SLIDE 15: The Four Monasteries — Quick Reference

### Rumtek (East Sikkim, near Gangtok)
- Karma Kagyu lineage seat (one of 4 major Tibetan Buddhist schools)
- Built 1734, rebuilt 1959–1966 by 16th Karmapa after fleeing Tibet
- Golden Stupa with Karmapa's relics
- Cham dances during Losar (Tibetan New Year)

### Pemayangtse (West Sikkim, near Pelling)
- Nyingma order (oldest school), head of all Sikkim Nyingma monasteries
- Founded ~1705, name means "Perfect Sublime Lotus"
- Zangdok Palri: 7-tiered wooden model of Padmasambhava's celestial palace, carved by 1 lama over 5 years
- Views of Kanchenjunga + Rabdentse ruins (Sikkim's former capital)

### Tashiding (West Sikkim)
- Founded 1641, holiest monastery in Sikkim
- Thongwa Rangdrol chorten — "saviour by mere sight" (one glance cleanses sin)
- Bumchu festival — sacred vase water level predicts Sikkim's fortune for the year
- Mani stone slabs lining the path, each hand-carved with mantras

### Enchey (East Sikkim, above Gangtok)
- Built 1909, Chinese pagoda style (unusual for Sikkim)
- Origin: hermitage of Lama Druptob Karpo (said to have power of flight)
- Masked Cham dances + Singhe Chaam (snow lion dance)
- Pang Lhabsol: uniquely Sikkimese festival honouring Kanchenjunga as guardian deity

---

## SLIDE 16: UI/UX Highlights

- **"Lamplight" dark theme** — warm, monastery-inspired palette (default)
- **Light mode** — warm parchment tones, not plain white
- **Prayer flags motif** — decorative elements as section markers
- **Scroll reveal animations** — content rises into view per section
- **Page transitions** — smooth Framer Motion fades between routes
- **Smooth scrolling** — Lenis library
- **Scroll progress bar** — top of page
- **Hero carousel** — Ken Burns effect on photos, real video for Enchey
- **Streaming AI text** — Kora's responses appear word-by-word with blinking cursor
- **Responsive** — works on mobile, tablet, desktop
- **Accessibility** — font size scaling, keyboard navigation, ARIA labels
- **i18n** — English + Hindi (infrastructure ready for Nepali, Bhutia, Lepcha)

---

## SLIDE 17: What Makes This Different (Talking Points)

1. **Not just another tourism website** — the condition reporting system turns it into a real preservation tool
2. **Every visitor is a volunteer surveyor** — continuous crowdsourced monitoring at zero extra cost
3. **AI triage** — authorities see the most urgent issues first, not buried in a feed
4. **Real data, not mock data** — the dashboard shows actual submitted reports
5. **AI is server-side** — unlike most hackathon projects, API keys are properly secured
6. **Honest about AI-generated content** — skyboxes labeled as "artistic impressions", never passed off as real photos
7. **Real monastery content** — sourced from Wikipedia, Incredible India, and Sikkim tourism refs with proper attribution
8. **Scales existing government work** — Sikkim's Dept. of Cultural Affairs is already digitizing by hand; we automate and scale it

---

## SLIDE 18: Future Scope

- **Badge persistence** — quiz badges currently local-only; database table exists, just needs writes
- **Festival RSVP** — replace cut booking feature with event registration
- **AI-powered archive search** — semantic search over the manuscript/mural archive
- **More languages** — Nepali, Bhutia, Lepcha (i18next infra is ready)
- **Real 360° panoramas** — replace AI skyboxes with actual panoramic photography when available
- **Payment gateway** — direct booking integration
- **Spatial computing** — expanded AR/VR with spatial APIs

---

## DEMO FLOW (Suggested)

1. **Landing page** — show the hero, scroll through features and monastery showcase
2. **VR Tour** — pick Rumtek, show the 360° experience + hotspots
3. **Kora AI** — ask "Plan a 2-day Buddhist Circuit from Gangtok" — show streaming response
4. **Heritage Explorer** — hover on the Sikkim map, click a monastery, take a quiz
5. **Condition Report** — submit a demo report, show the AI classification result
6. **Dashboard** — show the priority-ranked table, severity pie chart
7. **Archive** — browse the 87 photographs with attribution
8. **Emergency** — show real Sikkim contacts + SOS button

---

## KEY NUMBERS

| Metric | Value |
|---|---|
| Monasteries covered | 4 (Rumtek, Pemayangtse, Tashiding, Enchey) |
| Archive photographs | 87 (all CC-licensed from Wikimedia Commons) |
| AI models used | 2 (Llama-3.3-70B for chat, BART-MNLI for classification) |
| Edge Functions | 4 (classify-condition, trip-genie-chat, sentiment-analysis, archive-search) |
| Severity levels | 4 (urgent / moderate / minor / no concern) |
| Languages | 2 (English, Hindi) — infra ready for 5 |
| Application routes | 17+ |
| npm dependencies | 81 (production) + 16 (dev) |
| Database tables | 8 (3 active, 5 legacy) |
| RLS policies | On every table |
