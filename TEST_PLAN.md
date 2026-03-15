# TaskMaster Test Plan

## 1) Goals
- Verify core user journeys work in both `rpg` and `minimal` modes.
- Catch regressions in task management, recurrence, AI features, Firestore sync, and theme rendering.
- Validate error handling for network/API failures and invalid inputs.

## 2) Test Scope
- In scope:
  - Auth, onboarding, tasks, scheduling, deadlines, recurrence, suggestions, quests, persona, settings/themes, and persistence.
- Out of scope (for this manual plan):
  - Load testing at scale, penetration testing, full browser automation.

## 3) Test Environment
- OS: Windows 10/11 (primary).
- Browser: latest Chrome (primary), Edge (secondary).
- App: local dev (`npm run dev`) and one production-like preview (`npm run build && npm run preview`).
- Required env vars in `.env.local`:
  - `ANTHROPIC_API_KEY`
  - `VITE_FIREBASE_API_KEY`

## 4) Pre-Test Setup
1. Start app:
   - `npm install`
   - `npm run dev`
2. Confirm app loads and you can sign in.
3. Open DevTools Console and keep it visible for JS/runtime errors.
4. Open Network tab and filter by:
   - `anthropic.com`
   - `firestore`
5. Optional: open a second browser/incognito window for sync testing.

## 5) Build/Static Checks (Run First)
- `npm run typecheck` -> expect no TypeScript errors.
- `npm run build` -> expect successful build.
- `npm run preview` -> sanity-check app startup.

## 6) Smoke Test (5-10 minutes)
- App launches, sign-in works, primary views render.
- Add one task, edit it, complete it, and verify no console errors.
- Open Explore and accept one suggestion.
- Switch themes and confirm text remains readable in expanded task date/time fields.

## 7) Detailed Functional Test Cases

### A. Authentication & Session
- [ ] Sign up (new account) works.
- [ ] Sign in with valid credentials works.
- [ ] Invalid credentials show a clear error.
- [ ] Sign out returns to auth screen.
- [ ] Refresh page keeps user logged in.

### B. Onboarding
- [ ] Complete onboarding in RPG mode.
- [ ] Complete onboarding in Minimal mode.
- [ ] Starter tasks are generated and appear in task list.
- [ ] Persona selection and preference answers persist after refresh.

### C. Task CRUD
- [ ] Add task via quick-add natural language input.
- [ ] Add plain/manual task.
- [ ] Edit title and description; save persists after refresh.
- [ ] Cancel edit does not change task.
- [ ] Complete task updates UI/state correctly.
- [ ] Dismiss task removes from active list without crash.

### D. Scheduling & Deadlines
- [ ] Set schedule date/time in expanded task editor.
- [ ] Set due date with no time (end-of-day behavior).
- [ ] Set due date with explicit time.
- [ ] Clear due date.
- [ ] Schedule from suggestion modal.
- [ ] Date/time values remain visible/readable in light + dark themes.

### E. Recurrence
- [ ] Set DAILY recurrence with interval > 1.
- [ ] Set WEEKLY recurrence and toggle specific days.
- [ ] Set MONTHLY recurrence with day-of-month.
- [ ] Remove recurrence (`Does not repeat`).
- [ ] Verify recurring settings persist after refresh.

### F. Suggestions (Today + Explore)
- [ ] Today suggestions load.
- [ ] Shuffle one suggestion updates card.
- [ ] Accept suggestion creates task.
- [ ] Explore initial suggestions load.
- [ ] Explore prompt-based suggestions return results.
- [ ] No duplicate/looping loading state.
- [ ] Caching behavior: reload within 10 min should reuse daily suggestions (fewer API calls).

### G. AI Enrichment & Persona
- [ ] Task enrichment produces sensible title/category/duration.
- [ ] Persona content loads (placeholders/pills).
- [ ] Reload within 1 hour reuses cached persona content when profile unchanged.
- [ ] In You view, persona generation/regeneration completes without errors.
- [ ] Clarification question flow works (question -> options -> submit).

### H. Quests & Rewards (RPG mode)
- [ ] Create quest from goal.
- [ ] Quest tasks are generated and visible.
- [ ] Complete quest tasks; progress updates.
- [ ] XP increases when tasks completed.
- [ ] Achievements/rewards view renders and updates expected unlocks.

### I. Settings, Modes, and Themes
- [ ] Toggle RPG/Minimal mode.
- [ ] Theme switching works across several light/dark themes.
- [ ] Sound effects toggle does not break UI.
- [ ] Group/sort/filter options in Today view persist and behave correctly.
- [ ] Accessibility sanity: focus states visible, keyboard navigation works for major controls.

### J. Data Persistence & Sync
- [ ] Refresh browser; tasks/quests/profile data persist.
- [ ] Open app in two windows with same account.
- [ ] Edit task in window A -> observe real-time update in window B.
- [ ] Complete task in window B -> reflect in window A.

### K. Error Handling / Resilience
- [ ] Simulate offline mode in DevTools and attempt task actions.
- [ ] Reconnect and verify app recovers gracefully.
- [ ] Simulate Claude API failure (invalid key or blocked request) and verify fallback/error messaging.
- [ ] Verify app does not crash on AI failure; baseline task flow still usable.

## 8) Theme/Visual Regression Checklist
Test at least 8-10 themes covering light and dark:
- [ ] Text contrast for title/description fields.
- [ ] Date/time input text contrast in:
  - Expanded Task editor
  - Schedule editor modal
  - Suggestion schedule modal
- [ ] Button text contrast for primary/secondary buttons.
- [ ] Modal readability with frosted/glass themes.
- [ ] No clipped text or overflow in compact and expanded task cards.

## 9) Console/Network Error Checklist
- [ ] No uncaught exceptions in Console during full smoke flow.
- [ ] No failed critical requests (except intentionally simulated failures).
- [ ] Firestore permission/auth errors are handled with user-facing feedback.

## 10) Release Gate (Pass/Fail)
Mark release-ready only if all are true:
- [ ] `npm run typecheck` passes
- [ ] `npm run build` passes
- [ ] Smoke test passes
- [ ] No P0/P1 bugs open
- [ ] Theme readability checks pass (including date/time fields)
- [ ] AI failure fallback test passes

## 11) Bug Severity Guide
- P0: Data loss, auth broken, app crash on core path.
- P1: Core feature broken (task add/edit/complete, sync, onboarding).
- P2: Major UX issue with workaround (bad contrast, flaky flow).
- P3: Minor polish/copy/layout issues.

## 12) Suggested Test Cadence
- Per PR/change batch:
  - Run section 5 + section 6 + impacted section(s).
- Daily regression:
  - Smoke + one deep area (rotate areas by day).
- Before release:
  - Full sections 5-10.
