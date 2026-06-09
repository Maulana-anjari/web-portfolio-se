---
title: "PharmaChain: Healthcare Data Interoperability"
slug: "pharmachain"
role: "Blockchain Researcher"
company: "UGM DTETI"
period: "Oct 2023 – Jan 2024"
tags: ["Hyperledger Fabric", "IPFS", "Docker", "Go", "MongoDB"]
image: "/images/pharmachain-project.webp"
metric: "UGM research grant · published"
excerpt: "Healthcare data interoperability testbed with 2 independent Hyperledger Fabric networks, 30+ Docker containers, 12-node encrypted IPFS cluster, and cross-chain identity sharing across 6 organizations."
order: 4
---

# Pharma Chain / Hyperledger Fabric

## 🔗 Repository

- Original repo: https://github.com/dteti-sys-rsch/pharma-chain
- Evidence extraction: `maulana-backend-case-studies/evidence/pharmachain-kontribusi.md`

---

## 🔑 Backend Keywords

Hyperledger Fabric, IPFS (Kubo + Helia), AES-256-CBC, cross-chain interoperability, Docker, off-chain databases, MongoDB, PostgreSQL, smart contracts, SHA-256 state hashing, benchmarking, distributed systems, healthcare data exchange, full-stack blockchain

---

## 🧾 Overview

Healthcare supply-chain interoperability testbed built as a **university research grant project (Hibah KD DTETI UGM)** under supervisor **Guntur D Putra**. The project explored secure, verifiable data exchange between hospital and insurance blockchain networks — combining on-chain identity verification with off-chain encrypted storage.

This work later became the **foundation for my undergraduate thesis (Grade A)**, with the full research report serving as the lab's academic publication baseline.

---

## 🛠️ My Role

- **Blockchain Researcher** — University Research Grant (Hibah KD DTETI UGM)
- Supervisor: Guntur D Putra (PI)
- 3-person research team (1 supervisor + 2 researchers)
- Covered **6 of 6 full-stack layers**: HLF network infrastructure, chaincode/smart contracts, encrypted IPFS storage, off-chain databases, cross-chain application, and dataset curation
- 3-month active span (Oct 2023 – Jan 2024), 20 commits, ~33,494 lines added, 199 unique files

---

## ❗ Problem

Healthcare data exchange between independent organizations (hospitals, insurers) requires strong integrity guarantees without overloading the shared ledger with large sensitive files. The project needed a testbed that could prove cross-network interoperability is viable — not just theoretical — while maintaining practical performance.

---

### 🧩 Sub-Problem: cross-network interoperability

- **Problem:** Hospital and insurance networks running separate blockchain deployments needed to exchange identity and transaction data securely, with cryptographic verifiability across trust boundaries.
- **Solution:** Built two independent Hyperledger Fabric networks (not 1 network with 2 channels — two fully isolated deployments with separate orderers, CAs, and port ranges) and a cross-chain application connecting both simultaneously via dual Gateway instances.
- **Stack:** Hyperledger Fabric 2.2.x, Node.js (`fabric-network`), Docker Compose, Bash automation scripts.
- **Result:** Two networks interoperating in a controlled testbed — `GetKey` from Org1 (hospital channel) relayed to `UploadIdentity` on Org4 (insurance channel), with SHA-256 chained state hashing for integrity verification between transactions.

<p align="left">
  <img src="https://img.shields.io/badge/2-independent_Fabric_networks-0ea5e9?style=for-the-badge" alt="2 independent Fabric networks" />
  <img src="https://img.shields.io/badge/6-organizations-111827?style=for-the-badge" alt="6 organizations" />
  <img src="https://img.shields.io/badge/30%2B-Docker_containers-10b981?style=for-the-badge" alt="30+ Docker containers" />
  <img src="https://img.shields.io/badge/154-HLF_config_files-f97316?style=for-the-badge" alt="154 HLF config files" />
</p>

---

### 🧩 Sub-Problem: ledger scalability and data storage

- **Problem:** Large healthcare data (patient records, documents) could not live directly on-chain without crippling throughput and inflating ledger size.
- **Solution:** Designed a hybrid architecture — **on-chain for identity verification and transaction integrity, off-chain for encrypted data storage**. Built a 12-node IPFS cluster (2 sub-clusters of 6 nodes each) with AES-256-CBC encryption via Helia, plus dual off-chain databases (MongoDB for patient records, PostgreSQL for structured healthcare datasets).
- **Stack:** IPFS (Kubo + IPFS Cluster), Helia (`@helia/unixfs`), Node.js `crypto` module (AES-256-CBC), MongoDB (Mongoose), PostgreSQL (pg).
- **Result:** ~40% reduction in cross-network data retrieval latency via off-chain relay architecture. Data integrity preserved through cryptographic verification without ledger bloat.

<p align="left">
  <img src="https://img.shields.io/badge/12-node-IPFS_cluster-8b5cf6?style=for-the-badge" alt="12-node IPFS cluster" />
  <img src="https://img.shields.io/badge/AES--256--CBC-encryption-ef4444?style=for-the-badge" alt="AES-256-CBC encryption" />
  <img src="https://img.shields.io/badge/MongoDB-|_PostgreSQL-3b82f6?style=for-the-badge" alt="MongoDB + PostgreSQL" />
  <img src="https://img.shields.io/badge/~40%25-latency_reduction-22c55e?style=for-the-badge" alt="~40% latency reduction" />
</p>

---

## 🧰 Stack

| Layer | Technologies |
|---|---|
| Blockchain network | Hyperledger Fabric 2.2.x (2 independent networks, 6 orgs) |
| Smart contracts | JavaScript chaincode (3 functions: identity relay, key retrieval, SHA-256 state hashing) |
| Decentralized storage | IPFS (Kubo + IPFS Cluster), Helia (`@helia/unixfs`) |
| Encryption | AES-256-CBC (Node.js `crypto` module) |
| Off-chain databases | MongoDB (Mongoose ODM), PostgreSQL (pg driver) |
| Cross-chain application | Node.js, `fabric-network` SDK, dual Gateway pattern |
| Infrastructure | Docker Compose (30+ containers), NFS shared storage, Bash automation |
| Data | 18 healthcare dataset URLs, 4 SQL tables |
| Benchmarking | Hyperledger Caliper |

---

## Architecture / Flow

- Two independent Hyperledger Fabric networks with dedicated orderers, CAs, and non-overlapping port ranges (hospital: 70xx, insurance: 71xx)
- Smart contract deployed to both channels (`hospital-cc`, `insurance-cc`) with SHA-256 chained state hashing
- Cross-chain application connecting to both channels simultaneously via two Fabric Gateway instances — performs identity relay across trust boundaries
- Encrypted IPFS pipeline: `storeToIPFS.js` (AES-256-CBC encrypt → Helia upload) and `takeFromIPFS.js` (download → AES-256-CBC decrypt)
- Dual off-chain databases: MongoDB (patient schema, Mongoose CRUD) and PostgreSQL (4 tables, pg CRUD) — both containerized and connected to the cross-chain app layer
- 154 HLF configuration files created from scratch (not copied from `fabric-samples`): custom configtx.yaml, CA registration scripts, Docker Compose, cryptogen configs, connection profile generation scripts
- Deployed end-to-end on DTETI UGM lab servers (IPs: 10.42.10.132 for HLF nodes, 10.42.29.133 for NFS storage)

---

## 📈 Result / Impact

### Technical Outcomes

| # | Metric | Value |
|---|--------|-------|
| 1 | Independent HLF networks built from scratch | 2 (bc-hospital, bc-insurance) |
| 2 | Organizations configured | 6 (2 orderers + 4 peers) |
| 3 | Docker containers orchestrated (zero port conflicts) | 30+ (18 HLF + 12 IPFS + 3 DBs) |
| 4 | HLF configuration files created from scratch | 154 |
| 5 | Cross-chain channels connected simultaneously | 2 (hospital + insurance) |
| 6 | IPFS cluster nodes (encrypted) | 12 nodes, 2 clusters |
| 7 | Off-chain databases integrated | 2 (MongoDB + PostgreSQL) |
| 8 | Full-stack blockchain layers covered | 6 of 6 |
| 9 | Lines added | 33,494 |
| 10 | Unique files touched | 199 |

### Delivery Metrics

| # | Metric | Value |
|---|--------|-------|
| 1 | Issue closure rate | 10/15 (67%) |
| 2 | PR acceptance rate | 7/8 (87.5%) |
| 3 | Commits in main branch | 19/20 |
| 4 | Activity span | Oct 25, 2023 – Jan 30, 2024 |
| 5 | Cross-network data retrieval latency reduction | ~40% |

---

## ✅ Solution

- Split the prototype into two independent Fabric networks with coordinated port ranges (no conflicts across 30+ containers)
- Added hybrid on-chain/off-chain architecture: on-chain for identity verification and transaction integrity, off-chain (IPFS + MongoDB + PostgreSQL) for encrypted heavy data
- Built encrypted IPFS pipeline with AES-256-CBC to ensure data confidentiality at rest in decentralized storage
- Developed cross-chain application with dual Gateway pattern for simultaneous multi-network operations
- Automated network configuration generation (`ccp-generate.sh`) for reproducible deployment
- Curated 18 healthcare datasets and 4 SQL tables to ground the testbed in realistic data

---

## ⚠️ Challenges

- Coordinating two independent blockchain networks with clean port separation across 30+ Docker containers
- Keeping data movement efficient across on-chain and off-chain layers — the wrong split would negate performance gains
- IPFS download pipeline (`takeFromIPFS.js`) had an unresolved hang bug when project time ran out — the upload pipeline and encryption/decryption flow were verified working; download concept later validated in a separate project (CAR-dano)
- Managing infrastructure complexity across physical lab servers without losing traceability or reproducibility

---

## 💡 What I Learned

**The core insight:** Blockchain doesn't need to store all data. Distributed systems achieve efficiency not by putting everything on the ledger, but by knowing exactly what belongs on-chain (identity, verification, integrity proofs) and what belongs off-chain (storage, heavy payloads, operational data). The ~40% latency reduction came from this architectural clarity — not from tuning individual components.

**Technical takeaways:**
- 154 config files from scratch taught me that infrastructure-as-code discipline is non-negotiable in distributed systems — copy-pasting `fabric-samples` hides critical design decisions
- Cross-chain identity sharing requires thinking about trust models, not just connection plumbing — two separate HLF networks mean two separate trust domains
- Encrypted IPFS pipelines introduce a tension between decentralization and key management that has no one-size-fits-all answer

---

## 🎓 Thesis Connection

This research grant work became the foundation for **my undergraduate thesis (Grade A)**. The comprehensive research report produced as a project deliverable served as the lab's baseline for academic publication on blockchain-based healthcare interoperability architectures.

