# TaskMaster

AI-powered task manager with RPG gamification (quests, levels, rewards) and a minimal mode. Claude AI enriches tasks and suggests next steps.

## Run locally

**Prerequisites:** Node.js

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment**
   - Copy `.env.example` to `.env.local`
   - Add your keys: `ANTHROPIC_API_KEY`, `VITE_FIREBASE_API_KEY`
   - Optional Phase-3 gateway mode: set `VITE_AI_GATEWAY_URL=/api/claude` when deploying with the serverless API route in `api/claude.ts`
   - Optional Phase-4 budget control: set `VITE_AI_SESSION_REQUEST_BUDGET=120` (or your preferred cap) to limit AI calls per browser session
   - Optional cost estimate tuning: set `VITE_CLAUDE_INPUT_COST_PER_MTOK_USD` and `VITE_CLAUDE_OUTPUT_COST_PER_MTOK_USD` (used for debug-strip estimate only)
   - Never commit `.env.local` (it’s gitignored)

3. **Start the app**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000 (or the port Vite prints).

## Scripts

| Command        | Description              |
|----------------|--------------------------|
| `npm run dev`  | Start dev server         |
| `npm run build`| Production build         |
| `npm run preview` | Preview production build |
| `npm run typecheck` | TypeScript check (no emit) |
| `npm run test:e2e` | Run Playwright smoke tests |
| `npm run test:e2e:ui` | Open Playwright UI mode |
| `npm run test:e2e:headed` | Run Playwright with visible browser |
| `npm run test:e2e:demo` | Run single guest demo flow (headed) |
| `npm run test:e2e:report` | Open Playwright HTML report |
| `npm run test:e2e:auth` | Record Google auth session for Playwright |

## End-to-end testing (Playwright)

1. Install Playwright browser binaries once:
   ```bash
   npx playwright install chromium
   ```
2. Run smoke tests:
   ```bash
   npm run test:e2e
   ```
3. (Optional) Reuse Google login in Playwright:
   - Run once and complete Google sign-in in the opened browser:
   ```bash
   npm run test:e2e:auth
   ```
   - Close the codegen window after sign-in to save auth state.
4. Optional auth-dependent flow tests:
   - Enable auth-dependent flow checks, then run:
   ```bash
   $env:E2E_RUN_GUEST_FLOW=1; npm run test:e2e
   ```
   - Enable the longer onboarding/task lifecycle flow only when needed:
   ```bash
   $env:E2E_RUN_GUEST_FLOW=1; $env:E2E_RUN_CORE_FLOW=1; npm run test:e2e
   ```
   - If your Firebase key is HTTP-referrer restricted, allow `http://localhost:3000/*` for Playwright runs.
   - To slow actions down for easier animation review:
   ```bash
   $env:E2E_STEP_DELAY_MS=1200; $env:E2E_RUN_GUEST_FLOW=1; npm run test:e2e:headed
   ```
   - To run one smooth guest-only demo flow end-to-end:
   ```bash
   $env:E2E_STEP_DELAY_MS=1200; npm run test:e2e:demo
   ```
   - To slow major UI transitions even more for animation review:
   ```bash
   $env:E2E_STEP_DELAY_MS=1400; $env:E2E_MAJOR_STEP_DELAY_MS=3200; npm run test:e2e:demo
   ```

## Repo and docs

- **Git:** Commit often; use `git add .` → `git commit -m "..."` → `git push` to save versions and sync to GitHub.
- **Developer guide:** See [CLAUDE.md](CLAUDE.md) for architecture, conventions, and AI service details.

## AI Gateway (Phase 3)

- This repo includes a serverless gateway endpoint at `api/claude.ts`.
- In production (for example Vercel), set:
  - `ANTHROPIC_API_KEY` (server env var, never exposed to browser)
  - `VITE_AI_GATEWAY_URL=/api/claude` (client env var)
- If `VITE_AI_GATEWAY_URL` is unset, the app falls back to direct browser Claude calls (legacy mode).
- `VITE_AI_SESSION_REQUEST_BUDGET` (optional) caps AI requests per session to prevent runaway usage.
- Cost estimate in debug strip is approximate and based on configured per-1M-token rates.
