// ManageApi acts as a central hub for all API helpers in the app.
// It uses lazy getters to create each API helper only when needed.
// This saves resources in large test suites, as unused APIs are not built.
// For small projects, you could create all API helpers up front instead.

import { APIRequestContext } from "@playwright/test";


export default class ManageApi {

    constructor(private apiContext: APIRequestContext) { }
}