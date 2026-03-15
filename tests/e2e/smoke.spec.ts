import { expect, test, type Page } from '@playwright/test';

const skipWithoutGuestFlowFlag = () => {
  test.skip(
    process.env.E2E_RUN_GUEST_FLOW !== '1',
    'Set E2E_RUN_GUEST_FLOW=1 to enable guest-auth flow checks.',
  );
};

const dismissDialogs = (page: Page) => {
  page.on('dialog', async (dialog) => {
    await dialog.dismiss();
  });
};

const continueAsGuest = async (page: Page) => {
  await page.goto('/');
  await page.getByRole('button', { name: /continue as guest/i }).click();

  const onboarding = page.getByRole('button', { name: /get started/i });
  const appShell = page.getByRole('button', { name: /settings/i });
  await expect(onboarding.or(appShell)).toBeVisible({ timeout: 30000 });
};

const completeOnboardingMinimalPath = async (page: Page) => {
  const startQuestButton = page.getByRole('button', { name: /get started/i });
  if (!(await startQuestButton.isVisible().catch(() => false))) return;

  await startQuestButton.click();

  await page.getByRole('button', { name: /early bird/i }).click();
  await page.getByRole('button', { name: /get my life organized/i }).click();
  await page.getByRole('button', { name: /^next$/i }).click();
  await page.getByRole('button', { name: /go for a walk/i }).click();
  await page.getByRole('button', { name: /^next$/i }).click();
  await page.getByRole('button', { name: /gaming/i }).click();
  await page.getByRole('button', { name: /^next$/i }).click();

  const finalNotes = page.locator('textarea').first();
  await expect(finalNotes).toBeVisible({ timeout: 10000 });
  await finalNotes.fill('E2E: keep tasks short and practical.');
  await page.getByRole('button', { name: /create my plan/i }).click();
};

test.describe('TaskMaster smoke', () => {
  test('shows login options on first load', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: /welcome to task master/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in with google/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /continue as guest/i })).toBeVisible();
  });

  test('guest flow reaches onboarding or app shell (optional)', async ({ page }) => {
    skipWithoutGuestFlowFlag();
    dismissDialogs(page);
    await continueAsGuest(page);
  });

  test('core flow: onboarding -> add task -> complete task (optional)', async ({ page }) => {
    test.setTimeout(120000);
    skipWithoutGuestFlowFlag();
    dismissDialogs(page);

    await continueAsGuest(page);
    await completeOnboardingMinimalPath(page);

    await expect(page.getByRole('heading', { name: /your tasks/i })).toBeVisible({ timeout: 60000 });

    const completeButtons = page.getByRole('button', { name: /complete task/i });
    const beforeAddCount = await completeButtons.count();

    const quickAddInput = page.locator('input[type="text"]').first();
    await expect(quickAddInput).toBeVisible({ timeout: 10000 });
    await quickAddInput.fill('E2E core flow task');
    await page.getByRole('button', { name: /^add task$|^add quest$/i }).click();

    await expect
      .poll(async () => await completeButtons.count(), { timeout: 45000 })
      .toBeGreaterThanOrEqual(beforeAddCount + 1);

    const afterAddCount = await completeButtons.count();
    await completeButtons.first().click();

    await expect
      .poll(async () => await completeButtons.count(), { timeout: 20000 })
      .toBeLessThan(afterAddCount);
  });
});
