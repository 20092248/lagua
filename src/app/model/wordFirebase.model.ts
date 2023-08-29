import { Examples } from "./example.model";

export interface FirebaseWord {
    text: string[];
    pluralText?: string[];
    translate: string[];
    originalText: string;
    originalPluralText?: string;
    originalTranslate: string;
    description: string;
    phoneticText: string[];
    phoneticTranslate: string[];
    link?: string;
    examples: Examples[];
}
