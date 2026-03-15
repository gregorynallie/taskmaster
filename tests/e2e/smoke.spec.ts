import { expect, test } from '@playwright/test';

test.describe('TaskMaster smoke', () => {
  test('shows login options on first load', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: /welcome to task master/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in with google/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /continue as guest/i })).toBeVisible();
  });

  test('guest flow reaches onboarding or app shell (optional)', async ({ page }) => {
    test.skip(
      process.env.E2E_RUN_GUEST_FLOW !== '1',
      'Set E2E_RUN_GUEST_FLOW=1 to enable guest-auth flow checks.',
    );

    page.on('dialog', async (dialog) => {
      await dialog.dismiss();
    });

    await page.goto('/');
    await page.getByRole('button', { name: /continue as guest/i }).click();

    const onboarding = page.getByRole('button', { name: /start my quest/i });
    const appShell = page.getByRole('button', { name: /settings/i });

    await expect(onboarding.or(appShell)).toBeVisible({ timeout: 20000 });
  });
});
