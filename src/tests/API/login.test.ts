import { test, expect } from "../../fixtures/fixtures";
import { request } from "@playwright/test"

test.describe("API Authentication Tests", () => {
    test('Create token with valid credentials', async ({ API }) => {
        const response = await API.auth.createToken({
            username: process.env.API_USERNAME!,
            password: process.env.API_PASSWORD!
        });

        //Validate token
        const token = API.auth.validateToken(response);
        expect(token).toBeTruthy();
        expect(typeof token).toBe('string');
        expect(token.length).toBeGreaterThan(0);

        console.log('Token:', token);
    });

    test('Login with invalid credentials', async ({ API }) => {
        const response = await API.auth.createToken({
            username: "invalid_user",
            password: "wrong_pass"
        });
        expect(response).toHaveProperty('reason');
        expect(response.reason).toBe('Bad credentials');
    });

    test('Login with missing username', async ({ API }) => {
        const response = await API.auth.createToken({
            username: "",
            password: process.env.API_PASSWORD!
        });

        expect(response).toHaveProperty('reason');
        expect(response.reason).toBe('Bad credentials')
    });
});
