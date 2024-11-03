export interface Question {
    id?: string;
    type: string;
    category: string;
    lesson: number;
    order: number;
    questions: any[];
}
