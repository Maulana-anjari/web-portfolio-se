---
title: "Enterprise LLM Insight Platform"
slug: "pertamina-llm"
role: "Primary Backend Integrator"
company: "PT Pertamina EP"
period: "Dec 2025 – Apr 2026"
tags: ["Python", "FastAPI", "SQL Server", "Milvus", "Redis", "RBAC"]
image: "/images/llm-pertamina-project.webp"
metric: "IDR 4B enterprise contract"
excerpt: "Enterprise LLM insight platform for Pertamina EP serving 5 production use cases — integrating RAG pipelines across SQL Server, Milvus, and Redis with role-based access for geologists, engineers, and managers."
order: 1
---

# PT Pertamina EP WOPDM Z4 — LLM Generate Insight Platform

## Overview

Enterprise LLM insight platform for **PT Pertamina EP**, Indonesia's state-owned oil & gas enterprise, serving **5 production use cases** across the Zona 4 operation. The system integrated LLM-powered chat, domain-specific widgets, structured operational data (drilling events, production summaries, pressure monitoring), and Excel-based verification workflows — all backed by a retrieval-augmented pipeline spanning SQL Server, Milvus, and Redis.

I was the **primary backend integrator** across 3 repositories, operating at a scale of **191 commits (~125K LoC inserted), 26 pull requests (24 merged, 92.3% merge rate), 53 authored issues (16 closed), 1,311 files changed**, with a peak throughput of **31 commits in a single day** (26 Mar 2026) across a 131-day active span (Dec 2025 – Apr 2026). I functioned as the de facto maintainer of the `main` integration branch, merging **19 of 24 PRs in under 1 hour** while collaborating cross-domain with **geology domain experts and LLM developers** to keep all 5 use cases synchronized.

---

## Repository

- **Primary**: `studi-generate-insight-llm-pertamina/llm-pertamina` (private)
- **Supporting**: `Maulana-anjari/backend-llm-pertamina-reporting`, `studi-generate-insight-llm-pertamina/rag-pertamina`
- GitHub: `Maulana-anjari` (commit email: `maulana17anjari@gmail.com`)

---

## Backend Keywords

`Python` `FastAPI` `SQL Server 2022` `Milvus` `Redis` `RBAC` `REST APIs` `GitHub Actions` `Alembic` `LLM integration` `RAG pipeline` `enterprise chat` `production caching` `vector search`

---

## My Role

- **Primary Backend Integrator** — de facto maintainer of the `main` merge branch; reviewed, merged, and shipped 24 PRs with a median merge lead time of **~7 minutes**.
- Owned end-to-end backend across 3 repos: core API server (`llm-pertamina`), reporting API (`backend-reporting`, 6 commits), and Milvus/RAG integration layer (`rag-pertamina`, 1 PR merged).
- Drove **issue-driven planning discipline**: authored 53 issues (16 closed) covering Backend, Feature-BE, Fix-BE, Functional, Database, and Refactor-BE categories.
- Cross-domain collaboration: worked directly with **geology domain experts** and the **LLM development team** to translate operational well-data requirements (drilling events, pressure columns, production summaries) into API contracts and database schemas.

---

## Problem

PT Pertamina EP Zona 4 needed a unified LLM insight platform to analyze operational data across 5 distinct use cases — drilling events, production monitoring, Excel-based verification workflows, pressure tracking, and domain-specific chat widgets. The system had to serve multiple internal roles (geologists, engineers, managers) with structured access control, maintain sub-second chat response times under production load, and support rapid iteration driven by evolving domain requirements.

The existing backend lacked a coherent integration architecture: no RBAC, no caching strategy, inconsistent API contracts, and no retrieval pipeline connecting structured operational data to LLM workflows.

---

### Sub-Problem: Backend Integration at Scale

- **Problem**: 5 distinct use cases required a unified backend that could serve widgets, chat, domain data, and verification workflows without fragmenting into isolated microservices.
- **Solution**: Designed explicit REST API contracts separating structured data (SQL Server), vector retrieval (Milvus), and caching (Redis). Standardized widget/chat tool-call contracts and enforced RBAC routing per user role.
- **Stack**: Python, FastAPI, SQL Server 2022, Milvus, Redis, RBAC.
- **Result**: 26 PRs shipped with 92.3% merge rate; median merge-to-deploy lead time of ~7 minutes; 42% of commits classified as fixes demonstrating production responsiveness.

![191 commits all-branch](https://img.shields.io/badge/191-commits_all--branch-0ea5e9?style=for-the-badge)
![~125K LoC inserted](https://img.shields.io/badge/~125K-LoC_inserted-10b981?style=for-the-badge)
![26 PRs, 24 merged](https://img.shields.io/badge/26-PRs_(24_merged)-8b5cf6?style=for-the-badge)
![31 peak commits/day](https://img.shields.io/badge/31-peak_commits/day-f59e0b?style=for-the-badge)

### Sub-Problem: Production Caching & LLM Pipeline Stability

- **Problem**: Chat responses were regenerated per-request with no caching, causing redundant LLM calls and degrading response time for repeated queries. Widget outputs lacked history persistence, making stateful multi-turn interactions unreliable.
- **Solution**: Implemented user-level chat response caching (PR #102), production summary caching flow (PR #97), widget history persistence API (PR #100), and single-pass suggestion with regression guards (PR #91).
- **Stack**: Redis, FastAPI, LLM pipeline, Python async workers.
- **Result**: Eliminated redundant LLM calls for identical queries; widgets became stateful with persisted history; suggestion pipeline reduced regression risk through guarded single-pass architecture.

![Redis caching for chat and widgets](https://img.shields.io/badge/Redis-caching_for_chat_%2B_widgets-dc2626?style=for-the-badge)
![LLM pipeline stability guards](https://img.shields.io/badge/LLM-pipeline_stability_guards-7c3aed?style=for-the-badge)
![19/24 PRs merged under 1 hour](https://img.shields.io/badge/19/24-PRs_merged_<1hr-059669?style=for-the-badge)

### Sub-Problem: Enterprise RBAC & Domain Workflow Enforcement

- **Problem**: The platform served geologists, engineers, and managers — each requiring different access to operational data, Excel templates, and domain-specific workflows. Without RBAC, sensitive production data risked overexposure and workflow templates lacked enforcement.
- **Solution**: Implemented RBAC routing and Excel template restriction (PR #98), Excel upload verifier workflow with staging/approval (PR #69), and structured domain workflows for drilling events summarization (PR #96), production summaries (PR #97), and pressure monitoring (PR #93).
- **Stack**: FastAPI middleware, SQL Server RBAC tables, role-based middleware routing.
- **Result**: Multi-role access enforcement in production; geologists, engineers, and managers operated within role-scoped views. Verification workflow introduced a staging/approval pipeline reducing data entry errors.

![RBAC multi-role enterprise workflows](https://img.shields.io/badge/RBAC-multi--role_enterprise_workflows-111827?style=for-the-badge)
![SQL Server 2022 schema and indexing overhaul](https://img.shields.io/badge/SQL_Server_2022-schema_%2B_indexing_overhaul-2563eb?style=for-the-badge)

---

## Stack

| Layer | Technology |
|---|---|
| API Framework | **Python** + **FastAPI** |
| Relational Database | **SQL Server 2022** (well tables, production events, pressure columns, RBAC) |
| Vector Database | **Milvus** (multi-vector retrieval for RAG pipeline) |
| Cache Layer | **Redis** (chat response caching, production summary caching) |
| Migration Tooling | **Alembic** |
| Access Control | **RBAC** (role-based routing via FastAPI middleware) |
| CI/CD | **GitHub Actions** (paths-filter, PR validation) |
| Cross-repo Integration | `backend-reporting` (technical docs & reporting API) + `rag-pertamina` (Milvus client endpoints) |

---

## Architecture / Flow

```
Client (Widget / Chat UI)
        │
        ▼
┌─ FastAPI REST API Layer ───────────────────────────────┐
│  • RBAC middleware (role-based routing)                │
│  • Widget tool-call contracts                         │
│  • Chat response caching (Redis)                      │
│  • Excel upload verifier (staging → approval)         │
│  • Drilling events / production summary endpoints     │
└────┬──────────────┬──────────────┬────────────────────┘
     │              │              │
     ▼              ▼              ▼
┌─────────┐  ┌───────────┐  ┌───────────┐
│SQL Server│  │  Milvus   │  │   Redis   │
│2022      │  │ (RAG)     │  │ (cache)   │
│• wells   │  │ • multi-  │  │ • chat    │
│• events  │  │   vector  │  │ • widget  │
│• pressure│  │ • retrieval│  │ • summary │
│• RBAC    │  │           │  │           │
└─────────┘  └───────────┘  └───────────┘
     │              │
     └──────┬───────┘
            ▼
    ┌───────────────┐
    │  LLM Pipeline │
    │  (RAG + chat) │
    └───────────────┘
```

---

## Result / Impact

| Metric | Value |
|---|---|
| Total commits (all-branch) | **191** |
| Lines of code inserted | **~125,000** |
| Pull requests authored | **26** (24 merged, 92.3%) |
| PRs merged in <1 hour | **19 / 24** (79.2%) |
| Median merge lead time | **~7 minutes** |
| Issues authored / closed | **53 / 16** |
| Peak single-day throughput | **31 commits** (26 Mar 2026) |
| Files changed (all-branch) | **1,311** |
| Active development days | **34** across 131-day span |
| Commit type breakdown | feat: 59, fix: 81, refactor: 12, test: 10 |
| Closed issue categories | Backend: 5, Feature-BE: 4, Fix-BE: 3, Functional: 2, Database: 1, Refactor-BE: 1 |

---

## Solution

### Integration & Maintainership
- Functioned as de facto backend integrator with **19 self-merged PRs in under 1 hour**, keeping the `main` branch continuously deployable.
- Authored and triaged **53 issues** across 6 technical categories, establishing structured backlog management for a multi-developer team.

### Widget & Chat System
- Implemented backend widget tool-call contracts enabling LLM components to invoke domain functions (PR #99), multi-function widget output support (PR #101), and widget history persistence API (PR #100).
- Added user-level chat response caching via Redis (PR #102) and single-pass suggestion with regression guards (PR #91).

### Database & Schema Engineering
- Overhauled SQL Server schema: well reference tables, pressure columns, production events table, indexing optimization (PR #19, PR #93).
- Fixed Alembic migration pipeline for consistent dev/prod parity (PR #20).

### Domain Workflows
- Built drilling events summarization flow (PR #96), production summary caching flow (PR #97), and Excel upload verifier with staging/approval workflow (PR #69).
- Enforced RBAC routing and Excel template access restrictions per user role (PR #98).

### Reliability & CI/CD
- Fixed 404-masked-as-500 routing bug (PR #40), server-owned state version protection (PR #41), widget-backend-LLM connection fix (PR #90), and CI paths-filter permission errors (PR #92).

### Cross-repo Contributions
- `backend-reporting`: 6 commits (Dec 2025 – Jan 2026) — technical reporting API endpoints, documentation.
- `rag-pertamina`: 4 commits, 1 PR merged — Milvus integration layer, client endpoint fix with `/api/v1` prefix.

---

## Concrete Actions (PR-Level Traceability)


| PR | Date | Action |
| --- | --- | --- |
| #1 | 8 Jan 2026 | Failure analysis API routes + data schemas |
| #5 | 18 Jan 2026 | Unified multi-vector Milvus + SQL Server integration |
| #17 | 29 Jan 2026 | Chat search & retrieval pipeline testing |
| #19 | 31 Jan 2026 | SQL Server schema overhaul (well table + indexing) |
| #20 | 1 Feb 2026 | Alembic migration fix for SQL Server init |
| #23 | 5 Feb 2026 | Private chat sharing + LLM output standardization |
| #28 | 19 Feb 2026 | Test suite restructuring |
| #40 | 8 Mar 2026 | Fix 404 masked as 500 in chat routing |
| #41 | 8 Mar 2026 | Prevent client from overwriting server-owned state version |
| #69 | 17 Mar 2026 | Excel upload verifier workflow with staging/approval |
| #90 | 25 Mar 2026 | Fix widget connection to backend/LLM |
| #91 | 26 Mar 2026 | Single-pass suggestion with regression guards |
| #92 | 26 Mar 2026 | CI paths-filter permission fix |
| #93 | 16 Apr 2026 | Pressure columns + production events table |
| #96 | 16 Apr 2026 | Drilling events summarization flow |
| #97 | 16 Apr 2026 | Production summary caching flow |
| #98 | 16 Apr 2026 | RBAC routing and Excel template restriction |
| #99 | 20 Apr 2026 | Backend widget tool-call contract |
| #100 | 20 Apr 2026 | Widget history persistence API |
| #101 | 20 Apr 2026 | Multi-function widget output support |
| #102 | 20 Apr 2026 | User-level chat response caching |


---

## Challenges

- **LLM pipeline instability under varying workload**: Chat response paths broke silently when widget state was invalid or 404s were masked as 500s — required surgical debugging across FastAPI middleware, widget contracts, and LLM invocation layers.
- **Enterprise RBAC without breaking velocity**: Introducing role-based access control mid-project risked blocking existing feature flows; solved by implementing RBAC as a routing layer rather than a permission gate, then progressively tightening scopes.
- **Cross-domain communication**: Translating geology domain requirements (drilling events, pressure column semantics, production summary formats) into database schemas and API contracts required active collaboration with non-engineer domain experts — the Excel upload verifier workflow with staging/approval was a direct result of this collaboration.
- **Migration consistency**: Alembic + SQL Server combination caused environment drift between dev and production; resolved through explicit migration testing in CI and documented migration ordering.

---

## What I Learned

- **LLM pipeline stability is a caching problem first**: Before optimizing prompts or models, invest in request-level caching (Redis) and stateful widget persistence — redundant LLM calls dominate cost and latency in production chat systems.
- **RBAC design in enterprise contexts is about routing, not just permissions**: Role-scoped views and template restrictions are more valuable than coarse-grained gate checks; they preserve velocity while enforcing domain boundaries.
- **The integrator role is a force multiplier**: Merging 19 PRs in under 1 hour wasn't about speed — it was about owning the integration surface so other developers could ship features without merge conflicts or broken `main`.
- **Issue-driven development scales better than ticket-driven development**: Authoring 53 issues and categorizing them by technical domain (Backend, Feature-BE, Fix-BE, Functional, Database, Refactor-BE) created a self-documenting backlog that outlasted the project's active development phase.
- **Cross-domain collaboration is a technical skill**: Working with geologists forced precision in API contracts — imprecise field names or missing validation rules would have propagated incorrect production data across 5 use cases.
