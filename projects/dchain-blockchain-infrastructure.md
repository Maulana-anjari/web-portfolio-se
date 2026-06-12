---
title: "DChain: National Blockchain Infrastructure for Academic Certificate Management"
slug: "dchain-blockchain-infrastructure"
role: "Blockchain Developer Intern — Frontend & Web3 Integration"
company: "Kemdiktisaintek (Kementerian Pendidikan Tinggi, Sains, dan Teknologi)"
period: "Sep 2024 – Dec 2024"
tags:
  [
    "Blockchain",
    "DChain",
    "NFT",
    "Ethereum",
    "Next.js",
    "Proof of Authority",
    "Proof of Stake",
    "Hyperledger Caliper",
    "Performance Benchmarking",
    "Web3",
  ]
image: "/images/dchain-project.webp"
metric: "Block time 5s — avg latency 4.6s (PoA)"
excerpt: "Built an NFT accreditation certificate management system on the DChain national blockchain for the Independent Accreditation Institute (LAM), and conducted a PoA vs PoS consensus performance benchmarking study that informed the network migration strategy recommendation."
order: 5
---

# DChain — Performance Benchmarking Analysis of Proof of Authority vs Proof of Stake Consensus Mechanisms on the National Blockchain Network

## Repository

- **Website**: https://dchain.id
- **Internship (LAM NFT Certificate)**: `Dikti-Blockchain-and-Metaverse/lam-nft-certificate` (private)
- **Thesis — PoA Network Generator**: [DChain-PoA-Geth](https://github.com/Skripsi-Maulana-Anjari/DChain-PoA-Geth)
- **Thesis — PoA Deployer (Kubernetes)**: [DChain-PoA-Deployer](https://github.com/Skripsi-Maulana-Anjari/DChain-PoA-Deployer)
- **Thesis — PoS Network Generator**: [DChain-PoS-Geth](https://github.com/Skripsi-Maulana-Anjari/DChain-PoS-Geth)
- **Thesis — Benchmark Pipeline**: [caliper-benchmark-workspace](https://github.com/Skripsi-Maulana-Anjari/caliper-benchmark-workspace)
- **Thesis — Monitoring Stack**: [monitoring-tools](https://github.com/Skripsi-Maulana-Anjari/monitoring-tools)
- **Thesis — Analysis & Visualization**: [analysis](https://github.com/Skripsi-Maulana-Anjari/analysis)

## Keywords

DChain, national blockchain, PoA, PoS, Clique, Gasper, NFT certificate, accreditation, Hyperledger Caliper, Kubernetes, benchmarking

## Overview

DChain (Dikti Chain) is an Ethereum-based national blockchain network developed by a cross-university research team in Indonesia under the Directorate General of Higher Education, Research, and Technology (Ditjen Diktiristek). The network is designed as a decentralized digital infrastructure for issuing, storing, and verifying academic documents — including digital diplomas, competency certificates, and transcripts — with data integrity guarantees.

DChain currently runs with 12 validator nodes spread across universities (UGM, ITB, UI, UB, ITS, UNUD, Gundar, UNIMED, UNDIP, UT, and others) using Proof of Authority (PoA) consensus. A migration to Proof of Stake (PoS) is planned to improve decentralization and scalability — a strategic decision requiring empirical performance evaluation.

## My Role

I joined as a **Blockchain Developer Intern** on the `Dikti-Blockchain-and-Metaverse` team (Sep–Dec 2024), part of a 4-person active developer group. My responsibilities included building the admin dashboard interface for the NFT accreditation certificate management system for the Independent Accreditation Institute (LAM) — an application designed to run on the DChain network.

After the internship, this experience became the foundation for my thesis research (Feb 2026) comparing the performance of PoA and PoS consensus mechanisms on DChain. The internship provided deep understanding of DChain's architecture and usage context, while the thesis contributed empirical data supporting the consensus migration decision.

## Architecture

DChain is built as an **Ethereum Virtual Machine (EVM)-compatible blockchain** using Go-Ethereum (Geth). The network has Chain ID `17845` (a reference to 17/08/1945 — Indonesia's independence day).

### Network Topology (Current — PoA)

```
┌──────────────────────────────────────────────────────────────┐
│                    DCHAIN NETWORK TOPOLOGY                    │
│                                                              │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐  │
│  │ Signer 1 │   │ Signer 2 │   │ Signer 3 │   │ Signer N │  │
│  │  (UGM)   │───│  (ITB)   │───│  (UI)    │───│   ...    │  │
│  └──────────┘   └──────────┘   └──────────┘   └──────────┘  │
│        │              │              │              │        │
│  ┌─────┴──────┐ ┌────┴───────┐ ┌───┴────────┐ ┌───┴─────┐  │
│  │ Observer 1 │ │ Observer 2 │ │ Observer 3 │ │Observer N│  │
│  │   (UT)     │ │  (UNUD)    │ │  (Gundar)  │ │  ...     │  │
│  └────────────┘ └────────────┘ └────────────┘ └──────────┘  │
│                                                              │
│  Consensus: PoA (Clique) — Round Robin block production      │
│  Block time: 5 detik  |  Gas limit: 30,000,000              │
│  Clients: Geth v1.13.x + Clef (external signer)             │
│  Chain ID: 17845                                            │
└──────────────────────────────────────────────────────────────┘
```

### PoA Architecture (Current)

- **Consensus**: Clique (EIP-225) — Round Robin, probabilistic finality
- **Execution Client**: Geth v1.13.2 / v1.13.10
- **Account Management**: Clef v1.13.2 (external signer with `rules.js` security rules)
- **Node Types**:
  - **Signers**: Authorized validators from universities, eligible to produce blocks
  - **Non-Signers (Observers)**: Full nodes without validation rights, acting as transaction gateways
- **Block Time**: 5 seconds
- **Gas Limit**: 30,000,000 per block

### PoS Architecture (Migration Target)

- **Consensus**: Gasper (LMD-GHOST + Casper FFG) — deterministic finality
- **Execution Client**: Geth v1.16.7
- **Consensus Client**: Prysm v6.0.4 (Beacon Chain)
- **Slot Time**: 12 seconds
- **Finality**: Deterministic — epoch finalized after 2/3 attestation votes
- **Validator Keys**: Each node runs 22 validator keys (110 total for 5 nodes)

### Smart Contract Architecture

The application uses a **`CertificateLAM` smart contract** (Solidity, EVM) to:
- **Mint**: Issue accreditation certificates as NFTs
- **Read**: Verify and read certificate metadata
- **Burn**: Remove/revoke certificates

### Data Flow — LAM NFT Certificate System

```
┌─────────────────────────────────────────────────────────────────┐
│                    LAM NFT CERTIFICATE SYSTEM                    │
│                                                                  │
│  ┌────────────┐    ┌──────────────┐    ┌────────────────────┐   │
│  │   Browser  │───▶│  Next.js 14  │───▶│   Backend API     │   │
│  │  (Wallet)  │    │  Frontend    │    │  (Express/NestJS) │   │
│  └────────────┘    └──────────────┘    └────────┬───────────┘   │
│        │                                        │                │
│        │  ethers.js                             │                │
│        │  (wallet interaction)                  │                │
│        ▼                                        ▼                │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    DChain Network                         │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │   │
│  │  │    Signer    │  │    Signer    │  │    Signer    │    │   │
│  │  │   (Geth +    │──│   (Geth +    │──│   (Geth +    │    │   │
│  │  │    Clef)     │  │    Clef)     │  │    Clef)     │    │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │   │
│  │                                                          │   │
│  │  Smart Contract: CertificateLAM (ERC-721 like)           │   │
│  │  Fungsi: mintCertificate(), getCertificate(), burn()     │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Problem

**Business Problem**: The Independent Accreditation Institute (LAM) needs a transparent, tamper-proof system for issuing and verifying study program accreditation certificates, accessible to all stakeholders (institutions, students, industry). Conventional certificate systems are vulnerable to forgery and slow verification.

**Technical Problem**: DChain currently uses PoA consensus — efficient but with limited decentralization. The planned PoS migration raises a strategic question: can PoS maintain or improve performance without sacrificing the responsiveness required by academic services? No comprehensive study had evaluated this migration's impact on DChain with standardized parameters.

## Solution

The solution consists of two layers:

1. **Certificate Management Application** — A Next.js 14 web system enabling LAM admins, study program operators, and users to manage and verify accreditation certificates as NFTs on the DChain blockchain. The application provides a dashboard interface, LAM/Program/Certificate CRUD, bulk Excel upload, and smart contract minting integration via ethers.js.

2. **Consensus Performance Study** — An experimental benchmarking study using Hyperledger Caliper on distributed multi-VPS infrastructure (5 nodes, K3s Kubernetes) comparing PoA (Clique) and PoS (Gasper) across 5 scenarios: throughput step, fixed load, worker scalability, read-intensive, and functional lifecycle/stability.

## My Contribution

### Internship (Sep–Dec 2024) — LAM NFT Certificate Frontend

Within a 4-person developer team, I was responsible for the majority of the frontend application with measurable contributions:

| Metric | Value |
|--------|-------|
| Commits | 30 (23.6% of total repo) |
| Lines added | 5,513 (24.1% of total repo) |
| Unique files touched | 75 |
| PRs authored & merged | 8 |
| UI components built | ~10+ (Pagination, ExcelUploader, CertificateCard, Skeleton, etc.) |

**Frontend & UI (100% my responsibility)**:
- Built the entire **admin dashboard** from scratch — login, sidebar, navbar, responsive layout, role-based routing (admin/LAM/prodi) — PR #2 (34 files, +792 lines)
- Developed **LAM/Program CRUD pages** with multi-column sorting, pagination, modal dialogs — PR #4, #6 (`list/lam/page.tsx`, 686 lines)
- Built the **NFT certificate page** with dual view (table/cards), search, pagination, detail modal, minting form, and blockchain verification — `sertifikat-lam/page.tsx` (933 lines)
- Implemented an **Excel bulk uploader** for mass data import of LAM/Program/Certificates — `ExcelUploader.tsx` (193 lines), xlsx parsing with the `xlsx` library, drag-and-drop zone
- Built **dashboard statistics** — certificate count aggregation per accreditation rating (Excellent/Very Good/Good) per LAM with skeleton loading — PR #21

**Blockchain Integration (client-side)**:
- **ethers.js integration** — connecting the frontend to the `CertificateLAM` smart contract on DChain
- **NFT Minting** — implemented `contract.mint(tokenURI, tupleMetadata)` via `BrowserProvider(window.ethereum)`
- **Blockchain Verification** — client-side certificate validation through smart contract reads

**Non-code contributions**:
- Studied DChain architecture, network consensus mechanisms, and web3 integration patterns
- Actively participated in team discussions during smart contract design
- Reviewed and merged 4 frontend team PRs

### Thesis (Aug–Dec 2025) — Benchmarking PoA vs PoS

The academic contribution was individual and independent:

- **Designed and built** the PoA DChain testbed environment: network replication using Geth + Clef, deployment automation with K3s Kubernetes across 5 distributed VPS (Contabo)
- **Designed and built** the PoS DChain testbed environment: Geth (execution layer) + Prysm (consensus layer) deployment with Kurtosis orchestration, 110 validator keys
- **Developed an automated benchmarking pipeline** — Hyperledger Caliper configuration, workload scripts for mint/read/burn/CPU stress, Mempool Guard watchdog, dual-mode Prometheus scraping
- **Built the monitoring stack** — Prometheus, Grafana, Pushgateway, Node Exporter, cAdvisor for real-time metrics (TPS, latency, CPU, RAM, network I/O)
- **Analyzed data** from 300+ trial iterations using robust statistics (median) and produced comparative visualizations (radar charts, time-series, hockey-stick curves)
- **Conclusion**: PoA remains most optimal for DChain's current stage due to its user-interactive nature and read-heavy workload

## Challenges

- **Learning DChain from scratch**: DChain was a blockchain platform none of the team had used before. Spent the first month (Sep 2024) studying its architecture, consensus mechanisms, and web3 integration patterns before writing any code. This delayed code contribution but built the foundation for meaningful blockchain integration work.
- **Integrating a smart contract you didn't write**: The Solidity smart contract was written by another team member. Had to read and understand the ABI, function signatures, and parameter shapes to call `mint()` from the frontend — without knowing Solidity.
- **Building for an undeployed system**: The platform never reached production. Every feature was built, tested, and demonstrated in development only — no real users, no production metrics, no live minting. This required focusing on code quality and architecture rather than user feedback loops.

## Thesis Connection

### Research Question
How does the performance of Proof of Authority (PoA) and Proof of Stake (PoS) consensus mechanisms compare on the DChain national blockchain network, measured through throughput, latency, resource efficiency, scalability, and stability?

### Methodology
**Approach**: Quantitative experimental through computerized benchmarking.

**Independent Variables**:
- Consensus mechanism: PoA (Clique) vs PoS (Gasper)
- Network topology: 4, 6, and 10 nodes
- Transaction load: 5–100 TPS (step load)
- Caliper worker count: 1, 3, 5
- Transaction types: mint (write), read, burn, CPU stress

**Infrastructure**:
- 1 Control Plane (AMD EPYC, 8 vCPU, 24GB RAM)
- 5 VPS nodes (6 vCPU, 12GB RAM) — distributed across Contabo
- Orchestrator: K3s Kubernetes
- Benchmark: Hyperledger Caliper v0.6.0
- Monitoring: Prometheus + Grafana (5-second resolution)
- Replication: 5 trials per scenario (300+ total iterations)

### Test Scenarios
1. **Throughput Capacity (Step Load)**: finding saturation point — 5–100 TPS load
2. **Fixed Load (Baseline)**: theoretical maximum capacity
3. **Worker Scalability**: 1, 3, 5 worker variations
4. **Read Intensive**: 200–600 TPS read load
5. **Functional Lifecycle & Stability**: 15-minute soak test + mint-read-burn lifecycle

### Internship–Thesis Connection
The internship provided essential domain context: understanding DChain's architecture, PoA consensus mechanism, and academic service characteristics. The thesis used that knowledge to design relevant experiments — including using DChain's actual smart contract as workload and mapping performance findings to real operational requirements.

## Key Findings

### Throughput & Saturation
| Metric | PoA (Clique) | PoS (Gasper) |
|--------|-------------|-------------|
| Peak throughput | ~30–40 TPS | ~60 TPS |
| Saturation point | 30 TPS | 60 TPS |
| Average latency | 4.6 seconds | ~8 seconds |
| Block/Slot time | 5 seconds | 12 seconds |

### Resource Efficiency
- **PoA significantly outperforms** in TPS per % CPU — minimal computational overhead
- **PoS pays for decentralization** with intensive attestation computation
- Under CPU stress testing, PoS performance degrades more drastically than PoA

### Stability
- Both consensus mechanisms stable in 15-minute soak tests — no memory leaks
- PoA has lower Coefficient of Variation (CV) → more deterministic performance

### Multi-dimensional Trade-off (Radar Chart)

```
                         PoA ─── PoS
                         
                   Throughput
                     ╱╲  10
                    ╱  ╲
                   ╱    ╲
                  ╱  8   ╲
                 ╱        ╲
                ╱          ╲
    Finality ◁─── 6 ──── 4 ── 2 ── 0 ── 2 ── 4 ── 6 ── 8 ── 10 ──▶ Responsiveness
                            ╲          ╱
                             ╲        ╱
                              ╲  6   ╱
                               ╲    ╱
                                ╲  ╱
                                 ╲╱
                          Resource
                         Efficiency
                         
    (Interpretation: PoA dominates in responsiveness & efficiency; PoS leads in throughput)
```

### Relevance to DChain
PoA is recommended for the current stage because:
1. **User-interactive**: 4.6s vs 8s latency — significant difference for certificate verification UX
2. **Read-heavy**: Write transaction volume (diploma issuance) is low and seasonal — PoS's massive capacity would be underutilized
3. **Deterministic finality**: PoA Clique is simpler for application integration
4. **Cost efficiency**: PoA's computational overhead is far lower → smaller infrastructure costs

## What I Learned

### Technical
- **Blockchain Architecture**: Understood end-to-end national blockchain architecture — from genesis configuration, validator network, consensus mechanisms, to application integration
- **Kubernetes for Blockchain**: Deployed and orchestrated blockchain nodes across multi-VPS using K3s, including hostNetwork configuration for optimal P2P performance
- **Benchmarking Methodology**: Implemented SPEC-recommended 5-layer benchmarking strategy, Caliper workload generator, dual-mode monitoring with Prometheus, and robust statistics
- **Ethereum Client Ecosystem**: Hands-on with Geth, Clef, Prysm — execution layer and consensus layer interaction, JWT authentication, peering, txpool management
- **Smart Contract Integration**: Client-side web3 integration via ethers.js, ABI management, wallet interaction

### Academic
- **Experimental Design**: Importance of variable control, trial replication, pre-warming, and cooldown for distributed systems data validity
- **Trade-off Analysis**: No perfect consensus solution — every choice is a trade-off between throughput, latency, decentralization, and computational cost
- **Context-driven Engineering**: Technical decisions must be based on actual workload characteristics, not technology hype — PoA, despite being "less fashionable," proved more suitable for DChain's current needs
- **Reproducibility**: All 10 source code repositories, configurations, and raw data are open for replication by other researchers

### Web3 Integration
- **You can integrate blockchain meaningfully without writing smart contracts**: Reading a contract ABI, understanding its interface, and wiring it into a frontend with ethers.js is real web3 work. The skill is in bridging Web2 UI patterns with Web3 transaction flows — handling wallet connection, transaction signing, and error states from chain interaction.
- **File parsing pipelines are underrated**: Building a reusable Excel uploader that parses `.xlsx`, validates columns, and dispatches to three different API endpoints taught structured data ingestion patterns that apply beyond blockchain.
- **Learning an unfamiliar blockchain on the job is transferable**: DChain was new to everyone on the team. Spending a month studying its architecture, consensus, and integration patterns before writing code taught how to ramp up on proprietary or niche blockchain platforms quickly.

### Project Status
- **LAM NFT Certificate App**: Development phase — not yet deployed to production
- **DChain Mainnet**: Active with 12 validator nodes — PoA current, PoS migration planned
- **Thesis Repositories**: All repositories public on GitHub (`Skripsi-Maulana-Anjari`) — open source for reproducibility
