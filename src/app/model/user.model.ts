import { Account } from "./account.model";
import { CodeTextTranslateMin } from "./codeTextTranslateMin.model";
import { Dialects } from "./dialects.model";

export class User {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    dialectSelected: CodeTextTranslateMin;
    dialects: Dialects;
    week: any;
    account: Account;
    timerActiveConnection: number;

    constructor(uid: string, email: string, displayName: string, photoURL: string, dialectSelected: CodeTextTranslateMin, dialects: Dialects, account: Account, timerActiveConnection: number) {
        this.uid = uid;
        this.email = email;
        this.displayName = displayName;
        this.photoURL = photoURL;
        this.dialectSelected = dialectSelected;
        this.dialects = dialects;
        this.account = account;
        this.timerActiveConnection = timerActiveConnection;
    }
}
