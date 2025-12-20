import { Page } from "@playwright/test";
import { LoginPage } from "../loginPage"
import { ProductPage } from "../productPage";
import { NavigationMenu } from "../navigation";
import { CheckoutPage } from "../checkoutPage";

export default class ManagePage {
    constructor(private readonly page: Page) { }

    private _login?: LoginPage;
    private _navigation?: NavigationMenu;
    private _product?: ProductPage;
    private _checkout?: CheckoutPage;


    //Lazy getter: creates the page object only when needed
    get login(): LoginPage {
        return this._login ??= new LoginPage(this.page);
    }

    get navigation(): NavigationMenu {
        return this._navigation ??=new NavigationMenu(this.page);
    }

    get product(): ProductPage {
        return this._product ??= new ProductPage(this.page);
    }

    get checkout(): CheckoutPage {
        return this._checkout ??=new CheckoutPage(this.page);
    }
} 