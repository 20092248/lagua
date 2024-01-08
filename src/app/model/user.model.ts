import { CodeTextTranslate } from "./codeTextTranslate.model";
import { Dialects } from "./dialects.model";

export class User {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    dialectSelected: CodeTextTranslate;
    dialects: Dialects;
    week: any;
    timerActiveConnection: number;

    constructor(uid: string, email: string, displayName: string, photoURL: string, dialectSelected: CodeTextTranslate, dialects: Dialects, timerActiveConnection: number) {
        this.uid = uid;
        this.email = email;
        this.displayName = displayName;
        this.photoURL = photoURL;
        this.dialectSelected = dialectSelected;
        this.dialects = dialects;
        this.timerActiveConnection = timerActiveConnection;
    }
}
