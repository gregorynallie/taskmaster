import { expect, test, type Page } from '@playwright/test';

const STEP_DELAY_MS = Number(process.env.E2E_STEP_DELAY_MS ?? 700);

const skipWithoutGuestFlowFlag = () => {
  test.skip(
    process.env.E2E_RUN_GUEST_FLOW !== '1',
    'Set E2E_RUN_GUEST_FLOW=1 to enable auth-dependent flow checks.',
  );
};

const skipWithoutCoreFlowFlag = () => {
  test.skip(
    process.env.E2E_RUN_CORE_FLOW !== '1',
    'Set E2E_RUN_CORE_FLOW=1 to enable the longer onboarding/task lifecycle flow.',
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

const completeOnboardingMinimalPath = async (page: Page) => {
  const startScreen = page.getByRole('button', { name: /get started/i });
  if (!(await startScreen.isVisible().catch(() => false))) return;

  const templateButton = page.getByRole('button', { name: /the balanced achiever/i });
  if (await templateButton.isVisible().catch(() => false)) {
    await templateButton.click();
    await pause(page);
    await expect(page.getByRole('heading', { name: /your tasks/i })).toBeVisible({ timeout: 30000 });
    return;
  }

  await startScreen.click();
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
  await page.locator('textarea').first().fill('E2E: keep tasks short and practical.');
  await page.getByRole('button', { name: /create my plan/i }).click();
  await pause(page);
};

test.describe.serial('TaskMaster smoke', () => {
  test('shows login options on first load', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: /welcome to task master/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in with google/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /continue as guest/i })).toBeVisible();
  });

  test('guest flow reaches onboarding or app shell (optional)', async ({ page }) => {
    skipWithoutGuestFlowFlag();
    dismissDialogs(page);
    await authenticateViaGuest(page);
  });

  test('core flow: onboarding -> add task -> complete task (optional)', async ({ page }) => {
    test.setTimeout(60000);
    skipWithoutGuestFlowFlag();
    skipWithoutCoreFlowFlag();
    dismissDialogs(page);

    await authenticateViaGuest(page);
    await completeOnboardingMinimalPath(page);

    await expect(page.getByRole('heading', { name: /your tasks/i })).toBeVisible({ timeout: 30000 });

    const completeButtons = page.getByRole('button', { name: /complete task/i });
    const beforeAddCount = await completeButtons.count();

    const quickAddInput = page.locator('input[type="text"]').first();
    await expect(quickAddInput).toBeVisible({ timeout: 10000 });
    await quickAddInput.fill('E2E core flow task');
    await pause(page);
    await page.getByRole('button', { name: /^add task$|^add quest$/i }).click();
    await pause(page);

    await expect
      .poll(async () => await completeButtons.count(), { timeout: 25000 })
      .toBeGreaterThanOrEqual(beforeAddCount + 1);

    const afterAddCount = await completeButtons.count();
    await completeButtons.first().click();
    await pause(page);

    await expect
      .poll(async () => await completeButtons.count(), { timeout: 20000 })
      .toBeLessThan(afterAddCount);
  });
});
