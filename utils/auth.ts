import { request } from "@playwright/test";
import * as dotenv from "dotenv";

const envFile = process.env.ENV === 'production'
    ? '.src/config/env.production'
    : '.src/config/env.testing';
dotenv.config({ path: envFile });

let cachedToken: string = '';
let tokenExpiry: number = 0;

interface AuthResponse {
    successResponse: {
        token: string;
    };
    failedResponse: {
        errorMessage?: string;
    };
}

export async function getValidAuthToken(): Promise<string>{
    const now = Math.floor(Date.now() / 1000);
    if (cachedToken && now < tokenExpiry - 30) {
        return cachedToken;
    }

    const context = await request.newContext({
        baseURL: process.env.API_BASE_URL,
        extraHTTPHeaders: {
            'Content-Type': 'application/json',
        },
    });

    //First login attempt
    const fullPath = new URL('api/Authenticate/login', process.env.API_BASE_URL).toString();

    const initialResponse = await context.post(fullPath, {
        headers: { 'Content-Type': 'application/json' },
        data: {
            username: process.env.userId,
            password: process.env.password,
        },
    });

    const initialResponseBody = await initialResponse.json() as AuthResponse;
    console.log('Initial login response:', initialResponseBody);

    let token = initialResponseBody.successResponse?.token;

    //If already logged in elsewhere, retry with forcelogin
    if (!token && initialResponseBody.failedResponse?.errorMessage === 'User already logged in') {
        console.log('Retrying login with forcelogin...');

        const forceResponse = await context.post('api/Authenticate/login', {
            headers: { 'Content-Type': 'application/json' },
            data: {
                username: process.env.userId,
                password: process.env.password,
                forcelogin: true,
            },
        });

        const forceBody = await forceResponse.json() as AuthResponse;
        token = forceBody.successResponse?.token;
    }

    if (!token || typeof token !== 'string' || !token.includes('.')) {
        throw new Error('Failed to obtain valid auth token');
    }

    cachedToken = token;

    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(Buffer.from(payload, 'base64').toString());
    tokenExpiry = decodedPayload.exp;

    await context.dispose();
    return cachedToken;
}
    