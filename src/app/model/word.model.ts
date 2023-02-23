import { Examples } from "./example.model";

export class Word {
    text?: string;
    translate?: string;
    description?: string;
    examples?: Examples[];

    constructor(text: string, translate: string, description: string, examples: Examples[]) {
        this.text = text;
        this.translate = translate;
        this.description = description;
        this.examples = examples;
    }
}
