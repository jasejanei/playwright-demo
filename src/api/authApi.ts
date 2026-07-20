import { APIRequestContext } from "@playwright/test";
import { endpoints } from "./endpoints";
import { BaseApi } from "../pages/base/baseApi";

export interface AuthCredentials {
    username: string;
    password: string;
}

export interface AuthTokenResponse {
    token: string;
}

export interface AuthErrorResponse {
    reason: string;
}

export class AuthApi extends BaseApi {
    constructor(private request: APIRequestContext) { super(); }

    // CORE API Request handler (same pattern as BookingApi)
    async getResponse(link: string, method: 'get' | 'post' | 'put' | 'delete', data?: any) {
        try {
            let response;
            if (method === 'get' || method === 'delete') {
                // GET/DELETE - no body
                response = await this.request[method](link);
            } else {
                // POST/PUT - with body
                response = await this.request[method](link, {
                    data: data
                });
            }
            const responseData = await response.json();
            this.baseApiGetApiMessage(responseData);
            return responseData;
        } catch (error) {
            console.error(`Error in getResponse for ${link}`, error);
            throw error;
        }
    }

    /**
     * Create authentication token
     * Returns { token: string } on success or { reason: string } on failure
     */
    async createToken(credentials: AuthCredentials) {
        const url = endpoints.auth.createToke(); // Note: Fix typo in endpoints.ts later
        return await this.getResponse(url, 'post', credentials);
    }

    /**
     * Create authentication token with direct username/password
     * Returns { token: string } on success or { reason: string } on failure
     */
    async login(username: string, password: string) {
        return await this.createToken({ username, password });
    }

    /**
     * Validate that token was successfully created
     * Returns the token string if valid, throws error otherwise
     */
    validateToken(response: AuthTokenResponse | AuthErrorResponse): string {
        if ('token' in response && response.token) {
            console.log('Token created successfully');
            return response.token;
        } else if ('reason' in response) {
            throw new Error(`Authentication failed: ${response.reason}`);
        } else {
            throw new Error('Invalid authentication response');
        }
    }
}