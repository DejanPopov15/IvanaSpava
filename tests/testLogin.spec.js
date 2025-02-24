import { test, expect } from '@playwright/test';

test('Login as existing user', async ({ page }) => {
  await page.goto('https://automaticityacademy.ngrok.app/login');

  // Debugging - prikazi poruke iz konzole
  page.on('console', msg => console.log(msg.text()));
  page.on('pageerror', error => console.log(`Page error: ${error}`));

  // Popunjavanje forme za login
  await page.getByPlaceholder('Email').fill('te2stuser123@example.com');
  await page.getByPlaceholder('Password').fill('St2rongPassword123');

  // Klik na login dugme
  await page.getByRole('button', { name: /Sign in/i }).click(); // Case-insensitive pretraga

  // Sačekaj da se učita nova stranica
 
  await expect(page).toHaveURL('https://automaticityacademy.ngrok.app/dashboard');
});