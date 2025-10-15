## Project Snapshot

* **Framework:** Next.js (App Router preferred)
* **Runtime:** Node 18+
* **Deployment:** Vercel (Preview PRs + Production)
* **Package manager:** `pnpm` (preferred) or `npm`
* **Language:** TypeScript
* **Styling:** Tailwind CSS (if present)
* **State/Server:** React Server Components, Server Actions, and Route Handlers

## Non‑Negotiables

* Keep builds green and previewable on Vercel.
* Maintain type-safety (no `any` unless justified).
* Never commit secrets; use env vars.
* Small, focused PRs with tests and docs.

## Repository Layout (expected)

```
/ (root)
  .env.example
  .env.local (ignored)
  .github/workflows/* (CI)
  .cursor/rules/AGENTS.md
  next.config.(js|mjs|ts)
  package.json
  pnpm-lock.yaml
  postcss.config.js
  tailwind.config.(js|ts)
  tsconfig.json
  /app           # App Router (preferred)
    /(marketing) # Optional route groups
    /api         # Route Handlers
    /components
    /lib
    /styles
    layout.tsx
    page.tsx
  /public
  /tests
```

## Environment & Secrets

Define *all* variables in **`.env.example`** with safe placeholders.

Required (adapt per project):

```
# Public
NEXT_PUBLIC_APP_URL=

# Server-only
DATABASE_URL=
NEXTAUTH_URL=
NEXTAUTH_SECRET=
OPENAI_API_KEY=
VERCEL_ANALYTICS_ID=
```

Guidelines: server-only keys must **not** be exposed in client components.

## Scripts

Use these standard scripts (add if missing):

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest",
    "test:watch": "vitest --watch",
    "format": "prettier --write ."
  }
}
```

## Quality Gates

* **Lint/Format:** ESLint + Prettier; run on staged files via Husky (optional).
* **Types:** `pnpm typecheck` passes.
* **Tests:** Unit tests in `/tests` or colocated `*.test.ts(x)` via Vitest/Jest.
* **Accessibility:** Prefer semantic HTML, aria labels, and `next/image`.

## Next.js/Vercel Conventions

* Prefer **App Router** (`/app`) over `/pages`.
* Use **Route Handlers** under `/app/api/*/route.ts`.
* Use **Edge runtime** only when latency-sensitive and supported libraries are compatible (`export const runtime = 'edge'`).
* Use **Server Components** by default; mark client components with `'use client'`.
* Optimize images using `next/image`; host static assets in `/public`.
* Configure domains/images in `next.config.js` if remote sources are used.

## Branching & Commits

* **Branch names:** `feat/<scope>`, `fix/<scope>`, `chore/<scope>`, `docs/<scope>`
* **Conventional commits:** `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`
* Keep commit messages imperative and scoped.

## PR Checklist (agents must follow)

* [ ] Scope is minimal and described in PR body.
* [ ] `pnpm lint` / `pnpm typecheck` / `pnpm test` pass locally.
* [ ] Updated **`.env.example`** if configuration changed.
* [ ] Added/updated docs in `README.md` or relevant `docs/*`.
* [ ] Screenshots for UI changes.
* [ ] No secret, token, or PII added to code/comments/tests/logs.

## Testing Guidance

* Prefer **Vitest** with React Testing Library.
* Test critical utils in `/lib`.
* For route handlers, test HTTP semantics (status, headers, JSON).
* Avoid mocking Next internals unless necessary; prefer integration tests for API routes.

## Performance & DX

* Code-split with nested routes and dynamic imports when useful.
* Memoize expensive client values (`useMemo`, `useCallback`) sparingly.
* Use `@vercel/analytics` or Web Vitals if enabled.
* Edge functions only if libraries are Edge-compatible.

## Security & Privacy

* Validate and sanitize all inputs at API boundaries (Zod recommended).
* Use **Server Actions** and Route Handlers for privileged ops.
* Do not log secrets or user data.
* Apply rate limiting and CSRF as appropriate.
* If using auth (NextAuth, custom): enforce session checks server-side.

## Error Handling & Observability

* Centralize error helpers in `/lib/errors.ts`.
* Return typed error shapes from APIs.
* Add basic logging (e.g., `@vercel/analytics`, Sentry if configured).
* Surface user-friendly error states; never leak stack traces to clients.

## Agent Capabilities & Boundaries

**Agents may:**

* Generate/modify TypeScript/React components, API handlers, config, tests, and docs.
* Create migration-ready SQL (but **must not** apply it).
* Suggest Vercel settings and `next.config.js` updates.

**Agents must not:**

* Introduce breaking env var changes without updating `.env.example`.
* Add new heavy dependencies without justification and lockfile update.
* Expose secrets, tokens, or internal URLs in client bundles.
* Push directly to `main` unless CI is green and process allows.

## Common Tasks — Agent Playbooks

### 1) Implement a New Route (UI + API)

1. Create UI under `/app/<route>/page.tsx` (Server Component by default).
2. If needed, add client component in `/app/<route>/components/*.tsx` with `'use client'`.
3. Add API handler at `/app/api/<name>/route.ts` (validate input with Zod).
4. Add tests in `/tests/<name>.test.ts`.
5. Update docs and screenshots.

### 2) Fix a Bug

1. Reproduce with a failing test.
2. Identify minimal fix; avoid regressions.
3. Ensure lint/types/tests pass.
4. Describe root cause and mitigation in PR body.

### 3) Add a Library

1. Justify in PR: size, purpose, alternatives.
2. Add to `package.json`; run `pnpm install`.
3. Ensure ESM/Edge compatibility if required.
4. Update imports and `next.config.js` as needed.

### 4) Configure Vercel

* Preview deployments for PRs **must** pass.
* Set env vars in Vercel project settings (Link to `.env.example`).
* Consider build cache, image domains, and `output: 'standalone'` for self-hosting if needed.

## Prompts for Cursor Agents

Use/modify these task prompts inside Cursor:

**Feature:**

> Implement `<feature>` using Next.js App Router. Create server-first UI, route handler under `/app/api/<name>/route.ts` with Zod validation, tests via Vitest/RTL, and docs. Keep diffs small and typed. Update `.env.example` if needed.

**Bugfix:**

> Reproduce issue `<id/summary>`, add failing test, then fix with minimal changes. Ensure `pnpm lint`, `typecheck`, and `test` pass. Explain root cause in PR body.

**Refactor:**

> Improve `<area>` for readability and performance without behavior change. Keep public API stable. Add/adjust tests as needed.

**Docs:**

> Update `README.md` and relevant code comments to reflect `<change>`. Ensure setup steps and env vars are current. Include screenshots for UI updates.

## Code Style Quick Rules

* Prefer named exports; default export only for top-level pages/components.
* Keep components small and pure; move logic to `/lib`.
* Avoid deep prop drilling; prefer context or server-side composition.
* Strongly type API responses and params.

## Checklists (Drop-in)

**New Component**

* [ ] Server component by default
* [ ] Props/interfaces typed
* [ ] Accessible semantics
* [ ] Tests added
* [ ] Story or usage example (optional)

**New API Route**

* [ ] Input validated (Zod)
* [ ] Returns typed JSON
* [ ] Handles errors
* [ ] Tests added
* [ ] Docs updated

---

## Maintainers

* Add maintainers here (names/GitHub handles) and areas of ownership.

## ADRs (Architecture Decisions)

* Record significant decisions in `/docs/adr/` or a short `docs/DECISIONS.md`.

---

**End of rules.**
