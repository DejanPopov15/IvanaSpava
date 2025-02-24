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

    // await page.getByPlaceholder('Email').fill('abvgd@gmail.com');
    // await page.getByPlaceholder('Password').fill('abvgd!');

    // Klik na login dugme
    await page.getByRole('button', { name: /Sign in/i }).click(); // Case-insensitive pretraga

    // Sačekaj da se učita nova stranica
    await page.waitForURL('https://automaticityacademy.ngrok.app/dashboard');

    //Listen for API requests
    await page.route('**/api/v1/products/?search=', (route, request) => {
        // If the request URL matches the pattern, allow it to pass
        route.continue();
    });

    // Trigger a page navigation or action that will trigger the API request
    await page.goto('https://automaticityacademy.ngrok.app/dashboard');  // or any relevant action that triggers the request
    await page.waitForLoadState('load');  // waits until 'load' event

    // Wait for the response from the API to be completed
    const response = await page.waitForResponse(response => 
    response.url().includes('api/v1/products/?search=') && response.status() === 200);

    const responseBody = await response.body();

    
    // page.on('response', async (response) => {
    // // Check if the response is an API call
    // if (response.url().includes('/api/')) {
    //     console.log('API Response URL:', response.url());
    //     console.log('Status Code:', response.status());
    //     // Optionally, get the response body (if needed)
    //     responseBody = await response.body();
    //     //console.log('Response Body:', responseBody.toString());
    // }
    // });
  
  // Now that the API has responded, you can safely interact with the page
  //console.log('API Response received:', await response.json());


// Define product selection (Selectors & Quantities)
    const productsToAdd = [
        { name: 'Logitech G Pro Wireless Gaming Mouse', quantity: 2, pageNumber: 1 },
        { name: 'ASUS TUF Gaming X570-Plus ATX Motherboard', quantity: 3, pageNumber: 4 },
        { name: 'Acer Nitro 5', quantity: 1, pageNumber: 2 }
    ];
    console.log('API Response received:', await response.json());
    responseBody = await response.body();
// Loop through the products in the response body
for (const response of responseBody) {
    console.log('Check', product.String);
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
  
    
    // Optionally, add some assertions here to verify the product has been added to the cart
    break;  // Exit the loop once the correct product has been added to the cart
  }
  
    // but you can navigate between pages dynamically (e.g., using pagination, 
    //     tabs, or category selection), we need to interact with 
    //     the UI to select different products instead of using direct URLs.
    // Define product selection (Selectors & Quantities)
    // const productsToAdd = [
    //     { name: 'Logitech G Pro Wireless Gaming Mouse', quantity: 2, pageNumber: 1 },
    //     { name: 'ASUS TUF Gaming X570-Plus ATX Motherboard', quantity: 3, pageNumber: 4 },
    //     { name: 'Acer Nitro 5', quantity: 1, pageNumber: 2 }
    // ];

    // // Loop through each product
    // for (const product of productsToAdd) {
    //     console.log(`Looking for ${product.name} on page ${product.pageNumber}`);

    //     // Navigate to the expected page
    //     await navigateToPage(page, product.pageNumber);

    //     // Wait for the response from the API to be completed
    //     const response = await page.waitForResponse(response => 
    //         response.url().includes('api/v1/products/?search=') && response.status() === 200
    //     );
        
    //     // Now that the API has responded, you can safely interact with the page
    //     console.log('API Response received:', await response.json());

    //     // Locate the product on that page
    //    const productLocator = page.locator(`text=/${product.Name}/i`);
    //    const productContainers = page.locator('div.flex.flex-row-reverse[test-data="product-container"]');

    //    // const productContainer = page.locator(`div[test-data="product-container"] h1:text("${product.Name}")`);

    //     const count = await productLocator.count();

    //     if (count > 0) {
    //     console.log(`${count} found!`);
    //     } else {
    //     console.log(`${count} not found.`);
    //     }

    //     if (await productLocator.isVisible()) {
    //         await page.locator('button:has(svg[xmlns="http://www.w3.org/2000/svg"])').click();
    //         console.log(`${product.name} added to cart!`);
    //     } else {
    //         console.log(`❌ ${product.name} not found on page ${product.pageNumber}`);
    //     }
    // }
   
});

/**
 * Function to navigate to a specific page number in a paginated product listing
 */
async function navigateToPage(page, targetPageNumber) {
    console.log(`Navigating to page ${targetPageNumber}...`);

    // Selector for the current page number
    await page.getByRole('button', { name: String(targetPageNumber) }).click();

    // Get the current page number
    await page.waitForLoadState('domcontentloaded'); // Wait for page load
    
}