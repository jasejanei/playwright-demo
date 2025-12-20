// BaseApi provides reusable API validation helpers for extending classes.
import { APIRequestContext, APIResponse, expect, request } from "@playwright/test";
import { getValidAuthToken } from "../../../../../../utils/auth";

export abstract class BaseApi {

    protected baseApiExpectEvery<T>(
        data: { payload: T[]; message?: string[] },
        predicate: (item: T) => boolean,
        message?: string
    ) {
        const each = data.payload.every(predicate);
        expect.soft(each, message ?? 'Expected items to match predicate').toBe(true);
    }

    protected baseApiDataFilter<T>(
        data: { payload: T[]; message?: string[] },
        predicate: (item: T) => boolean
    ) {
        const each = data.payload.filter(predicate);
        return each;
    }

    protected baseApiDataEvery<T>(
        data: { payload: T[]; message?: string[] },
        predicate: (item: T) => boolean
    ) {
        const each = data.payload.every(predicate);
        return each;
    }

    protected baseApiGetApiMessage<T>(data: { payload: T[]; message?: string[] },) {
        console.log({
            message: data.message ?? ['No API message provided'],
        });
    }

    protected baseApiCount(filtered: any[]) {
        const count = filtered.length;
        return count;
    }

    static async baseApiCreateApiContext(
        link: string,
        method: 'get' | 'post' | 'put' | 'delete',
        options?: { data?: any; headers?: Record<string, string> }
    ): Promise<APIResponse> {
        const token = await getValidAuthToken();
        const api = await request.newContext({
            baseURL: process.env.API_BASE_URL,
            extraHTTPHeaders: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
                ...(options?.headers ?? {}),
            },
        });

        let response: APIResponse;

        switch (method) {
            case 'get':
                response = await api.get(link);
                break;
            case 'post':
                response = await api.post(link, { data: options?.data });
                break;
            case 'put':
                response = await api.put(link, { data: options?.data });
                break;
            case 'delete':
                response = await api.delete(link);
                break;
            default:
                throw new Error(`Unsupported HTTP method: ${method}`);
        }

        expect(response.ok()).toBeTruthy();

        return response;
    }
}