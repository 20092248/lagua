import { Examples } from "./example.model";

export class Word {
    text?: string;
    translate?: string;
    description?: string;
    examples?: Examples[];
    link?: string;

    constructor(text: string, translate: string, description: string, examples: Examples[], link: string) {
        this.text = text;
        this.translate = translate;
        this.description = description;
        this.examples = examples;
        this.link = link;
    }
}
