export interface Review {
    category: string;
    order: number;
    lesson: number;
    text: string;
    translate: string;
    contents: string[];
    content?: string;
    score: number;
}
