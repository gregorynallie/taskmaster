# TaskMaster Concept (Source of Truth)

## Purpose
TaskMaster helps users turn thoughts into action through fast task capture, clear daily execution, and adaptive AI support. The core promise is: less friction, more consistency, and better life balance without pressure-heavy UX.

## Product Identity
- AI-powered task manager first, gamification second.
- Encouraging tone over guilt/shame messaging.
- Works in two usable modes:
  - `minimal`: focused productivity.
  - `rpg`: progression/reward layer on top of productivity.

## Core Principles
1. **Action over planning overhead**: users can quickly capture intent in plain language.
2. **Consistency beats intensity**: reward small repeatable wins.
3. **Personalized but user-controlled**: AI should adapt to user context, with clear controls and opt-out.
4. **Balance-aware guidance**: suggestions should help neglected life areas (productivity, fun, relaxation, social, health).
5. **Core-first execution**: keep auth, onboarding, task CRUD, scheduling, recurrence, suggestions, sync, and settings stable before broader expansion.

## Existing Foundation (Do Not Re-add As New Features)
The app already includes these major capabilities:
- Auth + Firestore-backed persistence/sync.
- Onboarding flow and starter task generation.
- Task CRUD with scheduling, deadlines, and recurrence.
- AI enrichment + AI suggestions (Today + Explore).
- Persona/profile synthesis and clarification-question flow.
- RPG progression paths (quests/rewards/XP) plus minimal mode.
- Theme system and mode/theme settings.
- Group/sort/filter behavior in Today view.

Use this section as a guardrail when writing TODO items so duplicates are not added.

## North Star User Loop
1. Capture intent quickly (quick add / natural language).
2. Get actionable output immediately (task, plan, or suggestion).
3. Execute with satisfying feedback and minimal friction.
4. Receive adaptive suggestions based on progress and preferences.
5. Repeat daily with compounding personalization.

## UX Direction
- Keep all primary actions available from the Today workflow.
- Prefer one-screen completability for common actions.
- Make AI actions explicit ("what the app is about to do") before commit.
- Support both guided and manual control paths on every major flow.

## AI Behavior Requirements
- All AI responses are structured JSON through `claudeService`.
- AI should provide clear, bounded outputs (task/suggestion/plan objects), not ambiguous prose.
- Respect personalization boundaries:
  - AI on/off capability.
  - Adjustable suggestion frequency/intensity.
  - Transparent use of user feedback (`too easy`, `too hard`, `not for me`, etc.).

## Data/Platform Constraints
- Firestore remains canonical source for user/task/quest data.
- No API keys in code; env-only secrets.
- No new router; single-page app with state-switched views.

## Prioritization Filter (Use For Any New Idea)
Ship ideas that score high on:
1. Improves daily task execution speed or clarity.
2. Improves suggestion relevance or trust.
3. Strengthens retention through lightweight habit loops.
4. Has low implementation risk relative to impact.

Defer ideas that are high complexity and weakly connected to core loop.

## Not Yet Core (Future / Optional)
- Deep social features.
- Heavy mini-game ecosystems.
- Broad external integrations (wearables, third-party APIs) before core flows are excellent.
- Extensive monetization mechanics before retention/fit metrics stabilize.
