# AGENTS.md

## Commands

- `npm run dev` — dev server (Express + Vite middleware on port 3000 via `tsx server.ts`)
- `npm run build` — production build (`vite build`, outputs to `dist/`)
- `npm run start` — production server (`node server.ts`, serves `dist/` statically)
- `npm run lint` — typecheck only (`tsc --noEmit`). No ESLint is configured.
- `npm run clean` — removes `dist/`

No test framework is configured.

## Architecture

- React 19 SPA with client-side routing (react-router-dom) and an Express backend
- `server.ts` is the runtime entrypoint: serves blog API routes (`/api/posts`, `/api/posts/:slug`) and either Vite middleware (dev) or static files from `dist/` (prod)
- `src/main.tsx` → `src/App.tsx` is the React entry. App.tsx is a large monolithic file containing all portfolio sections (hero, about, experience, projects, services, testimonials, tech stack, contact)
- `src/components/Blog.tsx` — blog index + post detail pages, with mermaid diagram rendering
- Blog posts live in `posts/*.md` with YAML frontmatter (title, date, excerpt, tags, readingTime)

## Key conventions

- Path alias: `@/*` → project root (configured in both tsconfig and vite.config)
- Tailwind CSS v4 via `@tailwindcss/vite` plugin. Custom theme vars defined in `src/index.css` (`--color-neon-mint: #00FF66`, `--color-dark-charcoal: #0A0A0A`)
- Animation library is `motion` (the framer-motion successor), imported as `motion/react`
- `tsconfig` has `noEmit: true` and `allowImportingTsExtensions: true` — Vite handles bundling

## Environment

- `GEMINI_API_KEY` — required at build time (injected via Vite `define`). Set in `.env.local` for dev.
- `APP_URL` — self-referential URL for the deployed app
- HMR is conditionally disabled when `DISABLE_HMR=true` (used by AI Studio)
