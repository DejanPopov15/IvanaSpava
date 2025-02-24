const { test, expect } = require('@playwright/test');

test('Add product to cart and verify', async ({ page }) => {
  // Intercept the add-to-cart API request
  await page.route('**/api/cart/add', async (route, request) => {
    console.log('Intercepted Request:', request.url());
    await route.continue(); // Allow the request to continue
  });

  // Navigate to the dashboard page
  await page.goto('https://your-website-url.com/dashboard');

  // Wait for the product cards to load
  await page.waitForSelector('.product-card'); // Adjust selector as needed

  // Define the product name to add
  const productName = 'NVIDIA GeForce RTX 3080 Ti';

  // Locate the product card by its name
  const productCard = page.locator(`h1:has-text("${productName}")`).locator('xpath=..');
  await expect(productCard).toBeVisible(); // Ensure product is visible

  // Locate the "Add to Cart" button inside the product card
  const addToCartButton = productCard.locator('button.add-to-cart');
  await expect(addToCartButton).toBeVisible();

  // Click the "Add to Cart" button
  await addToCartButton.click();

  // Wait for the response confirming the product is added to the cart
  const response = await page.waitForResponse(response =>
    response.url().includes('/api/cart/add') && response.status() === 200
  );
  const responseBody = await response.json();
  console.log('API Response:', responseBody);
  expect(responseBody.success).toBe(true);

  // Verify the product was added to the cart
  const cartIcon = page.locator('button.cart-icon');
  await expect(cartIcon).toHaveText('1'); // Verify the cart now contains 1 item
});
