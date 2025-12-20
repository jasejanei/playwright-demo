import { Page } from "@playwright/test";
import { CheckoutForm } from "../../forms/checkoutForm";


export default class ManageForms {
    constructor(private readonly page: Page) { }

    private _checkout!: CheckoutForm;

    get checkout(): CheckoutForm {
        return this._checkout ??= new CheckoutForm(this.page);
    }
}