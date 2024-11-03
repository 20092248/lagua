import { CodeLabel } from "./codeLabel.model";
import { CodeLabelMin } from "./codeLabelMin.model";
import { CodeTextTranslate } from "./codeTextTranslate.model";
import { CodeTextTranslateMin } from "./codeTextTranslateMin.model";
import { Lesson } from "./lesson.model";
import { LessonMin } from "./lessonMin.model";
import { ResultReview } from "./resultReview.model";
import { Review } from "./review.model";

export class Dialect {
    learn: CodeTextTranslateMin;
    why: CodeLabelMin;
    age: CodeLabelMin;
    time: CodeLabelMin;
    level: CodeLabelMin;
    review: Review;
    resultReviews: ResultReview[];
    lesson: LessonMin;
    resultLessons: LessonMin[];

    constructor(learn: CodeTextTranslateMin, why: CodeLabelMin, age: CodeLabelMin, time: CodeLabelMin, level: CodeLabelMin, review: Review, lesson: Lesson) {
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
