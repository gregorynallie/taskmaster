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

## Repo and docs

- **Git:** Commit often; use `git add .` → `git commit -m "..."` → `git push` to save versions and sync to GitHub.
- **Developer guide:** See [CLAUDE.md](CLAUDE.md) for architecture, conventions, and AI service details.
