import { Account } from "./account.model";

export class Checkout {
    uid: string;
    email: string;
    account: Account;
    production: boolean;

    constructor(uid: string, email: string, account: Account, production: boolean) {
        this.uid = uid;
        this.email = email;
        this.account = account;
        this.production = production;
    }
}
