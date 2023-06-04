import { CodeLabel } from "./codeLabel.model";
import { CodeTextTranslate } from "./codeTextTranslate.model";
import { ResultReview } from "./resultReview.model";

export class User {
    uid?: string | null;
    email?: string | null;
    displayName?: string | null;
    photoURL?: string | null;
    learn?: CodeTextTranslate;
    why?: CodeLabel;
    age?: CodeLabel;
    time?: CodeLabel;
    level?: CodeLabel;
    review?: any;
    resultReviews?: ResultReview[];
    lesson?: any;
    resultLessons?: any[];

    constructor(uid: string, email: string, displayName: string, photoURL: string) {
        this.uid = uid;
        this.email = email;
        this.displayName = displayName;
        this.photoURL = photoURL;
        this.resultReviews = [];
        this.resultLessons = [];
    }
}
