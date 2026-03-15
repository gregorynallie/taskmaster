# TaskMaster Ideas Backlog

This file is for triaging raw ideas from the project brain dump into maintainable, build-ready work.

## How To Use This File
- Add new ideas only to `Inbox`.
- During weekly review, move ideas into `Candidate` with clear scope and acceptance criteria.
- Only move items to `Planned` when they are small enough to estimate and test.
- Archive completed or rejected ideas at the bottom with a short reason.

## Status Buckets
- `Inbox`: unrefined ideas, raw notes.
- `Candidate`: refined feature concepts with clear value.
- `Planned`: approved and ready for implementation.
- `Shipped`: completed.
- `Rejected/Deferred`: intentionally not building now.

## Lightweight Scoring (per Candidate)
Use 1-5:
- **Impact**: user value/retention improvement.
- **Core Fit**: aligns with core task loop.
- **Effort**: implementation complexity (higher = harder).
- **Confidence**: clarity of requirement + technical certainty.

Priority hint: `(Impact + Core Fit + Confidence) - Effort`

## Candidate Ideas (From Brain Dump, De-duplicated)

### Input & Task Intelligence
1. **Command-style add input**
   - Let users create, reschedule, complete, or query tasks via natural language.
   - Example: "Move team sync to Friday 3pm."
   - Acceptance: parser identifies action + target + date/time and confirms before applying.
2. **Prompt quality + relevance tuning loop**
   - Continuously improve suggestion relevance using acceptance, edits, dismiss reasons, and completion outcomes.
   - Acceptance: measurable increase in suggestion acceptance rate and decrease in immediate edits.
3. **Bulk completion from natural-language recap**
   - Allow users to type a recap like "I did workout, groceries, and laundry today" and match/complete tasks in one pass.
   - Acceptance: app shows match preview + confidence, user confirms before bulk complete.
4. **Plan-my-day prompt mode**
   - Turn one prompt into a sequenced day plan with gaps filled by suggestions.
   - Acceptance: generated plan appears as editable tasks before final save.
5. **Disambiguation prompts**
   - If command target is ambiguous, show quick-choice clarification instead of guessing.
   - Acceptance: no silent wrong updates when multiple task matches exist.

### List Behavior & Prioritization
6. **Smart auto-repositioning for recurring tasks**
   - On completion, animate task into its next logical date position.
   - Acceptance: daily/weekly/monthly recurrences move consistently and predictably.
7. **Pinned tasks above all sorting/filtering**
   - Pinning creates a persistent top section that supersedes sort order.
   - Acceptance: pinned tasks remain visible regardless of group/sort mode.

### Explore & Suggestion UX
8. **Explore suggestion types**
   - Label suggestions as `task`, `recurring`, `project`, or `plan`.
   - Acceptance: users can filter by suggestion type before accepting.
9. **Explore guidance controls**
   - Add free-form guidance + basic filters (difficulty, duration, category).
   - Acceptance: filters measurably change returned suggestion mix.
10. **Suggestion quality controls**
   - Add comfort-zone slider and quick relevance feedback loops.
   - Acceptance: feedback affects subsequent suggestion outputs.

### Project Flow
11. **Convert task to project**
   - Convert a large task into project + subtasks and route to Projects flow.
   - Acceptance: conversion preserves original intent and schedule context.
12. **Accept Explore result as project**
   - Allow accepted Explore items to initialize project planning directly.
   - Acceptance: one-click path from suggestion to editable project scaffold.
13. **PLAN hub architecture decision**
   - Decide whether to rename/expand Projects into PLAN or keep PLAN as a separate dedicated planning hub.
   - Acceptance: one chosen structure with clear navigation and ownership boundaries.

### Personalization & Safety
14. **Personalization intensity controls**
   - Add explicit slider for how strongly AI personalizes suggestions.
   - Acceptance: low intensity reduces inferred/push suggestions; high increases them.
15. **AI abuse/rate-limit guardrails**
   - Add per-user usage controls, debounce, and fallback UX.
   - Acceptance: app remains responsive and clear under limit conditions.
16. **AI-off parity audit and fallback UX**
   - Ensure core flows are fully usable without AI (add, edit, complete, schedule, recurring, planning).
   - Acceptance: AI-disabled mode still supports the full core task workflow without dead ends.

### Core Loop & Retention
17. **30-60 second daily check-in flow**
   - Add a lightweight daily review path to capture what was done and plan the next day.
   - Acceptance: user can complete check-in quickly and generate a clear next-step plan.
18. **Onboarding self-discovery branch**
   - Add an "I don't know, help me with this" option that triggers guided discovery prompts.
   - Acceptance: branch produces useful starter guidance without forcing long-form setup.
19. **Reward style personalization**
   - Let users choose preferred reward style/intensity while keeping one shared core task flow.
   - Acceptance: changing reward style does not break core task management behavior.
20. **Tool + gamified independence guardrail**
   - Ensure task manager remains excellent standalone and gamified layer remains optional.
   - Acceptance: minimal-mode usability remains strong with no progression dependency.

### Platform & Quality
21. **Mobile-first optimization pass**
   - Improve touch targets, spacing, animation performance, and layout for mobile.
   - Acceptance: key daily flows are smooth on phone viewport sizes.
22. **Push notification strategy (phased)**
   - Start with reminders/check-ins before advanced contextual nudges.
   - Acceptance: user can configure frequency and disable per reminder type.
23. **Lightweight UI consistency pass**
   - Standardize category colors, key labels, and control placement across core views.
   - Acceptance: visual semantics stay consistent between Today, Explore, Projects/Plan, and task cards.

## Inbox (Raw, Not Yet Refined)
- Voice-first global logging flow (mic anywhere in app).
- Photo-to-log intake (food/activity notes) as optional module.
- Theme testing sandbox for animation QA and fast visual iteration.
- Favorite-theme rotation / shuffle rules.

## Planned
- _(empty)_

## Shipped
- _(track completed backlog items here once shipped)_

## Rejected / Deferred
- _(document why to prevent re-discussing the same idea repeatedly)_
