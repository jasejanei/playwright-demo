import { test, expect } from "../../fixtures/fixtures";
import * as fs from 'fs';

let testData: Record<string, any> = {};

// Determine environment, default to 'testing'
const ENV = process.env.ENV || process.env.NODE_ENV || 'testing';

//map environment to test data file
const testDataFileMap: Record<string, string> = {
    testing: 'test-data-testing.json',
    production: 'test-data-production.json'
};

test.describe("Problem User: Product Test", () => {
    const loadTestData = (): Record<string, any> => {
        try {
            return JSON.parse(fs.readFileSync(`./src/test data/${testDataFileMap[ENV] || 'test-data-testing.json'}`, 'utf-8'));
        } catch {
            return {};
        }
    }
    test.beforeEach(async ({ POM, page }) => {
        await POM.login.navigate();
        await POM.login.login(testData.users.problem_user.username, testData.users.problem_user.password);
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

    test('Problem User - Verify Product Images are shown', async ({ POM, page }) => {
        await POM.product.verifyAllProductImagesLoaded(testData.products);
    });

    test('Problem User: Verify all product images are correct', async ({ POM, page }) => {
        await page.waitForLoadState('domcontentloaded');
        
        for (const productKey in testData.products) {
            const product = testData.products[productKey];
            console.log(`Verifying image for product: ${product.name}`);

            await POM.product.clickProductImageByName(product.name);
            await page.waitForLoadState('domcontentloaded');

            const actualImageSrc = await POM.product.page.locator('img.inventory_details_img').getAttribute('src');
            const expectedImageSrc = product.image;

            console.log(`Expected Image Src: ${expectedImageSrc}`);
            console.log(`Actual Image Src: ${actualImageSrc}`);

            expect(actualImageSrc).toBe(expectedImageSrc);

            await POM.product.navigateBackToProductList();
        };
    });

    test('Problem User: Verify that clicking on product image navigates to correct product detail page', async ({ POM, page }) => {
        await page.waitForLoadState('domcontentloaded');
        
        for (const productKey in testData.products) {
            const product = testData.products[productKey];
            console.log(`Verifying navigation for product: ${product.name}`);
            await POM.product.clickProductImageByName(product.name);
            await page.waitForLoadState('domcontentloaded');

            const productTitle = await POM.product.productTitle.textContent();
            console.log(`Expected Product Title: ${product.name}`);
            console.log(`Actual Product Title: ${productTitle}`);

            expect(productTitle).toBe(product.name);

            await POM.product.navigateBackToProductList();
        };
    });

    test('Problem User: Verify that Add to cart button turns to Remove when clicked', async ({ POM, page }) => {
        const productsToAdd = [
            testData.products.sauce_labs_backpack.name,
            testData.products.sauce_labs_bike_light.name,
            testData.products.sauce_labs_fleece_jacket.name,
            testData.products.sauce_labs_bolt_tshirt.name,
            testData.products.sauce_labs_onesie.name,

        ];
        for (const name of productsToAdd) {
            console.log(`Adding product to cart: ${name}`);
            const addBtn = POM.product.addToCartButton(name);
            
            await addBtn.click()
            const removeBtn = POM.product.removeButton(name)
            
            try {
                await expect(removeBtn).toBeVisible({ timeout: 1500 });
                console.log(`${name} added to cart (button changed to Remove)`);
            } catch (error) {
                console.log(`${name} not added to cart - Remove button is not visible after clicking Add to Cart`);
                throw error;
            }
        }
        
    });
        

    test('Problem User: Verify that correct product is added to cart', async ({ POM, page }) => {
        const productsToAdd = [
            testData.products.sauce_labs_backpack.name,
            testData.products.sauce_labs_fleece_jacket.name,
            testData.products.sauce_labs_onesie.name
        ];
        for (const productName of productsToAdd) {
            console.log(`Adding product to cart: ${productName}`);
            await POM.product.clickAddToCart(productName);
        }

        
        await POM.product.clickShoppingCart();
        await page.waitForLoadState('domcontentloaded');
        await POM.checkout.verifyProductsInCart(productsToAdd);
        
    });

    test('Problem User: Verify that items can be removed in the cart from Product List', async ({ POM, page }) => {
        const productName = testData.products.sauce_labs_backpack.name;

        console.log(`Adding product to cart: ${productName}`);
        await POM.product.clickAddToCart(productName);

        console.log(`Removing product from cart: ${productName}`);
        await POM.product.clickRemove(productName);

        await POM.product.clickAndExpectCartBadgeDelta(POM.product.removeButton(productName), -1);
    });

    test('Problem User: Verify that user cannot checkout when cart is empty', async ({ POM, page }) => {
        await POM.product.clickShoppingCart();
        await page.waitForLoadState('domcontentloaded');
        await expect(POM.checkout.checkoutButton).toBeDisabled();
    });

    test('Problem User: Verify that Checkout form is functional', async ({ POM, FORMS, page}) => {
        const productsToAdd = [
            testData.products.sauce_labs_backpack.name,
            testData.products.sauce_labs_bike_light.name,
            testData.products.sauce_labs_fleece_jacket.name
        ];

        for (const productName of productsToAdd) {
            const addBtn = POM.product.addToCartButton(productName)
            await addBtn.scrollIntoViewIfNeeded();
            await POM.product.clickAddToCart(productName);
        }
        await POM.product.clickShoppingCart();
        await page.waitForLoadState('domcontentloaded');
        await POM.checkout.clickCheckout();
        await FORMS.checkout.fillCheckoutForm(
            testData.users.problem_user.firstName, 
            testData.users.problem_user.lastName, 
            testData.users.problem_user.postalCode
        );
        await page.waitForLoadState('domcontentloaded');
        await FORMS.checkout.verifyEnteredDetails(
            testData.users.problem_user.firstName, 
            testData.users.problem_user.lastName, 
            testData.users.problem_user.postalCode
        );
    });

    


});