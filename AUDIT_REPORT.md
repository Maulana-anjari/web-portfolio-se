# Laporan Audit — maulana-anjari-portfolio

**Tanggal audit:** 2026-05-24
**Auditor:** Claude Code (otomatis)

---

## KRITIKAL

### 1. GEMINI_API_KEY bocor ke client-side bundle

**Lokasi:** [vite.config.ts:10-12](vite.config.ts#L10-L12)

API key di-inject ke client bundle via `define`:

```ts
'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
```

Siapa pun yang membuka halaman bisa melihat key ini di JS bundle hasil build. **Tidak peduli apakah key ini dipakai di source code atau tidak** — key tetap tersedia di bundle. `@google/genai` ada di `dependencies` dan berpotensi digunakan dari client.

**Solusi:** Pindahkan semua pemanggilan Gemini ke backend (server.ts atau Vercel API function), jangan pernah expose API key ke client. Hapus baris `define` di vite.config.ts.

---

### 2. Path traversal di API endpoint slug

**Lokasi:** [api/posts/[slug].ts:24](api/posts/[slug].ts#L24) dan [server.ts:56](server.ts#L56)

```ts
const filePath = path.join(postsDirectory, `${slug}.md`);
```

`path.join` + `path.resolve` akan menormalisasi traversal direktori. Input `../../../etc/passwd` menghasilkan `/etc/passwd.md`, memungkinkan pembacaan file `.md` apa pun di filesystem.

Verifikasi:
```
$ node -e "path.join('/app/posts', '../../../etc/passwd.md')"
/etc/passwd.md
```

Di Vercel sandbox blast radius-nya terbatas, tapi tetap celah serius.

**Solusi:** Sanitasi slug — hanya izinkan karakter alphanumeric, dash, dan underscore. Tolak jika mengandung `/` atau `..`.

---

## HIGH

### 3. Tidak ada Content Security Policy (CSP)

**Lokasi:** [index.html](index.html) dan [server.ts](server.ts)

Tidak ada header CSP atau `<meta http-equiv="Content-Security-Policy">`. Tanpa CSP, risiko XSS lebih tinggi.

**Solusi:** Tambahkan minimal:
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' https: data:;">
```

---

### 4. Tidak ada rate limiting di API

**Lokasi:** [api/posts.ts](api/posts.ts) dan [server.ts](server.ts)

Endpoint `/api/posts` dan `/api/posts/:slug` tidak memiliki rate limiting. Bisa di-spam.

**Solusi:** Tambahkan rate limiter — `express-rate-limit` untuk Express, atau guard manual (counter-based) untuk Vercel serverless.

---

### 5. Tidak ada Error Boundary

**Lokasi:** [src/main.tsx](src/main.tsx)

React app tidak dibungkus error boundary. Satu error di komponen bisa mem-blank-kan seluruh halaman.

**Solusi:** Tambahkan satu level error boundary di root, minimal:
```tsx
class ErrorBoundary extends React.Component<...> { ... }
```

---

### 6. Mixed content risk pada gambar blog

**Lokasi:** [Blog.tsx:545](src/components/Blog.tsx#L545)

URL gambar dibangun dari `frontmatter.img` tanpa validasi. Jika frontmatter berisi URL HTTP (bukan path relatif), bisa menghasilkan mixed content warning.

**Solusi:** Validasi URL gambar; pastikan diawali `/` (path relatif) atau `https://`.

---

## MEDIUM

### 7. Gambar missing — bridge-shaped-engineer-thinking

**Lokasi:** [posts/bridge-shaped-engineer-thinking.md](posts/bridge-shaped-engineer-thinking.md)

Post mereferensi `/images/blog/bridge-shaped-engineer-thinking-01.png` — file ini **tidak ada** di `public/images/blog/`. Di halaman home dan blog index, gambar akan memicu `onError` fallback ke placehold.co.

---

### 8. Gambar missing — when-does-problem-need-blockchain

**Lokasi:** [posts/when-does-problem-need-blockchain.md](posts/when-does-problem-need-blockchain.md)

Post mereferensi `/images/blog/when-does-problem-need-blockchain-01.png` — file ini **tidak ada**.

---

### 9. `rehypeSlug` diimpor tapi tidak dipakai

**Lokasi:** [Blog.tsx:6](src/components/Blog.tsx#L6)

```ts
import rehypeSlug from "rehype-slug";
```

Diimpor tapi tidak pernah di-pass ke `<ReactMarkdown>`. Heading ID dibuat manual lewat `generateId()` di custom renderer — pendekatannya sudah benar, tapi import tidak terpakai tetap dead code.

---

### 10. `ReactMarkdown` diimpor di App.tsx tapi tidak dipakai

**Lokasi:** [App.tsx:28](src/App.tsx#L28)

```ts
import ReactMarkdown from "react-markdown";
```

Tidak digunakan di manapun di file tersebut.

---

### 11. `site.webmanifest` salah konfigurasi

**Lokasi:** [site.webmanifest](site.webmanifest)

| Field | Nilai saat ini | Seharusnya |
|-------|---------------|------------|
| `name` | `"MyWebSite"` | `"Maulana Anjari Portfolio"` |
| `short_name` | `"MySite"` | `"Maulana Anjari"` |
| `theme_color` | `"#ffffff"` | `"#0A0A0A"` |
| `background_color` | `"#ffffff"` | `"#0A0A0A"` |

---

### 12. Format tanggal tidak konsisten di halaman blog index

**Lokasi:** [Blog.tsx:369](src/components/Blog.tsx#L369)

Menggunakan `{post.date}` mentah — output bervariasi tergantung format YAML frontmatter (string `"2026-02-22"` vs Date object dari `2026-05-19`). Di halaman home ([App.tsx:1784](src/App.tsx#L1784)) sudah diformat `.toISOString().slice(0,10)`. Harusnya konsisten:

```tsx
{new Date(post.date).toISOString().slice(0, 10)}
```

---

### 13. `react-syntax-highlighter` tidak di-lazy-load

**Lokasi:** [Blog.tsx:7-8](src/components/Blog.tsx#L7-L8)

Library ini ~1MB+ (termasuk semua bahasa & tema). Diimpor langsung di top-level tanpa code splitting. Memperlambat initial load halaman blog post.

**Solusi:** Bungkus dengan `React.lazy()` atau dynamic `import()`.

---

## LOW

### 14. Tidak ada halaman 404

**Lokasi:** [App.tsx:2059](src/App.tsx#L2059)

Footer link "404" mengarah ke `#`. Tidak ada route `*` untuk menangani halaman tidak ditemukan.

**Solusi:** Buat komponen `NotFound` dan tambahkan `<Route path="*" element={<NotFound />} />`.

---

### 15. Footer link mati / placeholder

**Lokasi:** [App.tsx:2059-2068](src/App.tsx#L2059-L2068)

| Link | Tujuan |
|------|--------|
| PRIVACY POLICY | `#` |
| TERM & CONDITION | `#` |
| GITLAB | `#` |
| LEETCODE | `#` |

---

### 16. Search tanpa debounce

**Lokasi:** [Blog.tsx:287-293](src/components/Blog.tsx#L287-L293)

Search input memicu re-filter setiap keystroke tanpa debounce. Untuk 12 post saat ini tidak masalah, tapi bisa lambat saat post bertambah.

---

### 17. API `/api/posts` tidak ada pagination

**Lokasi:** [api/posts.ts](api/posts.ts)

Mengembalikan semua post sekaligus. Untuk 12 post tidak masalah, tapi tidak scalable.

---

### 18. Nama file portrait tidak profesional

**Lokasi:** [public/input_file_0.png](public/input_file_0.png)

Nama file generik dari AI Studio export. Rename ke `portrait.png` atau `maulana-anjari.png` dan update referensi di [App.tsx:776](src/App.tsx#L776) dan [App.tsx:2078](src/App.tsx#L2078).

---

### 19. Sitemap: whitespace kosong untuk static pages

**Lokasi:** [scripts/generate-sitemap.ts:68](scripts/generate-sitemap.ts#L68)

Baris kosong tertinggal di output sitemap untuk halaman tanpa `lastmod` (home dan `/blog`). Tidak fatal tapi tidak rapi.

**Solusi:** Perbaiki template string ternary agar tidak menghasilkan newline saat `lastmod` kosong.

---

### 20. `loading` state mengembalikan `null`

**Lokasi:** [Blog.tsx:530](src/components/Blog.tsx#L530)

```ts
if (loading) return null;
```

Menyebabkan flash halaman kosong sebelum konten muncul. Tampilkan skeleton loader sebagai gantinya.

---

## Ringkasan

| Severity | Count |
|----------|-------|
| Kritis   | 2     |
| High     | 4     |
| Medium   | 7     |
| Low      | 7     |
| **Total** | **20** |

**Prioritas perbaikan:**
1. Cabut API key dari client bundle — pindahkan ke backend
2. Sanitasi slug di API endpoint untuk mencegah path traversal
3. Tambahkan CSP dan rate limiting sebagai lapisan pertahanan
4. Tambahkan error boundary agar aplikasi tidak crash total
