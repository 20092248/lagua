export class ResultReview {
    category: string;
    lesson: number;
    order: number; 
    score: number;
    nbrQuestion: number;
    toRevise: string[];
    toLearn: string[];
    learned: string[];

    constructor() {
        this.category = '';
        this.lesson = 0;
        this.order = 0;
        this.nbrQuestion = 0;
        this.score = 0;
        this.toRevise = [];
        this.toLearn = [];
        this.learned = [];
    }
}
