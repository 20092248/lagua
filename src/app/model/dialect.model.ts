import { CodeLabel } from "./codeLabel.model";
import { CodeTextTranslate } from "./codeTextTranslate.model";
import { Lesson } from "./lessons.model";
import { ResultReview } from "./resultReview.model";
import { Review } from "./review.model";

export class Dialect {
    learn: CodeTextTranslate;
    why: CodeLabel;
    age: CodeLabel;
    time: CodeLabel;
    level: CodeLabel;
    review: Review;
    resultReviews: ResultReview[];
    lesson: Lesson;
    resultLessons: Lesson[];

    constructor(learn: CodeTextTranslate, why: CodeLabel, age: CodeLabel, time: CodeLabel, level: CodeLabel, review: Review, lesson: Lesson) {
        this.learn = learn;
        this.why = why;
        this.age = age;
        this.time = time;
        this.level = level;
        this.review = review;
        this.lesson = lesson;
        this.resultReviews = [];
        this.resultLessons = [];
    }
}
