---
title: "Find-IT Registration Platform"
slug: "find-it"
role: "Primary Backend Engineer"
company: "Find IT UGM"
period: "Jan – Mar 2022"
tags: ["Node.js", "Express.js", "MongoDB", "JWT", "Multer"]
image: "/images/find-it-project.webp"
metric: "45-day sprint delivery"
excerpt: "First major backend delivery — registration platform API for a national competition. 6 Mongoose models, JWT + Google OAuth, email verification, and Google Drive integration — 89% solo-authored."
order: 6
---

# Find-It Registration Platform — First Backend Delivery

## 🧾 Overview

**My first major backend project.** Built the entire registration platform API for Find IT 2022, a national-level competition event, in a 45-day sprint (Jan 19 – Mar 4, 2022). As the primary backend engineer on a 2-person backend team, I wrote **89% of the codebase** (~12,068 lines), authored **34 commits** (40% of repo) and **14 merged PRs** (67% of all PRs).

This was the origin story — the project where I learned backend engineering by doing, delivered under real deadline pressure, and established patterns I carried into Technocorner, Pertamina EP, and beyond.

---

## 🔗 Repository

- Private project; details sanitized for public sharing.

---

## 🔑 Backend Keywords

Node.js, Express.js, MongoDB/Mongoose, JWT authentication, Google OAuth (Passport.js), email verification (Nodemailer + Zoho SMTP), Google Drive API, Multer file upload, express-validator, team management workflows, admin dashboard, real-time statistics

---

## 🛠️ My Role

- **Primary Backend Engineer** — 2-person backend team (collaborated with Jovian Reynaldo, who handled deployment and minor bug fixes).
- Initiated the repository and built the entire backend architecture from scratch: project scaffolding, 6 Mongoose data models, routing, controllers, middleware, validation, third-party integrations.
- **89% codebase ownership** — 34 non-merge commits (40% of total), 14 merged PRs (67% of all PRs), ~12,068 lines added.

---

## ❗ Problem

Find IT 2022 needed a production-ready registration platform to serve **~200–300 teams** across **6 competition categories** (Hackathon, Mobile Legends, Competitive Programming, Data Analytics, Capture The Flag, Valorant) plus a webinar track. The platform had to handle registration, team creation and management, document upload, admin verification, and real-time statistics — all within a **45-day development window**.

There was no existing backend. No scaffolding. No prior institutional codebase to borrow from. This was built entirely from zero by a junior developer still learning Express.js and MongoDB.

---

### 🧩 Sub-Problem: Full authentication system from scratch

- **Problem:** The platform needed complete user auth — registration, email verification, login, password reset, and Google OAuth — before any team features could work.
- **Solution:** Built a JWT-based auth system with activation links via Zoho SMTP (Nodemailer), Google OAuth via Passport.js (client-side token verification + server-side session), forgot/reset password flow with email tokens, and multi-source token extraction (Bearer header, cookie, query param).
- **Stack:** Express.js, jsonwebtoken + express-jwt, Passport.js + passport-google-oauth20, Nodemailer, Zoho SMTP, express-validator.
- **Result:** 6 auth endpoints in `controllers/auth.js` (440 lines), with input validation on all routes. Users could register, verify email, login via JWT or Google, and reset passwords.

### 🧩 Sub-Problem: Team management across 6 event categories

- **Problem:** Team workflows had to work identically across 6 different competition categories, each with different slot limits, leader constraints, and verification rules (e.g. Hackathon didn't require payment proof).
- **Solution:** Designed a flexible team system with crypto-generated team codes, leader validation (profile completeness check, duplicate team/leader prevention per event), slot-based join validation, member kick by leader, and category-aware verification logic.
- **Stack:** Mongoose models (Team, TeamMember) with population queries, JWT-protected routes, Multer file upload to Google Drive API, Nodemailer email notifications to admin on team verification submission.
- **Result:** 7 team endpoints in `controllers/team.js` (534 lines) + dedicated team middleware (164 lines). Team creation, search-by-code, join-with-slot-check, payment proof upload to Google Drive, and leader-only member kick.

### 🧩 Sub-Problem: Admin dashboard with real-time statistics

- **Problem:** Event organizers needed a single dashboard to manage events, announcements, verify/reject teams with email notifications, and see real-time statistics broken down by event category and verification status.
- **Solution:** Built 10 admin endpoints covering CRUD for events and announcements, team accept/reject with HTML email templates (including re-registration links for e-sport categories), team deletion, and a statistics endpoint aggregating counts per event × per status (verified/rejected/checking/unsubmitted).
- **Stack:** MongoDB aggregation pipelines, Nodemailer styled HTML email templates, JWT + ensureAdmin middleware.
- **Result:** `controllers/admin.js` (576 lines) with 10 admin endpoints. Statistics endpoint provided breakdown across all 6 events and 4 verification statuses. Rejection emails for e-sport teams included styled HTML with re-registration Bitly links.

### 📊 Metric callouts

![89% codebase ownership](https://img.shields.io/badge/89%25-codebase_ownership-10b981?style=for-the-badge)
![28+ API endpoints](https://img.shields.io/badge/28+-API_endpoints-0ea5e9?style=for-the-badge)
![45-day sprint](https://img.shields.io/badge/45-day_sprint-f59e0b?style=for-the-badge)
![6 event categories](https://img.shields.io/badge/6-event_categories-8b5cf6?style=for-the-badge)
![14 PRs merged](https://img.shields.io/badge/14-PRs_merged-ec4899?style=for-the-badge)
![~200-300 teams served](https://img.shields.io/badge/~200–300-teams_served-111827?style=for-the-badge)

---

## 🧰 Stack

| Category | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js 4.17 |
| Database | MongoDB + Mongoose 6.1 |
| Authentication | JWT (jsonwebtoken + express-jwt) |
| OAuth | Passport.js + passport-google-oauth20 |
| Email | Nodemailer via Zoho SMTP (smtp.zoho.com:465) |
| File Upload | Multer 1.4 + Google Drive API (googleapis) |
| Validation | express-validator 6.14 |
| Session | express-session + connect-mongo |
| Password Hashing | Node.js crypto (HMAC-SHA1) |

---

## Architecture / Flow

```
Client (Frontend)
    │
    ├── POST /auth/* ──────────── JWT + Google OAuth + email verification
    ├── GET/POST/PATCH /team/* ── Team CRUD + join/search/kick/verify
    ├── GET/PATCH /user/* ─────── User profile + institution file upload
    ├── GET/POST/DELETE /admin/* ─ Admin CRUD + team accept/reject + statistics
    └── POST /webinar/* ───────── Webinar join
            │
    ┌───────┴────────┐
    │  Express.js API │
    │  ┌───────────┐  │
    │  │ Middleware │  │ ← JWT (requireSignin) + ensureAdmin + Team validation
    │  ├───────────┤  │
    │  │Controllers│  │ ← Auth (440L) + Team (534L) + Admin (576L) + User (184L)
    │  ├───────────┤  │
    │  │  Models   │  │ ← 6 Mongoose schemas: User, Team, TeamMember, Event, Announcement, Webinar
    │  └─────┬─────┘  │
    └────────┼────────┘
             │
    ┌────────┼────────────────────┐
    │        ▼                     │
    │  MongoDB (Mongoose)          │
    │  Google Drive API (uploads)  │
    │  Zoho SMTP (Nodemailer)      │
    └──────────────────────────────┘
```

**API endpoint breakdown:**
- **Auth (6):** register, activation, login, forgot/reset password, Google OAuth
- **Team (7):** create, search by code, join, get details, update, verify (upload to Drive), kick member
- **User (4):** get profile, update profile, upload institution file, find user teams
- **Admin (10):** CRUD event, CRUD announcement, list teams, get teams by event, delete team, accept team (+email), reject team (+email), statistics
- **Webinar (1):** join

---

## 📈 Result / Impact

- Delivered a **complete backend API (28+ endpoints)** for a national competition platform serving ~200–300 teams across **6 event categories** in **45 days**.
- Wrote **89% of the entire codebase** (~12,068 lines) as the primary backend engineer on a 2-person team.
- Authored **14 merged PRs** (67% of all repository PRs) and **34 non-merge commits**.
- Designed **6 Mongoose data models** covering users, teams, team members, events, announcements, and webinars.
- Integrated **3 external services**: Google Drive (file upload), Zoho SMTP (transactional email), Google OAuth (social login).
- Built an **admin dashboard with real-time statistics** broken down by event × verification status, plus HTML email templates for team accept/reject notifications.

---

## ✅ Solution

- Initiated the repository and built the entire backend architecture from zero — Express.js project setup, MongoDB connection, CORS, session management, error handling middleware, 6 router modules.
- Implemented full authentication system: JWT registration with email activation, multi-source token extraction (header/cookie/query), Google OAuth via Passport.js, forgot/reset password flow.
- Built team management workflows: crypto team-code generation, leader-only kick, slot-based join validation, category-aware verification (Hackathon bypasses payment upload).
- Integrated Google Drive API for payment proof and institution file uploads, with Nodemailer email notifications to admins on new verification submissions.
- Developed admin dashboard with CRUD operations, team accept/reject with styled HTML email notifications (including re-registration links for e-sport categories), and real-time statistics aggregation.

---

## 🖼️ Evidence

| Evidence Type | Description |
|---|---|
| **Certificate** | Formal backend engineer certificate from Find IT 2022 committee (`sertifikat-backend-find-it.jpeg`) |
| **Git metrics** | 34 non-merge commits, 14 merged PRs (67% of repo), ~12,068 lines added (89% of codebase) |
| **Source code** | `controllers/auth.js` (440 lines), `controllers/team.js` (534 lines), `controllers/admin.js` (576 lines), 6 Mongoose models |
| **API surface** | 28+ endpoints across 5 route modules (Auth, Team, User, Admin, Webinar) |
| **Timeline** | 45-day development sprint (Jan 19 – Mar 4, 2022), 30 tracked commits |

---

## ⚠️ Challenges

- **Building while learning.** This was my first major backend project. Every pattern — auth flows, middleware chains, file upload to external APIs, email integration — was being learned and applied simultaneously under a 45-day deadline.
- **Designing for 6 event categories without duplication.** Each category had different rules (slot sizes, payment requirements, leader constraints). The data model and controller logic had to be flexible enough to handle all 6 without branching spaghetti code.
- **Solo ownership of the codebase.** With 89% of the code written by me, every production bug, every edge case, and every late-breaking requirement change landed on my plate. This taught me to write defensive, self-documenting code early.
- **External service integration with no prior experience.** Google Drive API, Passport.js OAuth, and Zoho SMTP were all new. Figuring out OAuth2 token flows, Multer file piping to Drive, and HTML email templates while shipping features was the steepest part of the learning curve.

---

## 💡 What I Learned

- **Shipping a complete backend in 45 days as a junior developer is possible — if you own every line.** Being the 89% contributor meant no hiding behind someone else's code. Every failure mode was mine to fix, and that accelerated my growth more than any tutorial could.
- **Design data models for variance from day one.** Six event categories with different rules forced me to think in abstractions — not hardcoding per-event logic, but building configurable validation layers. This habit of designing for variation carried directly into Technocorner and Pertamina.
- **External integrations are not "just API calls."** Google OAuth token flow, Drive file permission scoping, and SMTP email deliverability each had hidden complexity that consumed disproportionate debugging time. After this project, I never again underestimated third-party integration effort in estimates.
- **The foundation matters more than the features.** The patterns established in this first project — middleware-based auth guard, centralized validation helpers, controller-service separation — became the template I reused and refined in every subsequent backend project.

---

