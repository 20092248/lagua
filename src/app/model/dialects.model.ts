import { CodeLabel } from "./codeLabel.model";
import { CodeTextTranslate } from "./codeTextTranslate.model";
import { Dialect } from "./dialect.model";
import { Lesson } from "./lessons.model";
import { ResultReview } from "./resultReview.model";
import { Review } from "./review.model";

export class Dialects {
    shingazidja: Dialect;
    shindzuani: Dialect;
    shimwali: Dialect;
    shimaore: Dialect;

    constructor() {
        this.shingazidja = {} as Dialect;
        this.shindzuani = {} as Dialect;
        this.shimwali = {} as Dialect;
        this.shimaore = {} as Dialect;
    }
}
