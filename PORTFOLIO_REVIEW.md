# Portfolio Review

## Context

Tujuan utama website portfolio ini adalah untuk "menjual" profil Maulana Anjari agar lebih mudah dipercaya, dihubungi, dan dipertimbangkan untuk kerja sama proyek, freelance, kolaborasi, atau role di perusahaan.

Review ini menilai website dari sudut pandang hiring manager, potential client, collaborator, dan technical reviewer.

---

## Review #1 (29 Mei 2026) — Status: Sebagian Besar Selesai

### Kritik Utama

1. **Terlalu Banyak Aesthetic Confidence, Belum Cukup Business Confidence** ✅ Fixed — Section "Problems I Solve" + Proof strip telah ditambahkan.
2. **Hero Perlu Lebih Tajam** ✅ Fixed — Headline dan subcopy sekarang lebih direct dengan positioning "Backend & AI Engineer".
3. **Project Section Perlu Lebih Case-Study Oriented** ✅ Fixed — Project cards sekarang Problem → Built → Impact dengan metric badge.
4. **CTA Masih Terlalu Generik** ✅ Fixed — CTA eksplisit: Hire Me, View Resume, See Case Studies, plus CTA per project.
5. **Segmentasi Audience Belum Eksplisit** ✅ Fixed — Section Problems I Solve + Services mencakup hiring manager, client, dan collaborator.

### Rekomendasi Tambahan

| # | Rekomendasi | Status |
|---|------------|--------|
| 1 | Perkuat Headline dan CTA Hero | ✅ |
| 2 | Tambahkan Proof Strip Setelah Hero | ✅ |
| 3 | Ubah Project Cards Menjadi Mini Case Studies | ✅ |
| 4 | Tambahkan Section "How I Can Help" | ✅ |
| 5 | Perkuat Resume dan Contact Path | ✅ |
| 6 | Naikkan Accessibility ke 95+ | ✅ (kontras #666 → #949, skip-link, focus-visible, footer 404 dihapus) |

---

## Review #2 (5 Juni 2026) — Temuan Baru

### Penilaian Saat Ini

| Area | Nilai | Catatan |
| --- | ---: | --- |
| Technical quality | 8.5/10 | Build sukses, struktur bersih, security header sudah baik |
| Performance | **5/10** | Project images 8 MB/per file, total public/ 41 MB, font tidak di-preload |
| Accessibility | 8.5/10 | Skip link + focus-visible + kontras sudah OK, tapi `cursor: none` bermasalah |
| Code quality | 7/10 | Monolithic component 2400+ baris, unused imports/deps, LazySyntaxHighlighter tidak berfungsi |
| Visual impression | 8.5/10 | Tetap premium dan ber-personality |

---

## Temuan Audit Terbaru

### KRITIKAL

#### 1. Gambar Proyek 7-8 MB per File — Total `public/` 41 MB

| File | Ukuran |
|------|--------|
| `public/images/CAR-dano-project.png` | 7.5 MB |
| `public/images/llm-pertamina-project.png` | 7.8 MB |
| `public/images/pharmachain-project.png` | 7.6 MB |
| `public/images/SumbuPay-project.png` | 8.0 MB |
| `public/images/blog/tashawwur-hero.png` | 8.5 MB |
| `public/og-image.png` | 975 KB |
| `public/favicon.svg` | 527 KB (berisi PNG base64 1086x1448px) |

Dampak: Lighthouse Performance bisa anjlok dari 95 ke 30-40. User dengan koneksi lambat akan menunggu puluhan detik. `favicon.svg` 527 KB untuk file yang seharusnya 1-16 KB.

#### 2. `LazySyntaxHighlighter` Tidak Melakukan Syntax Highlighting

**Lokasi:** [src/components/LazySyntaxHighlighter.tsx](src/components/LazySyntaxHighlighter.tsx)

Komponen hanya render `<pre><code>{code}</code>` polos. Library `react-syntax-highlighter` (~1 MB) sudah terinstall tapi tidak pernah di-import. Semua code block di blog tampil sebagai teks hitam-putih tanpa warna syntax.

#### 3. `cursor: none` Global Tanpa Fallback

**Lokasi:** [src/index.css:17-19](src/index.css#L17-L19)

```css
body, html, a, button, [role="button"] {
  cursor: none !important;
}
```

Jika JavaScript gagal load, user tidak melihat kursor sama sekali. Custom cursor (`GlobalCursor`) hanya untuk mouse desktop. Tidak ada fallback untuk touch device atau screen reader.

---

### HIGH

#### 4. Unused Imports dan Dependencies

**Unused imports di [src/App.tsx](src/App.tsx):**
- `useSpring` — hanya dipakai di Blog.tsx
- `ChevronsUpDown`, `Cloud`, `Network`, `Share2` — tidak digunakan di JSX

**Unused dependencies di `package.json`:**
- `@giscus/react` — tidak pernah di-import
- `@google/genai` — sudah dipindah ke backend, dependency tertinggal
- `react-syntax-highlighter` + `@types/react-syntax-highlighter` — tidak dipakai
- `autoprefixer` — Tailwind v4 via Vite sudah handle prefixing
- `rehype-slug` — heading ID dibuat manual via `generateId()`
- `dotenv` — tidak dipanggil di mana pun

#### 5. Duplikasi Schema.org JSON-LD

`index.html` punya `Person` schema (jobTitle: "Software Engineer"). `App.tsx` via Helmet juga inject `Person` + `WebSite` schema (jobTitle: "Backend & AI Engineer"). Dua `Person` schema dengan data berbeda bisa membingungkan crawler.

#### 6. CSP Hanya di Server, Tidak Ada Meta Fallback

CSP diset di `server.ts` (Express) dan `vercel.json` (headers). Tidak ada `<meta http-equiv="Content-Security-Policy">` di `index.html` sebagai fallback jika custom headers tidak tersedia.

#### 7. `PortfolioHome` Monolitik — 2.431 Baris

Satu komponen berisi seluruh halaman: Hero + Skills + Experience + Work + Services + Process + Testimonials + Tech Stack + Blog + Footer + Resume Modal. 13 `useState` dalam satu lingkup. Tidak bisa lazy-load per section.

---

### MEDIUM

#### 8. Favicon 527 KB

`favicon.svg` berisi embedded PNG base64 resolusi 1086x1448px. Favicon seharusnya 1-16 KB dalam ukuran 32x32 atau 96x96.

#### 9. Experience Card `onClick` Tidak Berguna

**Lokasi:** [src/App.tsx:1314](src/App.tsx#L1314)

`onClick={() => window.open("#", "_blank")}` — membuka tab baru dengan hash kosong. Tidak ada aksi bermakna.

#### 10. Gambar Eksternal Tanpa `onError` Fallback

- Services section: gambar Unsplash ([App.tsx:1623](src/App.tsx#L1623))
- Testimonials: avatar GitHub ([App.tsx:1892](src/App.tsx#L1892))

Keduanya tidak punya fallback handler jika gambar broken.

#### 11. `tsconfig.json` Tanpa `strict: true`

TypeScript tanpa strict mode = type checking longgar. `noUnusedLocals`/`noUnusedParameters` tidak aktif — unused imports tidak terdeteksi saat build.

#### 12. Lenis RAF Loop Non-Stop

Lenis berjalan di `requestAnimationFrame` loop tanpa henti meskipun halaman tidak di-scroll. Menambah beban CPU idle. CSS `scroll-behavior: smooth` di index.css redundant.

---

### LOW

#### 13. `name` di `package.json` Masih `"react-example"`

Default Vite template, harusnya `"maulana-anjari-portfolio"`.

#### 14. File Development Tersisa di Root

`detailed_tree.txt`, `tree_output.txt`, `AUDIT_REPORT.md`, `maulana.sumbu.xyz-latest.json`, `maul-web-score.pdf`, `AGENTS.md`, `skills-lock.json`.

#### 15. `site.webmanifest` Tidak Lengkap

Tidak ada `start_url`, `description`, `categories`.

#### 16. Duplikasi Rate Limiter di `api/`

`api/posts.ts` dan `api/posts/[slug].ts` punya implementasi `checkRate()` identik. `api/posts/[slug].ts` tidak kirim `Cache-Control` header.

#### 17. Blog Fetch Tanpa User-Facing Error State

[src/App.tsx:374](src/App.tsx#L374): blog fetch gagal = skeleton loader selamanya, user tidak tahu ada error.

---

## Strategic Implementation Plan

### Fase 1: Performance Emergency (Target: 1 sesi)

Fokus pada perbaikan yang langsung berdampak ke user experience dan Lighthouse score.

| # | Tugas | Impact | Effort |
|---|-------|--------|--------|
| 1 | Konversi 5 gambar proyek ke WebP (quality 80%) + resize ke max 1200px width | Performance 30→85+ | Medium |
| 2 | Extract favicon dari SVG, buat PNG 32x32 dan 96x96 yang proper | Performance + UX | Low |
| 3 | Resize `og-image.png` ke 1200x630 + kompresi | Social sharing | Low |
| 4 | Konversi `portrait.png` sebagai WebP default, fallback ke PNG | Performance | Low |

**Cara:** Gunakan `sharp` (Node.js) atau `cwebp` CLI untuk batch convert:
```bash
find public/images -name "*.png" -exec cwebp -q 80 {} -o {}.webp \;
```

### Fase 2: Code Cleanup (Target: 1 sesi)

Bersihkan dead code dan perbaiki isu struktural.

| # | Tugas | Impact | Effort |
|---|-------|--------|--------|
| 5 | Hapus 5 unused imports dari App.tsx | Bundle size | Low |
| 6 | Hapus 7 unused dependencies dari package.json | node_modules size | Low |
| 7 | Hapus Schema.org JSON-LD dari `index.html` (biarkan Helmet yang handle) | SEO clarity | Low |
| 8 | Ganti `name` di `package.json` ke `"maulana-anjari-portfolio"` | Metadata | Low |
| 9 | Hapus file development dari root (`.txt`, laporan lama, dll) | Kebersihan repo | Low |
| 10 | Tambah `strict: true` + `noUnusedLocals: true` di `tsconfig.json` | Code safety | Low |

### Fase 3: Bug Fixes (Target: 1 sesi)

Perbaiki isu fungsional yang berdampak langsung ke user.

| # | Tugas | Impact | Effort |
|---|-------|--------|--------|
| 11 | Fix `LazySyntaxHighlighter` — import `react-syntax-highlighter` + `PrismLight` + register 5-6 bahasa umum | Blog UX | Medium |
| 12 | Fix `cursor: none` — bungkus dengan `@media (pointer: fine)` | Accessibility | Low |
| 13 | Hapus `onClick` tidak berguna di experience detail card | UX | Low |
| 14 | Tambah `onError` fallback ke gambar Unsplash dan avatar GitHub | UX | Low |
| 15 | Tambah `Cache-Control` header ke `api/posts/[slug].ts` | API perf | Low |

### Fase 4: Arsitektur & Robustness (Target: 1-2 sesi)

Perbaikan struktural jangka panjang.

| # | Tugas | Impact | Effort |
|---|-------|--------|--------|
| 16 | Tambah CSP meta tag fallback di `index.html` | Security | Low |
| 17 | Ekstrak shared rate limiter untuk `api/` functions | DRY | Low |
| 18 | Tambah user-facing error state untuk blog fetch di home page | UX | Low |
| 19 | Throttle GlobalCursor mousemove event | CPU perf | Low |
| 20 | Ekstrak section besar dari PortfolioHome ke komponen lazy-loaded (Hero, Projects, Services, dll) | Maintainability | High |
| 21 | Tambah `start_url`, `description`, `categories` ke `site.webmanifest` | PWA | Low |
| 22 | Preload font Inter + JetBrains Mono via `<link rel="preload">` | Perf | Low |

### Fase 5: Enhancement (Opsional/Nanti)

| # | Tugas | Impact | Effort |
|---|-------|--------|--------|
| 23 | Tambah skeleton loader untuk blog post di home page (ganti `opacity-20` placeholder) | UX | Medium |
| 24 | Tambah pagination ke `/api/posts` untuk scalability | API | Medium |
| 25 | Refactor warna hardcoded `#00FF66` ke CSS variable/Tailwind class | Maintainability | Medium |

---

## Ringkasan Total Temuan

| Severity | Count | Fase |
|----------|-------|------|
| Kritikal | 3 | Fase 1 + 3 |
| High | 4 | Fase 2 + 3 + 4 |
| Medium | 5 | Fase 3 + 4 |
| Low | 5 | Fase 2 + 4 |
| **Total** | **17** | |

**Estimasi effort total:** 3-4 sesi untuk Critical + High + Medium. Fase 4 (refactor PortfolioHome) adalah yang paling berat tapi paling berdampak jangka panjang.

**Quick wins (< 1 jam):** Fase 2 seluruhnya + items 12, 13, 14, 15, 16, 17, 18, 19, 21, 22.
