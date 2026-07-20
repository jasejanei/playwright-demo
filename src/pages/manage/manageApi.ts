// ManageApi acts as a central hub for all API helpers in the app.
// It uses lazy getters to create each API helper only when needed.
// This saves resources in large test suites, as unused APIs are not built.
// For small projects, you could create all API helpers up front instead.

import { APIRequestContext } from "@playwright/test";
import { AuthApi } from "../../api/authApi";
import { BookingApi } from "../../api/bookingApi";

export default class ManageApi {
    private _auth?: AuthApi;
    private _booking?: BookingApi;

    constructor(private readonly request: APIRequestContext) { }

    get booking(): BookingApi {
        return this._booking ??= new BookingApi(this.request);
    }

    get auth(): AuthApi {
        return this._auth ??= new AuthApi(this.request);
    }
}