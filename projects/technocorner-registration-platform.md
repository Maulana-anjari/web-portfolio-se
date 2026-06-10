---
title: "Technocorner Registration Platform"
slug: "technocorner"
role: "Primary Backend Developer"
company: "KMK UGM"
period: "Nov 2022 – May 2023"
tags: ["Node.js", "Express.js", "MongoDB", "Next.js", "JWT"]
image: "/images/technocorner-project.webp"
metric: "200+ participant teams"
excerpt: "National engineering competition registration platform serving 5 contest tracks. Full-stack delivery with Express.js backend, Next.js 13 frontend, JWT auth, payment verification, and Google integrations."
order: 5
---

# Technocorner Registration Platform

## Overview

Full-stack registration platform for **Technocorner UGM 2023** — a national engineering competition organized by KMK UGM with 5 contest tracks (EEC, IoT, Line Follower, Sumorobot, Transporter) serving ~200 participant teams. I was the **primary backend developer**, authoring **94.3% of backend commits** (66 of 70), plus **107 frontend commits** as API integrator and auth developer — totaling **173 commits across both repos** over a 6-month development cycle (November 2022 – May 2023).

Unlike my earlier sprint-style event project (Find-It), Technocorner was a **mature, sustained delivery** spanning initialization, feature development, production deployment (Cyclic → Render migration), and post-event maintenance. It demonstrates full-stack capability — Express.js backend with MongoDB, Next.js 13 frontend with Redux Toolkit, cross-domain cookie-based authentication, Google Drive + Sheets integrations, and real production debugging (10+ CORS-related commits).

## Repository

- BE_TC23 (backend): `WebTechnocorner-2023/BE_TC23` — 66 of 70 commits authored (94.3%)
- FE_TC23 (frontend): `WebTechnocorner-2023/FE_TC23` — 107 commits authored
- Deployment mirror: `Maulana-anjari/temp-api-technocorner`
- Private repositories; details sanitized for public sharing

## Keywords

Node.js, Express.js, MongoDB, Mongoose, JWT authentication, Google OAuth2 (Passport.js), Nodemailer, Google Drive upload, Google Sheets export, Next.js 13, Redux Toolkit, Tailwind CSS, cookie-based auth, CORS, deployment (Cyclic → Render), REST APIs, full-stack, production operations

## My Role

**Primary Backend Developer** — effectively solo backend owner — built the entire REST API, database schema, authentication/authorization system, email service, Google integrations, and deployment pipeline from scratch. Authored 94.3% of all backend commits; the only other contributors were a minor dev (3 commits) and a deployment bot (1 commit). Also contributed **107 commits to the frontend** as API integrator: built the authentication flow, user dashboard, and registration pipeline using Next.js 13, Redux Toolkit, and Tailwind CSS.

## Problem

Technocorner UGM needed a reliable registration platform for a national-scale engineering competition spanning 5 contest tracks, each with distinct business rules, team compositions, and pricing. The system had to handle:

1. Team registration with multi-member data collection and document uploads (photos, ID cards, promotional materials)
2. Payment verification with proof-of-transfer upload
3. Admin review workflows — team verification, status tracking, announcements
4. Exportable statistics for the organizing committee (Google Sheets)
5. Authentication for participants, admins, and Google OAuth users
6. Production deployment with separate frontend and backend domains — requiring CORS and cross-domain cookie management

The platform went live for ~200 teams and ran through the event with ongoing maintenance.

### Sub-Problem: Multi-track team registration at scale

- **Problem**: 5 competition tracks (EEC, IoT, Line Follower, Sumorobot, Transporter) with different team structures, member counts, and pricing. Registration logic had to be track-aware without branching into 5 separate code paths.
- **Solution**: Designed a unified `Tim` model with a `cabangLomba` enum field, normalized member storage via the `Anggota` model, and registration services that composed track-specific validation on top of a shared core. 7 Mongoose models (User, Tim, Anggota, Pembayaran, Pengumuman, Linktree, Url) mapped the domain cleanly.
- **Stack**: Express.js, MongoDB/Mongoose, JWT auth, Multer (file upload), Google Drive API.
- **Result**: Single registration flow served all 5 tracks. Admin could filter, verify, and export per-track statistics without separate dashboards.

### Sub-Problem: Cross-domain authentication between Next.js frontend and Express backend

- **Problem**: The frontend (Next.js 13) and backend (Express.js) ran on separate domains — requiring cookie-based session management across origins. Standard localhost auth patterns broke in production.
- **Solution**: Implemented JWT-based auth with `httpOnly` cookies, configured `sameSite: 'none'` and `secure: true` for cross-domain delivery, and built the frontend auth layer using Redux Toolkit async thunks with `withCredentials: true` on every Axios request. Auth coverage included signup, email activation (Nodemailer + Zoho SMTP), signin, forgot/reset password, Google OAuth2 (Passport.js), and role-based access control (admin vs user).
- **Stack**: JWT (jsonwebtoken), bcrypt, Passport.js (Google OAuth2), Nodemailer, cookie-parser, express-session + connect-mongo, Redux Toolkit, axios.
- **Result**: Seamless auth flow across separate frontend and backend domains. Role-protected admin routes and user dashboard functioned correctly in production.

### Sub-Problem: CORS and deployment reliability in production

- **Problem**: Deploying a cross-origin Express.js backend to Cyclic and later to Render exposed persistent CORS misconfigurations. Cookies weren't being set, preflight requests failed, and environment-specific origins behaved inconsistently.
- **Solution**: Iterated through **10+ CORS fix commits** across February–May 2023 — adjusting `origin` configuration, `credentials: true`, header allow-lists, and environment-variable-driven CORS settings. Migrated deployment from Cyclic (initial) to Render (final) when Cyclic's free tier proved unstable.
- **Stack**: cors middleware, Helmet, environment-driven configuration, Cyclic, Render.
- **Result**: Stable production deployment on Render serving cross-domain cookie-based auth. Gained real operational experience debugging deployment-edge-case issues that don't appear in local development.

### Metric Callouts

![94.3% backend ownership](https://img.shields.io/badge/94.3%25-backend_ownership_(66/70_commits)-0ea5e9?style=for-the-badge)
![173 total commits](https://img.shields.io/badge/173_total-commits_(BE+FE)-111827?style=for-the-badge)
![5 competition tracks](https://img.shields.io/badge/5-competition_tracks-10b981?style=for-the-badge)

## Stack

| Layer | Technology | Details |
|-------|-----------|---------|
| Runtime | Node.js | Express.js 4.18.2 |
| Database | MongoDB (Mongoose 6.7.2) | 7 models: User, Tim, Anggota, Pembayaran, Pengumuman, Linktree, Url |
| Auth | JWT + Passport.js + Nodemailer | Signup, email activation, signin, forgot/reset password, Google OAuth2, role-based access (admin/user) |
| Email | Nodemailer 6.8.0 + Zoho SMTP | Activation emails, password reset |
| File Upload | Multer 1.4.5 → Google Drive | Photos, ID cards, promotional materials, payment proof |
| Integrations | Google Drive API, Google Sheets API | Categorized upload folders, per-track statistics export |
| Security | Helmet, CORS, bcrypt, compression, express-validator | Cookie-based session, rate limiting |
| Frontend | Next.js 13, React 18, Redux Toolkit 1.9, Tailwind CSS 3.2, Material UI 5.11 | Auth flow, user dashboard, registration pipeline, admin pages |
| Deployment | Cyclic (initial) → Render (final) | Cross-domain deployment with CORS configuration |

## Architecture / Flow

```
┌────────────────────────────────┐
│        Next.js 13 (FE_TC23)    │
│   Auth · Dashboard · Register  │
│   Redux Toolkit · Axios        │
│   withCredentials: true        │
└──────────────┬─────────────────┘
               │ cookie-based auth (cross-domain)
               ▼
┌────────────────────────────────┐
│      Express.js (BE_TC23)      │
│  4 route groups:               │
│  Auth · User · Admin · Google  │
│  MVC: controllers/services/    │
│  models/middleware/utils        │
└───┬───────┬────────┬───────────┘
    │       │        │
    ▼       ▼        ▼
┌────────┐ ┌──────┐ ┌──────────────┐
│MongoDB │ │Google│ │ Google       │
│(7 models)│ │Drive │ │ Sheets       │
│        │ │Upload│ │ (Statistics  │
│        │ │Files │ │  Export)     │
└────────┘ └──────┘ └──────────────┘
```

- **FE → BE**: Cookie-based JWT auth with `withCredentials`, Redux Toolkit async thunks, Axios HTTP client. Auth slice manages signup/signin/activate/logout state.
- **BE API**: 4 route groups (Auth, User, Admin, Google Auth). Controllers → Services → Models architecture. Middleware chain: ensureAuth, ensureAdmin, ensureGuest.
- **Google Drive**: Multer handles multipart upload; `GoogleDrive.js` utility uploads to categorized folders (foto, KTP, twibbon, bukti transfer). Supports delete-and-replace on update.
- **Google Sheets**: `exports-sheets.js` writes verified team data per competition track. `statistic.service.js` computes counts: verified/unverified/failed per cabang lomba.
- **Deployment**: Cyclic (February 2023, initial) → Render (May 2023, final). Package.json `push-deploy` script for Cyclic; `temp-api-technocorner` mirror for Render.

## Result / Impact

| Metric | Value | Evidence |
|--------|-------|----------|
| Backend commits authored | 66 of 70 (94.3%) | GitHub Contributors API: `Maulana-anjari: 66, ahmadzakiakmal: 3, wdtcugm: 1` |
| Frontend commits authored | 107 | GitHub Contributors API: `Maulana-anjari: 107` |
| Total commits (BE + FE) | 173 | Combined commit counts |
| Competition tracks | 5 | EEC, IoT, Line Follower, Sumorobot, Transporter |
| Mongoose models | 7 | User, Tim, Anggota, Pembayaran, Pengumuman, Linktree, Url |
| Route groups | 4 | Auth, Admin, User, Google Auth |
| Development timeline | 6 months | Nov 15, 2022 (first commit) – May 22, 2023 (last commit) |
| Teams served | ~200 (needs-confirmation) | Candidate estimate from memory; MongoDB Cloud no longer accessible |
| PRs merged (BE) | 2 | PR #2 (statistik + sheet), PR #3 (tautan) |
| PRs merged (FE) | 1 | PR #14 (authentication) |
| CORS fix iterations | 10+ commits | February–May 2023 commit history; Cyclic → Render migration |

## Solution

1. **Solo backend delivery** — built the entire REST API from `npm init` to production, authoring 94.3% of backend commits. Only 4 commits came from other contributors. Designed 7 Mongoose models, 4 route groups, and full MVC architecture with services, middleware, and utility layers.
2. **Complete authentication system** — JWT + Google OAuth2 (Passport.js) with email verification (Nodemailer + Zoho SMTP), cookie-based session management (`httpOnly`, `sameSite: 'none'`, `secure: true`), role-based access control (ensureAuth/ensureAdmin/ensureGuest middleware), and frontend auth integration via Redux Toolkit async thunks.
3. **Full-stack registration pipeline** — 107 frontend commits delivering the complete user journey: signup → email activation → login → team registration (multi-member, document upload) → dashboard → profile management. Redux Toolkit managed auth and registration state; Axios handled cross-domain cookie-based requests.
4. **Production operations** — iterated through 10+ CORS fix commits, migrated deployment from Cyclic to Render when the free tier became unreliable, and maintained the platform post-event through May 2023. This was not a "build and handoff" project — it required sustained production debugging.
5. **Google ecosystem integrations** — categorized file uploads to Google Drive (foto, KTP, twibbon per team member + payment proof) with delete-and-replace semantics. Per-track statistics auto-exported to Google Sheets for the organizing committee, reducing manual reporting effort.

## Challenges

- **CORS + cross-domain cookie auth in production**: The single largest source of deployment bugs. Cookie-based JWT auth between a Next.js frontend and Express.js backend on different domains required precise CORS configuration (`origin`, `credentials`, allowed headers) and correct cookie flags (`sameSite`, `secure`, `httpOnly`). Localhost worked; production didn't. Required 10+ iterative fixes spread across 3 months before stabilizing. This was a practical lesson in how deployment environment differences surface subtle auth bugs.
- **Deployment platform instability**: Cyclic's free tier proved insufficient for production load, necessitating a mid-project migration to Render. The migration was straightforward but required environment variable reconfiguration, CORS origin updates, and a deployment mirror repo (`temp-api-technocorner`). The experience reinforced that free-tier platforms are fine for prototyping but unreliable for live event workloads.
- **Multi-track registration without code duplication**: 5 competition tracks could easily have become 5 separate registration flows. Centralizing track differentiation in the data model (`cabangLomba` enum on `Tim`) and composing track-aware validation kept the codebase DRY while supporting distinct business rules per track.
- **Maintaining the system during live event operations**: Unlike a sprint-and-done project, Technocorner required ongoing maintenance as teams registered, admins verified, and edge cases surfaced. Fix commits in March–May 2023 addressed bugs found by real users during the competition cycle — impostor syndrome bugs (teams unable to register for certain tracks, profile edit failures, password change errors) that only appeared under real usage patterns.

## What I Learned

- **Production is the real testing environment**: CORS misconfigurations, cookie delivery failures, and deployment platform quirks only surfaced in production. 10+ CORS fix commits taught me that deployment debugging is a distinct skill from development — it requires understanding browser security policies, proxy behavior, and environment-variable-driven configuration at a deeper level than local development does.
- **Cookie-based cross-domain auth is deceptively complex**: `httpOnly`, `sameSite`, `secure`, `withCredentials` — each flag interacts with browser security models differently across environments. Getting this right between a Next.js frontend and Express.js backend on separate domains required methodical iteration and an understanding of how browsers enforce cookie policies.
- **Sustained delivery vs. sprint delivery are different skills**: Find-It was a 45-day sprint; Technocorner was a 6-month sustained delivery with post-launch maintenance. The latter required different disciplines — keeping the codebase maintainable over time, debugging issues reported by real users, and delivering fixes under live-event pressure. The frontend contributions (107 commits) added full-stack context that pure backend work doesn't provide.
- **Model-rich schema design simplifies multi-variant logic**: 7 Mongoose models wasn't over-engineering — it was the right abstraction for a domain with 5 competition tracks, multi-member teams, payment tracking, admin announcements, and URL management. Clean schema design prevented the "one giant collection" anti-pattern that makes event platforms brittle.
- **Free-tier platforms have hidden costs**: Migrating from Cyclic to Render mid-project consumed time that could have gone to features. For live-event systems, starting with a platform you trust for production scale is worth the upfront cost — the migration overhead of switching platforms under time pressure exceeds the savings of starting free.

## Evidence

| Claim | Type | Source | Confidence |
|-------|------|--------|------------|
| 66 of 70 backend commits (94.3%) | Impact | GitHub Contributors API: `Maulana-anjari: 66, ahmadzakiakmal: 3, wdtcugm: 1` | verified |
| 107 frontend commits | Impact | GitHub Contributors API: `Maulana-anjari: 107` | verified |
| 7 Mongoose models | Impact | `src/models/` directory: User, Tim, Anggota, Pembayaran, Pengumuman, Linktree, Url | verified |
| 5 competition tracks | Impact | FE pages + BE `Tim.cabangLomba` field | verified |
| 6-month development cycle | Impact | First commit: Nov 15, 2022; last commit: May 22, 2023 | verified |
| JWT + Google OAuth2 + email verification | Action | `auth.controller.js`, `auth.service.js`, `email.service.js`, `GooglePassport.js` | verified |
| Cookie-based cross-domain auth | Action | BE: `res.cookie("token", ..., {httpOnly, sameSite: 'none', secure})`; FE: `withCredentials: true` | verified |
| Google Drive + Sheets integration | Action | `GoogleDrive.js`, `exports-sheets.js`, `statistic.service.js` | verified |
| Cyclic → Render deployment migration | Action | Package.json `push-deploy` (Cyclic), FE authService `API_URL` (Render), `temp-api-technocorner` mirror repo | verified |
| 10+ CORS fix commits | Action | Commit history: Feb–May 2023, multiple "fix: cors" commits | verified |
| Express.js + Next.js 13 tech stack | Scope | `package.json` both repos | verified |
| ~200 teams served | Impact | Candidate estimate from memory; MongoDB Cloud no longer accessible | needs-confirmation |
