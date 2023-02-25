import { Examples } from "./example.model";

export interface FirebaseWord {
    text: string[];
    translate: string[];
    description: string;
    phoneticText: string[];
    phoneticTranslate: string[];
    examples: Examples[];
}
