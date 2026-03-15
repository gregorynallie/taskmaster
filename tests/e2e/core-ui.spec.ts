import { expect, test, type Locator, type Page } from '@playwright/test';

const STEP_DELAY_MS = Number(process.env.E2E_STEP_DELAY_MS ?? 700);

const skipWithoutGuestFlowFlag = () => {
  test.skip(
    process.env.E2E_RUN_GUEST_FLOW !== '1',
    'Set E2E_RUN_GUEST_FLOW=1 to enable auth-dependent core UI tests.',
  );
};

const pause = async (page: Page) => {
  await page.waitForTimeout(STEP_DELAY_MS);
};

const dismissDialogs = (page: Page) => {
  page.on('dialog', async (dialog) => {
    await dialog.dismiss();
  });
};

const authenticateViaGuest = async (page: Page) => {
  await page.goto('/');
  await pause(page);

  const alreadyInApp = page.getByRole('heading', { name: /your tasks/i });
  const onboarding = page.getByRole('button', { name: /get started/i });
  const appShell = page.getByRole('button', { name: /^settings$/i });
  const appReady = onboarding.or(appShell).or(alreadyInApp);
  if (await appReady.isVisible().catch(() => false)) return;

  // Keep E2E deterministic: always use guest auth in automation.
  const guestButton = page.getByRole('button', { name: /continue as guest/i });
  if (await guestButton.isVisible().catch(() => false)) {
    await guestButton.click();
    await pause(page);
  }

  await expect(appReady).toBeVisible({ timeout: 25000 });
};

const completeOnboardingIfVisible = async (page: Page) => {
  const getStarted = page.getByRole('button', { name: /get started/i });
  if (!(await getStarted.isVisible().catch(() => false))) return;

  const templateButton = page.getByRole('button', { name: /the balanced achiever/i });
  if (await templateButton.isVisible().catch(() => false)) {
    await templateButton.click();
    await pause(page);
    await expect(page.getByRole('heading', { name: /your tasks/i })).toBeVisible({ timeout: 30000 });
    return;
  }

  await getStarted.click();
  await pause(page);
  await page.getByRole('button', { name: /early bird/i }).click();
  await pause(page);
  await page.getByRole('button', { name: /get my life organized/i }).click();
  await pause(page);
  await page.getByRole('button', { name: /^next$/i }).click();
  await pause(page);
  await page.getByRole('button', { name: /go for a walk/i }).click();
  await pause(page);
  await page.getByRole('button', { name: /^next$/i }).click();
  await pause(page);
  await page.getByRole('button', { name: /gaming/i }).click();
  await pause(page);
  await page.getByRole('button', { name: /^next$/i }).click();
  await pause(page);
  await page.locator('textarea').first().fill('E2E core UI path.');
  await page.getByRole('button', { name: /create my plan/i }).click();
  await pause(page);
};

const ensureOnTodayView = async (page: Page) => {
  const tasksNav = page.getByRole('button', { name: /^tasks$/i });
  if (await tasksNav.isVisible().catch(() => false)) {
    await tasksNav.click();
    await pause(page);
  }
  await expect(page.getByRole('heading', { name: /your tasks/i })).toBeVisible({ timeout: 30000 });
};

const ensureAtLeastOneTask = async (page: Page) => {
  await ensureOnTodayView(page);
  const taskCards = page.locator('[data-task-id]');
  const count = await taskCards.count();
  if (count > 0) return;

  const quickAddInput = page.locator('input[type="text"]').first();
  await quickAddInput.fill(`Core UI seeded task ${Date.now()}`);
  await pause(page);
  await page.getByRole('button', { name: /^add task$|^add quest$/i }).click();
  await expect(taskCards.first()).toBeVisible({ timeout: 45000 });
};

const firstTask = (page: Page): Locator => page.locator('[data-task-id]').first();

test.describe.serial('TaskMaster core UI', () => {
  test.describe.configure({ timeout: 90000 });

  test('settings view controls are interactive', async ({ page }) => {
    skipWithoutGuestFlowFlag();
    dismissDialogs(page);

    await authenticateViaGuest(page);
    await completeOnboardingIfVisible(page);
    await expect(page.getByRole('button', { name: /^settings$/i })).toBeVisible({ timeout: 30000 });

    await page.getByRole('button', { name: /^settings$/i }).click();
    await pause(page);
    await expect(page.getByRole('heading', { name: /settings/i })).toBeVisible();

    const soundToggle = page.getByRole('switch', { name: /sound effects/i });
    const before = await soundToggle.getAttribute('aria-checked');
    await soundToggle.click();
    await pause(page);
    await expect(soundToggle).toHaveAttribute('aria-checked', before === 'true' ? 'false' : 'true');
  });

  test('task scheduling modal and recurrence controls work', async ({ page }) => {
    skipWithoutGuestFlowFlag();
    dismissDialogs(page);

    await authenticateViaGuest(page);
    await completeOnboardingIfVisible(page);
    await ensureAtLeastOneTask(page);

    const task = firstTask(page);
    await task.getByRole('button', { name: /edit schedule date/i }).click();
    await pause(page);
    const dateInput = page.locator('#schedule-date-modal');
    const timeInput = page.locator('#schedule-time-modal');
    await expect(dateInput).toBeVisible();

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const y = tomorrow.getFullYear();
    const m = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const d = String(tomorrow.getDate()).padStart(2, '0');
    await dateInput.fill(`${y}-${m}-${d}`);
    await timeInput.fill('09:30');
    await pause(page);
    await page.getByRole('button', { name: /^save$/i }).click();
    await pause(page);

    await expect(task.getByRole('button', { name: /edit schedule date/i })).toContainText(/tomorrow|[a-z]{3}/i);

    await task.getByRole('button', { name: /task actions/i }).click();
    const makeRecurring = page.getByRole('button', { name: /make recurring/i });
    if (await makeRecurring.isVisible().catch(() => false)) {
      await makeRecurring.click();
      await pause(page);
    } else {
      await page.getByRole('button', { name: /edit recurrence/i }).click();
      await pause(page);
      await page.getByRole('button', { name: /^cancel$/i }).click();
      await pause(page);
    }

    await expect(task).toContainText(/🔄|every day|daily/i);
  });

  test('explore prompt returns suggestions or error state', async ({ page }) => {
    skipWithoutGuestFlowFlag();
    dismissDialogs(page);

    await authenticateViaGuest(page);
    await completeOnboardingIfVisible(page);

    await page.getByRole('button', { name: /^explore$/i }).click();
    await pause(page);
    await expect(page.getByRole('heading', { name: /explore new tasks/i })).toBeVisible();

    const promptInput = page.locator('input[type="text"]').first();
    await promptInput.fill('Give me one quick productive task for this afternoon');
    await pause(page);
    await page.getByRole('button', { name: /^suggest$/i }).click();
    await pause(page);

    const acceptButton = page.getByRole('button', { name: /^accept$/i }).first();
    const errorBox = page.getByText(/oops! something went wrong/i);
    await expect(acceptButton.or(errorBox)).toBeVisible({ timeout: 45000 });
  });
});
