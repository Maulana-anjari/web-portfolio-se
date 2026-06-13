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

> 🔄 **Status: Currently in development.** Architecture designed, funding secured: initial build in progress. This case study documents the zero-to-one founder phase; git-backed metrics will be added as implementation progresses.

---

## 🧾 Overview

SumbuPay is a Web3 payment platform currently under development at **Sumbu Labs (PT Sumbu Inovasi Digital)**, the startup Maulana co-founded after the CAR-dano grant success. The platform bridges Indonesia's national QR standard (**QRIS**, used by 30M+ merchants) with **MPC-based Web3 wallet infrastructure**, creating a payment rail that serves both conventional and decentralized finance.

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

- I designed the entire technical architecture for SumbuPay from first principles: database schema, service boundaries, integration topology, and deployment strategy.
- I made product-defining technical bets: why QRIS alongside crypto rails, why MPC wallets over single-key wallets, how to structure a payment backend that could survive regulatory review.
- I co-led the funding pitch: articulated the technical vision that secured **IDR 50,000,000** in FT UGM startup support funding, translating Web3 concepts into language non-technical evaluators could assess.
- I am currently translating architecture into implementation: the initial build phase.

---

## ❗ Problem

Indonesia's digital payment field is dominated by centralized gateways. We conceived SumbuPay to bridge two worlds: **QRIS** (Indonesia's national QR standard, accessible to 30M+ merchants) and **Web3 wallet infrastructure** (MPC-based self-custody, giving users sovereign control of their assets).

The challenge is existential for a two-person startup: **design something compliant enough to be taken seriously by regulators and flexible enough to evolve when regulation shifts.** The architecture must be right before the code is written, because payment infrastructure doesn't forgive "move fast and fix later."

---

### 🧩 Sub-Problem: designing payment reliability from first principles

- **Problem**: Payment flows, even in early-stage products, cannot fail silently. A lost transaction is a lost customer and potential regulatory exposure. But over-engineering at the pre-build stage kills startup velocity.
- **Design approach**: I separated service logic from persistence and integration points with explicit boundaries in the architecture. Every payment-adjacent operation mapped to a defined state machine with explicit states designed into the schema upfront.
- **Stack**: Node.js/NestJS, PostgreSQL, Prisma.
- **Status**: Architecture designed; implementation in progress.

### 🧩 Sub-Problem: QRIS and MPC as independent payment rails

- **Problem**: QRIS is Indonesia's national payment standard; MPC wallets are the emerging Web3 custody standard. Both are complex integrations with sparse documentation and no prior art for combining them. The risk: building a tight coupling that becomes unfixable when regulation or specs change.
- **Design approach**: I structured both integrations as independent payment rails behind well-defined service boundaries. The MPC module handles key shard coordination; the QRIS module handles the national payment specification. They are cleanly separated so either can evolve or be replaced without architectural collapse.
- **Stack**: QRIS specification, MPC wallet protocols, NestJS service layer.
- **Status**: Integration contracts defined; implementation pending.

### 📊 Metric callouts

![IDR 50M startup funding secured](https://img.shields.io/badge/IDR_50M-startup_funding_secured-0ea5e9?style=for-the-badge)
![QRIS and MPC architecture designed](https://img.shields.io/badge/QRIS+MPC-architecture_designed-111827?style=for-the-badge)
![Prisma PostgreSQL compliance-first schema](https://img.shields.io/badge/Prisma+PostgreSQL-compliance--first_schema-10b981?style=for-the-badge)

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

- **Backend service layer**: Payment orchestration and wallet coordination, all behind explicit service boundaries designed from first principles.
- **Database layer**: PostgreSQL via Prisma for transactional records and audit trails. The schema includes idempotency guarantees and compliance-friendly data boundaries from day one.
- **Integration layer**: QRIS and MPC wallet modules are isolated from core business logic. Each functions as an independent payment rail with its own circuit breaker and retry semantics designed into the architecture.
- **Storage layer**: S3-compatible storage for digital assets and supporting artifacts, separated from transactional persistence.

**The architectural bet**: QRIS for now, Web3 for next. I designed the backend so QRIS and MPC wallets function as two payment rails on equal footing, ready for whichever direction regulation and market adoption move.

---

## 📈 Result / Impact (to date)

- I co-led the pitch that secured **IDR 50,000,000** in FT UGM startup support funding
- I designed the technical architecture for a compliance-first QRIS-native Web3 payment platform
- I made key product decisions (QRIS + MPC dual-rail and compliance-first schema) before committing to implementation, reducing architectural risk and rework cost
- We established Sumbu Labs as a legitimate venture with a second product line beyond CAR-dano

---

## ✅ Design Decisions

- **Explicit service boundaries**: I separated payment, wallet, and platform workflows from day one in the architecture.
- **Compliance-first schema**: Audit trails and state machines designed into the Prisma schema upfront.
- **Independent payment rails**: QRIS and MPC wallets function as isolated integration surfaces. Either can evolve or be replaced without refactoring the other.
- **Storage isolation**: I separated S3-compatible storage from transactional persistence to avoid domain coupling.
- **Dual-rail strategy**: QRIS serves today's market; MPC wallets position for tomorrow's. Both rails are swappable modules.

---

## ⚠️ Challenges

- **Designing for unknown regulation**: Indonesia's Web3 regulatory situation is evolving. The architecture had to be compliant enough for current norms while not over-engineering for rules that don't exist yet.
- **Zero-to-one founder scope**: I was simultaneously responsible for technical architecture, funding strategy, product decisions, and stakeholder communication with no separate CTO to delegate to.
- **Pre-build decision discipline**: When every architecture decision feels irreversible (because payment infrastructure is unforgiving), the temptation is to over-design. Finding the line between "robust enough" and "over-engineered" required constant calibration.
- **Funding as a technical communication challenge**: Translating QRIS, MPC, and compliance architecture into language that non-technical evaluators could assess was as critical as the architecture itself.

---

## 💡 What I Learned

- **Design before code is cost avoidance**: In payment infrastructure, architecture decisions compound. A wrong schema choice discovered in production costs orders of magnitude more to fix than one caught in the design phase. The architecture phase was de-risking.
- **Funding is a technical skill**: Securing IDR 50M required articulating a technical vision that non-technical evaluators could assess. Architecture diagrams and clear reasoning about compliance and payment rails were as important as the business pitch.
- **Compliance-first is a competitive moat**: When competitors build first and retrofit audit trails later, they incur technical debt and potential regulatory risk. Designing audit trails and data boundaries from the schema up is a structural advantage that compounds over time.
- **Independent payment rails are a regulatory hedge**: Treating QRIS and MPC wallets as independent, swappable integration surfaces means regulation changes only require swapping one module. I directly borrowed this pattern from the CAR-dano experience of decoupling blockchain verification from core inspection workflows.
- **The founder phase is a different kind of engineering**: Before a single PR is merged, a co-founder has already made dozens of irreversible architecture and product decisions. This is still engineering where the artifacts are designs, trade-off analyses, and funding pitches rather than pull requests.
