import { test, expect } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

test('Add multiple products from different pages to cart', async ({ page }) => {
    await page.goto('https://automaticityacademy.ngrok.app/login');

    // Debugging - prikazi poruke iz konzole
    page.on('console', msg => console.log(msg.text()));
    page.on('pageerror', error => console.log(`Page error: ${error}`));

    // Popunjavanje forme za login
    await page.getByPlaceholder('Email').fill('te2stuser123@example.com');
    await page.getByPlaceholder('Password').fill('St2rongPassword123');

    // Klik na login dugme
    await page.getByRole('button', { name: /Sign in/i }).click(); 

    // Sačekaj da se učita nova stranica
    await page.waitForURL('https://automaticityacademy.ngrok.app/dashboard');
    await page.waitForLoadState('load'); 

    const response = await page.waitForResponse(response => 
    response.url().includes('api/v1/products/?search=') && response.status() === 200);

    const responseBody = await response.json();
    const products = responseBody.products;

    // Definisi proizvode i stranicu na kojoj se nalaze
    const productsToAdd = [
        { name: 'Logitech G Pro Wireless Gaming Mouse', quantity: 2, pageNumber: 1 },
        { name: 'ASUS TUF Gaming X570-Plus ATX Motherboard', quantity: 3, pageNumber: 4 },
        { name: 'Acer Nitro 5', quantity: 1, pageNumber: 2 }
    ];
    
    // Trazi proizvode u telu odgovora
    for (const product of products) {
        console.log('Check', product.name);
        for(const productToAdd of productsToAdd)
        {
            // Check if the product's name matches the one you want
            if (product.name === productToAdd.name) {
                // Print the details of the product
                console.log(`Adding product to cart: ${product.name}`);

                // Now you can locate the product card using the name (example)
                const productCardLocator = page.locator(`h1:has-text("${product.name}")`).locator('xpath=..');
                await expect(productCardLocator).toBeVisible();

                // Find the "Add to Cart" button inside the product card (you may need to adjust the selector)
                const addToCartButton = productCardLocator.locator('button.add-to-cart');  // Adjust the button selector
                await expect(addToCartButton).toBeVisible();  // Ensure the button is visible

                // Click the "Add to Cart" button
                await addToCartButton.click();
            }
        }
    }
   
});
