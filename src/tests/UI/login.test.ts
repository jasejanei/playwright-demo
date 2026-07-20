import { test, expect } from "../../fixtures/fixtures";
import * as fs from 'fs';

let testData: Record<string, any> = {};

// Determine environment, default to 'saas'
const ENV = process.env.ENV || process.env.NODE_ENV || 'testing';

//map environment to test data file
const testDataFileMap: Record<string, string> = {
    testing: 'test-data-testing.json',
    production: 'test-data-production.json'
};

test.describe("Login Page Tests", () => {
    const loadTestData = (): Record<string, any> => {
        try {
            return JSON.parse(fs.readFileSync(`./src/test data/${testDataFileMap[ENV] || 'test-data-testing.json'}`, 'utf-8'));
        } catch {
            return {};
        }
    };

    test.beforeAll(() => {
        testData = loadTestData();
    });

    /* test.afterEach(async ({ POM, page}) => {
        await POM.login.openMenu();
        await POM.login.clickLogout();
        await page.waitForLoadState('domcontentloaded');
    }) */

    test('Valid Login test', async ({ POM, page }) => {
        await POM.login.navigate();
        await POM.login.login(process.env.userId!, process.env.password!);
        await page.waitForLoadState('domcontentloaded');
        await expect(page).toHaveURL(/.*inventory.html/);
    });

    test('Locked Out User Login test', async ({ POM }) => {
        await POM.login.navigate();
        await POM.login.login(testData.users.locked_out_user.username, testData.users.locked_out_user.password);
        await POM.login.checkLockedMessage("Epic sadface: Sorry, this user has been locked out.");
    })
})