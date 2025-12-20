import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "../pages/base/basePage";


export class CheckoutForm extends BasePage {
    readonly page: Page;
    readonly header: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly postalCodeInput: Locator;
    readonly continueButton: Locator;
    readonly finishButton: Locator;
    readonly cancelButton: Locator;
    readonly errorMessage: Locator;
    readonly errorButton: Locator;
    readonly errorMessagebyField: (fieldName: string) => Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.header = page.locator("span.title");
        this.firstNameInput = page.locator("#first-name");
        this.lastNameInput = page.locator("#last-name");
        this.postalCodeInput = page.locator("#postal-code");
        this.continueButton = page.locator("input[name='continue']");
        this.finishButton = page.locator("button[data-test='finish']");
        this.cancelButton = page.locator("button[name='cancel']");
        this.errorMessage = page.locator("h3[data-test='error']");
        this.errorButton = page.locator("button[data-test='error-button']");
        this.errorMessagebyField = (fieldName: string) => 
            page.locator(`h3[data-test='error']`, { hasText: `${fieldName} is required` });
    }


    async closeErrorMessage() {
        await this.basePageClick(this.errorButton);
    }

    async waitForHeader() {
        await this.basePageWaitForData(this.header);
    }

    async clickCancel() {
        await this.basePageClick(this.cancelButton);
    }

    async fillCheckoutForm(firstName: string, lastName: string, postalCode: string) {
        await this.basePageFill(this.firstNameInput, firstName);
        await this.basePageFill(this.lastNameInput, lastName);
        await this.basePageFill(this.postalCodeInput, postalCode);
    }

    async clickContinue() {
        await this.basePageClick(this.continueButton);
    }

    async clickFinish() {
        await this.basePageClick(this.finishButton);
    }

    async verifyRequiredFieldErrors(fieldName: string): Promise<void> {
        await expect(this.errorMessagebyField(fieldName)).toBeVisible();
    }

    async verifyEnteredDetails(firstName: string, lastName: string, postalCode: string) {
        const firstNameValue = await this.firstNameInput.inputValue();
        const lastNameValue = await this.lastNameInput.inputValue();
        const postalCodeValue = await this.postalCodeInput.inputValue();

        if (firstNameValue !== firstName) {
            console.log(`First name mismatch: expected: ${firstName}, actual: ${firstNameValue}`);
        } else {
            console.log(`First name is correct: "${firstNameValue}`)
        }
        if (lastNameValue !== lastName) {
            console.log(`Last name mismatch: expected: ${lastName}, actual: ${lastNameValue}`);
        } else {
            console.log(`Last name is correct: "${lastNameValue}`);
        }
        if (postalCodeValue !== postalCode) {
            console.log(`Postal code mismatch: expected: ${postalCode}, actual: ${postalCodeValue}`);
        } else {
            console.log(`Postal code is correct: "${postalCodeValue}`);
        }

        expect(firstNameValue).toBe(firstName);
        expect(lastNameValue).toBe(lastName);
        expect(postalCodeValue).toBe(postalCode);

        
    }

}