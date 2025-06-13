Here’s a quick-scan “tour” of everything in packages/, the way the pieces fit together, and some tips for getting up to speed fast.

1. Package-by-package overview
   server / @self-hosted/server
   Purpose Express API that stores UI components, runs searches, and uses Google Gemini to auto-generate / refine React components.
   Key tech TypeScript, Express 5, Nodemon, dotenv, CORS, @google/generative-ai.
   Entry points
   src/app.ts boots Express, sets CORS for http://localhost:5173, mounts routes.
   Routes layer → Controllers → Services (classic controller/service split).
   services/ai.service.ts wraps Gemini calls.
   File-based “DB” under db/ (JSON files).
   web
   Purpose Production-quality React front-end that consumes the server API and showcases generated UI components.
   Key tech Vite + React 19, Tailwind 4, Radix UI, Jotai, axios, Three.js, dnd-kit, TipTap, etc.
   Entry points
   src/main.tsx mounts React.
   src/App.tsx top-level routes / layout.
   src/services/api.ts + componentService.ts wrap HTTP calls to the server.
   Tailwind config + tailwind.config.js, vite.config.ts.
   client
   Purpose A vanilla Vite/TypeScript starter (counter demo). Appears to be a sandbox or leftover scaffold — not referenced by the other two.
   Key tech Vite + plain TS/DOM (no React).
   Entry points src/main.ts (template “Hello Vite”).
2. Inter-package relationships
   • web ───► server via REST (http://localhost:3001/api/\*).
   client is currently standalone (no cross-calls).
   No shared TypeScript library or workspace-level tooling; each package keeps its own node_modules.
3. Patterns, strengths & potential issues
   Strengths
   ✓ Clear separation of concerns (API vs UI).
   ✓ TypeScript across the stack.
   ✓ Familiar Express controller/service layout.
   ✓ Modern React stack with Tailwind & Radix gives rapid UI iteration.
   ✓ AI helper (Gemini) to auto-generate components is encapsulated in its own service.
   Issues / risks
   Hard-coded URLs
   Front-end: http://localhost:3001/api
   Server CORS origin: http://localhost:5173
   These break in staging/production—swap for env-driven config.
   File-system “DB” (JSON in db/) isn’t concurrency-safe and will not scale.
   Duplicate front-end folders (client vs web) can confuse newcomers; consider deleting or archiving client.
   Very large dependency set in web (Radix, TipTap, Three, dnd-kit, etc.) increases bundle size and cold-start time.
   No root-level build / dev scripts — each package must be run manually.
   Lint/test scripts light to non-existent (server has no tests).
4. Fast-track onboarding & debugging tips
5. Install & run everything
   Apply to README.md
   Run
   )
   Add a “concurrently” root script when time permits.
   Environment variables
   packages/server/.env needs PORT, GEMINI_API_KEY.
   Mirror the API base URL in web via import.meta.env.VITE_API_URL to remove hard-coding.
   Debugging workflows
   Backend — set breakpoints in VS Code (src/app.ts), nodemon auto-restarts.
   Frontend — Vite gives HMR; DevTools network tab should show /api/search, /api/fetch-ui calls.
   Use the file system db/ to inspect saved components quickly; each component is a JSON file.
   Common pain-points & fixes
   CORS errors → ensure UI is running on 5173 or adjust cors() origin.
   Gemini quota / key issues → stub ai.service.ts with a mock during dev.
   Large bundle warnings → tree-shake unused Radix or TipTap extensions.
   Recommended next clean-ups
   Delete or merge the client package to avoid duplication.
   Centralise config (root .env, root scripts, shared ts-config paths).
   Replace file-based storage with lightweight DB (SQLite, Postgres) or at least lock-file writes.
   Add eslint/prettier & minimal Jest tests (start with service layer).
