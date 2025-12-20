import { BasePage } from "../pages/base/basePage";
import { Page, Locator } from "@playwright/test";

export class LoginPage extends BasePage {
    readonly page: Page;
    readonly header: Locator;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly lockedMessage: Locator;
    readonly menu: Locator;
    readonly logoutButton: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.header = page.locator('div.login_logo');
        this.usernameInput = page.locator("input[name='user-name']");
        this.passwordInput = page.locator("input[name='password']");
        this.loginButton = page.locator("input[name='login-button']");
        this.lockedMessage = page.locator("h3[data-test='error']")
        this.menu = page.locator("#react-burger-menu-btn");
        this.logoutButton = page.locator("#logout_sidebar_link");
    }

    async navigate() {
        await this.navigateTo('');
    }

    async login(username: string, password: string) {
        await this.basePageFill(this.usernameInput, username);
        await this.basePageFill(this.passwordInput, password);
        await this.basePageClick(this.loginButton);
    }

    async checkLockedMessage(expectedMessage: string) {
        await this.basePageExpectText(this.lockedMessage, expectedMessage);
    }

    async clickLogout() {
        await this.basePageClick(this.logoutButton);
    }

    async openMenu() {
        await this.basePageClick(this.menu);
    }
}