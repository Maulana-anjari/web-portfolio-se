# Portfolio Gap Analysis

## 🟡 Content Gaps

### 4. Belum ada halaman `/about`
- Bio lengkap, ProfilePage schema, education section
- UGM degree (Sarjana Teknik, GPA 3.40) hanya ada di JSON-LD, tidak visible di halaman mana pun

### 5. Belum ada Education section
- Pendidikan formal: S.T. from Universitas Gadjah Mada (2022–2026)
- Sertifikasi apa pun (jika ada)
- Coursework relevan: distributed systems, blockchain, AI/ML

### 6. ~~Case study DChain dalam Bahasa Indonesia~~ ✅ DONE
- 9 case studies lain English — DChain satu-satunya yang Indonesian
- Harusnya konsisten: either all English or bilingual dengan English sebagai primary

### 7. Belum ada cross-links antara blog dan projects
- Blog post → "Related Projects" section
- Project detail → "Related Reading" section
- Membangun topical authority dan internal linking

### 8. ServiceSection CTA link ke `#contact` anchor
- `services` CTA menggunakan `<a href="#contact">` — di SPA dengan Lenis smooth scroll, hash navigation tidak menjamin scroll ke footer
- Harusnya programmatic scroll atau langsung `mailto:` (seperti footer button)

## 🟡 UX/UI Gaps

### 9. Testimonials carousel broken
- Ada prev/next buttons (`aria-label="Previous testimonial"` / "Next testimonial")
- Hanya ada 1 testimonial — buttons non-fungsional, tidak ada carousel state
- Solusi: tambah testimonial lain, atau sembunyikan buttons kalo cuma 1

### 10. Navigasi sub-pages terbatas
- FloatingMenu di `/blog/:slug` dan `/projects/:slug` cuma nampilin 2 item (Home, All Posts/All Projects)
- User tidak bisa navigate ke section lain tanpa balik ke home
- Solusi: tambah item navigasi yang lebih lengkap di sub-pages (atau minimal "Back to Home", "Blog", "Projects", "Contact")

### 11. Footer button text mismatch
- Desktop: "Let's Collaborate"
- Mobile: "Hire / Collaborate"
- Harusnya konsisten — prefer "Let's Collaborate" untuk kedua

### 12. TechStack icons repetitive
- PostgreSQL, SQL Server, Milvus semua pakai icon `Database` yang sama
- Solusi: pilih icon yang lebih spesifik atau tambah label yang lebih jelas

### 13. No scroll-to-top button
- ScrollToTop ada di route change, tapi setelah scroll panjang di halaman blog/project detail (1000+ lines), tidak ada FAB untuk scroll ke atas
- Lenis smooth scroll membuat manual scroll ke atas lambat

### 14. 404 page tidak link ke `/projects`
- Hanya punya link ke home dan `/blog`
- Harusnya tambah "Browse Projects" sebagai opsi ketiga

## 🟡 SEO/Technical Gaps

### 15. `site.webmanifest` description outdated
- Masih "Backend & AI Engineer" dari positioning lama
- Seharusnya: "Backend Engineer & Startup Builder"

### 16. `vercel.json` duplicate cache-control
- Source `/assets/(.*)` muncul 2 kali di headers array (line 4–11 dan line 50–57)
- Tidak menyebabkan error tapi redundant

### 17. No breadcrumb JSON-LD
- Tidak ada `BreadcrumbList` structured data di halaman mana pun
- Penting untuk Google SERP rich snippets, terutama untuk blog dan project detail

### 18. No analytics
- Tidak ada tracking sama sekali (Google Analytics, Plausible, Umami, dll)
- Tidak bisa ukur: traffic, conversion (email/WA clicks), popular content, bounce rate
- Privacy-preserving option: Plausible or Umami (self-hosted)

### 19. ServiceSection Unsplash image tanpa local fallback
- Image dari Unsplash: kalau gagal load, area image jadi kosong
- onError handler tidak replace dengan placeholder seperti di ProjectDetail

## 📊 Positioning Gaps

### 20. Open source contribution tidak di-highlight
- 7 repositori thesis (DChain-PoA-Geth, DChain-PoS-Geth, caliper-benchmark-workspace, dll) adalah open source
- Tidak disebut di SkillsSection, ProjectsSection, atau mana pun
- Bisa jadi signal kuat untuk technical hiring managers

### 21. Aggregate impact metrics tidak ada
- Homepage cuma punya 3 stats di SkillsSection (3+ years, 15+ systems, 97+ endpoints)
- Tidak ada aggregate: total production users impacted, total TPS handled, total repos, total PRs merged

### 22. ~~Fitted & Pawona tidak ada disclaimer "design-phase"~~ ✅ DONE
- Case studies Fitted dan Pawona adalah design/architecture work, belum shipped
- Di listing project card tidak ada indikasi
- Perlu label visible: "request for" / "design phase" di project card dan detail page

### 23. No `/uses` or `/now` page
- Common developer portfolio patterns
- `/uses`: tools, hardware, software stack
- `/now`: current focus areas (Derek Sivers pattern)
