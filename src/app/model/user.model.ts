import { CodeLabel } from "./codeLabel.model";
import { CodeTextTranslate } from "./codeTextTranslate.model";
import { Lesson } from "./lessons.model";
import { ResultReview } from "./resultReview.model";
import { Review } from "./review.model";

export class User {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    learn: CodeTextTranslate;
    why: CodeLabel;
    age: CodeLabel;
    time: CodeLabel;
    level: CodeLabel;
    review: Review = {} as Review;
    resultReviews: ResultReview[];
    lesson: Lesson;
    resultLessons: Lesson[];
    week: any;
    timerActiveConnection: number;

    constructor(uid: string, email: string, displayName: string, photoURL: string, learn: CodeTextTranslate, 
        why: CodeLabel, age: CodeLabel, time: CodeLabel, level: CodeLabel, lesson: Lesson, timerActiveConnection: number) {
        this.uid = uid;
        this.email = email;
        this.displayName = displayName;
        this.photoURL = photoURL;
        this.resultReviews = [];
        this.resultLessons = [];
        this.learn = learn;
        this.why = why;
        this.age = age;
        this.time = time;
        this.level = level;
        this.lesson = lesson;
        this.timerActiveConnection = timerActiveConnection;
    }
}
