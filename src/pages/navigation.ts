import { BasePage } from "../pages/base/basePage";
import { Page, Locator, expect } from "@playwright/test";

export class NavigationMenu extends BasePage {
    readonly page: Page;
    readonly menuButton: Locator;
    readonly allItemsLink: Locator;
    readonly aboutLink: Locator;
    readonly logoutLink: Locator;
    readonly resetAppStateLink: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.menuButton = page.locator("#react-burger-menu-btn");
        this.allItemsLink = page.locator("#inventory_sidebar_link");
        this.aboutLink = page.locator("#about_sidebar_link");
        this.logoutLink = page.locator("#logout_sidebar_link");
        this.resetAppStateLink = page.locator("#reset_sidebar_link");
    }

    async openMenu() {
        await this.basePageClick(this.menuButton);
    }

    async navigateToAllItems() {
        await this.basePageClick(this.allItemsLink);
    }

    async navigateToAbout() {
        await this.basePageClick(this.aboutLink);
    }

    async logout() {
        await this.basePageClick(this.logoutLink);
    }

    async resetAppState() {
        await this.basePageClick(this.resetAppStateLink);
    }
}