import { APIRequestContext, test as base, request } from "@playwright/test";
import { getValidAuthToken } from "../../utils/auth";
import ManageApi from "../pages/manage/manageApi"
import ManagePage from "../pages/manage/managePage"
import ManageForms from "../pages/manage/manageForms"
import * as dotenv from "dotenv"

const envFile = process.env.ENV === 'testing'
    ? '.src/config/env.testing'
    : '.src/config/.env'
dotenv.config({ path: envFile });

type Fixtures = {
    POM: ManagePage;
    API: ManageApi;
    FORMS: ManageForms;
    apiContext: APIRequestContext;
};

export const test = base.extend<Fixtures>({
    POM: async ({ page }, use) => {
        const managePage = new ManagePage(page);
        await use(managePage);
    },
    FORMS: async ({ page }, use) => {
        const manageForms = new ManageForms(page);
        await use(manageForms);
    },
    API: async ({ apiContext}, use) => {
        const manageApi = new ManageApi(apiContext);
        await use(manageApi);
    },
    apiContext: async ({ browser }, use) => {
        console.log('[FIXTURE] Creating authenticated API Context...');

        //Get token from auth.ts
        const token = await getValidAuthToken();
        console.log(`[FIXTURE] Token obtained: ${token.substring(0,20)}...`);
        const authenticatedContext = await request.newContext({
            baseURL: process.env.API_BASE_URL,
            extraHTTPHeaders: {
                'Cookie': `token=${token}`,
                //'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        });

        console.log('[FIXTURE] Authenticated API Context created.');
        await use(authenticatedContext);

        //Cleanup
        await authenticatedContext.dispose();
        console.log('[FIXTURE] Authenticated API Context disposed.');
    }
});

export { expect, Download } from "@playwright/test";