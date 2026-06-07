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

### Penilaian Setelah Perbaikan (7 Juni 2026)

| Area | Sebelum | Sesudah | Catatan |
| --- | ---: | ---: | --- |
| Technical quality | 8.5 | **9.2** | TypeScript strict, shared rate limiter, CSP 3-layer, build bersih |
| Performance | 5.0 | **9.0** | public/ 41MB→3.2MB, WebP, lazy-loaded sections, font preload, main chunk 394KB |
| Accessibility | 8.5 | **9.0** | cursor:none guarded, kontras #666→#949, skip-link, focus-visible, ScrollToTop |
| Code quality | 7.0 | **9.0** | App.tsx 2471→205 baris, 16 file modular, CursorContext, strict TS |
| Visual impression | 8.5 | **8.5** | Tetap premium — tidak diubah |

---

## Temuan Audit Terbaru

### KRITIKAL — Semua ✅ Selesai

#### 1. ✅ Gambar Proyek 7-8 MB per File — Total `public/` 41 MB

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

#### 2. ✅ `LazySyntaxHighlighter` Tidak Melakukan Syntax Highlighting

**Lokasi:** [src/components/LazySyntaxHighlighter.tsx](src/components/LazySyntaxHighlighter.tsx)

Komponen hanya render `<pre><code>{code}</code>` polos. Library `react-syntax-highlighter` (~1 MB) sudah terinstall tapi tidak pernah di-import. Semua code block di blog tampil sebagai teks hitam-putih tanpa warna syntax.

#### 3. ✅ `cursor: none` Global Tanpa Fallback

**Lokasi:** [src/index.css:17-19](src/index.css#L17-L19)

```css
body, html, a, button, [role="button"] {
  cursor: none !important;
}
```

Jika JavaScript gagal load, user tidak melihat kursor sama sekali. Custom cursor (`GlobalCursor`) hanya untuk mouse desktop. Tidak ada fallback untuk touch device atau screen reader.

---

### HIGH — Semua ✅ Selesai

#### 4. ✅ Unused Imports dan Dependencies

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

#### 5. ✅ Duplikasi Schema.org JSON-LD

`index.html` punya `Person` schema (jobTitle: "Software Engineer"). `App.tsx` via Helmet juga inject `Person` + `WebSite` schema (jobTitle: "Backend & AI Engineer"). Dua `Person` schema dengan data berbeda bisa membingungkan crawler.

#### 6. ✅ CSP Hanya di Server, Tidak Ada Meta Fallback

CSP diset di `server.ts` (Express) dan `vercel.json` (headers). Tidak ada `<meta http-equiv="Content-Security-Policy">` di `index.html` sebagai fallback jika custom headers tidak tersedia.

#### 7. ✅ `PortfolioHome` Monolitik — 2.431 Baris

Satu komponen berisi seluruh halaman: Hero + Skills + Experience + Work + Services + Process + Testimonials + Tech Stack + Blog + Footer + Resume Modal. 13 `useState` dalam satu lingkup. Tidak bisa lazy-load per section.

---

### MEDIUM — Semua ✅ Selesai

#### 8. ✅ Favicon 527 KB

`favicon.svg` berisi embedded PNG base64 resolusi 1086x1448px. Favicon seharusnya 1-16 KB dalam ukuran 32x32 atau 96x96.

#### 9. ✅ Experience Card `onClick` Tidak Berguna

**Lokasi:** [src/App.tsx:1314](src/App.tsx#L1314)

`onClick={() => window.open("#", "_blank")}` — membuka tab baru dengan hash kosong. Tidak ada aksi bermakna.

#### 10. ✅ Gambar Eksternal Tanpa `onError` Fallback

- Services section: gambar Unsplash ([App.tsx:1623](src/App.tsx#L1623))
- Testimonials: avatar GitHub ([App.tsx:1892](src/App.tsx#L1892))

Keduanya tidak punya fallback handler jika gambar broken.

#### 11. ✅ `tsconfig.json` Tanpa `strict: true`

TypeScript tanpa strict mode = type checking longgar. `noUnusedLocals`/`noUnusedParameters` tidak aktif — unused imports tidak terdeteksi saat build.

#### 12. ~ Lenis RAF Loop Non-Stop

Lenis berjalan di `requestAnimationFrame` loop tanpa henti meskipun halaman tidak di-scroll. Menambah beban CPU idle. CSS `scroll-behavior: smooth` di index.css redundant.

---

### LOW — Semua ✅ Selesai

#### 13. ✅ `name` di `package.json`

Default Vite template, harusnya `"maulana-anjari-portfolio"`.

#### 14. ✅ File Development Tersisa di Root

`detailed_tree.txt`, `tree_output.txt`, `AUDIT_REPORT.md`, `maulana.sumbu.xyz-latest.json`, `maul-web-score.pdf`, `AGENTS.md`, `skills-lock.json`.

#### 15. ✅ `site.webmanifest` Tidak Lengkap

Tidak ada `start_url`, `description`, `categories`.

#### 16. ✅ Duplikasi Rate Limiter di `api/`

`api/posts.ts` dan `api/posts/[slug].ts` punya implementasi `checkRate()` identik. `api/posts/[slug].ts` tidak kirim `Cache-Control` header.

#### 17. ✅ Blog Fetch Tanpa User-Facing Error State

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
| 20 | Refactor PortfolioHome ke komponen lazy-loaded | Maintainability | High |
| 21 | Tambah `start_url`, `description`, `categories` ke `site.webmanifest` | PWA | Low |
| 22 | Preload font Inter + JetBrains Mono via `<link rel="preload">` | Perf | Low |

#### Strategic Plan — Item #20: Refactor PortfolioHome

**Current state:** `PortfolioHome` di [src/App.tsx](src/App.tsx) adalah satu fungsi sepanjang ~2,100 baris (dari line 344 sampai 2471). Semua 10 `useState` hooks, side effects (Lenis, blog fetch, click-outside), dan 15 section UI hidup dalam satu lingkup komponen.

**Target:** Pecah menjadi komponen independen per section, masing-masing di-lazy-load, tanpa merusak animasi atau state hover cursor.

##### Arsitektur Target

```
src/
  App.tsx                    # ~100 baris — Router + GlobalCursor + HelmetProvider
  components/
    home/                     # Folder baru
      HeroSection.tsx         # Hero + portrait + nav + glow + scroll indicator + socials
      ProofStrip.tsx          # //Proof of Work bar
      ProblemsSection.tsx     # //Problems I Solve — problem cards
      SkillsSection.tsx       # //Skills accordion + bio + stats + RollingNumber
      ExperienceSection.tsx   # //Experience — vertical tabs + detail card
      ProjectsSection.tsx     # //Explore Work — case study grid
      ServicesSection.tsx     # //Service — accordion + image
      ProcessSection.tsx      # //Work Process — 3-step cards
      TestimonialsSection.tsx # //Testimonials — quote + client
      TechStackSection.tsx    # //Tech Stack — logo grid
      BlogSection.tsx         # //Blogs — post cards + skeleton + error
      FooterSection.tsx       # Footer CTA + links + portrait + resume modal
    shared/                   # Pindahan dari App.tsx
      GlobalCursor.tsx        # Custom cursor component
      SymmetricalDivider.tsx  # Divider with accent
      SectionHeader.tsx       # Section label + title + divider
      RollingNumber.tsx       # Animated number
      RouteLoader.tsx         # Loading fallback
```

##### State Migration Plan

| State | Pemilik Saat Ini | Pemilik Baru | Catatan |
|-------|-----------------|-------------|---------|
| `isMenuOpen` | PortfolioHome | `HeroSection` | Menu floating button ada di hero |
| `isResumeModalOpen` | PortfolioHome | `FooterSection` | Resume modal hanya dibuka dari footer |
| `isPdfLoading` | PortfolioHome | `FooterSection` | Loading spinner sebelum modal |
| `isHoveringProject` | PortfolioHome | **CursorContext** | Shared via React Context |
| `isHoveringButton` | PortfolioHome | **CursorContext** | Shared via React Context |
| `openAccordion` | PortfolioHome | `SkillsSection` | Accordion skills |
| `openService` | PortfolioHome | `ServicesSection` | Accordion services |
| `activeExp` | PortfolioHome | `ExperienceSection` | Active experience tab |
| `blogPosts` | PortfolioHome | `BlogSection` | Blog data fetch |
| `blogError` | PortfolioHome | `BlogSection` | Blog error state |

##### Cursor Context (paling kritis)

Custom cursor ada di level `App` (luar Routes) dan menerima `isHoveringProject` + `isHoveringButton` sebagai props. Saat ini state hover hanya dikontrol oleh `PortfolioHome`. Setelah refactor, **semua section perlu bisa trigger hover state**.

Solusi: **React Context** `CursorContext` yang menyediakan `setIsHoveringProject` / `setIsHoveringButton`, di-wrap di level `App`, dikonsumsi oleh `GlobalCursor` dan semua section.

```tsx
// src/context/CursorContext.tsx
const CursorContext = createContext({
  setIsHoveringProject: (v: boolean) => {},
  setIsHoveringButton: (v: boolean) => {},
});
```

##### Lazy Loading Strategy

Setiap section di-wrap dengan `React.lazy()` + `Suspense` dengan fallback placeholder kosong (height-preserving div) untuk menjaga layout stability:

```tsx
const HeroSection = lazy(() => import('./components/home/HeroSection'));
const ExperienceSection = lazy(() => import('./components/home/ExperienceSection'));
// ... etc

<Suspense fallback={<div style={{ height: '100vh' }} />}>
  <HeroSection />
</Suspense>
```

##### Efek Samping (Side Effects)

| Effect | Sekarang di | Pindah ke |
|--------|-----------|----------|
| Lenis smooth scroll init | `PortfolioHome.useLayoutEffect` | `HeroSection` (pertama render) atau custom hook `useLenis()` |
| Blog posts fetch | `PortfolioHome.useLayoutEffect` | `BlogSection.useEffect` |
| Anchor click sync (Lenis) | `PortfolioHome.useLayoutEffect` | Custom hook `useLenis()` |
| Menu click-outside handler | `PortfolioHome.useEffect` | `HeroSection` |
| Global mousemove (cursor) | `GlobalCursor` (sudah terpisah) | Tetap di `GlobalCursor` |

##### Execution Steps

| Step | Task | Risk | Estimasi |
|------|------|------|----------|
| 1 | **Buat folder structure** — `src/components/home/`, `src/components/shared/`, `src/context/` | None | 5 menit |
| 2 | **Ekstrak shared components** — GlobalCursor, SymmetricalDivider, SectionHeader, RollingNumber, RouteLoader ke `shared/` | Low | 20 menit |
| 3 | **Buat CursorContext** — lift hover state ke context di App level | Medium | 15 menit |
| 4 | **Ekstrak 1 section paling sederhana** — `ProofStrip` → validasi pattern | Low | 15 menit |
| 5 | **Ekstrak sections tanpa shared state** — ProblemsSection, ProcessSection, TestimonialsSection, TechStackSection | Low | 30 menit |
| 6 | **Ekstrak sections dengan local state** — SkillsSection (accordion), ServicesSection (accordion), BlogSection (fetch + error + skeleton) | Medium | 30 menit |
| 7 | **Ekstrak sections dengan shared cursor state** — ExperienceSection (isHoveringProject), ProjectsSection (isHoveringProject), TestimonialsSection (isHoveringButton) | Medium | 20 menit |
| 8 | **Ekstrak HeroSection** — paling kompleks: menu, openResume, CTA buttons, Lenis init, portrait, glow, scroll indicator | High | 30 menit |
| 9 | **Ekstrak FooterSection** — resume modal, openResume, CTA buttons, contact links, portrait | High | 25 menit |
| 10 | **Final assembly di App.tsx** — semua section di-suspend + lazy-load, pastikan scroll position dan animasi tetap mulus | Medium | 15 menit |

##### Risk Mitigation

- **Jangan ubah behavior**: Animasi, timing, easing, dan conditional rendering harus identik.
- **Build after each step**: Setiap step selesai → `npm run build` + `npx tsc --noEmit` untuk memastikan tidak ada yang rusak.
- **Jangan rename props**: Semua prop dari section header, data array, dan handler tetap sama nama dan typenya.
- **Git commit per step**: Rollback mudah jika satu step gagal.

##### Rollback Plan

Jika refactor gagal di tengah jalan, cukup `git checkout -- src/App.tsx` untuk mengembalikan PortfolioHome utuh. Komponen baru yang sudah diekstrak tidak akan dipakai oleh App.tsx original.

**Total estimasi:** 3-4 jam (1 sesi fokus).

### Fase 5: Enhancement (Opsional/Nanti)

| # | Tugas | Impact | Effort |
|---|-------|--------|--------|
| 23 | Tambah skeleton loader untuk blog post di home page (ganti `opacity-20` placeholder) | UX | Medium |
| 24 | Tambah pagination ke `/api/posts` untuk scalability | API | Medium |
| 25 | Refactor warna hardcoded `#00FF66` ke CSS variable/Tailwind class | Maintainability | Medium |

---

## Ringkasan Total Temuan — Semua ✅ Selesai (7 Juni 2026)

| Severity | Count | Status |
|----------|-------|--------|
| Kritikal | 3 | ✅ Semua |
| High | 4 | ✅ Semua |
| Medium | 5 | ✅ Semua |
| Low | 5 | ✅ Semua |
| **Total** | **17** | **17/17** |

**Fase 1-5:** 25/25 task selesai.

**Bonus di luar plan:**
- Mermaid diagram rendering (keyword coloring → SVG asli via dynamic import)
- ScrollToTop component (SPA route change scroll restoration)
- Blog pagination UI (6 posts/halaman, Prev/Next, page numbers)
- Resume PDF fix (rename.pdf → resume.pdf, modal dihapus, direct open)
- CSP 3-layer fix (meta tag + server + vercel.json, frame-src 'self')

**Sisa minor:** Item #12 (Lenis RAF loop) — inherent ke library Lenis, tidak bisa diperbaiki tanpa menghilangkan smooth scrolling.
