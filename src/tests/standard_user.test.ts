import { test, expect } from "../fixtures/fixtures";
import * as fs from 'fs';

let testData: Record<string, any> = {};

// Determine environment, default to 'testing'
const ENV = process.env.ENV || process.env.NODE_ENV || 'testing';

//map environment to test data file
const testDataFileMap: Record<string, string> = {
    testing: 'test-data-testing.json',
    production: 'test-data-production.json'
};

test.describe("Standard_user: Product Page Tests", () => {
    const loadTestData = (): Record<string, any> => {
        try {
            return JSON.parse(fs.readFileSync(`./src/test data/${testDataFileMap[ENV] || 'test-data-testing.json'}`, 'utf-8'));
        } catch {
            return {};
        }
    }
    test.beforeEach(async ({ POM, page }) => {
        await POM.login.navigate();
        await POM.login.login(process.env.userId!, process.env.password!);
        await page.waitForLoadState('domcontentloaded');

    });
    test.beforeAll(() => {
        testData = loadTestData()
    })
    test.afterEach(async ({ POM, page}) => {
        await POM.login.openMenu();
        await POM.login.clickLogout();
        await page.waitForLoadState('domcontentloaded');
    });

    test('Verify sorting by Product Name Z-A', async ({ POM}) => {
        await POM.product.selectFilterOptions('Name (Z to A)');
        await POM.product.waitForSortToComplete();

        const productNames = await POM.product.getProductNames();
        console.log("Product Names (Z to A):", productNames);

        const sortedNames = [...productNames].sort().reverse();
        expect(productNames).toEqual(sortedNames);
    });

    test('Verify sorting by Price Low to High', async ({ POM }) => {
        await POM.product.selectFilterOptions('Price (low to high)');
        await POM.product.waitForSortToComplete();

        const productPrices = await POM.product.getProductPrices();
        console.log("Product Prices (Low to High):", productPrices);

        const sortedPrices = [...productPrices].sort((a, b) => parseFloat(a.replace('$', '')) - parseFloat(b.replace('$', '')));
        expect(productPrices).toEqual(sortedPrices);
    });

    test('Verify sorting by Price High to Low', async ({ POM }) => {
        await POM.product.selectFilterOptions('Price (high to low)');
        await POM.product.waitForSortToComplete();

        const productPrices = await POM.product.getProductPrices();
        console.log("Product Prices (High to Low):", productPrices);

        const sortedPrices = [...productPrices].sort((a, b) => parseFloat(b.replace('$', '')) - parseFloat(a.replace('$', '')));
        expect(productPrices).toEqual(sortedPrices);
    });

    test('Verify Product Details Page by clicking image', async ({ POM }) => {
        const productName = testData.products.test_allthethings_tshirt_red.name;
        await POM.product.clickProductImageByName(productName);
        await POM.product.assertProductDetails(
            testData.products.test_allthethings_tshirt_red.name,
            testData.products.test_allthethings_tshirt_red.description,
            testData.products.test_allthethings_tshirt_red.price
        );
    });

    test('Verify Product Details Page by clicking name', async ({ POM }) => {
        const productName = testData.products.sauce_labs_bike_light.name;
        await POM.product.clickProductName(productName);
        await POM.product.assertProductDetails(
            testData.products.sauce_labs_bike_light.name,
            testData.products.sauce_labs_bike_light.description,
            testData.products.sauce_labs_bike_light.price
        );
    });

    test('Add Product to Cart and Verify Cart Count', async ({ POM, page }) => {
        const productName = testData.products.sauce_labs_bike_light.name;
        
        await POM.product.clickAddToCart(productName);
        await POM.product.clickShoppingCart();
        await page.waitForLoadState('domcontentloaded');
        
        const cartItem = page.locator(`div.cart_item:has-text("${productName}")`);
        await expect(cartItem).toBeVisible();
    });

    test('Verify total items in cart after adding multiple products', async ({ POM, page }) => {
        const productsToAdd = [
            testData.products.sauce_labs_bike_light.name,
            testData.products.sauce_labs_backpack.name,
            testData.products.sauce_labs_fleece_jacket.name
        ];

        for (const productName of productsToAdd) {
            await POM.product.clickAddToCart(productName);
        }

        await POM.product.clickShoppingCart();
        await page.waitForLoadState('domcontentloaded');

        for (const productName of productsToAdd) {
            const cartItem = page.locator(`div.cart_item:has-text("${productName}")`);
            await expect(cartItem).toBeVisible();
        }

        const cartItems = page.locator('div.cart_item');
        await expect(cartItems).toHaveCount(productsToAdd.length);
    });

    test('Verify Remove Product from Cart', async ({ POM, page }) => {
        const productsToAdd = [
            testData.products.sauce_labs_bike_light.name,
            testData.products.sauce_labs_backpack.name,
            testData.products.sauce_labs_fleece_jacket.name,
            testData.products.sauce_labs_onesie.name
        ];
        for (const productName of productsToAdd) {
            await POM.product.clickAddToCart(productName);
        }
        
        await POM.product.clickShoppingCart();
        await page.waitForLoadState('domcontentloaded');

        const productToRemove = testData.products.sauce_labs_backpack.name;
        await POM.checkout.removeProductFromCart(productToRemove);

        const removedItem = page.locator(`div.cart_item:has-text("${productToRemove}")`);
        await expect(removedItem).toHaveCount(0);

        const expectedCount = productsToAdd.length - 1;
        const cartItems = page.locator('div.cart_item');
        await expect(cartItems).toHaveCount(expectedCount);
        const productsInCart = await POM.product.getProductNames();
        const productNamesInCart = productsInCart.filter(name => name !== productToRemove);
        console.log('Current products in cart after removal:', productNamesInCart);
    });

    test('Verify add to cart and continue shopping', async ({ POM, page }) => {
        const productName = testData.products.sauce_labs_onesie.name;
        await POM.product.clickAddToCart(productName);
        await POM.product.clickShoppingCart();
        await page.waitForLoadState('domcontentloaded');

        const cartItem = page.locator(`div.cart_item:has-text("${productName}")`);
        await expect(cartItem).toBeVisible();

        await POM.checkout.clickContinueShopping();
        await page.waitForLoadState('domcontentloaded');
        await expect(page).toHaveURL(/.*inventory.html/);

        const additionalProducts = [
            testData.products.sauce_labs_bolt_tshirt.name,
            testData.products.sauce_labs_fleece_jacket.name
        ];
        for (const prodName of additionalProducts) {
            await POM.product.clickAddToCart(prodName);
        }

        await POM.product.clickShoppingCart();
        await page.waitForLoadState('domcontentloaded');

        const allProducts = [productName, ...additionalProducts];
        for (const prodName of allProducts) {
            const item = page.locator(`div.cart_item:has-text("${prodName}")`);
            await expect(item).toBeVisible();
        }

        const cartItems = page.locator('div.cart_item');
        await expect(cartItems).toHaveCount(allProducts.length);
    });

    test('Verify Checkout Button Navigation', async ({ POM, page }) => {
        const productName = testData.products.sauce_labs_bike_light.name;
        await POM.product.clickAddToCart(productName);
        await POM.product.clickShoppingCart();
        await page.waitForLoadState('domcontentloaded');

        await POM.checkout.clickCheckout();
        await page.waitForLoadState('domcontentloaded');

        await expect(page).toHaveURL(/.*checkout-step-one.html/);
    });

    test('Verify message appears when checkout form is empty', async ({ POM, FORMS, page }) => {
        const productName = testData.products.sauce_labs_bike_light.name;
        await POM.product.clickAddToCart(productName);
        await POM.product.clickShoppingCart();
        await page.waitForLoadState('domcontentloaded');

        await POM.checkout.clickCheckout();
        await FORMS.checkout.waitForHeader();

        console.log("Submitting empty checkout form...");
        console.log("[VERIFY] Expecting error message for missing first name.");
        await FORMS.checkout.clickContinue();
        await FORMS.checkout.verifyRequiredFieldErrors("First Name");
        await FORMS.checkout.closeErrorMessage();

        console.log("Filling in First Name only...");
        await FORMS.checkout.fillCheckoutForm("John", "", "");
        console.log("[VERIFY] Expecting error message for missing last name.");
        await FORMS.checkout.clickContinue();
        await FORMS.checkout.verifyRequiredFieldErrors("Last Name");
        await FORMS.checkout.closeErrorMessage();

        console.log("Filling in First and Last Name...");
        await FORMS.checkout.fillCheckoutForm("", "Doe", "");
        console.log("[VERIFY] Expecting error message for missing postal code.");
        await FORMS.checkout.clickContinue();
        await FORMS.checkout.verifyRequiredFieldErrors("Postal Code");
        await FORMS.checkout.closeErrorMessage();
    });
    
    test('Verify Price Calculation on Checkout Overview Page', async ({ POM, FORMS, page }) => {
        const productsToAdd = [
        testData.products.sauce_labs_bike_light.name,
        testData.products.sauce_labs_backpack.name,
        testData.products.sauce_labs_fleece_jacket.name
    ];
    let expectedTotal = 0;

    for (const productName of productsToAdd){
        await POM.product.clickAddToCart(productName);
        const priceStr = testData.products[productName.replace(/\s+/g, '_').toLowerCase()].price;
        const priceNum = parseFloat(priceStr.replace('$', ''));
        expectedTotal += priceNum;
    }
    await POM.product.clickShoppingCart();
    await page.waitForLoadState('domcontentloaded');

    await POM.checkout.clickCheckout();
    await FORMS.checkout.waitForHeader();

    await FORMS.checkout.fillCheckoutForm("John", "Doe", "12345");
    await FORMS.checkout.clickContinue();
    await page.waitForLoadState('domcontentloaded');

    await POM.checkout.verifyPriceCalculations(expectedTotal, 0.08);
    });

    test('Full LifCycle Test: Add to Cart, Remove items, Continue Shopping, Checkout, and Complete Order', async ({ POM, FORMS, page }) => {
        const productsToAdd = [
            testData.products.sauce_labs_bike_light.name,
            testData.products.sauce_labs_backpack.name
        ];

        for (const productName of productsToAdd) {
            await POM.product.clickAddToCart(productName);
        }
        
        await POM.product.clickShoppingCart();
        await page.waitForLoadState('domcontentloaded');

        const productToRemove = testData.products.sauce_labs_backpack.name;
        await POM.checkout.removeProductFromCart(productToRemove);

        const removedItem = page.locator(`div.cart_item:has-text("${productToRemove}")`);
        await expect(removedItem).toHaveCount(0);

        await POM.checkout.clickContinueShopping();
        await page.waitForLoadState('domcontentloaded');

        const additionalProducts = [
            testData.products.sauce_labs_onesie.name,
            testData.products.sauce_labs_fleece_jacket.name,
            testData.products.sauce_labs_bolt_tshirt.name
        ];
        for (const prodName of additionalProducts) {
            await POM.product.clickAddToCart(prodName);
        }

        await POM.product.clickShoppingCart();
        await page.waitForLoadState('domcontentloaded');

        await POM.checkout.clickCheckout();
        await FORMS.checkout.waitForHeader();

        await FORMS.checkout.fillCheckoutForm("Jane", "Doe", "54321");
        await FORMS.checkout.clickContinue();
        await page.waitForLoadState('domcontentloaded');

        let expectedTotal = 0;
        const finalProducts = [testData.products.sauce_labs_bike_light.name, ...additionalProducts];
        for (const productName of finalProducts) {
            const priceStr = testData.products[productName.replace(/\s+/g, '_').toLowerCase()].price;
            const priceNum = parseFloat(priceStr.replace('$', ''));
            expectedTotal += priceNum;
        }

        await POM.checkout.verifyPriceCalculations(expectedTotal, 0.08);

        await FORMS.checkout.clickFinish();
        await page.waitForLoadState('domcontentloaded');

        await expect(POM.checkout.orderCompleteMessage).toBeVisible();
        await expect(POM.checkout.orderCompleteMessage).toHaveText("Thank you for your order!");
        await POM.checkout.clickBackHome();
    });

});
   