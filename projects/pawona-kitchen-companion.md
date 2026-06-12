---
title: "Pawona: AI Kitchen Companion for Indonesian Households"
slug: "pawona-kitchen-companion"
role: "System Architect"
company: "Pawona"
period: "Jan 2026 – Present"
tags: ["food-tech", "ai", "flutter", "nestjs", "supabase", "indonesia", "mobile-app", "rag"]
image: "/images/pawona-hero.webp"
metric: "Pre-Production"
status: "design"
excerpt: "Designed the system architecture for an AI-powered kitchen companion that helps Indonesian households reduce food waste by discovering meals from available ingredients. This is a design-phase case study — the architecture is complete but the system has not yet been built."
order: 9
---
# Pawona — AI Kitchen Companion for Indonesian Households

![Pawona ? AI Kitchen Companion di dapur Indonesia](/images/pawona-hero.webp)

## Keywords
food waste reduction, AI recipe recommendation, Indonesian culinary knowledge, RAG-based recommendation engine, household food management, ingredient-first cooking, modular monolith, Flutter mobile app, NestJS backend, knowledge-driven AI

## Overview

Pawona is an AI-powered kitchen companion designed to help Indonesian households solve a daily struggle: deciding what to cook from the ingredients they already have. The product addresses household food waste — a systemic problem in Indonesia where families routinely buy more than they need and let ingredients spoil because they run out of meal ideas.

The target users are two primary personas: Household Planners (ibu rumah tangga managing family meals) and Busy Independents (young professionals and kos residents with limited time and budget).

![Persona Busy Independent ? anak kos memasak dengan bantuan Pawona](/images/pawona-busy-independent.webp)

The product is currently in the design phase, with a complete Product Bible covering vision, market analysis, user personas, MVP scope, technical architecture, AI strategy, and data architecture. No code has been shipped yet.

## My Role

As System Architect, I designed the end-to-end technical architecture across five layers: presentation (Flutter), application (NestJS), intelligence (RAG-based AI), data (PostgreSQL + pgvector), and infrastructure (Supabase + Cloudflare). I also defined the engineering principles, domain boundaries, data flows, AI provider abstraction, and scalability roadmap. The work involved translating product requirements into architectural decisions that balance speed-to-validation with long-term evolvability.

## Problem

Household food waste is a significant but under-addressed problem in Indonesia. Families routinely over-purchase ingredients because they lack visibility into what they already have and what meals those ingredients can become. Existing solutions fall into two camps: generic recipe catalogs (hundreds of thousands of recipes, no personalization) and meal kit services (expensive, limited reach, Western-centric). Neither addresses the core behavioral pattern of Indonesian households: cooking daily from available ingredients with budget constraints.

![Diptych ? problem food waste (kiri) vs solusi Pawona (kanan)](/images/pawona-problem-solution.webp)

The real gap is not access to recipes — it is decision support. Users do not need more recipes; they need help answering "What can I cook today?" based on what is in their kitchen right now. The problem compounds over time: one failed decision leads to wasted ingredients, which leads to guilt, which leads to ordering food instead of cooking, which costs more.

## Solution Design

The architecture is organized as a **Modular Monolith** on NestJS with Supabase PostgreSQL, intentionally avoiding microservices until product-market fit is validated. This was a deliberate trade-off: optimize for learning speed over scalability. The system comprises five architectural layers:

**Presentation Layer** — A Flutter mobile application handling UI, state management, and offline caching. Chosen for cross-platform efficiency with a single codebase.

**Application Layer** — A NestJS API organized as domain modules (Auth, User, Recipe, Recommendation, Cooking, Kitchen, AI, Memory, Analytics). Each module follows a controller-service-repository pattern with class-validator DTOs. Business logic lives exclusively in the service layer.

![Feature close-up ? bahan dapur berubah jadi rekomendasi resep di layar](/images/pawona-feature-focus.webp)

**Intelligence Layer** — The core differentiator. Rather than using pure LLM generation (expensive, inconsistent, hard to evaluate), the system uses a **Retrieval-Augmented Generation pipeline**: Ingredient Understanding → Recipe Retrieval (structured SQL + semantic pgvector) → Recipe Ranking (weighted by ingredient match, preferences, behavior, completion signals) → Recipe Adaptation (budget, spice level, substitutions) → Response Generation. The AI is model-agnostic via a provider abstraction layer supporting OpenAI, Anthropic, and Gemini.

**Data Layer** — PostgreSQL as single source of truth, extended with pgvector for semantic search. Data is classified into five domains: User (identity, preferences), Knowledge (recipes, ingredients, regional cuisine), Behavioral (events, sessions, saves), Memory (derived preference profiles), and Analytics (PostHog for business intelligence).

**Infrastructure Layer** — Supabase for database, auth, and file storage. Redis for caching and background job queues (BullMQ). Cloudflare for CDN. Sentry for error monitoring.

![Ilustrasi flow ? bahan baku menjadi resep hingga hidangan jadi](/images/pawona-flow-illustration.webp)

The data flow for the core product loop follows: Ingredients → Recipe → Cook �?� Save → Learn → Repeat. Each stage produces behavioral signals that update user memory profiles, creating an intelligence flywheel where more cooking sessions produce better recommendations.

## Key Design Decisions

**1. Modular Monolith over Microservices.** The engineering team is small. Deploying a distributed system before validating product-market fit would add operational complexity without corresponding benefit. The domain modules are explicitly bounded so they can be extracted into separate services later if needed, but for MVP, all code ships as a single NestJS application.

**2. Recommend Before Generate.** The AI pipeline retrieves and ranks existing recipes before resorting to LLM generation. This reduces cost, eliminates hallucination risk for ingredient combinations, and produces more consistent results. LLMs are used only for adaptation (substitutions, personalization) and response formatting. The retrieval hierarchy is: structured query → hybrid retrieval → LLM reasoning (most expensive resource used last).

**3. Model-Agnostic AI Layer.** Pawona does not depend on a single AI provider. The AI module abstracts model selection behind a gateway, enabling cost optimization, vendor independence, and experimentation across OpenAI, Anthropic, and Gemini without changing application code.

**4. Structured Knowledge First.** The culinary knowledge base is stored as structured PostgreSQL data (recipes, ingredients, regions, methods) rather than in vector embeddings or unstructured documents. Vector search (pgvector) is a secondary retrieval path for semantic queries. This ensures the system can always fall back to deterministic, auditable queries and keeps AI usage scoped to where it adds genuine value.

**5. No Chatbot.** The AI is not a conversational agent. It is a recommendation and assistance system. This avoids the cost, latency, and UX complexity of maintaining multi-turn conversations. The product philosophy is "warm before smart" — the AI should feel helpful before it feels advanced.

## Current Status

The project is in an advanced design phase. The Product Bible is complete with 15+ documents covering brand positioning, market validation, user personas (4 defined, 2 primary), MVP scope (P0/P1/P2/P3 prioritization), technical architecture, AI architecture (RAG strategy, Recipe Intelligence Engine, Memory Strategy, Prompting Strategy), data architecture, infrastructure, security, and a phased 12-month roadmap. The next step is beginning MVP implementation: Flutter app scaffolding, NestJS backend with Auth and Recipe domains, and the initial Recipe Intelligence Engine pipeline.

## What I Learned

**Scope the intelligence layer early.** AI is not a feature you bolt on — it is an architectural layer that touches data modeling, API design, cost structure, and user experience. Designing the RAG pipeline, provider abstraction, and memory strategy upfront saved us from having to retrofit intelligence into a CRUD architecture later.

**Structured data beats LLMs for reliability.** The temptation to use LLMs for everything is strong, but structured retrieval + ranking + minimal LLM adaptation produces more consistent, cheaper, and more auditable results. The cost hierarchy (structured query < hybrid retrieval < LLM) became a core architectural principle.

**Modular monolith fits small teams pre-PMF.** The debate between monolith and microservices is often premature. Clear domain boundaries within a monolith provide the flexibility to split later without the operational tax of distributed systems during validation.

**Design for the flywheel, not the feature.** Every architectural decision was evaluated against whether it strengthens the core loop (Ingredients → Recipe → Cook → Save → Learn → Repeat). Features that do not feed the intelligence flywheel get lower priority. This forced discipline in both product and engineering decisions.
