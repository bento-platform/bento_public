import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe.configure({ mode: 'parallel' });

test.describe('homepage', () => {
  test('should not have any automatically detectable accessibility issues when load', async ({ page }) => {
    await page.goto('https://bentov2.local/', { timeout: 45000 }); // Check for a variable in CI
    await page.waitForSelector('#default-layout');

    await page.waitForSelector('#content-layout');

    await page.waitForSelector('.catalogue-grid');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    await expect.soft(accessibilityScanResults.violations.length).toBe(3);
    // 'should not have any automatically detectable accessibility while ready'

    // expect(accessibilityScanResults.violations).toEqual([]);
  });
  test('should not have any automatically detectable accessibility issues when load', async ({ page }) => {
    await page.goto('https://bentov2.local/', { timeout: 45000 }); // Check for a variable in CI
    await page.waitForSelector('#default-layout');

    await page.waitForSelector('#content-layout');

    await page.waitForSelector('.catalogue-grid');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    await expect.soft(accessibilityScanResults.violations.length).toBe(3);
    // 'should not have any automatically detectable accessibility while ready'

    // expect(accessibilityScanResults.violations).toEqual([]);
  });
});
