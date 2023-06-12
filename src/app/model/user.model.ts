import { CodeLabel } from "./codeLabel.model";
import { CodeTextTranslate } from "./codeTextTranslate.model";
import { ResultReview } from "./resultReview.model";

export class User {
    uid?: string;
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
    week?: any;
    timerActiveConnection?: number;

    constructor(uid: string, email: string, displayName: string, photoURL: string) {
        this.uid = uid;
        this.email = email;
        this.displayName = displayName;
        this.photoURL = photoURL;
        this.resultReviews = [];
        this.resultLessons = [];
    }
}
