import { CodeLabel } from "./codeLabel.model";
import { CodeTextTranslate } from "./codeTextTranslate.model";

export class User {
    uid?: string;
    email?: string;
    displayName?: string;
    photoURL? : string;
    learn?: CodeTextTranslate;
    why?: CodeLabel;
    age?: CodeLabel;
    time?: CodeLabel;
    level?: CodeLabel;

    constructor(uid: string, email: string, displayName: string, photoURL: string) {
        this.uid = uid;
        this.email = email;
        this.displayName = displayName;
        this.photoURL = photoURL;
    }
}
