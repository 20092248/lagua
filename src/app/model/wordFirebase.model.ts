import { Examples } from "./example.model";

export interface FirebaseWord {
    uid?: string;
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
    scraper?: any;
}
