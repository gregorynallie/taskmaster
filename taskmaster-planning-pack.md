# TaskMaster Planning Pack (Single-File Upload)

Use this file as a Claude-friendly alternative to the `.zip` bundle.

## Project Identity
- Name: `TaskMaster`
- Type: AI-powered task manager with optional `gamified` mode
- Core focus: fast task capture, execution, recurrence, suggestions, personalization
- Architecture: single-page app (state-switched views), no router
- Stack: React + TypeScript + Vite + Firebase + Claude API

## Source-of-Truth Docs
- `CONCEPT.md` (product intention and principles)
- `TODO` (actionable implementation backlog)
- `IDEAS_BACKLOG.md` (triage/candidate ideas)

## Current Product Intention (Condensed from `CONCEPT.md`)
- Prioritize a rewarding daily loop: capture quickly, complete easily, feel progress.
- Keep core task manager strong independently of gamified layer.
- Support natural-language input, including bulk recap completion workflows.
- Keep AI personalized but user-controlled (frequency/intensity/clear boundaries).
- Preserve manual-first usability when AI is disabled or unavailable.

## Priority Backlog (Condensed from `TODO`)
- Input + AI:
  - Command-style task input with confirm-before-apply
  - Bulk completion from recap text ("I did X, Y, Z")
  - Disambiguation prompts for ambiguous task targets
  - PLAN hub expansion (day/week/month/year wizard)
- Task list:
  - Recurring task auto-reposition behavior
  - Pin-to-top section
- Explore:
  - Suggestion labels and filters
  - Guidance controls + comfort-zone tuning
- Reliability/platform:
  - Deployment host setup with AI gateway env
  - iOS TestFlight packaging flow
  - AI-off parity audit across core flows

## AI / Resource Optimization Status
- Implemented:
  - Request queue with priorities and per-feature cooldowns
  - Retry/backoff for 429s
  - Shared caching with invalidation-aware keys
  - Session request budget caps
  - Quality tiers (`low`/`standard`/`high`)
  - Resilient JSON parsing + retry-on-parse-failure
  - Runtime telemetry + floating debug strip
  - Token/cost estimates (configurable via env rates)
- Optional secure mode:
  - Server AI gateway at `api/claude.ts`
  - Client points to `VITE_AI_GATEWAY_URL=/api/claude`
  - Server keeps `ANTHROPIC_API_KEY`

## Key Files to Also Upload Individually (if needed)
If Claude asks for full code context, upload these directly in addition to this pack:
- `services/claudeService.ts`
- `hooks/useTaskManager.ts`
- `hooks/useUserProfileManager.ts`
- `contexts/TasksProvider.tsx`
- `views/ExploreView.tsx`
- `views/SettingsView.tsx`
- `components/AIDebugFloatingStrip.tsx`
- `src/templateStarterTasks.ts`
- `src/templatePersonaSummary.ts`
- `App.tsx`

## Environment Variables (Current)
- Required:
  - `ANTHROPIC_API_KEY`
  - `VITE_FIREBASE_API_KEY`
- Optional:
  - `VITE_AI_GATEWAY_URL`
  - `VITE_AI_SESSION_REQUEST_BUDGET`
  - `VITE_CLAUDE_INPUT_COST_PER_MTOK_USD`
  - `VITE_CLAUDE_OUTPUT_COST_PER_MTOK_USD`

## Known Open Tracks
- First production deployment (Vercel or equivalent) with gateway vars
- iOS beta packaging via Capacitor + TestFlight
- Additional command-style input and planning workflows

## Suggested Prompt To Paste With This File
```text
You are reviewing TaskMaster. Treat CONCEPT/TODO/IDEAS_BACKLOG as source-of-truth intent.
Please:
1) Identify the top 5 highest-leverage implementation steps from current TODO.
2) Flag any architecture risks around AI queueing, caching, and persona/suggestion flows.
3) Propose a pragmatic milestone plan for deployment + TestFlight beta.
Keep recommendations core-first and avoid RPG-heavy expansion unless explicitly requested.
```

