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
2. **Bulk completion from natural-language recap**
   - Allow users to type a recap like "I did workout, groceries, and laundry today" and match/complete tasks in one pass.
   - Acceptance: app shows match preview + confidence, user confirms before bulk complete.
3. **Plan-my-day prompt mode**
   - Turn one prompt into a sequenced day plan with gaps filled by suggestions.
   - Acceptance: generated plan appears as editable tasks before final save.
4. **Disambiguation prompts**
   - If command target is ambiguous, show quick-choice clarification instead of guessing.
   - Acceptance: no silent wrong updates when multiple task matches exist.

### List Behavior & Prioritization
5. **Smart auto-repositioning for recurring tasks**
   - On completion, animate task into its next logical date position.
   - Acceptance: daily/weekly/monthly recurrences move consistently and predictably.
6. **Pinned tasks above all sorting/filtering**
   - Pinning creates a persistent top section that supersedes sort order.
   - Acceptance: pinned tasks remain visible regardless of group/sort mode.

### Explore & Suggestion UX
7. **Explore suggestion types**
   - Label suggestions as `task`, `recurring`, `project`, or `plan`.
   - Acceptance: users can filter by suggestion type before accepting.
8. **Explore guidance controls**
   - Add free-form guidance + basic filters (difficulty, duration, category).
   - Acceptance: filters measurably change returned suggestion mix.
9. **Suggestion quality controls**
   - Add comfort-zone slider and quick relevance feedback loops.
   - Acceptance: feedback affects subsequent suggestion outputs.

### Project Flow
10. **Convert task to project**
   - Convert a large task into project + subtasks and route to Projects flow.
   - Acceptance: conversion preserves original intent and schedule context.
11. **Accept Explore result as project**
   - Allow accepted Explore items to initialize project planning directly.
   - Acceptance: one-click path from suggestion to editable project scaffold.

### Personalization & Safety
12. **Personalization intensity controls**
   - Add explicit slider for how strongly AI personalizes suggestions.
   - Acceptance: low intensity reduces inferred/push suggestions; high increases them.
13. **AI abuse/rate-limit guardrails**
   - Add per-user usage controls, debounce, and fallback UX.
   - Acceptance: app remains responsive and clear under limit conditions.

### Platform & Quality
14. **Mobile-first optimization pass**
   - Improve touch targets, spacing, animation performance, and layout for mobile.
   - Acceptance: key daily flows are smooth on phone viewport sizes.
15. **Push notification strategy (phased)**
   - Start with reminders/check-ins before advanced contextual nudges.
   - Acceptance: user can configure frequency and disable per reminder type.

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
