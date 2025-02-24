import { test, expect } from '@playwright/test';

test('Should navigate to register page', async ({ page }) => {
  await page.goto('https://automaticityacademy.ngrok.app/register'); // Zameni sa svojim URL-om
  await expect(page).toHaveURL(/.*register/); // Provera da URL sadrži "register"
});