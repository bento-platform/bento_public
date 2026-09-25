import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { API_PROJECTS } from './mocks';

test.describe.configure({ mode: 'parallel' });

test.describe('homepage', () => {
  test.beforeEach(async ({ page }) => {
    // Intercept projects API in CI (or if MOCK_API=true) so catalogue cards render cleanly
    if (process.env.CI || process.env.MOCK_API === 'true') {
      await page.route('**/api/metadata/api/projects*', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(API_PROJECTS),
        });
      });
    }
  });

  test('should not have any automatically detectable accessibility issues when load', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#default-layout');
    await page.waitForSelector('#content-layout');

    // Wait for the catalogue grid or fallback to empty state
    await page.waitForSelector('.catalogue-grid, .catalogue-insights-container');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .exclude('.catalogue-card__title')
      .exclude('#_r_u_')
      .analyze();

    await expect.soft(accessibilityScanResults.violations.length).toBe(0);
    // Should not have any automatically detectable accessibility while ready

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
