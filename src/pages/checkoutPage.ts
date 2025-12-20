import { BasePage } from './base/basePage';
import { Page, Locator, expect } from '@playwright/test';


export class CheckoutPage extends BasePage {
    readonly page: Page;
    readonly header: Locator;
    readonly removeFromCartButton: (productName: string) => Locator;
    readonly checkoutButton: Locator;
    readonly continueShoppingButton: Locator;
    readonly orderCompleteMessage: Locator;
    readonly backHomeButton: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.header = page.locator("span.title");
         this.removeFromCartButton = (productName: string) => 
            page.locator(`#remove-${productName.replace(/\s+/g, '-').toLowerCase()}`);
        this.checkoutButton = page.locator("#checkout");
        this.continueShoppingButton = page.locator("#continue-shopping");
        this.orderCompleteMessage = page.locator(".complete-header");
        this.backHomeButton = page.locator("#back-to-products");
    }


    async removeProductFromCart(productName: string) {
        const escapedName = productName.replace(/\s+/g, '-').toLowerCase().replace(/[()]/g, '');
        await this.basePageClick(this.removeFromCartButton(escapedName));
    }

    async verifyProductsInCart(productNames: string[], timeout: number = 1500): Promise<void> {
        const cartItems = await this.page.locator('.cart_item').count();
        console.log(`Total Items in cart: ${cartItems}`);

        const missingItems: string[] = [];

        for (const itemName of productNames) {
            const cartItem = this.page.locator('.cart_item').filter({ hasText: itemName });
            
            try {
                await expect(cartItem).toBeVisible({ timeout})
                console.log(`Product found in cart: ${itemName}`);
            } catch (error) {
                console.log(`Product NOT found in cart: ${itemName}`);
                missingItems.push(itemName);
            }
        }
        if (missingItems.length > 0) {
            console.log(`Missing items in cart: ${missingItems.join(', ')}`);
            throw new Error(`Failed to verify products. Missing ${missingItems.length} item(s): ${missingItems.join(',')}`);
        } else {
            console.log("All products verified in cart.");
        }
    }

    async verifyProductRemovedFromCart(productName: string): Promise<void> {
        const cartItem = this.page.locator('.cart_item').filter({ hasText: productName });
        const isRemoved = await cartItem.isVisible().catch(() => false);
        
        if (isRemoved) {
            console.log(`Product still in cart: ${productName} (BUG - Remove did not work)`);
        } else {
            console.log(`Product successfully removed from cart: ${productName}`);
        }
        
        expect(isRemoved).toBe(false);
    }

    async clickCheckout() {
        await this.basePageClick(this.checkoutButton);
    }

    async clickContinueShopping() {
        await this.basePageClick(this.continueShoppingButton);
    }

    async clickBackHome() {
        await this.basePageClick(this.backHomeButton);
    }

    async getItemTotalPrice(): Promise<number> {
        const itemTotalLocator = this.page.locator("div.summary_subtotal_label");
        const itemTotalText = await itemTotalLocator.textContent();
        const itemTotalMatch = itemTotalText?.match(/Item total: \$([0-9]+\.[0-9]{2})/);
        return itemTotalMatch ? parseFloat(itemTotalMatch[1]) : 0;
    }

    async getTaxAmount(): Promise<number> {
        const taxLocator = this.page.locator('.summary_tax_label');
        const taxText = await taxLocator.textContent();
        const taxMatch = taxText?.match(/Tax: \$([0-9]+\.[0-9]{2})/);
        return taxMatch ? parseFloat(taxMatch[1]) : 0;
    }

    async getGrandTotal(): Promise<number> {
        const totalLocator = this.page.locator('.summary_total_label');
        const totalText = await totalLocator.textContent();
        const totalMatch = totalText?.match(/Total: \$([0-9]+\.[0-9]{2})/);
        return totalMatch ? parseFloat(totalMatch[1]) : 0;
    }

    async verifyPriceCalculations(expectedSubtotal: number, expectedTaxRate: number = 0.08): Promise<void> {
        const itemTotal = await this.getItemTotalPrice();
        const tax = await this.getTaxAmount();
        const grandTotal = await this.getGrandTotal();
        const expectedTax = expectedSubtotal * expectedTaxRate;
        const expectedGrandTotal = expectedSubtotal + expectedTax;

        console.log(`Expected Subtotal: $${expectedSubtotal.toFixed(2)}, Actual: $${itemTotal.toFixed(2)}`);
        expect(itemTotal).toBeCloseTo(expectedSubtotal, 2);

        console.log(`Expected Tax (${expectedTaxRate * 100}%): $${expectedTax.toFixed(2)}, Actual: $${tax.toFixed(2)}`);
        expect(tax).toBeCloseTo(expectedTax, 2);

        console.log(`Expected Grand Total: $${expectedGrandTotal.toFixed(2)}, Actual: $${grandTotal.toFixed(2)}`);
        expect(grandTotal).toBeCloseTo(expectedGrandTotal, 2);
    }

    

}