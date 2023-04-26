import { Examples } from "./example.model";

export interface FirebaseWord {
    text: string[];
    translate: string[];
    originalText: string;
    originalTranslate: string;
    description: string;
    phoneticText: string[];
    phoneticTranslate: string[];
    examples: Examples[];
}
