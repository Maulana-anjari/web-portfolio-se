---
title: "CAR-dano: Vehicle Inspection Platform"
slug: "car-dano"
role: "Primary Backend Engineer"
company: "Sumbu Labs"
period: "Feb – Oct 2025"
tags: ["Node.js", "NestJS", "Cardano", "PostgreSQL", "Prisma"]
image: "/images/CAR-dano-project.webp"
metric: "60K ADA Catalyst funding"
excerpt: "Blockchain-backed vehicle inspection platform with Cardano NFT minting. 67 API endpoints, 15+ NestJS modules, 100% uptime serving 20 concurrent users — built from scratch to production."
order: 2
---

# CAR-dano / Cardano Backend — Vehicle Inspection Platform

## Repository

- Backend: https://github.com/CAR-dano/cardano-backend
- Product (live): https://api.inspeksimobil.id — https://cari.inspeksimobil.id

## Keywords

Cardano, NestJS, Node.js, Prisma, PostgreSQL, REST APIs, NFT minting, Xendit, Backblaze B2, Prometheus, Grafana, Docker, CI/CD, backend architecture, blockchain verification, production reliability, performance optimization

## Overview

CAR-dano is a blockchain-backed vehicle inspection platform (inspeksimobil.id) built for PT Inspeksi Mobil Jogja, funded by **Project Catalyst Cardano Fund 13 (60K ADA)** grant. The platform enables automobile inspectors to conduct on-site vehicle inspections, generate certified reports, mint inspection records as NFTs on Cardano, and deliver verified results to customers. The production backend runs at **100% uptime** serving 20 concurrent users.

The backend was built from scratch by a small team at **Sumbu Labs (PT Sumbu Inovasi Digital)** between February and October 2025, with continued post-experience contributions through March 2026.

## My Role

**Primary / de facto lead backend engineer** — authored **194 of 314 commits (62% of the entire codebase)**, writing **+71,648 net lines of code** across **216 TypeScript source files**, delivering **67 API endpoints in production** spanning **15+ modules**.

Built every core backend domain from scratch: authentication, inspection CRUD + workflow engine, blockchain integration (Cardano NFT minting), PDF generation queue, cloud storage (Backblaze B2), billing (Xendit + webhook idempotency), monitoring (Prometheus + Grafana), structured logging + audit trail, CI/CD pipeline (GitHub Actions), and Docker deployment infrastructure. Collaborated cross-functionally alongside PM, mobile engineer, frontend engineer, and UI/UX designer.

Also wrote **~3,400 lines of architecture proposals** for platform evolution (microservice migration, observability stack, security pipeline) and continued contributing **post-experience**: built `inspector-backend` from scratch (10 commits, 17,798 LOC) and optimized `cardano-frontend` performance (19 commits, React.memo, optimistic UI, prefetching).

## Problem

The client, PT Inspeksi Mobil Jogja, ran manual inspection workflows with no centralized backend, no verifiable audit trail, and no automated report generation. They needed a production-grade platform that could:

1. Digitize end-to-end inspection workflows (inspector to reviewer to customer)
2. Provide tamper-proof, blockchain-backed verification via Cardano NFT minting
3. Automate PDF report generation with cloud storage
4. Monetize through paid inspection reports and credit packages
5. Remain stable under real concurrent usage with zero downtime

### Sub-Problem: Operational bottlenecks in manual inspection flow

- **Problem**: Inspection flow was entirely manual. Inspectors recorded data on paper, reviewers approved offline, customers waited hours for results. The client handled only ~7 inspections daily with ~3-hour end-to-end cycle time.
- **Solution**: Built full inspection CRUD + status workflow engine (submitted, reviewed, approved, published), granular RBAC (5 roles: ADMIN, REVIEWER, INSPECTOR, SUPERADMIN, CUSTOMER), role-based approval flows, and batch operations for bulk approval.
- **Stack**: NestJS, Prisma, PostgreSQL, REST APIs, JWT/PIN/OAuth.
- **Result**: Daily on-chain inspections grew from ~7 to 15-20. End-to-end cycle time dropped from ±3 hours to 1.5-2 hours (inspeksi to approval reviewer to hasil ke customer).

### Sub-Problem: Blockchain verification without degrading performance

- **Problem**: Every inspection needed on-chain verification via Cardano NFT minting, but blockchain transaction latency risked slowing down the core API for all users.
- **Solution**: Isolated blockchain module with in-memory queue and circuit breaker pattern, per-UTXO minimum logic, and retry mechanism. Core inspection workflow never blocks on chain confirmation. PDF hash is minted to blockchain asynchronously after report generation.
- **Stack**: Cardano, MeshSDK, Blockfrost, NestJS queue, PostgreSQL (transaction isolation).
- **Result**: Reliable on-chain verification that never degraded API response times. Users experienced blockchain-backed integrity without blockchain latency.

### Sub-Problem: Monetization with guaranteed payment integrity

- **Problem**: The platform needed paid report packages and credit-based billing, but payment webhook failures could double-charge customers or lose payment records.
- **Solution**: Designed Xendit-integrated billing module with **database-backed webhook idempotency** (unique transaction IDs, deduplication via Prisma unique constraints), credit packages with toggle-active management, and presigned download URLs for paid reports. Customer self-service endpoints for credit purchases and report downloads.
- **Stack**: NestJS, Xendit API, Prisma, PostgreSQL, Backblaze B2 (presigned URLs).
- **Result**: Zero duplicate charges in production. Idempotent webhook handling ensured payment processing was crash-safe and replay-safe.

### Metric Callouts

![194 commits, 62% codebase](https://img.shields.io/badge/194_commits-62%25_codebase-0ea5e9?style=for-the-badge)
![100% faster response time](https://img.shields.io/badge/100%25-faster_response_time-111827?style=for-the-badge)
![100% uptime, 20 concurrent users](https://img.shields.io/badge/100%25-uptime_20_users-10b981?style=for-the-badge)

## Stack

- **Runtime**: Node.js
- **Framework**: NestJS (modular monolith)
- **Database**: PostgreSQL (Neon serverless) + Prisma ORM (17 models, 10 enums, GIN indexes on JSONB)
- **Blockchain**: Cardano via MeshSDK + Blockfrost API
- **Storage**: Backblaze B2 (S3-compatible)
- **Payments**: Xendit (credit packages, webhook idempotency)
- **Monitoring**: Prometheus + Grafana (16 module commits dedicated to observability)
- **CI/CD**: GitHub Actions (Docker 3-stage build, multi-tag release, staging + production deploy)
- **Logging**: nestjs-pino (structured) + custom audit logger for sensitive flows
- **Security**: JWT + refresh token rotation, Google OAuth, PIN login, granular rate limiting, Content Security Policy

## Architecture / Flow

```
Client (Web / Mobile)
    │
    ▼
┌─────────────────────────────┐
│     REST API (NestJS)       │ 67 endpoints, 12 controllers
│  Auth | Inspections | Users │
│  Billing | Blockchain | PDF │
│  Backblaze | Reports | etc  │
└──────────┬──────────────────┘
           │
    ┌──────┴──────┬──────────┬─────────────┐
    ▼             ▼          ▼             ▼
┌────────┐ ┌──────────┐ ┌────────┐ ┌──────────────┐
│Prisma  │ │Blockchain│ │Xendit  │ │Backblaze B2  │
│Postgres│ │Queue +   │ │Payment │ │PDFs + Photos │
│        │ │CircuitBr │ │Gateway │ │              │
└────────┘ └────┬─────┘ └────────┘ └──────────────┘
                │
                ▼
         ┌────────────┐
         │  Cardano   │ NFT minting, UTXO management
         │  Blockchain│ async — never blocks API
         └────────────┘
```

- REST API serves inspection and platform workflows
- PostgreSQL (Prisma) handles all transactional data: inspections, users, credits, audit logs
- Blockchain queue operates asynchronously with circuit breaker. NFT minting never blocks API response.
- Xendit webhooks processed with DB-backed idempotency (unique transaction deduplication)
- PDF reports generated in parallel with compression, stored on Backblaze B2, served via presigned URLs
- Prometheus exposes `/metrics` endpoint. Grafana dashboards visualize throughput, latency, error rates.
- GitHub Actions CI/CD: Docker 3-stage build to push to registry to deploy to staging/production

## Result / Impact

| Metric | Before | After | Business Impact |
|--------|--------|-------|-----------------|
| Daily on-chain inspections | ~7 | 15–20 | **2–3x growth** in client throughput |
| End-to-end cycle time | ±3 hours | 1.5–2 hours | **~50% faster** inspector-to-customer delivery |
| API response time (production) | baseline | **~100% faster** | Measurable latency reduction across all endpoints |
| Production uptime | — | **100%** | Zero downtime during experience period |
| Concurrent users | — | **20** | Stable under real multi-user load |
| Backend codebase ownership | 0 | **194 commits (62%)** | Authored majority of 314-commit codebase |
| Production API endpoints | 0 | **67** | Full platform coverage across 12 controllers |
| Architecture proposals written | — | **~3,400 lines** | Microservice migration, observability, security pipeline plans |
| Post-experience contributions | — | **29 commits, +20,114 LOC** | inspector-backend (built from scratch) + cardano-frontend optimization |

## Solution

1. **Modular NestJS monolith** — 15+ feature modules with clear separation. Auth, inspections, users, blockchain, billing, credits, reports, photos, backblaze, pdf-proxy, logging, customer, public-api, dashboard, grafana.
2. **Async blockchain integration** — Cardano NFT minting isolated behind in-memory queue with circuit breaker. Core inspection API never blocks on chain confirmation. UTXO-aware minting logic with per-UTXO minimum and retry.
3. **Production-grade reliability** — Docker 3-stage optimized builds, GitHub Actions CI/CD, Prometheus + Grafana monitoring, structured logging (nestjs-pino), audit trail for sensitive flows, granular per-endpoint rate limiting.
4. **Payment integrity** — Xendit webhook idempotency enforced at database level (Prisma unique constraints on transaction IDs). Credit charging with atomic decrement. No duplicate charges possible.
5. **Scalability foresight** — Wrote comprehensive architecture proposals (~3,400 lines) for Go PDF microservice migration (RabbitMQ + Chromedp), observability stack (Prometheus + Loki + Jaeger), and CI/CD security pipeline (CodeQL + Trivy + OWASP ZAP).

## Challenges

- **Isolating blockchain latency from user experience**: Cardano transaction confirmation takes 20+ seconds. Built in-memory queue with circuit breaker so NFT minting failures never cascade into API errors. Users get as-fast-as-normal response times regardless of chain state.
- **Webhook idempotency for payments**: Xendit can send duplicate webhooks under network retry. Implemented DB-level idempotency (unique constraint on `xendit_transaction_id`) with proper error handling so replay is safe and no customer gets double-charged.
- **PDF generation under concurrent load**: Generating inspection PDFs consumes significant CPU. Built parallel generation (full and no-docs PDFs simultaneously) with compression tuning. Added circuit breaker to prevent resource exhaustion. Wrote migration plan for dedicated Go PDF worker.
- **Maintaining 100% uptime while shipping 194 commits**: Every feature went through staging to production with zero-downtime deploys. Used Prisma migrations carefully (no destructive changes in production), feature flags for partial rollouts, and rollback-compatible API changes.
- **Cross-team coordination in a startup**: Worked alongside PM for feature scoping, mobile engineer for API contract design, frontend engineer for data shape alignment, and UI/UX designer for workflow states. All 67 API endpoints shaped through this collaboration.

## Evidence

### Metrics Summary

| Metric | Value | Source |
|--------|-------|--------|
| Commits authored | 194 of 314 (62%) | `git shortlog -sn --all` |
| Net LOC | +71,648 | `git log --numstat` |
| Feature commits | 68 across 15+ modules | `git log --oneline | grep feat(` |
| API endpoints in production | 67 (cardano-backend) + 9 (inspector-backend) | Controller decorator scan |
| Production uptime | 100% | Confirmed |
| Response time improvement | ~100% faster post-optimization | Confirmed |
| Client daily inspections growth | ~7 → 15–20 | Story bank |
| Cycle time reduction | ±3 hours → 1.5–2 hours | Story bank |
| Post-experience commits | 29 (19 frontend + 10 inspector-backend) | `git log --author=maulana17anjari` |
| Architecture proposals | ~3,400 lines across 4 documents | `microservice-plan/` + `issues/` |

## What I Learned

- **Decouple slow subsystems from fast ones**: Isolating Cardano NFT minting behind an async queue with circuit breaker was the most impactful decision. Users never felt blockchain latency. This principle applies everywhere: payment webhooks, PDF generation, external APIs.
- **Payment idempotency is not optional**: Database-level idempotency for Xendit webhooks (unique constraint on transaction ID) was a small implementation that prevented an entire class of catastrophic bugs. Every payment integration needs this from day one.
- **Operational simplicity wins in startups**: The 67-endpoint NestJS monolith with modular design served 20 concurrent users at 100% uptime. Microservices would have been premature. But writing ~3,400 lines of migration proposals meant the team had a clear path when growth demanded it.
- **Queue and circuit breaker as a deployment safety net**: PDF generation and blockchain minting both used the same pattern (queue, worker, circuit breaker, graceful degradation). This prevented resource exhaustion and kept the API responsive even when downstream services degraded.
- **Cross-team API design compounds**: Shaping 67 endpoints alongside PM, mobile, frontend, and UI/UX meant the API fit real workflows, not just what looked good in Swagger. The frontend performance optimization I later contributed (React.memo, optimistic UI, prefetching) was enabled by clean API contracts we designed together months earlier.
- **Ownership beyond employment**: Continuing to build `inspector-backend` (10 commits, 17,798 LOC from scratch) and optimize `cardano-frontend` (19 commits) months after the formal experience period ended taught me that real engineering ownership does not stop at a contract date. It stops when the system is right.
