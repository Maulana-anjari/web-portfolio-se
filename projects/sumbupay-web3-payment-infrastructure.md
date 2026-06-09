---
title: "SumbuPay Web3 Payment Infrastructure"
slug: "sumbupay"
role: "Co-Founder & Backend Architect"
company: "Sumbu Labs"
period: "2025 – Present"
tags: ["Node.js", "NestJS", "PostgreSQL", "MPC", "QRIS"]
image: "/images/SumbuPay-project.webp"
metric: "IDR 50M startup grant"
excerpt: "Web3 payment platform designed from zero — bridging Indonesia's national QR standard (QRIS, 30M+ merchants) with MPC-based wallet infrastructure through compliance-first, dual-rail architecture."
order: 3
---

# SumbuPay Web3 Payment Infrastructure

> 🔄 **Status: Currently in development.** Architecture designed, funding secured — initial build in progress. This case study documents the zero-to-one founder phase; git-backed metrics will be added as implementation progresses.

---

## 🧾 Overview

SumbuPay is a Web3 payment platform currently under development at **Sumbu Labs (PT Sumbu Inovasi Digital)**, the startup Maulana co-founded after the CAR-dano grant success. The platform aims to bridge Indonesia's national QR standard (**QRIS**, used by 30M+ merchants) with **MPC-based Web3 wallet infrastructure** — creating a payment rail that serves both conventional and decentralized finance.

This case study documents the **zero-to-one founder phase**: securing **IDR 50,000,000** in FT UGM startup support funding, designing the technical architecture from first principles, and making product-defining decisions before committing to implementation.

---

## 🔗 Repository

Private repository under PT Sumbu Inovasi Digital; currently in setup phase.

---

## 🔑 Backend Keywords

Node.js, NestJS, PostgreSQL, Prisma, QRIS integration, MPC wallet workflows, S3-compatible storage, payment infrastructure, Web3 fintech, startup architecture, compliance-first design, zero-to-one product design

---

## 🛠️ My Role

**Co-Founder & Backend Architect**

- Designed the entire technical architecture for SumbuPay — database schema, service boundaries, integration topology, and deployment strategy — from first principles.
- Made product-defining technical bets: why QRIS (not just crypto rails), why MPC wallets (not single-key), how to structure a payment backend that could survive regulatory review.
- Co-led the funding pitch: articulated the technical vision that secured **IDR 50,000,000** in FT UGM startup support funding — translating Web3 concepts into language non-technical evaluators could assess.
- Currently translating architecture into implementation — the initial build phase.

---

## ❗ Problem

Indonesia's digital payment landscape is dominated by centralized gateways. SumbuPay was conceived to bridge two worlds: **QRIS** (Indonesia's national QR standard, accessible to 30M+ merchants) and **Web3 wallet infrastructure** (MPC-based self-custody, giving users sovereign control of their assets).

The challenge is not just technical — it's existential for a two-person startup: **design something compliant enough to be taken seriously by regulators and flexible enough to evolve when regulation inevitably shifts.** The architecture must be right before the code is written, because payment infrastructure doesn't forgive "move fast and fix later."

---

### 🧩 Sub-Problem: designing payment reliability from first principles

- **Problem**: Payment flows — even in early-stage products — cannot fail silently. A lost transaction is a lost customer and potential regulatory exposure. But over-engineering at the pre-build stage kills startup velocity.
- **Design approach**: Separated service logic from persistence and integration points with explicit boundaries in the architecture. Every payment-adjacent operation mapped to a defined state machine, not implicit side effects — designed into the schema upfront, not retrofitted later.
- **Stack**: Node.js/NestJS, PostgreSQL, Prisma.
- **Status**: Architecture designed; implementation in progress.

### 🧩 Sub-Problem: QRIS and MPC as independent payment rails

- **Problem**: QRIS is Indonesia's national payment standard; MPC wallets are the emerging Web3 custody standard. Both are complex integrations with sparse documentation and no prior art for combining them. The risk: building a tight coupling that becomes unfixable when regulation or specs change.
- **Design approach**: Structured both integrations as independent payment rails behind well-defined service boundaries. The MPC module handles key shard coordination; the QRIS module handles the national payment specification — cleanly separated so either can evolve, be replaced, or be removed without architectural collapse.
- **Stack**: QRIS specification, MPC wallet protocols, NestJS service layer.
- **Status**: Integration contracts defined; implementation pending.

### 📊 Metric callouts

<p align="left">
  <img src="https://img.shields.io/badge/IDR_50M-startup_funding_secured-0ea5e9?style=for-the-badge" alt="IDR 50M startup funding secured" />
  <img src="https://img.shields.io/badge/QRIS+MPC-architecture_designed-111827?style=for-the-badge" alt="QRIS and MPC architecture designed" />
  <img src="https://img.shields.io/badge/Prisma+PostgreSQL-compliance--first_schema-10b981?style=for-the-badge" alt="Prisma PostgreSQL compliance-first schema" />
</p>

---

## 🧰 Stack (designed)

- Node.js / NestJS
- PostgreSQL
- Prisma
- QRIS integration (national payment rail)
- MPC wallet workflows (multi-party computation self-custody)
- AWS / S3-compatible storage

---

## Architecture / Flow (designed)

- **Backend service layer**: Payment orchestration, wallet coordination, platform workflows — all behind explicit service boundaries designed from first principles.
- **Database layer**: PostgreSQL via Prisma for transactional records, operational state, and audit trails — schema includes idempotency guarantees and compliance-friendly data boundaries from day one.
- **Integration layer**: QRIS and MPC wallet modules isolated from core business logic — each treated as an independent payment rail with its own circuit breaker and retry semantics designed into the architecture.
- **Storage layer**: S3-compatible storage for digital assets and supporting artifacts, separated from transactional persistence.

**The architectural bet**: QRIS for now, Web3 for next. The backend is designed so that QRIS is not a legacy dependency and MPC wallets are not a speculative gimmick — they're two payment rails on equal footing, ready for whichever direction regulation and market adoption move.

---

## 📈 Result / Impact (to date)

- Co-led the pitch that secured **IDR 50,000,000** in FT UGM startup support funding
- Designed the technical architecture for a compliance-first QRIS-native Web3 payment platform
- Made key product decisions (QRIS + MPC dual-rail, compliance-first schema, independent payment modules) before committing to implementation — reducing architectural risk and rework cost
- Established Sumbu Labs as a legitimate venture with a second product line beyond CAR-dano

---

## ✅ Design Decisions

- **Explicit service boundaries**: No "god service" anti-pattern — payment, wallet, and platform workflows were separated from day one in the architecture.
- **Compliance-first schema**: Audit trails, state machines, and clear data boundaries designed into the Prisma schema, not retrofitted.
- **Independent payment rails**: QRIS and MPC wallets are isolated integration surfaces — either can evolve or be replaced without refactoring the other.
- **Storage isolation**: S3-compatible storage separated from transactional persistence to avoid domain coupling.
- **Dual-rail strategy**: QRIS serves today's market; MPC wallets position for tomorrow's. Neither rail is hard-coupled to the core — both are swappable modules.

---

## ⚠️ Challenges

- **Designing for unknown regulation**: Indonesia's Web3 regulatory landscape is evolving. The architecture had to be compliant enough for current norms while not over-engineering for rules that don't exist yet.
- **Zero-to-one founder scope**: Simultaneously responsible for technical architecture, funding strategy, product decisions, and stakeholder communication — no separate CTO to delegate to.
- **Pre-build decision discipline**: When every architecture decision feels irreversible (because payment infrastructure is unforgiving), the temptation is to over-design. Finding the line between "robust enough" and "over-engineered" required constant calibration.
- **Funding as a technical communication challenge**: Translating QRIS, MPC, and compliance architecture into language that non-technical evaluators could assess was as critical as the architecture itself.

---

## 💡 What I Learned

- **Design before code is not procrastination — it's cost avoidance**: In payment infrastructure, architecture decisions compound. A wrong schema choice discovered in production costs orders of magnitude more to fix than one caught in the design phase. The architecture phase was not delay — it was de-risking.
- **Funding is a technical skill**: Securing IDR 50M required articulating a technical vision that non-technical evaluators could assess. Architecture diagrams and clear reasoning about compliance, payment rails, and scalability were as important as the business pitch.
- **Compliance-first is a competitive moat**: When competitors build first and retrofit audit trails later, they incur technical debt, rework, and potential regulatory risk. Designing audit trails, state machines, and data boundaries from the schema up is a structural advantage that compounds over time.
- **Independent payment rails are a regulatory hedge**: Treating QRIS and MPC wallets as independent, swappable integration surfaces means regulation changes don't require architectural surgery — they require swapping one module. This pattern was directly borrowed from the CAR-dano experience of decoupling blockchain verification from core inspection workflows.
- **The founder phase is a different kind of engineering**: Before a single PR is merged, a co-founder has already made dozens of irreversible architecture and product decisions. That's still engineering — just engineering where the artifacts are designs, trade-off analyses, and funding pitches rather than pull requests.
