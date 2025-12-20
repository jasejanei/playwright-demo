//BasePage stores playwright 'Page' instanse for use in extending classes.
import { Page, Locator, expect } from "@playwright/test";


export abstract class BasePage {
    constructor(protected page: Page) { }

    /* ─────────── Navigation ─────────── */
    /** Navigate to a specific URL path. */
    protected async navigateTo(path: string) {
        await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    }

    protected async basePageWaitForData(selector: string | Locator) {
        await this.toLocator(selector).first().waitFor({ state: 'visible', timeout: 60000 });
    }

    protected async basePageWaitForTableData(tableSelector: string | Locator) {
        await this.basePageExpectVisible(tableSelector);
        await this.toLocator(tableSelector).first().waitFor({ state: 'visible', timeout: 15000 });

        const rows = await this.toLocator(tableSelector).count();
        expect(rows).toBeGreaterThanOrEqual(0);
    }

    /* ── Low-level helpers (protected) ── */
    protected async basePageClick(selector: string | Locator) {
        await this.toLocator(selector).click();
    }

    protected async basePageFill(selector: string | Locator, value: string) {
        await this.toLocator(selector).click();
        await this.toLocator(selector).type(value, { delay:100 });
    }

    protected async basePageExpectVisible(selector: string | Locator) {
        await this.toLocator(selector).waitFor({ state: 'visible', timeout: 5000})
        await expect(this.toLocator(selector)).toBeVisible();
    }

    protected async basePageExpectText(selector: string | Locator, text: string) {
        await expect(this.toLocator(selector)).toContainText(text);
    }

    protected async basePageNewPage(selector: string | Locator): Promise<Page> {
        // We expect a new page to open after clicking some element.
        const [newPage] = await Promise.all([
            this.page.context().waitForEvent('page'),
            await this.toLocator(selector).click(),
        ]);
        await newPage.bringToFront();
        await newPage.waitForLoadState('domcontentloaded');
        return newPage;
    }

    protected async basePageCheck(selector: string | Locator) {
        await this.toLocator(selector).check();
    }

    protected async basePageUncheck(selector: string | Locator) {
        await this.toLocator(selector).uncheck();
    }

    
    /** Quick helper for tests:
     * If you need a quick selector in a .spec test file
     * This will keep `page` protected but lets grab elements without adding a dedicated method for every page.
     */
    public locator(selector: string | Locator): Locator {
        return this.toLocator(selector);
    }

    protected toLocator(selector: string | Locator): Locator {
        return typeof selector === 'string'
            ? this.page.locator(selector)
            : selector;
    }
}