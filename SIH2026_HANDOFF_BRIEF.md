# SIH Internal Hackathon — Handoff Brief for Claude Code

## READ THIS FIRST — INSTRUCTIONS FOR CLAUDE CODE

**Do not write, edit, or run any code yet.** Do not create files, do not scaffold anything, do not touch the repo. Your first job is to **read this brief fully, then discuss it with Pranav** — ask clarifying questions, surface risks, and help him think through the plan before any implementation starts. There is an "Open Questions" section at the bottom with things I (a prior Claude session, chat-only, no code access) could not resolve — do not assume answers to those. Ask him directly. Once you and Pranav have a concrete, agreed plan, THEN move into implementation, and even then, scope it incrementally rather than building everything at once.

---

## 1. What this is

Pranav's college (SRM Ramapuram) is running an **internal hackathon that reuses last year's SIH 2025 problem statement list**. This is not the live national SIH — SIH 2025 already concluded in December 2025. This is an internal round only. Judging criteria as stated by Pranav: **wow factor, innovation, clearly defining the pain point, and solving it.**

## 2. The existing asset

Pranav has a working repo: `github.com/Pranav-0710/sih2026` — originally built for SIH 2025 as an "AI-Powered India Tourism Platform," themed around Jharkhand. Pranav confirms this is **entirely his own code** — former teammates who worked on the original SIH 2025 team have "the idea alone," not the codebase. He did the majority of the implementation himself. (Claude Code: if anything in the commit history suggests otherwise, flag it to Pranav rather than assuming his account is complete — but take his stated account as the working premise unless you see clear evidence against it.)

### Current tech stack
- React 18 + TypeScript + Vite, Tailwind CSS + shadcn/ui (Radix)
- Supabase (Postgres + Auth + Row Level Security + Edge Functions)
- Hugging Face Inference API for AI features
- Three.js for VR/AR panorama tours
- i18next (English/Hindi), Leaflet for maps, Framer Motion/GSAP for animation

### Current features (from README/PRD)
- Auth (Supabase, email + Google OAuth), role-based (`tourist`, `local_guide`, `agency`, `admin`)
- **TripGenie** — AI trip planner using Hugging Face, generates itineraries
- **Bookings** — booking management dashboard (hotels/flights/tours)
- **Sentiment Analysis** — Hugging Face NLP on tourist reviews, via a Supabase **edge function** (this one is done correctly, server-side)
- **Heritage Explorer** — catalogue of sites, gamified Bronze/Silver/Gold badges, currently seeded with Jharkhand data (Hundru Falls, Betla National Park, Jagannath Temple Ranchi, etc.)
- **VR/AR Experience** — Three.js panoramic tours, hotspots, audio guide, text-to-speech, spatial audio
- **Funscapes** — 8 gamified mini-games (Hidden Animal, Tribal Artifact Hunt, Festival Dance-Off, Wildlife Trivia, Eco Explorer, Time Traveler, Food Explorer, Cave Painting) with leaderboard + certificate system
- **GenZ Corner** — trend content, viral challenges, social sharing
- Transport, Weather, Emergency SOS (floating button, geolocation-based emergency contacts), Community feed (posts, likes, comments)
- Admin Dashboard, multi-language, dark mode, accessibility (font scaling)

### Known technical problem — fix regardless of what else happens
**TripGenie calls the Hugging Face Inference API directly from the browser**, with `VITE_HUGGINGFACE_API_KEY` exposed in the client bundle. Anyone opening browser dev tools can extract this key. The Sentiment Analysis feature already does this correctly via a Supabase edge function — TripGenie needs to be moved to the same pattern before this is shown to any judge who might inspect the network tab or bundle.

## 3. The decision reached

After going through roughly a dozen SIH 2025 problem statements against the "wow factor / innovation / defines pain point / solves it" criteria, and specifically weighing which ones let Pranav leverage his existing codebase rather than building from zero, the recommendation is:

**SIH25061 — "Digitize and Showcase Monasteries of Sikkim for Tourism and Cultural Preservation"** (Government of Sikkim, Travel & Tourism theme, Software).

### Why this PS, and why now (not the Odisha heritage PS considered earlier)
- The PS title itself asks for exactly what the app already does — digitize + showcase heritage sites for tourism and preservation. No narrative stretching required, unlike other options considered (e.g., an Odisha AR heritage PS was considered first but would have required reframing a tourism app as a preservation-mission app; Sikkim's PS doesn't require that reframe).
- Real, verifiable preservation pain points exist for Sikkim's monasteries: overtourism pressure on sites like Rumtek and Tsomgo Lake, most monasteries sit in remote mountainous locations that are genuinely hard to physically monitor/document, a real shortage of trained conservators, and humidity damage to manuscripts/thangkas. Sikkim's own Department of Cultural Affairs & Heritage is already manually digitizing old photographs in collaboration with the Archaeological Survey of India and INTACH — meaning the pitch is "we scale up work the department has already started by hand," not a fabricated problem.
- Visually, monasteries (murals, thangkas, prayer wheels, mountain backdrops) are strong material for the existing Three.js VR panorama engine — this addresses the "wow factor" concern directly.
- Sikkim is a small state — fewer major sites than a full-state heritage sweep, which keeps scope tight rather than sprawling (a real risk flagged from Pranav's past projects — see "Known pattern to watch" below).

## 4. Required changes (the actual work, once discussed and agreed)

### Cut (don't belong in a preservation-focused pitch, and add scope risk)
- **Bookings / travel packages** — this is a tourism-transaction feature, not a preservation feature. Cut or deprioritize hard.
- **GenZ Corner** — trend/social content, not relevant to the new PS framing. Cut or deprioritize hard.

### Keep and repurpose
- **VR/AR panorama engine** — keep as-is architecturally; content needs to change (see below).
- **Gamified badges (Bronze/Silver/Gold)** — keep the mechanic, re-theme around monastery visits/learning.
- **Sentiment Analysis edge function** — repurpose from "tourist review sentiment" to **classifying urgency/severity of user-submitted heritage condition reports** (see new feature below). The underlying NLP call pattern is reusable; the classification labels and prompt need to change.
- **Community feed** — repurpose from generic travel posts into the crowdsourced condition-reporting feed (see below).
- **TripGenie** — needs the security fix (move to edge function) regardless. Whether to keep it as an "AI monastery guide" (e.g., answering questions about a self-guided Buddhist Circuit route) or cut it is an open question for discussion with Pranav — don't assume.

### New feature to build
**Crowdsourced heritage condition reporting.** A visitor or local can submit a report on a monastery — photo, geotag, short description of an issue (damage, erosion, neglect, overcrowding impact, etc.). The existing sentiment-analysis pattern gets repurposed to read the description and estimate urgency/severity. Reports feed an admin view that ranks sites by restoration priority. This is the feature that turns "reskinned tourism app" into an actual preservation tool, and it should be the centerpiece of the pitch, not a side feature.

### Content swap
Replace Jharkhand seed data with real Sikkim monastery content. Known major sites to prioritize: Rumtek, Pemayangtse, Tashiding, Enchey. Public tourism-board photography exists for these and should be usable for demo purposes — need to confirm licensing/sourcing before using anything in a submitted deliverable.

## 5. Known pattern to watch (context Claude Code should know, not to lecture Pranav about, just to help hold the line if scope starts creeping)

Pranav has a documented tendency across past projects to keep expanding scope or generating new directions rather than finishing a tightly-defined build (this showed up in a prior project's game-developmentด scope, among others). Given a short internal-hackathon timeline, the discipline needed here is: **ship the condition-reporting feature and the re-themed VR/gamification core well, rather than trying to preserve every feature from the original app "just in case."** If the discussion with Pranav starts drifting toward keeping Bookings, GenZ Corner, all 8 mini-games, etc. "because they're already built," that's worth naming explicitly rather than going along with it.

## 6. Open questions — ASK PRANAV, DO NOT ASSUME

1. **Team**: Who's actually on the team for this internal round? Same as before, or new members? What are their strengths/stack familiarity?
2. **Timeline**: How much time is there before the internal round — hours, days, weeks? This changes how much of the "cut" list is actually cuttable vs. just deprioritized.
3. **TripGenie**: Keep as an AI monastery guide, repurpose it into something else, or cut it entirely?
4. **Funscapes mini-games**: Keep all 8 re-themed, keep a subset, build new monastery/Sikkim-specific ones, or drop the mini-games entirely in favor of focusing on the condition-reporting feature?
5. **Content sourcing**: Does Pranav already have or have access to real Sikkim monastery photography/data, or does this need to be sourced/generated, and from where (with proper licensing)?
6. **Infrastructure**: Is the existing Supabase project being reused (same env, same auth users, same tables extended), or does this need a fresh project?
7. **Condition-reporting feature scope**: Just submission + AI severity classification + a simple ranked list, or a fuller admin workflow (assignment, status tracking, resolution logging)?
8. **Languages**: Keep English/Hindi i18n as-is, or is there value in adding Sikkim-specific languages (Nepali, Bhutia, Lepcha) given the cultural specificity of the pitch?
9. **Pitch framing**: Does Pranav want to be upfront in the presentation that this is a repurposed, previously-selected codebase (a legitimate strength — proven infrastructure, more time for the new feature), or downplay that origin? This affects how the demo and slides should be built, not just the code.

---

**Reminder to Claude Code: talk through this with Pranav first. Don't start building until the open questions above have real answers from him, and don't assume the "recommended" plan above is final — treat it as a strong starting proposal to pressure-test with him, not a spec to execute.**
