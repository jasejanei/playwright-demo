import { request } from "@playwright/test";
import * as dotenv from "dotenv";

const envFile = process.env.ENV === 'production'
    ? './src/config/.env.production'
    : './src/config/.env.testing';
dotenv.config({ path: envFile });

// Token cache
let cachedToken: string = '';
let tokenExpiry: number = 0;

// API Auth Response interface
interface ApiAuthResponse {
    token: string;
}

/**
 * Gets a valid API authentication token with caching
 * Uses credentials from environment variables (API_USERNAME, API_PASSWORD)
 */
export async function getValidAuthToken(): Promise<string> {
    const now = Math.floor(Date.now() / 1000);
    
    // Return cached token if still valid
    if (cachedToken && now < tokenExpiry) {
        console.log('[AUTH] Using cached API token');
        return cachedToken;
    }

    console.log('[AUTH] Requesting new API token...');

    const context = await request.newContext({
        baseURL: process.env.API_BASE_URL,
        extraHTTPHeaders: {
            'Content-Type': 'application/json',
        },
    });

    // API authentication endpoint
    const response = await context.post('/auth', {
        data: {
            username: process.env.API_USERNAME,
            password: process.env.API_PASSWORD,
        },
    });

    if (!response.ok()) {
        await context.dispose();
        throw new Error(`API authentication failed: ${response.status()} ${response.statusText()}`);
    }

    const body = await response.json() as ApiAuthResponse;
    
    if (!body.token) {
        await context.dispose();
        throw new Error('No token received from API authentication');
    }

    cachedToken = body.token;
    // Cache token for 1 hour (adjust as needed)
    tokenExpiry = now + 3600;

    console.log('[AUTH] API token obtained successfully');

    await context.dispose();
    return cachedToken;
}