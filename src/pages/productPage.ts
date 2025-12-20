import { BasePage } from "../pages/base/basePage";
import { Page, Locator, expect } from "@playwright/test";

export class ProductPage extends BasePage {
    readonly page: Page;
    readonly header: Locator;
    readonly shoppingCart: Locator;
    readonly backToProductsButton: Locator;
    readonly inventoryList: Locator;
    readonly productTitle: Locator;
    readonly productImageByName: (productName: string) => Locator;
    readonly productDescription: Locator;
    readonly productPrice: Locator;
    readonly removeButton: (productName: string) => Locator;
    readonly addToCartButton: (productName: string) => Locator;
    

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.header = page.locator("span.title");
        this.shoppingCart = page.locator("a.shopping_cart_link");
        this.backToProductsButton = page.locator("button[data-test='back-to-products']");
        this.inventoryList = page.locator("div[data-test='inventory-list']");
        this.productTitle = page.locator("div[data-test='inventory-item-name']");
        this.productImageByName = (productName: string) => 
            page.locator(`img[data-test="inventory-item-${productName.replace(/\s+/g, '-').toLowerCase()}-img"]`)
        this.productDescription = page.locator("div.inventory_details_desc.large_size");
        this.productPrice = page.locator("div.inventory_details_price");
        this.addToCartButton = (productName: string) => 
            page.locator(`button[data-test="add-to-cart-${productName.replace(/\s+/g, '-').toLowerCase()}"]`);
        this.removeButton = (productName: string) =>
            page.locator(`button[data-test='remove-${productName.replace(/\s+/g, '-').toLowerCase()}']`);

    }

    async waitForDataToLoad(): Promise<void> {
        try {
            console.log("Waiting for product data to load...");
            await this.basePageWaitForData(this.header);
            console.log("Product data loaded.");
            await Promise.race([
                this.inventoryList.first().waitFor({ state: 'visible', timeout: 10000 })
            ]).catch(() => {
                console.log('No visible inventory items found within timeout.');
            });
            console.log("Inventory items are visible.");
        } catch (error) {
            console.error("Error while waiting for product data to load:", error);
            throw error;
        }
    }

    async clickProductImageByName(productName: string) {
        await this.basePageClick(this.productImageByName(productName));
    }

    async clickShoppingCart() {
        const cart = this.shoppingCart;
        await cart.scrollIntoViewIfNeeded();
        await this.basePageClick(this.shoppingCart);
    }

    async clickProductName(productName: string) {
        const productLocator = this.page.locator(`div[data-test='inventory-item-name']`, { hasText: productName });
        await this.basePageClick(productLocator);
    }

    async clickAddToCart(productName: string) {
        const escapedName = productName.replace(/\s+/g, '-').toLowerCase().replace(/[()]/g, '');
        const btn = this.addToCartButton(escapedName);
        await btn.scrollIntoViewIfNeeded();
        await this.basePageClick(btn);
    }

    async clickRemove(productName: string) {
        const escapedName = productName.replace(/\s+/g, '-').toLowerCase().replace(/[()]/g, '');
        const btn = this.removeButton(escapedName);
        await btn.scrollIntoViewIfNeeded();
        await this.basePageClick(btn);
    }

    async clickAndExpectCartBadgeDelta(clickLocator: Locator, delta = 1, timeout = 1500) {
        const badge = this.page.locator('a.shopping_cart_link .shopping_cart_badge');
        const initialCountText = await badge.textContent().catch(() => null);
        const initialCount = initialCountText ? parseInt(initialCountText, 10): 0;

        //await clickLocator.scrollIntoViewIfNeeded();
        await this.basePageClick(clickLocator);

        const expectedCount = (initialCount || 0) + delta;
        await expect(badge).toHaveText(expectedCount.toString(), { timeout }).catch(() => {
            console.error(`Cart badge did not update: before=${initialCount}, expected=${expectedCount}`)
            throw new Error(`Cart badge did not update to expected count: ${expectedCount}`);
        });
        
        console.log(`Expected cart badge to be ${expectedCount}, but it did not update in time.`);
    }

    async navigateBackToProductList() {
        await this.basePageClick(this.backToProductsButton);
        await this.basePageWaitForData(this.inventoryList);
        expect(this.inventoryList).toBeVisible();
        expect(this.header).toHaveText("Products");
    }

    async assertProductDetails(expectedName: string, expectedDescription: string, expectedPrice: string) {
        await this.basePageExpectText(this.productTitle, expectedName);
        await this.basePageExpectText(this.productDescription, expectedDescription);
        await this.basePageExpectText(this.productPrice, expectedPrice);
    }

    async selectFilterOptions(filterOption: string) {
        const filterMap: Record<string, string> = {
            'Name (A to Z)': 'az',
            'Name (Z to A)': 'za',
            'Price (low to high)': 'lohi',
            'Price (high to low)': 'hilo'
        };
        
        const optionValue = filterMap[filterOption] || filterOption;
        await this.page.locator("select[data-test='product-sort-container']").selectOption(optionValue);
        await this.page.waitForLoadState('domcontentloaded');
    }

    async getProductNames(): Promise<string[]> {
        return await this.page.locator("div[data-test='inventory-item-name']").allTextContents();
    }

    async getProductPrices(): Promise<string[]> {
        return await this.page.locator("div[data-test='inventory-item-price']").allTextContents();
    }

    async waitForSortToComplete(): Promise<void> {
        await this.page.waitForLoadState('domcontentloaded');
    }

    //------PRODUCT IMAGES HELPERS ------//

    async getProductImageSrc(productName: string): Promise<string | null> {
        const imageLocator = this.productImageByName(productName);
        return await imageLocator.getAttribute('src');
    }

    async isProductImageCorrect(productName: string, expectedSrcSubstring: string): Promise<boolean> {
        const imageLocator = this.productImageByName(productName);
        const src = await imageLocator.getAttribute('src');
        return src?.includes(expectedSrcSubstring) || false;
    }

    async verifyProductImageVisible(productName: string): Promise<void> {
        const productImage = this.productImageByName(productName);
        await this.basePageExpectVisible(productImage);
    }

    async verifyProductImageLoaded(productName: string): Promise<void> {
        const productImage = this.productImageByName(productName);
        await expect(productImage).toHaveAttribute('src', /\.(jpg|png|gif|webp)/i);
    }

    async verifyAllProductImagesLoaded(productNames: string[]): Promise<void> {
        const allImages = this.page.locator('img.inventory_item_img');
        const count = await allImages.count();
        for (let i = 0; i < count; i++) {
            const img = allImages.nth(i);
            await expect(img).toHaveAttribute('src', /\.(jpg|png|gif|webp)/i);
        }
        console.log(`Verified ${count} product images are loaded.`);
    }
    
    
    
}