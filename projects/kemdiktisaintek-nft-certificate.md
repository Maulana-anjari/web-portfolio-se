---
title: "Kemdiktisaintek NFT Certificate Platform"
slug: "kemdiktisaintek"
role: "Blockchain Developer Intern"
company: "Kemdiktisaintek"
period: "2025"
tags: ["DChain", "Next.js", "TypeScript", "ethers.js", "NFT"]
image: "/images/kemdiktisaintek-project.webp"
metric: "Ministry-level platform"
excerpt: "Blockchain-backed accreditation certificate platform built for Indonesia's Ministry of Higher Education. Role-based dashboards for admins, LAM operators, and study programs with DChain NFT minting."
order: 7
---

# Kemdiktisaintek NFT Certificate Platform

## 🧾 Overview

A blockchain-backed accreditation certificate management system built for Lembaga Akreditasi Mandiri (LAM) under Kemdiktisaintek — the Indonesian Ministry of Higher Education, Science, and Technology. The platform enables LAM institutions to manage study program accreditations and mint tamper-proof NFT certificates on the DChain blockchain, with role-based dashboards for admins, LAM operators, and study program managers. Built during a 4-month internship by a 4-person team under the `Dikti-Blockchain-and-Metaverse` GitHub organization.

**Status**: Development-phase system; not deployed to production.

## 🔗 Repository

Private repository under `Dikti-Blockchain-and-Metaverse/lam-nft-certificate`. Details sanitized for public sharing.

## 🔑 Backend Keywords

blockchain, DChain, NFT, ethers.js, MetaMask, smart contract ABI integration, web3, Next.js 14, TypeScript, Excel parsing, bulk data ingestion, dashboard analytics, role-based access, CRUD, reusable component library

## 🛠️ My Role

**Blockchain Developer Intern** — responsible for the majority of the frontend application, including all admin dashboards, CRUD pages for LAM/Prodi/Sertifikat entities, 10+ reusable UI components, Excel bulk uploader, dashboard statistics, and client-side NFT minting integration with the DChain smart contract. Also participated in team discussions on smart contract design and self-studied DChain architecture, consensus mechanisms, and web3 integration patterns during the onboarding month.

## ❗ Problem

Kemdiktisaintek needed a digital platform for LAM institutions to manage accreditation certificates for study programs across Indonesia. The system had to support bulk data ingestion from Excel files, role-based dashboards for different stakeholders, and blockchain-backed certificate integrity via NFT minting — all built on the DChain blockchain network, a platform unfamiliar to every team member at the start.

### 🧩 Sub-Problem: role-based dashboards for three distinct user types

- **Problem**: Admin, LAM operators, and study program managers each needed different views, data access levels, and workflows. A single generic dashboard would not work.
- **Solution**: Built separate dashboard pages for admin (aggregated stats across all LAM), LAM (filtered to their own institution), and Prodi (program-level views). Implemented role-aware navigation (sidebar, navbar, footer) with conditional routing.
- **Stack**: Next.js 14 (App Router), TypeScript, Tailwind CSS, DaisyUI.
- **Result**: Three distinct, role-scoped dashboards delivered across 8+ pages with consistent layout and navigation.

### 📊 Metric callouts

<p align="left">
  <img src="https://img.shields.io/badge/30-commits-0ea5e9?style=for-the-badge" alt="30 commits" />
  <img src="https://img.shields.io/badge/5%2C513-LOC_~24%25_codebase-111827?style=for-the-badge" alt="5,513 LOC, ~24% codebase" />
  <img src="https://img.shields.io/badge/8-PRs_merged-10b981?style=for-the-badge" alt="8 PRs merged" />
</p>

### 🧩 Sub-Problem: bulk data ingestion from Excel files

- **Problem**: LAM operators needed to upload hundreds of study program and certificate records at once. Manual entry was not feasible. The data came in `.xlsx` format from offline spreadsheets.
- **Solution**: Built a standalone reusable `ExcelUploader` component (193 lines) using the `xlsx` library for client-side parsing with `useDropzone` for drag-and-drop UX. Component handles file validation, parsing, and POST to three different API endpoints (`/lam`, `/prodi`, `/sertifikat/bulk`).
- **Stack**: TypeScript, `xlsx` library, `react-dropzone`, Next.js API routes.
- **Result**: Bulk upload pipeline that accepts `.xlsx` files and posts parsed records to the backend — reusable across three entity types from a single component.

### 🧩 Sub-Problem: blockchain NFT minting from the frontend

- **Problem**: Accreditation certificates needed on-chain verification as NFTs on DChain, but the smart contract was written by another team member. The frontend had to interact with the deployed contract without knowing Solidity.
- **Solution**: Integrated the smart contract ABI on the client side using ethers.js — connected to MetaMask/BrowserProvider, instantiated a `Contract` object with the ABI and deployed address, and called the `mint()` function with token URI and metadata tuple. Built the entire certificate management page (933 lines) with dual table/card view, sorting, search, pagination, detail modal, and blockchain verification.
- **Stack**: ethers.js, MetaMask (`window.ethereum`), TypeScript, Next.js, Tailwind CSS.
- **Result**: Working NFT minting flow from the browser — users could mint certificates that referenced on-chain records, with blockchain verification visible in the UI.

### 🧩 Sub-Problem: dashboard analytics for accreditation statistics

- **Problem**: Admins and LAM operators needed aggregated views of certificate counts grouped by accreditation ranking (Unggul/Baik Sekali/Baik) across institutions.
- **Solution**: Built a `statsDashboard` utility (153 lines) that fetches and aggregates certificate data by ranking, with skeleton loading states for perceived performance. Integrated into both admin and LAM dashboard pages.
- **Stack**: TypeScript, Next.js, Tailwind CSS, DaisyUI (skeleton components).
- **Result**: Real-time dashboard statistics showing certificate distribution by accreditation tier, with responsive skeleton loading during data fetch.

## 🧰 Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, DaisyUI
- **Blockchain**: ethers.js, MetaMask (BrowserProvider), DChain network
- **Data ingestion**: `xlsx` library, `react-dropzone`
- **State & routing**: React hooks, Next.js routing
- **Version control**: Git, GitHub (PR-based workflow)

## Architecture / Flow

```
Browser (MetaMask)
    │
    ▼
┌──────────────────────────────────┐
│       Next.js 14 App             │
│                                   │
│  ┌──────────┐  ┌───────────────┐ │
│  │  Admin    │  │  LAM          │ │
│  │  Dashboard│  │  Dashboard    │ │
│  └──────────┘  └───────────────┘ │
│  ┌──────────┐  ┌───────────────┐ │
│  │  Prodi    │  │  Certificate   │ │
│  │  Dashboard│  │  List + Mint   │ │
│  └──────────┘  └───────┬───────┘ │
│                         │         │
│  ┌──────────────────────┴───────┐ │
│  │  Reusable Components (10+)   │ │
│  │  ExcelUploader | Pagination  │ │
│  │  CertificateCard | LamCard   │ │
│  │  PdfViewer | FilterTools     │ │
│  │  Skeleton | AddButton        │ │
│  │  EditButtons | CountChart    │ │
│  └──────────────────────────────┘ │
└──────────┬───────────────────────┘
           │
     ┌─────┴─────┬──────────────┐
     ▼           ▼              ▼
┌─────────┐ ┌─────────┐ ┌─────────────┐
│  REST   │ │  DChain │ │  ethers.js  │
│  API    │ │  Smart  │ │  Contract   │
│         │ │  Contract│ │  (ABI)      │
└─────────┘ └─────────┘ └─────────────┘
```

- Next.js 14 App Router serves role-scoped dashboards for admin, LAM, and Prodi users
- CRUD pages for LAM, Prodi, and Sertifikat entities with pagination, sorting, and search
- Certificate list page (933 lines) provides dual table/card view with blockchain verification
- Excel bulk uploader parses `.xlsx` client-side and POSTs to REST API endpoints
- ethers.js connects to DChain smart contract via ABI — MetaMask handles key management and signing
- 10+ reusable UI components shared across pages for consistent UX

## 📈 Result / Impact

- Delivered **30 commits (5,513 LOC)** across **75 unique files** — ~24% of the total 22,843-line codebase
- Authored and merged **8 pull requests** through structured PR review; also reviewed and merged **4 PRs** from teammates
- Built **8+ pages** (admin dashboard, LAM dashboard, Prodi dashboard, LAM list, Prodi list, certificate list, certificate-Prodi, login)
- Created **10+ reusable UI components** (Pagination, ExcelUploader, CertificateCard, LamCard, Skeleton, PdfViewer, FilterTools, AddButton, EditButtons, CountChart)

## ✅ Solution

- **Role-based dashboard architecture**: separate admin, LAM, and Prodi views with role-aware navigation and consistent layout components
- **Excel bulk upload pipeline**: single reusable component handling `.xlsx` parsing, validation, and API dispatch for three different entity types
- **Client-side NFT minting**: ethers.js Contract integration with smart contract ABI — mint certificates with token URI and metadata, connected to MetaMask
- **Dashboard analytics engine**: certificate count aggregation by accreditation ranking (Unggul/Baik Sekali/Baik) per institution, with skeleton loading
- **Component library**: 10+ reusable UI components built for consistency across all pages and future extensibility

## ⚠️ Challenges

- **Learning DChain from scratch**: DChain was a blockchain platform none of the team had used before. Spent the first month (Sep 2024) studying its architecture, consensus mechanism, and web3 integration patterns before writing any code. This delayed code contributions but built the foundation for meaningful blockchain integration work.
- **Integrating a smart contract you didn't write**: The Solidity contract was authored by another team member. Had to read and understand the ABI, function signatures, and expected parameter shapes to correctly call `mint()` from the frontend — without knowing Solidity.
- **Building for an undeployed system**: The platform never reached production. Every feature was built, tested, and demonstrated in development only — no real users, no production metrics, no live minting. This required focusing on code quality and architecture rather than user feedback loops.

## 💡 What I Learned

- **You can integrate blockchain meaningfully without writing smart contracts**: Reading a contract ABI, understanding its interface, and wiring it into a frontend with ethers.js is real web3 work. The skill is in bridging Web2 UI patterns with Web3 transaction flows — handling wallet connection, transaction signing, and error states from chain interaction.
- **File parsing pipelines are underrated backend-adjacent skills**: Building a reusable Excel uploader that parses `.xlsx`, validates columns, and dispatches to three different API endpoints taught structured data ingestion patterns. Most frontend devs never touch file parsing — having this in your toolkit matters when real-world systems ingest offline data.
- **Learning an unfamiliar blockchain on the job is a transferable skill**: DChain was new to everyone on the team. Spending a month studying its architecture, consensus, and integration patterns before writing code taught how to ramp up on proprietary or niche blockchain platforms quickly. The pattern — read docs, trace architecture, understand consensus, find integration surface — applies to any new chain.
