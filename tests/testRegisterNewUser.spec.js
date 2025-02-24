import { test, expect } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

test('Successful login with valid registered account', async ({ page }) => {
    // Register
    await page.goto('https://automaticityacademy.ngrok.app/register'); 

    await page.getByPlaceholder('Username address').fill('Te2stUser123');
    await page.getByPlaceholder('Email').fill('te2stuser123@example.com');
    await page.getByPlaceholder('Password').fill('St2rongPassword123');
    
    const registerButton = await page.getByRole('button', { name: 'Register' });
    await registerButton.click();

    await expect(page).toHaveURL(/.*register.*/);
});