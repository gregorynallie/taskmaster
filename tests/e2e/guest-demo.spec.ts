import { expect, test, type Page, type Route } from '@playwright/test';

const STEP_DELAY_MS = Number(process.env.E2E_STEP_DELAY_MS ?? 1200);
const MAJOR_STEP_DELAY_MS = Number(process.env.E2E_MAJOR_STEP_DELAY_MS ?? Math.max(STEP_DELAY_MS * 2, 2400));

const pause = async (page: Page) => {
  await page.waitForTimeout(STEP_DELAY_MS);
};

const majorPause = async (page: Page) => {
  await page.waitForTimeout(MAJOR_STEP_DELAY_MS);
};

const dismissDialogs = (page: Page) => {
  page.on('dialog', async (dialog) => {
    await dialog.dismiss();
  });
};

const anthroJsonResponse = (jsonText: string) => ({
  id: 'msg_test',
  type: 'message',
  role: 'assistant',
  model: 'claude-sonnet-4-6',
  content: [{ type: 'text', text: jsonText }],
  stop_reason: 'end_turn',
});

const nowPlusDaysIso = (days: number, hour: number, minute = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

const mockClaudeForE2E = async (route: Route) => {
  const req = route.request();
  const payload = req.postDataJSON() as { system?: string; max_tokens?: number };
  const system = payload.system ?? '';

  if (system.includes('setting up a new user\'s account')) {
    const starterTasks = [
      {
        title: 'Morning planning check-in',
        description: 'Review top priorities for the day and pick one must-win task.',
        category: 'Productivity',
        subcategories: ['planning'],
        duration_min: 10,
        difficulty: 1,
        xp_estimate: 15,
        isHybrid: false,
        scheduled_at: nowPlusDaysIso(0, 9, 0),
        recurring: { frequency: 'DAILY', interval: 1, daysOfWeek: [], dayOfMonth: 1 },
      },
      {
        title: '15-minute focus sprint',
        description: 'Do one focused sprint on your most important task with notifications off.',
        category: 'Productivity',
        subcategories: ['focus'],
        duration_min: 15,
        difficulty: 2,
        xp_estimate: 20,
        isHybrid: false,
        scheduled_at: nowPlusDaysIso(0, 14, 0),
        recurring: null,
      },
      {
        title: 'Short walk break',
        description: 'Take a 10-minute walk to reset energy and attention.',
        category: 'Health',
        subcategories: ['movement'],
        duration_min: 10,
        difficulty: 1,
        xp_estimate: 12,
        isHybrid: false,
        scheduled_at: nowPlusDaysIso(1, 16, 0),
        recurring: { frequency: 'WEEKLY', interval: 1, daysOfWeek: ['MO', 'WE', 'FR'], dayOfMonth: 1 },
      },
    ];
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(anthroJsonResponse(JSON.stringify(starterTasks))),
    });
    return;
  }

  if (system.includes('Generate personalized UI content')) {
    const content = {
      task: {
        placeholders: [
          { question: 'What should I focus on today?', example: 'Example: Finish client summary', subtext: '💡 Keep it specific and actionable.' },
          { question: 'What quick win can I do next?', example: 'Example: Reply to 3 important emails', subtext: '💡 Short wins build momentum.' },
          { question: 'What needs scheduling?', example: 'Example: Book dentist appointment', subtext: '💡 Add a clear date and time.' },
        ],
      },
      explore: {
        placeholders: [
          { question: 'What should I explore next?', example: 'Example: Learn a better planning method', subtext: '💡 Try one new idea at a time.' },
          { question: 'Need a useful suggestion?', example: 'Example: Suggest a low-effort task', subtext: '💡 Ask with context for better output.' },
          { question: 'What fits my energy now?', example: 'Example: Give me a quick focus task', subtext: '💡 Match task size to current energy.' },
        ],
        pills: [
          { emoji: '⚡', label: 'Quick Win' },
          { emoji: '🧠', label: 'Deep Work' },
          { emoji: '🧹', label: 'Reset & Organize' },
          { emoji: '💪', label: 'Healthy Habit' },
          { emoji: '📈', label: 'Progress Booster' },
        ],
      },
      project: {
        placeholders: [
          { question: 'What project should I start?', example: 'Example: Plan monthly budget cleanup', subtext: '💡 Start with 3 concrete steps.' },
          { question: 'Need a project outline?', example: 'Example: Break this goal into milestones', subtext: '💡 Keep milestones small and testable.' },
          { question: 'What can I finish this week?', example: 'Example: Launch simple personal site', subtext: '💡 Scope tightly for momentum.' },
        ],
        pills: [
          { emoji: '🚀', label: 'Start Project' },
          { emoji: '🗂️', label: 'Organize Plan' },
          { emoji: '🎯', label: 'Goal Sprint' },
          { emoji: '📅', label: 'Weekly Plan' },
          { emoji: '🧩', label: 'Break It Down' },
        ],
      },
    };
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(anthroJsonResponse(JSON.stringify(content))),
    });
    return;
  }

  if (system.includes('brilliant AI life coach generating task suggestions')) {
    const suggestions = [
      {
        title: 'Desk reset for focus',
        description: 'Spend 10 minutes clearing visual clutter and prepping your next work block.',
        category: 'Productivity',
        subcategories: ['organizing'],
        duration_min: 10,
        difficulty: 1,
        xp_estimate: 12,
        isHybrid: false,
        recurring: null,
        reasoning: 'Quick clarity boost',
        context_tag: 'Momentum',
      },
      {
        title: 'Hydration + stretch break',
        description: 'Drink water and do a short full-body stretch routine.',
        category: 'Health',
        subcategories: ['wellness'],
        duration_min: 8,
        difficulty: 1,
        xp_estimate: 10,
        isHybrid: false,
        recurring: null,
        reasoning: 'Energy reset',
        context_tag: 'Well-being',
      },
      {
        title: 'Plan tomorrow in 3 bullets',
        description: 'Write three high-impact actions for tomorrow and block calendar time.',
        category: 'Productivity',
        subcategories: ['planning'],
        duration_min: 12,
        difficulty: 2,
        xp_estimate: 18,
        isHybrid: false,
        recurring: null,
        reasoning: 'Reduce decision fatigue',
        context_tag: 'Planning',
      },
      {
        title: 'Read one article for growth',
        description: 'Read one practical article and note one idea to apply immediately.',
        category: 'Personal Growth',
        subcategories: ['learning'],
        duration_min: 15,
        difficulty: 2,
        xp_estimate: 20,
        isHybrid: false,
        recurring: null,
        reasoning: 'Small growth step',
        context_tag: 'Learning',
      },
    ];
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(anthroJsonResponse(JSON.stringify(suggestions))),
    });
    return;
  }

  if (system.includes('generating "explore" suggestions') || system.includes('generating task suggestions')) {
    const suggestions = [
      {
        title: 'Write a 10-minute project plan',
        description: 'Define objective, first 3 actions, and one measurable outcome.',
        category: 'Productivity',
        subcategories: ['planning'],
        duration_min: 10,
        difficulty: 1,
        xp_estimate: 14,
        isHybrid: false,
        recurring: null,
        reasoning: 'Clear next step',
        context_tag: 'Planning',
      },
      {
        title: 'Quick mobility reset',
        description: 'Do a short shoulder and hip mobility sequence.',
        category: 'Health',
        subcategories: ['mobility'],
        duration_min: 8,
        difficulty: 1,
        xp_estimate: 10,
        isHybrid: false,
        recurring: null,
        reasoning: 'Body refresh',
        context_tag: 'Wellness',
      },
      {
        title: 'Inbox zero sprint',
        description: 'Archive, delegate, or respond to priority messages only.',
        category: 'Productivity',
        subcategories: ['email'],
        duration_min: 12,
        difficulty: 2,
        xp_estimate: 16,
        isHybrid: false,
        recurring: null,
        reasoning: 'Reduce mental load',
        context_tag: 'Quick Win',
      },
      {
        title: 'Review one long-term goal',
        description: 'Update your next milestone and set one immediate action.',
        category: 'Personal Growth',
        subcategories: ['goals'],
        duration_min: 10,
        difficulty: 2,
        xp_estimate: 15,
        isHybrid: false,
        recurring: null,
        reasoning: 'Goal alignment',
        context_tag: 'Progress',
      },
    ];
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(anthroJsonResponse(JSON.stringify(suggestions))),
    });
    return;
  }

  // Safe default fallback
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(anthroJsonResponse(JSON.stringify([]))),
  });
};

test.describe.serial('TaskMaster guest demo (single flow)', () => {
  test('guest template onboarding + core UI walkthrough without long AI waits', async ({ page }) => {
    test.setTimeout(180000);

    dismissDialogs(page);
    await page.route('https://api.anthropic.com/v1/messages', mockClaudeForE2E);

    await page.goto('/');
    await majorPause(page);
    await expect(page.getByRole('heading', { name: /welcome to task master/i })).toBeVisible();

    await page.getByRole('button', { name: /continue as guest/i }).click();
    await majorPause(page);

    const onboardingTemplateButton = page.getByRole('button', { name: /the balanced achiever/i });
    await expect(onboardingTemplateButton).toBeVisible({ timeout: 20000 });
    await onboardingTemplateButton.click();
    await majorPause(page);

    await expect(page.getByRole('heading', { name: /your tasks/i })).toBeVisible({ timeout: 30000 });
    await majorPause(page);

    const taskCards = page.locator('[data-task-id]');
    await expect(taskCards.first()).toBeVisible();
    await expect(taskCards).toHaveCount(3, { timeout: 20000 });
    await majorPause(page);

    const completeButtons = page.getByRole('button', { name: /complete task/i });
    const beforeAddCount = await completeButtons.count();
    const quickAddInput = page.locator('input[type="text"]').first();
    await expect(quickAddInput).toBeVisible({ timeout: 10000 });
    await quickAddInput.fill(`Demo task ${Date.now()}`);
    await pause(page);
    await page.getByRole('button', { name: /^add task$|^add quest$/i }).click();
    await majorPause(page);
    await expect
      .poll(async () => await page.getByRole('button', { name: /complete task/i }).count(), { timeout: 25000 })
      .toBeGreaterThanOrEqual(beforeAddCount + 1);

    await page.getByRole('button', { name: /complete task/i }).first().click();
    await majorPause(page);

    const firstTask = taskCards.first();
    await firstTask.getByRole('button', { name: /edit schedule date/i }).click();
    await majorPause(page);
    const dateInput = page.locator('#schedule-date-modal');
    const timeInput = page.locator('#schedule-time-modal');
    await expect(dateInput).toBeVisible();

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const y = tomorrow.getFullYear();
    const m = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const d = String(tomorrow.getDate()).padStart(2, '0');
    await dateInput.fill(`${y}-${m}-${d}`);
    await pause(page);
    await timeInput.fill('09:30');
    await pause(page);
    await page.getByRole('button', { name: /^save$/i }).click();
    await majorPause(page);

    await firstTask.getByRole('button', { name: /task actions/i }).click();
    await majorPause(page);
    const makeRecurring = page.getByRole('button', { name: /make recurring/i });
    if (await makeRecurring.isVisible().catch(() => false)) {
      await makeRecurring.click();
      await majorPause(page);
    } else {
      const editRecurring = page.getByRole('button', { name: /edit recurrence/i });
      if (await editRecurring.isVisible().catch(() => false)) {
        await editRecurring.click();
        await majorPause(page);
        await page.getByRole('button', { name: /^cancel$/i }).click();
        await majorPause(page);
      }
    }

    await expect(taskCards.filter({ hasText: '15-minute focus sprint' }).first()).toBeVisible();
    await majorPause(page);

    await page.getByRole('button', { name: /^explore$/i }).click();
    await majorPause(page);
    await expect(page.getByRole('heading', { name: /explore new tasks/i })).toBeVisible();

    const exploreInput = page.locator('input[type="text"]').first();
    await exploreInput.fill('Give me a short productive task.');
    await majorPause(page);
    await page.getByRole('button', { name: /^suggest$/i }).click();
    await majorPause(page);
    const acceptSuggestionButton = page.getByRole('button', { name: /^accept$/i }).first();
    await expect(acceptSuggestionButton).toBeVisible({ timeout: 20000 });
    await acceptSuggestionButton.click();
    await majorPause(page);

    const tasksNav = page.getByRole('button', { name: /^tasks$/i });
    if (await tasksNav.isVisible().catch(() => false)) {
      await tasksNav.click();
      await majorPause(page);
      await expect(page.getByRole('heading', { name: /your tasks/i })).toBeVisible({ timeout: 20000 });
    }

    await page.getByRole('button', { name: /^settings$/i }).click();
    await majorPause(page);
    await expect(page.getByRole('heading', { name: /settings/i })).toBeVisible();
    const soundToggle = page.getByRole('switch', { name: /sound effects/i });
    const before = await soundToggle.getAttribute('aria-checked');
    await soundToggle.click();
    await majorPause(page);
    await expect(soundToggle).toHaveAttribute('aria-checked', before === 'true' ? 'false' : 'true');
  });
});
