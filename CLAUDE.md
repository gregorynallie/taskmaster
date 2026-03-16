# TaskMaster — Project Guide

## What This Is
AI-powered task manager with RPG gamification. Two modes: **RPG** (leveling, quests, rewards) and **Minimal** (focused). Claude AI enriches task input, generates personalized suggestions, and builds a user persona over time.

## Tech Stack
- React 19 + TypeScript, Vite 6
- Firebase (Auth + Firestore real-time sync)
- Claude API via raw fetch in `services/claudeService.ts` (`claude-sonnet-4-6`)
- Tailwind CSS + 120+ custom themes in `/src/themes/`
- No routing library — single-page, view-switched via state

## Running the App
```bash
npm run dev   # http://localhost:3000
```
API keys live in `.env.local` (gitignored): `ANTHROPIC_API_KEY`, `VITE_FIREBASE_API_KEY`. Never commit real keys. See `.env.example` for required vars.

## Key Architecture

### State & Data Flow
```
AuthProvider → SettingsProvider → UserProfileProvider → TasksProvider
```
Each context owns a domain and uses a custom hook for its logic:
- `useTaskManager` → tasks, quests, AI enrichment
- `useUserProfileManager` → persona, insights, clarification questions
- `useSettingsManager` → theme, mode (localStorage)
- `useGamificationManager` → XP, levels, achievements
- `ViewOptionsProvider` → UI state (filters, sort, modals)

Firestore `onSnapshot` listeners keep tasks/quests/profile in sync across devices.

### AI Service (`services/claudeService.ts`)
All AI calls use `claudeService` (Claude API via raw fetch). Consumers import from `../services/claudeService`.

| Function | Trigger |
|---|---|
| `enrichTaskWithAI` | User submits natural language task input |
| `generateStarterTasksFromOnboarding` | Onboarding completion |
| `getDynamicSuggestions` | User prompts Explore view |
| `getInitialExploreSuggestions` | Explore view loads |
| `getSuggestions` | Periodic suggestion refresh |
| `synthesizeUserProfileIntoPersona` | Profile update / feedback |
| `synthesizeAIInsights` | Task history grows |
| `createQuestFromGoal` | User creates a quest |
| `getInContextSuggestion` | In-list context insertion |
| `getNewClarificationQuestion` | Profile refinement flow |

All responses are JSON. `generateJson<T>()` handles parsing and strips markdown fences.

### Core Types (`src/types/`)
- `taskTypes.ts` — `Task`, `Quest`, `Suggestion`, `EnrichedTaskData`, `SuggestionFeedback`
- `userTypes.ts` — `UserProfile`, `UserStats`, `AIPersonaSummary`, `AIInsight`, `CategoryFocus`
- `uiTypes.ts` — `Mode`, `SuggestionPill`, `TimeOfDay`
- `onboardingTypes.ts` — `OnboardingAnswers`
- `contextTypes.ts` — `Placeholder`

### Task Recurring Rules
Full iCal-style recurrence: `MINUTELY|HOURLY|DAILY|WEEKLY|MONTHLY|YEARLY` with `interval`, optional `daysOfWeek` (`SU|MO|TU|WE|TH|FR|SA`), optional `dayOfMonth`. Must be `null` for one-off tasks.

## Directory Structure
```
/components   — Reusable UI (TaskCard, QuickAddTask, modals, filters)
/views        — Page views (TodayView, ExploreView, ProjectsView, RewardsView, YouView, SettingsView, JournalView)
/contexts     — React contexts (Auth, Settings, Tasks, UserProfile, Gamification, LifeQuest, ViewOptions)
/hooks        — Business logic hooks (useTaskManager, useUserProfileManager, etc.)
/services     — claudeService.ts, firebase.ts, gamificationService.ts
/src/types    — All TypeScript types
/src/themes   — 120+ theme definitions
/utils        — dateUtils, taskUtils, animationUtils
/assets       — Sound effects, icons
```

## Firebase
- Auth: email/password via `firebase.ts`
- Firestore paths:
  - `users/{uid}` — userProfile + userStats
  - `users/{uid}/tasks` — Task documents
  - `users/{uid}/quests` — Quest documents
- Config in `services/firebaseConfig.ts`

## Conventions
- Components use inline Tailwind — no separate CSS files per component
- Themes override CSS variables; custom per-theme CSS goes in theme definition objects
- Suggestion feedback (irrelevant, not_now, too_difficult, already_done) biases future AI calls
- `isEnriching: true` on a task means it's mid-AI-enrichment (show loading state)
- `isSpoofed: true` marks demo/placeholder tasks
