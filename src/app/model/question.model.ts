export interface Question {
    id?: string;
    type: string;
    category: string;
    lesson: number;
    order: number;
    qcm: any;
    questions: any[];
}
