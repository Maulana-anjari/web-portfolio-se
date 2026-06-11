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
metric: "Blok time 5s — latensi rata-rata 4.6s (PoA)"
excerpt: "Mengembangkan sistem manajemen sertifikat akreditasi NFT di atas jaringan blockchain nasional DChain untuk Lembaga Akreditasi Mandiri (LAM), dan melakukan benchmarking performa perbandingan konsensus PoA vs PoS yang menjadi dasar rekomendasi strategi migrasi jaringan."
order: 5
---

# DChain — Analisis Perbandingan Kinerja Mekanisme Konsensus Proof of Authority dan Proof of Stake pada Jaringan Blockchain Nasional DChain

## Repository

- **Internship (LAM NFT Certificate)**: `Dikti-Blockchain-and-Metaverse/lam-nft-certificate` (private)
- **Thesis — PoA Network Generator**: [DChain-PoA-Geth](https://github.com/Skripsi-Maulana-Anjari/DChain-PoA-Geth)
- **Thesis — PoA Deployer (Kubernetes)**: [DChain-PoA-Deployer](https://github.com/Skripsi-Maulana-Anjari/DChain-PoA-Deployer)
- **Thesis — PoS Network Generator**: [DChain-PoS-Geth](https://github.com/Skripsi-Maulana-Anjari/DChain-PoS-Geth)
- **Thesis — Benchmark Pipeline**: [caliper-benchmark-workspace](https://github.com/Skripsi-Maulana-Anjari/caliper-benchmark-workspace)
- **Thesis — Monitoring Stack**: [monitoring-tools](https://github.com/Skripsi-Maulana-Anjari/monitoring-tools)
- **Thesis — Analysis & Visualization**: [analysis](https://github.com/Skripsi-Maulana-Anjari/analysis)

## Keywords

DChain, blockchain nasional, PoA, PoS, Clique, Gasper, sertifikat NFT, akreditasi, Hyperledger Caliper, Kubernetes, benchmarking

## Overview

DChain (Dikti Chain) adalah jaringan blockchain nasional berbasis Ethereum yang dikembangkan oleh tim peneliti lintas universitas di Indonesia di bawah koordinasi Direktorat Jenderal Pendidikan Tinggi, Riset, dan Teknologi (Ditjen Diktiristek). Jaringan ini dirancang sebagai infrastruktur digital terdesentralisasi untuk penerbitan, penyimpanan, dan verifikasi dokumen akademik — termasuk ijazah digital, sertifikat kompetensi, dan transkrip — dengan jaminan integritas data.

Saat ini DChain berjalan dengan 12 node validator yang tersebar di berbagai perguruan tinggi (UGM, ITB, UI, UB, ITS, UNUD, Gundar, UNIMED, UNDIP, UT, dan lainnya) dan menggunakan mekanisme konsensus Proof of Authority (PoA). Terdapat rencana migrasi ke Proof of Stake (PoS) untuk meningkatkan desentralisasi dan skalabilitas — sebuah keputusan strategis yang memerlukan kajian performa empiris.

## My Role

Saya bergabung sebagai **Blockchain Developer Intern** di tim `Dikti-Blockchain-and-Metaverse` (Sep–Des 2024), dalam grup 4 developer aktif. Tanggung jawab saya mencakup pembangunan antarmuka admin dashboard sistem manajemen sertifikat akreditasi NFT untuk Lembaga Akreditasi Mandiri (LAM) — aplikasi yang dirancang untuk berjalan di atas jaringan DChain.

Setelah masa internship, pengalaman tersebut menjadi landasan bagi penelitian skripsi saya (Feb 2026) yang membandingkan kinerja mekanisme konsensus PoA dan PoS pada DChain. Internship memberikan pemahaman mendalam tentang arsitektur DChain dan konteks penggunaannya, sementara skripsi memberikan kontribusi akademis berupa data empiris yang mendukung keputusan migrasi konsensus.

## Architecture

DChain dibangun sebagai **Ethereum Virtual Machine (EVM)-compatible blockchain** menggunakan Go-Ethereum (Geth). Jaringan memiliki Chain ID `17845` (simbol dari 17/08/1945 — hari kemerdekaan Indonesia).

### Topologi Jaringan (Saat Ini — PoA)

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

### Arsitektur PoA (Saat Ini)

- **Konsensus**: Clique (EIP-225) — Round Robin, probabilistic finality
- **Klien Eksekusi**: Geth v1.13.2 / v1.13.10
- **Manajemen Akun**: Clef v1.13.2 (external signer dengan aturan keamanan `rules.js`)
- **Node Types**:
  - **Signers**: Validator terotorisasi dari universitas, berhak memproduksi blok
  - **Non-Signers (Observers)**: Full node tanpa hak validasi, sebagai gateway transaksi
- **Block Time**: 5 detik
- **Gas Limit**: 30,000,000 per blok

### Arsitektur PoS (Target Migrasi)

- **Konsensus**: Gasper (LMD-GHOST + Casper FFG) — deterministic finality
- **Klien Eksekusi**: Geth v1.16.7
- **Klien Konsensus**: Prysm v6.0.4 (Beacon Chain)
- **Slot Time**: 12 detik
- **Finality**: Deterministic — epoch di-finalisasi setelah 2/3 suara attestation
- **Validator Keys**: Setiap node menjalankan 22 validator keys (total 110 untuk 5 node)

### Arsitektur Smart Contract

Aplikasi menggunakan **smart contract `CertificateLAM`** (Solidity, EVM) untuk:
- **Mint**: Penerbitan sertifikat akreditasi sebagai NFT
- **Read**: Verifikasi dan pembacaan metadata sertifikat
- **Burn**: Penghapusan/pencabutan sertifikat

### Alur Data — LAM NFT Certificate System

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

**Masalah Bisnis**: Lembaga Akreditasi Mandiri (LAM) memerlukan sistem penerbitan dan verifikasi sertifikat akreditasi program studi yang transparan, anti-pemalsuan, dan dapat diakses oleh seluruh pemangku kepentingan (institusi, mahasiswa, industri). Sistem sertifikat konvensional rentan terhadap pemalsuan dan verifikasi yang lambat.

**Masalah Teknis**: DChain saat ini menggunakan konsensus PoA yang efisien namun memiliki desentralisasi terbatas. Rencana migrasi ke PoS menimbulkan pertanyaan strategis: apakah PoS dapat mempertahankan atau meningkatkan performa tanpa mengorbankan responsivitas yang dibutuhkan layanan akademik? Belum ada kajian komprehensif yang mengevaluasi dampak migrasi ini pada DChain dengan parameter terstandar.

## Solution

Solusi terdiri dari dua lapis:

1. **Aplikasi Manajemen Sertifikat** — Sistem web berbasis Next.js 14 yang memungkinkan admin LAM, operator prodi, dan pengguna untuk mengelola dan memverifikasi sertifikat akreditasi sebagai NFT di blockchain DChain. Aplikasi ini menyediakan antarmuka dashboard, CRUD LAM/Prodi/Sertifikat, upload massal via Excel, serta integrasi smart contract minting melalui ethers.js.

2. **Kajian Performa Konsensus** — Penelitian benchmarking eksperimental menggunakan Hyperledger Caliper pada infrastruktur multi-VPS terdistribusi (5 node, K3s Kubernetes) untuk membandingkan PoA (Clique) dan PoS (Gasper) dalam 5 skenario: throughput step, fixed load, worker scalability, read-intensive, dan functional lifecycle/stability.

## My Contribution

### Internship (Sep–Dec 2024) — LAM NFT Certificate Frontend

Dalam tim 4 developer, saya bertanggung jawab atas mayoritas frontend aplikasi dengan kontribusi terukur:

| Metrik | Nilai |
|--------|-------|
| Commit | 30 (23.6% dari total repo) |
| Baris kode ditambah | 5,513 (24.1% dari total repo) |
| File unik disentuh | 75 |
| PR authored & merged | 8 |
| Komponen UI dibuat | ~10+ (Pagination, ExcelUploader, CertificateCard, Skeleton, dll.) |

**Frontend & UI (100% tanggung jawab saya)**:
- Membangun seluruh **admin dashboard** dari awal — login, sidebar, navbar, layout responsif, routing berbasis role (admin/LAM/prodi) — PR #2 (34 files, +792 lines)
- Mengembangkan **halaman CRUD LAM/Prodi** dengan sorting multi-kolom, pagination, modal dialog — PR #4, #6 (`list/lam/page.tsx`, 686 baris)
- Membangun **halaman sertifikat NFT** dengan dual view (tabel/kartu), search, pagination, detail modal, form minting, dan verifikasi blockchain — file `sertifikat-lam/page.tsx` (933 baris)
- Mengimplementasikan **Excel bulk uploader** untuk upload massal data LAM/Prodi/Sertifikat — `ExcelUploader.tsx` (193 baris), parsing xlsx dengan library `xlsx`, dropzone
- Membangun **fitur statistik dashboard** — agregasi jumlah sertifikat per peringkat akreditasi (Unggul/Baik Sekali/Baik) per LAM dengan skeleton loading — PR #21

**Blockchain Integration (client-side)**:
- **Integrasi ethers.js** — menghubungkan frontend ke smart contract `CertificateLAM` di DChain
- **NFT Minting** — implementasi `contract.mint(tokenURI, tupleMetadata)` via `BrowserProvider(window.ethereum)`
- **Verifikasi Blockchain** — validasi sertifikat di sisi klien melalui smart contract reads

**Non-code contributions**:
- Mempelajari arsitektur DChain, mekanisme konsensus jaringan, pola integrasi web3
- Berpartisipasi aktif dalam diskusi tim saat perancangan smart contract
- Melakukan review dan merge 4 PR frontend tim

### Thesis (Aug–Dec 2025) — Benchmarking PoA vs PoS

Kontribusi akademis bersifat individu dan independen:

- **Merancang dan membangun** lingkungan testbed PoA DChain: replikasi jaringan menggunakan Geth + Clef, otomasi deployment dengan K3s Kubernetes di 5 VPS terdistribusi (Contabo)
- **Merancang dan membangun** lingkungan testbed PoS DChain: deployment Geth (execution layer) + Prysm (consensus layer) dengan orkestrasi Kurtosis, 110 validator keys
- **Mengembangkan pipeline benchmarking otomatis** — konfigurasi Hyperledger Caliper, workload scripts untuk mint/read/burn/CPU stress, Mempool Guard watchdog, dual-mode Prometheus scraping
- **Membangun stack monitoring** — Prometheus, Grafana, Pushgateway, Node Exporter, cAdvisor untuk metrik real-time (TPS, latensi, CPU, RAM, network I/O)
- **Menganalisis data** dari 300+ iterasi uji coba menggunakan robust statistics (median) dan menghasilkan visualisasi komparatif (radar chart, time-series, hockey-stick curves)
- **Kesimpulan**: PoA tetap paling optimal untuk DChain saat ini karena karakteristik user-interactive dan beban read-heavy

## Thesis Connection

### Research Question
Bagaimana perbandingan kinerja mekanisme konsensus Proof of Authority (PoA) dan Proof of Stake (PoS) pada jaringan blockchain nasional DChain, diukur melalui metrik throughput, latensi, efisiensi sumber daya, skalabilitas, dan stabilitas?

### Methodology
**Pendekatan**: Kuantitatif eksperimental melalui benchmarking terkomputerisasi.

**Variabel Bebas**:
- Mekanisme konsensus: PoA (Clique) vs PoS (Gasper)
- Topologi jaringan: 4, 6, dan 10 node
- Beban transaksi: 5–100 TPS (step load)
- Jumlah worker Caliper: 1, 3, 5
- Jenis transaksi: mint (write), read, burn, CPU stress

**Infrastruktur**:
- 1 Control Plane (AMD EPYC, 8 vCPU, 24GB RAM)
- 5 VPS nodes (6 vCPU, 12GB RAM) — tersebar di Contabo
- Orchestrator: K3s Kubernetes
- Benchmark: Hyperledger Caliper v0.6.0
- Monitoring: Prometheus + Grafana (resolusi 5 detik)
- Replikasi: 5 trial per skenario (300+ iterasi total)

### Skenario Pengujian
1. **Throughput Capacity (Step Load)**: mencari titik jenuh — beban 5–100 TPS
2. **Fixed Load (Baseline)**: kapasitas maksimum teoretis
3. **Worker Scalability**: variasi 1, 3, 5 worker
4. **Read Intensive**: beban baca 200–600 TPS
5. **Functional Lifecycle & Stability**: soak test 15 menit + mint-read-burn lifecycle

### Hubungan Internship–Thesis
Internship memberi saya konteks domain yang esensial: pemahaman arsitektur DChain, mekanisme konsensus PoA, dan karakteristik layanan akademik. Thesis menggunakan pengetahuan tersebut untuk merancang eksperimen yang relevan — termasuk menggunakan smart contract aktual DChain sebagai workload dan memetakan temuan performa ke kebutuhan operasional nyata.

## Key Findings

### Throughput & Saturasi
| Metrik | PoA (Clique) | PoS (Gasper) |
|--------|-------------|-------------|
| Throughput puncak | ~30–40 TPS | ~60 TPS |
| Titik saturasi | 30 TPS | 60 TPS |
| Latensi rata-rata | 4.6 detik | ~8 detik |
| Block/Slot time | 5 detik | 12 detik |

### Efisiensi Sumber Daya
- **PoA unggul signifikan** dalam TPS per % CPU — overhead komputasi minimal
- **PoS membayar desentralisasi** dengan komputasi attestation intensif
- Pada CPU stress test, performa PoS menurun lebih drastis dibanding PoA

### Stabilitas
- Kedua konsensus stabil dalam soak test 15 menit — tidak ada kebocoran memori
- PoA memiliki Coefficient of Variation (CV) lebih rendah → performa lebih deterministik

### Trade-off Multidimensi (Radar Chart)

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
                         
    (Interpretasi: PoA dominan di responsiveness & efisiensi; PoS unggul di throughput)
```

### Relevansi untuk DChain
PoA direkomendasikan untuk tahap saat ini karena:
1. **User-interactive**: Latensi 4.6s vs 8s — perbedaan signifikan untuk UX verifikasi sertifikat
2. **Read-heavy**: Volume transaksi tulis (penerbitan ijazah) rendah dan musiman — kapasitas masif PoS kurang termanfaatkan
3. **Finalitas deterministik**: PoA Clique lebih sederhana untuk integrasi aplikasi
4. **Efisiensi biaya**: Overhead komputasi PoA jauh lebih rendah → biaya infrastruktur lebih kecil

## What I Learned

### Technical
- **Blockchain Architecture**: Memahami end-to-end arsitektur blockchain nasional — dari genesis configuration, jaringan validator, mekanisme konsensus, hingga integrasi aplikasi
- **Kubernetes for Blockchain**: Deployment dan orkestrasi node blockchain di multi-VPS menggunakan K3s, termasuk konfigurasi hostNetwork untuk performa P2P optimal
- **Benchmarking Methodology**: Implementasi SPEC-recommended 5-layer benchmarking strategy, workload generator Caliper, dual-mode monitoring dengan Prometheus, dan robust statistics
- **Ethereum Client Ecosystem**: Hands-on dengan Geth, Clef, Prysm — interaksi execution layer dan consensus layer, JWT authentication, peering, txpool management
- **Smart Contract Integration**: Client-side web3 integration via ethers.js, ABI management, wallet interaction

### Academic
- **Experimental Design**: Pentingnya kontrol variabel, replikasi trial, pre-warming, dan cooldown untuk validitas data sistem terdistribusi
- **Trade-off Analysis**: Tidak ada solusi konsensus yang sempurna — setiap pilihan adalah trade-off antara throughput, latensi, desentralisasi, dan biaya komputasi
- **Context-driven Engineering**: Keputusan teknis harus didasarkan pada karakteristik beban kerja aktual, bukan hype teknologi — PoA yang "kurang fashionable" terbukti lebih cocok untuk kebutuhan DChain saat ini
- **Reproducibility**: Seluruh 10 repositori kode sumber, konfigurasi, dan data mentah dibuka untuk memungkinkan replikasi oleh peneliti lain

### Project Status
- **LAM NFT Certificate App**: Development phase — belum di-deploy ke production
- **DChain Mainnet**: Aktif dengan 12 node validator — PoA current, migrasi ke PoS direncanakan
- **Thesis Repositories**: Semua repositori publik di GitHub (`Skripsi-Maulana-Anjari`) — open source untuk reprodusibilitas
