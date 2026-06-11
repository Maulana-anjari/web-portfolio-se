---
title: "Fitted: AI-Powered Wardrobe Intelligence Platform"
slug: "fitted-wardrobe-intelligence"
role: "System Designer & Technical Architect"
company: "Fitted"
period: "2024–2025"
tags: ["Flutter", "Supabase", "PostgreSQL", "Riverpod", "AI/ML", "GPT-4o", "Computer Vision", "Fashion Tech", "Mobile App", "System Design"]
image: "/images/fitted-hero.webp"
metric: "Design Phase Complete"
excerpt: "Designed the architecture and product specification for an AI-powered wardrobe intelligence platform that digitizes clothing, generates personalized Fits, and provides daily styling recommendations. Currently in pre-production design phase."
order: 8
---
# Fitted — AI-Powered Wardrobe Intelligence Platform

## Keywords
Flutter, Supabase, PostgreSQL, Riverpod, GPT-4o Vision, AI recommendation engine, computer vision, fashion tech, wardrobe digitization, system architecture design, Edge Functions, Row Level Security, MVP architecture

## Overview

Fitted is an AI-powered wardrobe intelligence platform designed to help users digitize their clothing inventory, create personalized Fits (outfits), plan what to wear via a calendar, and receive daily AI-driven styling recommendations. The product targets three primary user segments: college students looking to look stylish on a budget, young professionals trying to reclaim time each morning, and fashion enthusiasts who want to curate and analyze their wardrobe usage.

The platform is currently in the design and specification phase. A complete Product Requirements Document (PRD v2.0), a Technical Architecture Document (TAD v2.0), and a comprehensive Design System (FITTED.DESIGN.md) have been produced. No production code has been deployed; the work to date has focused on system design, architecture decisions, and product definition.

## My Role

I was responsible for the full system design and technical architecture of Fitted. This included authoring the Technical Architecture Document, designing the Supabase-native backend architecture, defining the database schema (core tables, relationships, RLS policies), planning the AI orchestration layer across multiple foundation models, structuring the Flutter frontend architecture (feature-first + clean architecture), and establishing the MVP scoping and future migration path to a dedicated backend (NestJS) at scale.

## Problem

Five interrelated problems motivated Fitted:

1. **Outfit decision fatigue** — Users spend significant cognitive energy every day deciding what to wear.
2. **Underutilized wardrobes** — Most clothing items are rarely worn despite continued purchases, creating waste and inefficiency.
3. **Impulse shopping** — Users buy new clothes without visibility into what they already own.
4. **Lack of wardrobe visibility** — No measurable understanding of wardrobe utilization, cost-per-wear, or style patterns.
5. **Difficult fit coordination** — Users struggle to combine existing items into attractive, context-appropriate Fits.

These problems compound: poor visibility drives unnecessary purchases, unused items accumulate, and each morning becomes a low-stakes but recurring decision burden. Existing solutions address individual symptoms (shopping apps, wardrobe trackers, style quizzes) but none integrate the full loop from digitization to recommendation to scheduling to analytics.

## Solution Design

### Architecture Philosophy

The architecture was guided by a core constraint: deliver an AI-first product with minimal backend maintenance during MVP, while preserving a clean migration path to a dedicated backend when scale demands it. This led to a Supabase-native design where the Flutter frontend communicates directly with Supabase for auth, database, storage, and Edge Functions, bypassing a dedicated application server entirely.

![Fitted system architecture — Flutter ↔ Supabase ↔ AI Services](/images/fitted-architecture.webp)

### System Architecture

```
Flutter App → Supabase Platform → External AI Services
                ├── Auth (Google/Apple/Email)
                ├── PostgreSQL (RLS-enforced)
                ├── Storage (Private buckets)
                └── Edge Functions (AI orchestration)
```

Edge Functions handle all sensitive operations: secure AI API calls, prompt construction, recommendation generation, image processing orchestration, and email dispatch via Space Mail SMTP. This avoids exposing API keys to the client and keeps AI logic server-side without maintaining a dedicated backend.

### Database Schema

Eight core tables define the data model: `users` (managed by Supabase Auth), `user_preferences`, `wardrobe_items` (with rich metadata including category, color, material, season, formality), `fits` (saved combinations), `fit_items` (join table linking fits to wardrobe items), `planned_fits` (calendar schedule), `wear_history` (actual usage tracking), and `recommendation_history` (AI recommendation tracking for preference learning).

Row Level Security is applied to all tables. Storage buckets are private by default, with scoped public URL generation for sharing.

![Fitted data model — eight core tables with RLS](/images/fitted-data-model.webp)

### AI Architecture

Rather than training custom models, Fitted orchestrates existing foundation models:

- **GPT-4o Vision** for clothing understanding (category, color, material, season, formality) with Gemini 2.5 as fallback
- **RMBG** for background removal, with Cloudinary as alternative
- **GPT-4o** for the Smart Fit Engine (contextual recommendation generation) and Fit Coach (conversational styling)
- **Stable Diffusion XL / IDM-VTON / CatVTON** for virtual try-on (Fit Preview, Phase 3+)

The AI layer is stateless and prompt-driven: each Edge Function constructs context-rich prompts incorporating wardrobe inventory, weather data, wear history, calendar events, and user preferences, then parses structured responses for the client.

![Fitted AI pipeline — foundation model orchestration for wardrobe understanding and styling](/images/fitted-ai-pipeline.webp)

### MVP Phasing

Three-phase rollout with clear scope boundaries:

- **Phase 1**: Authentication, wardrobe digitization, AI background removal, AI categorization
- **Phase 2**: Fit Builder (drag-and-drop canvas), My Fits, Fit Planner (calendar scheduling), wear tracking
- **Phase 3**: Fit Check (conversational AI), Smart Fit Engine (full recommendation pipeline), weather integration, Fit Collections

### Future-Proofing

The architecture explicitly plans for a post-MVP migration to NestJS when either MAU exceeds 10,000 or AI requests exceed 100,000/month. The migration path is staged: first insert NestJS as an API layer between Flutter and Supabase, then evolve toward microservices (AI Service, Recommendation Service, Analytics Service) behind an API gateway.

![Fitted UI screens — wardrobe digitization, Fit Builder, and Fit Planner](/images/fitted-ui-screens.webp)

### Design System

The visual design system (documented in FITTED.DESIGN.md) establishes a premium, minimal identity: Deep Charcoal (#111827) as primary, Indigo (#6366F1) reserved exclusively for AI features as a learned visual cue, Inter typography across seven size levels, 8px-base spacing, and 150–250ms motion guidelines. The design philosophy emphasizes emotional communication over data presentation — insights are phrased as "You haven't worn this jacket in 143 days" rather than "45% wardrobe utilization."

![Fitted design system — typography, color, spacing, and component guidelines](/images/fitted-design-system.webp)

## Key Design Decisions

**Supabase-native over dedicated backend.** Using Supabase Edge Functions instead of NestJS for MVP eliminates server maintenance and reduces time-to-market. The trade-off is limited debuggability and execution time constraints (10s timeout for Edge Functions), which is acceptable for stateless AI inference calls. This decision is explicitly reversible with a documented migration path when scale warrants it.

**SQL-first data access over ORM.** The TAD explicitly rejects ORMs for MVP. Raw PostgreSQL with Supabase's type-safe client provides direct control over queries, simpler debugging, and no abstraction overhead. The trade-off is more verbose data access code in the Flutter layer, but this is acceptable for the schema's complexity level.

**Foundation model orchestration over custom ML training.** No custom models are trained. All AI capabilities are built by composing and prompting existing models (GPT-4o, Gemini, RMBG). This dramatically reduces ML infrastructure cost and iteration time. The trade-off is dependency on third-party API pricing and model availability, mitigated by fallback chains (e.g., Gemini for vision when GPT-4o is unavailable).

**Feature-first architecture with Riverpod.** The Flutter frontend uses a feature-first directory structure (auth/, wardrobe/, fits/, planner/, fit_check/, fit_insights/, profile/) with clean architecture layers within each feature. Riverpod was chosen over Provider or BLoC for its compile-time safety, testability, and natural fit with the feature-first pattern. Hive provides offline caching for wardrobe items, fits, and user preferences.

**Private-by-default storage with scoped sharing.** All storage buckets are private with Row Level Security. Public URLs are generated only for explicit share actions. This is more complex than a fully public bucket but necessary for user trust and compliance with Indonesian data protection regulations (PDP).

## Current Status

Design and specification phase complete. The PRD, Technical Architecture Document, and Design System are finalized. No production code has been deployed to app stores. A Flutter project scaffold exists with the feature-first directory structure and core dependencies configured. The next step is Phase 1 implementation: authentication flows, wardrobe upload with AI background removal, and AI categorization.

## What I Learned

Designing an AI-powered consumer product from scratch required weighing trade-offs across multiple dimensions simultaneously — infrastructure cost vs. control, development speed vs. scalability, abstraction vs. flexibility. The most valuable discipline was documenting explicit non-goals (no microservices, no Kubernetes, no custom ML, no ORM) to prevent scope creep during design.

The Supabase-native architecture taught me that "no backend" does not mean "no architecture." Edge Functions still require careful prompt engineering, error handling, and timeout management. The migration path from serverless to dedicated backend needs to be designed upfront, even if the trigger conditions (10k MAU, 100k AI requests/month) are distant — because retrofitting a backend layer into a tightly coupled Supabase app would be expensive.

The design system work reinforced that AI products need especially careful UX vocabulary. The decision to use "Purple = AI Intelligence" as a learned color cue, and to ban the word "outfit" in favor of "Fit" throughout the codebase and UI, was a deliberate attempt to build a distinct product identity rather than cloning existing wardrobe apps. Whether this vocabulary constraint survives user testing remains an open question worth measuring.
